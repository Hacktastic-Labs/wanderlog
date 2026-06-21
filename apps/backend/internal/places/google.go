package places

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const googlePlacesBaseURL = "https://maps.googleapis.com/maps/api/place"

type GooglePlacesClient struct {
	apiKey     string
	httpClient *http.Client
}

func NewGooglePlacesClient(apiKey string) *GooglePlacesClient {
	return &GooglePlacesClient{
		apiKey: apiKey,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

type SearchPage struct {
	Results       json.RawMessage `json:"results"`
	NextPageToken *string         `json:"nextPageToken,omitempty"`
}

type googleSearchResponse struct {
	Status        string          `json:"status"`
	Results       json.RawMessage `json:"results"`
	NextPageToken *string         `json:"next_page_token"`
	ErrorMessage  string          `json:"error_message"`
}

type googleDetailResponse struct {
	Status       string          `json:"status"`
	Result       json.RawMessage `json:"result"`
	ErrorMessage string          `json:"error_message"`
}

func (c *GooglePlacesClient) NearbySearch(
	latitude, longitude float64,
	radius int,
	placeType, keyword, pageToken string,
) (*SearchPage, error) {
	params := url.Values{
		"location": {fmt.Sprintf("%f,%f", latitude, longitude)},
		"radius":   {fmt.Sprintf("%d", radius)},
		"language": {"en"},
	}
	if placeType != "" {
		params.Set("type", placeType)
	}
	if keyword != "" {
		params.Set("keyword", keyword)
	}
	if pageToken != "" {
		params.Set("pagetoken", pageToken)
	}

	return c.search("/nearbysearch/json", params)
}

func (c *GooglePlacesClient) TextSearch(
	query, placeType, keyword, pageToken string,
) (*SearchPage, error) {
	searchQuery := query
	if keyword != "" {
		searchQuery = strings.TrimSpace(keyword + " " + query)
	} else if placeType != "" {
		searchQuery = strings.TrimSpace(placeType + " " + query)
	}

	params := url.Values{
		"query":    {searchQuery},
		"language": {"en"},
	}
	if placeType != "" {
		params.Set("type", placeType)
	}
	if pageToken != "" {
		params.Set("pagetoken", pageToken)
	}

	return c.search("/textsearch/json", params)
}

func (c *GooglePlacesClient) PlaceDetails(placeID string) (json.RawMessage, error) {
	fields := strings.Join([]string{
		"place_id",
		"name",
		"vicinity",
		"formatted_address",
		"rating",
		"user_ratings_total",
		"photos",
		"opening_hours",
		"geometry",
		"types",
		"price_level",
		"formatted_phone_number",
		"international_phone_number",
		"website",
		"reviews",
		"address_components",
	}, ",")

	params := url.Values{
		"place_id": {placeID},
		"fields":   {fields},
		"language": {"en"},
	}

	body, err := c.get("/details/json", params)
	if err != nil {
		return nil, err
	}

	var parsed googleDetailResponse
	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, fmt.Errorf("decode place details: %w", err)
	}

	if parsed.Status != "OK" {
		return nil, googleAPIError(parsed.Status, parsed.ErrorMessage)
	}
	if len(parsed.Result) == 0 {
		return nil, ErrPlaceNotFound
	}

	return parsed.Result, nil
}

func (c *GooglePlacesClient) FetchPhoto(photoReference, maxWidth string) (contentType string, data []byte, err error) {
	params := url.Values{
		"maxwidth":        {maxWidth},
		"photo_reference": {photoReference},
		"key":             {c.apiKey},
	}

	reqURL := fmt.Sprintf("%s/photo?%s", googlePlacesBaseURL, params.Encode())
	resp, err := c.httpClient.Get(reqURL)
	if err != nil {
		return "", nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return "", nil, fmt.Errorf("photo request failed: %s", strings.TrimSpace(string(body)))
	}

	data, err = io.ReadAll(resp.Body)
	if err != nil {
		return "", nil, err
	}

	contentType = resp.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "image/jpeg"
	}

	return contentType, data, nil
}

func (c *GooglePlacesClient) search(path string, params url.Values) (*SearchPage, error) {
	body, err := c.get(path, params)
	if err != nil {
		return nil, err
	}

	var parsed googleSearchResponse
	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, fmt.Errorf("decode search response: %w", err)
	}

	if parsed.Status != "OK" && parsed.Status != "ZERO_RESULTS" {
		return nil, googleAPIError(parsed.Status, parsed.ErrorMessage)
	}

	if len(parsed.Results) == 0 {
		parsed.Results = json.RawMessage("[]")
	}

	return &SearchPage{
		Results:       parsed.Results,
		NextPageToken: parsed.NextPageToken,
	}, nil
}

func (c *GooglePlacesClient) get(path string, params url.Values) ([]byte, error) {
	reqURL := fmt.Sprintf("%s%s?%s", googlePlacesBaseURL, path, params.Encode())
	req, err := http.NewRequest(http.MethodGet, reqURL, nil)
	if err != nil {
		return nil, err
	}

	query := req.URL.Query()
	query.Set("key", c.apiKey)
	req.URL.RawQuery = query.Encode()

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return nil, fmt.Errorf("google places HTTP %d", resp.StatusCode)
	}

	return body, nil
}

