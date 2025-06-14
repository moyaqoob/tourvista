import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef } from "react";

type MapLibreComponentProps = {
  city: string;
  coordinates: [number, number]; // [longitude, latitude]
  openStreetMap: string;
};

const MapLibreComponent: React.FC<MapLibreComponentProps> = ({
  city,
  coordinates,
  openStreetMap,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null); // Reference to map container
  const mapInstance = useRef<maplibregl.Map | null>(null); // Reference to map instance

  useEffect(() => {
    // Validate coordinates
    const [longitude, latitude] = coordinates;
    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      console.error("Invalid coordinates:", coordinates);
      return; // Exit early if coordinates are invalid
    }

    if (mapContainer.current && !mapInstance.current) {
      // Initialize the map
      mapInstance.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://demotiles.maplibre.org/style.json", // Style URL
        center: coordinates, // Set initial map center
        zoom: 5, // Adjust zoom level as needed
      });

      // Add navigation controls
      mapInstance.current.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
      );
    }

    return () => {
      // Clean up map instance on unmount
      if (mapInstance.current) {
        mapInstance.current.remove?.(); // Use optional chaining to safely call remove
        mapInstance.current = null; // Reset the map instance reference
      }
    };
  }, [coordinates]); // Reinitialize map if coordinates change

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Map Container */}
      <div
        ref={mapContainer}
        style={{
          width: "90%",
          height: "50%",
        }}
      />

      {/* Overlay Information */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        <strong>{city}</strong>
        <br />
        <a
          href={openStreetMap}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            color: "#007BFF",
          }}
        >
          View on OpenStreetMap
        </a>
      </div>
    </div>
  );
};

export default MapLibreComponent;
