import { useEffect, useState } from "react";
import axios from "axios";

const LOCATION_CACHE_KEY = "session_user_location";
const PLACE_CACHE_KEY = "session_user_place";

export const clearCachedLocation = () => {
  try {
    sessionStorage.removeItem(LOCATION_CACHE_KEY);
    sessionStorage.removeItem(PLACE_CACHE_KEY);
  } catch (err) {
    console.error("Failed to clear cached location", err);
  }
};

export default function useLocation() {
  const [place, setPlace] = useState("Detecting location...");
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>(
    {
      lat: null,
      lng: null,
    }
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already cached in this session, use it and skip geolocation prompt
    try {
      const cachedPlace = sessionStorage.getItem(PLACE_CACHE_KEY);
      const cachedCoords = sessionStorage.getItem(LOCATION_CACHE_KEY);
      if (cachedPlace && cachedCoords) {
        const parsed = JSON.parse(cachedCoords);
        setPlace(cachedPlace);
        setCoords({ lat: parsed.lat, lng: parsed.lng });
        return; // don't fetch again until logout/clear
      }
    } catch (err) {
      console.warn("Error reading cached location", err);
    }

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          setCoords({ lat, lng });

          // Check if user is online before Axios request
          if (!navigator.onLine) {
            setError("No internet connection");
            setPlace("Offline");
            return;
          }
          
          const response = await axios.get(
            `https://api.bigdatacloud.net/data/reverse-geocode-client`,
            {
              params: {
                latitude: lat,
                longitude: lng,
                localityLanguage: "en",
              },
            }
          );

          const data = response.data;
          const placeString = `${data.city}, ${data.countryName}`;

          setPlace(placeString);

          // Cache for session so we don't ask again until logout
          try {
            sessionStorage.setItem(PLACE_CACHE_KEY, placeString);
            sessionStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({ lat, lng }));
          } catch (err) {
            console.warn("Failed to cache location in sessionStorage", err);
          }
        } catch (err) {
          console.error(err);
          setError("Error fetching location");
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission denied");
        } else {
          setError("Unable to detect location");
        }
      }
    );
  }, []);

  return { place, coords, error };
}
