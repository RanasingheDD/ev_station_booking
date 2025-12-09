import { useEffect, useState } from "react";

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

          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );

          const data = await res.json();
          setPlace(`${data.city}, ${data.countryName}`);
        } catch {
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
