import { useState, useEffect } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [address, setAddress] =
    useState<Location.LocationGeocodedAddress | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1. Request Permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          return;
        }

        // 2. Get Latitude & Longitude
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        // 3. Reverse Geocode (Get Address from Lat/Long)
        let addressResponse = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        });

        // The API returns an array, usually the first item is the best match
        if (addressResponse.length > 0) {
          setAddress(addressResponse[0]);
        }
      } catch (error) {
        setErrorMsg("Error fetching location");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, address, errorMsg, loading };
};
