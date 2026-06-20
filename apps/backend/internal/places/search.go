package places

import (
	"encoding/json"
	"strconv"
)

func (s *PlacesService) SearchNearby(
	latitude, longitude float64,
	radius int,
	placeType, keyword, pageToken string,
) (*SearchPage, error) {
	if s.google == nil {
		return nil, errGooglePlacesNotConfigured
	}
	if radius <= 0 {
		radius = defaultSearchRadius
	}
	return s.google.NearbySearch(latitude, longitude, radius, placeType, keyword, pageToken)
}

func (s *PlacesService) SearchText(
	query, placeType, keyword, pageToken string,
) (*SearchPage, error) {
	if s.google == nil {
		return nil, errGooglePlacesNotConfigured
	}
	return s.google.TextSearch(query, placeType, keyword, pageToken)
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
	if _, err := strconv.Atoi(maxWidth); err != nil {
		maxWidth = "800"
	}
	return s.google.FetchPhoto(photoReference, maxWidth)
}
