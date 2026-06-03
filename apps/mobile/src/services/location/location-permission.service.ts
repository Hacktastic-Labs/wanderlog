import * as Location from 'expo-location';

export const requestForegroundLocationPermission = async () => {
  const response = await Location.requestForegroundPermissionsAsync();
  return response.granted;
};

export const requestBackgroundLocationPermission = async () => {
  const response = await Location.requestBackgroundPermissionsAsync();
  return response.granted;
};

export const getPermissionSnapshot = async () => {
  const [foreground, background] = await Promise.all([
    Location.getForegroundPermissionsAsync(),
    Location.getBackgroundPermissionsAsync(),
  ]);

  return {
    foregroundGranted: foreground.granted,
    backgroundGranted: background.granted,
  };
};
