import { useEffect } from "react";
import L from "leaflet";

interface EVStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function EVMap() {

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        initMap(position.coords.latitude, position.coords.longitude);
      },
      () => alert("Location permission required")
    );
  }, []);

  const initMap = (lat: number, lng: number) => {

    const map = L.map("map").setView([lat, lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // User marker
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup("📍 You are here")
      .openPopup();

    fetchEVStations(map, lat, lng);
  };

  const fetchEVStations = async (map: L.Map, userLat: number, userLng: number) => {

    const response = await fetch("http://localhost:8080/api/ev_stations/all");
    const stations: EVStation[] = await response.json();

    stations.forEach((station) => {

      const distance = getDistance(
        userLat,
        userLng,
        station.latitude,
        station.longitude
      );

      if (distance <= 10) {
        L.marker([station.latitude, station.longitude])
          .addTo(map)
          .bindPopup(`
            ⚡ ${station.name} <br/>
            📏 ${distance.toFixed(2)} km away
          `);
      }
    });
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
      <div id="map" className="w-full h-full rounded-lg shadow-lg"></div>
    </div>
  );
}
