import { useEffect, useState } from "react";
import axios from "axios";

export default function useLocation() {
  const [place, setPlace] = useState("Detecting location...");
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

          // Axios request (auto JSON parsing)
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

          setPlace(`${data.city}, ${data.countryName}`);
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
