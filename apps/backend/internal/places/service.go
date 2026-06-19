package places

type PlacesService struct {
	placesRepository *PlacesRepository
}

func NewPlaceService(pr *PlacesRepository) *PlacesService {
	return &PlacesService{placesRepository: pr}
}

func (s *PlacesService) AddPlace(place *Place) error {
	return s.placesRepository.SavePlaces(place)
}
