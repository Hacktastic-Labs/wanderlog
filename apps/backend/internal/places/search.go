package places

import "encoding/json"

type NearbySearchParams struct {
	Latitude  float64
	Longitude float64
	Radius    int
	PlaceType string
	Keyword   string
	PageToken string
}

type TextSearchParams struct {
	Query     string
	PlaceType string
	Keyword   string
	PageToken string
}

func (s *PlacesService) SearchNearby(params NearbySearchParams) (*SearchPage, error) {
	if s.google == nil {
		return nil, errGooglePlacesNotConfigured
	}

	radius := params.Radius
	if radius <= 0 {
		radius = s.defaultSearchRadius
	}

	return s.google.NearbySearch(
		params.Latitude,
		params.Longitude,
		radius,
		params.PlaceType,
		params.Keyword,
		params.PageToken,
	)
}

func (s *PlacesService) SearchText(params TextSearchParams) (*SearchPage, error) {
	if s.google == nil {
		return nil, errGooglePlacesNotConfigured
	}

	return s.google.TextSearch(
		params.Query,
		params.PlaceType,
		params.Keyword,
		params.PageToken,
	)
}

func (s *PlacesService) GetPlaceDetails(placeID string) (json.RawMessage, error) {
	if s.google == nil {
		return nil, errGooglePlacesNotConfigured
	}
	return s.google.PlaceDetails(placeID)
}

func (s *PlacesService) FetchPhoto(photoReference, maxWidth string) (string, []byte, error) {
	if s.google == nil {
		return "", nil, errGooglePlacesNotConfigured
	}
	if maxWidth == "" {
		maxWidth = "800"
	}
	return s.google.FetchPhoto(photoReference, maxWidth)
}
