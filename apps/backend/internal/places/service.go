package places

type PlacesService struct {
	placesRepository    *PlacesRepository
	google              *GooglePlacesClient
	defaultSearchRadius int
}

func NewPlaceService(pr *PlacesRepository, google *GooglePlacesClient, defaultSearchRadius int) *PlacesService {
	if defaultSearchRadius <= 0 {
		defaultSearchRadius = 5000
	}

	return &PlacesService{
		placesRepository:    pr,
		google:              google,
		defaultSearchRadius: defaultSearchRadius,
	}
}

func (s *PlacesService) AddPlace(place *Place) error {
	return s.placesRepository.SavePlaces(place)
}
