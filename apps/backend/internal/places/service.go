package places

import "errors"

var errGooglePlacesNotConfigured = errors.New("google places is not configured")

type PlacesService struct {
	placesRepository *PlacesRepository
	google           *GooglePlacesClient
}

func NewPlaceService(pr *PlacesRepository, google *GooglePlacesClient) *PlacesService {
	return &PlacesService{placesRepository: pr, google: google}
}

func (s *PlacesService) AddPlace(place *Place) error {
	return s.placesRepository.SavePlaces(place)
}
