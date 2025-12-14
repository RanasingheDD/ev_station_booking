import { useEffect ,useState} from "react";
import L from "leaflet";
import axios from "axios";
import useLocation from "../hooks/useLocation";

import { API_URL } from "../../config/api_config";

interface EVStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function EVMap() {

  const { place, coords, error } = useLocation();
  const [distances, setDistance] = useState<number>(0);
  const [latitudes, setLatitude] = useState<number | null>(null);



  useEffect(() => {
    if (error) {
      alert(error);
      return;
    }

    if (coords.lat && coords.lng) {
      initMap(coords.lat, coords.lng);
    }
  }, [coords, error]);

  const initMap = (lat: number, lng: number) => {
    const map = L.map("map").setView([lat, lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // User marker
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`You are here: ${place}`)
      .openPopup();

    fetchEVStations(map, lat, lng);
  };

  const fetchEVStations = async (map: L.Map, userLat: number, userLng: number) => {
    try {
      const response = await axios.get<EVStation[]>(API_URL+"/ev_stations/all");

      const stations = response.data;
      // setEvStations(stations);

      stations.forEach((station) => {
        const distance = getDistance(
          userLat,
          userLng,
          station.latitude,
          station.longitude
        );

        if (distance <= 10000000) {
          L.marker([station.latitude, station.longitude])
            .addTo(map)
            .bindPopup(`
              ⚡ ${station.name} <br/>
              📏 ${distance.toFixed(2)} km away
            `);
        }
      });
    } catch (err) {
      console.error("Error fetching EV stations:", err);
      alert("Failed to load EV stations. Check your backend server.");
    }
  };

  const getDistance = (
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number => {

    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="w-full h-screen">
       <ul>
        {/* {evStations.map((station) => (
          <li key={station.id}>
            {station.name} — ({station.latitude}, {station.longitude})
          </li>
        ))} */}
      </ul>
      <div id="map" className="w-full h-full rounded-lg shadow-lg"></div>
    </div>
  );
}
