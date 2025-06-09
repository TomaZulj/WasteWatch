import { useEffect, useRef } from "react";
import L from "leaflet";
import { FaTrash } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";

function MapView({ sensorsData }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (mapRef.current && !mapInstanceRef.current) {
            const zagrebCenter = [45.815, 15.9819];

            mapInstanceRef.current = L.map(mapRef.current).setView(zagrebCenter, 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors",
            }).addTo(mapInstanceRef.current);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current || Object.keys(sensorsData).length === 0) return;

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        Object.entries(sensorsData).forEach(([sensorId, data]) => {
            const { fullness, counter, location } = data;

            let color = "#00ff00";
            if (fullness >= 100) color = "#ff0000";
            else if (fullness >= 50) color = "#ffaa00";

            const icon = L.divIcon({
                className: "custom-trash-icon",
                html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid #333; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;">
                    ${ReactDOMServer.renderToString(<FaTrash />)}
                </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            });

            const marker = L.marker([location.lat, location.lng], { icon }).addTo(mapInstanceRef.current).bindPopup(`
          <div style="padding: 10px;">
            <h3>Kanta #${sensorId}</h3>
            <p><strong>Punoća:</strong> ${fullness}%</p>
            <p><strong>Otvorena</strong> ${counter} <strong>puta</strong></p>
            <p><strong>Lokacija:</strong> ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}</p>
          </div>
        `);

            marker.on("mouseover", function () {
                this.bindTooltip(`Otvorena: ${counter} puta`, { permanent: false }).openTooltip();
            });

            markersRef.current.push(marker);
        });
    }, [sensorsData]);

    return (
        <div className="map-container">
            <div ref={mapRef} className="map"></div>
            <MapLegend />
        </div>
    );
}

function MapLegend() {
    return (
        <div className="map-legend">
            <h3>Legend</h3>
            <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: "#00ff00" }}></span>
                <span>Empty (0%)</span>
            </div>
            <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: "#ffaa00" }}></span>
                <span>Half Full (50%)</span>
            </div>
            <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: "#ff0000" }}></span>
                <span>Full (100%)</span>
            </div>
        </div>
    );
}

export default MapView;
