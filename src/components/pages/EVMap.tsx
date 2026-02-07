import { useEffect ,useState, useRef} from "react";
import L from "leaflet";
import axios from "axios";
import useLocation from "../hooks/useLocation";
import { API_URL } from "../../config/api_config";
import type { Station } from "../../models/station_model";
import { useOutletContext } from "react-router-dom";

export default function EVMap() {

  const { place, coords, error } = useLocation();
  const [] = useState<number>(0);
  const [] = useState<number | null>(null);


  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  
  // const { setEvStations } = useOutletContext<{ setEvStations: React.Dispatch<React.SetStateAction<(Station & { distance: number })[]>> }>();

  const outletContext = useOutletContext<{ setEvStations: Function }>();
  const setEvStations = outletContext.setEvStations;

  // 1️⃣ Init map when coords available
  useEffect(() => {
    if (error) {
      alert(error);
      return;
    }

    if (!coords.lat || !coords.lng || mapRef.current) return;

    mapRef.current = L.map("map").setView([coords.lat, coords.lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(mapRef.current);

    markerRef.current = L.marker([coords.lat, coords.lng]).addTo(
      mapRef.current
    );

    markerRef.current
      .bindPopup("You are here: Detecting location...")
      .openPopup();

    fetchEVStations(mapRef.current, coords.lat, coords.lng);
  }, [coords, error]);

  // 2️⃣ Update popup when place updates 🔥
  useEffect(() => {
    if (!markerRef.current) return;

    markerRef.current.setPopupContent(`You are here: ${place}`);
  }, [place]);

  const fetchEVStations = async (map: L.Map, userLat: number, userLng: number) => {
    try {
      const response = await axios.get<Station[]>(API_URL+"/ev_stations/all");

      const stations = response.data;
      // setEvStations(stations);

      const stationsWithDistance: (Station & { distance: number })[] = [];

      stations.forEach((station) => {
        const distance = getDistance(
          userLat,
          userLng,
          station.lat,
          station.lng
        );
        console.log("Calculated distance:", distance, "km");
        if (distance <= 10000000) {
          L.marker([station.lat, station.lng])
            .addTo(map)
            .bindPopup(`
              ⚡ ${station.name} <br/>
              📏 ${distance.toFixed(2)} km away
            `);
            console.log("Station:", station.lat, "Distance:", distance.toFixed(2), "km");
            stationsWithDistance.push({ ...station, distance });
        }
      });
      setEvStations(stationsWithDistance);
      console.log("Stations sent to chatbot:", stationsWithDistance);
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

  // return (
  //   <div className="w-full h-screen">
  //      <ul>
  //       {/* {evStations.map((station) => (
  //         <li key={station.id}>
  //           {station.name} — ({station.latitude}, {station.longitude})
  //         </li>
  //       ))} */}
  //     </ul>
  //     <p></p>
  //     <div id="map" className="w-full h-full rounded-lg shadow-lg"></div>

  //     <div className="w-1/4 p-4 bg-gray-900 text-white overflow-y-auto">
  //       <ChatBot stations={evStations} />
  //     </div>
  //   </div>
  // );
  return (
    <div className="w-full h-screen flex">
      <div className="w-full h-full">
        <div id="map" className="w-full h-full rounded-lg shadow-lg"></div>
      </div>
    </div>
  );
}
