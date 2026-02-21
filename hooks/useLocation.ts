import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [address, setAddress] =
    useState<Location.LocationGeocodedAddress | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // Request Permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get Latitude & Longitude
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Reverse Geocode (Get Address from Lat/Long)
      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });

      // The API returns an array, usually the first item is the best match
      if (addressResponse.length > 0) {
        setAddress(addressResponse[0]);
      }
    } catch (error) {
      setErrorMsg("Error fetching location. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    location,
    address,
    errorMsg,
    loading,
    refreshLocation: fetchLocation
  };
};
