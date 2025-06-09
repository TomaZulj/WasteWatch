import { useState, useEffect } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import Navbar from "./components/Navbar";
import MapView from "./components/MapView";
import Statistics from "./components/Statistics";
import LoadingOverlay from "./components/LoadingOverlay";

function App() {
    const [activeTab, setActiveTab] = useState("map");
    const [sensorsData, setSensorsData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSensorData = async () => {
            setLoading(true);
            const sensorNumbers = [1, 2, 3, 4, 5];
            const newSensorsData = {};

            const username = import.meta.env.VITE_API_USERNAME;
            const password = import.meta.env.VITE_API_PASSWORD;
            const acceptHeader = import.meta.env.VITE_API_ACCEPT_HEADER;
            const credentials = btoa(`${username}:${password}`);

            const headers = {
                Authorization: `Basic ${credentials}`,
                Accept: acceptHeader,
            };

            try {
                for (const num of sensorNumbers) {
                    const [fullnessRes, counterRes, locationRes] = await Promise.all([
                        fetch(`/api/m2m/data?res=resource_kontejner_pun_${num}`, { headers }),
                        fetch(`/api/m2m/data?res=resource_kontejner_brojac_${num}`, { headers }),
                        fetch(`/api/m2m/data?res=resource_kontejner_lokacija_${num}`, { headers }),
                    ]);

                    const fullnessData = await fullnessRes.json();
                    const counterData = await counterRes.json();
                    const locationData = await locationRes.json();

                    const fullness = fullnessData.contentNodes?.[0]?.value || 0;
                    const counter = counterData.contentNodes?.[0]?.value || 0;
                    const locationString = locationData.contentNodes?.[0]?.value || "45.8150;16.0000";

                    const [lat, lng] = locationString.split(";").map((coord) => parseFloat(coord));

                    newSensorsData[num] = {
                        fullness: parseInt(fullness),
                        counter: parseInt(counter),
                        location: { lat, lng },
                        timestamp: new Date().toISOString(),
                    };
                }

                setSensorsData(newSensorsData);
            } catch (error) {
                console.error("Error fetching sensor data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSensorData();
        const interval = setInterval(fetchSensorData, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>WasteWatch</h1>
                <p>Sustav upravljanja otpadom - Zagreb</p>
            </header>

            <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="main-content">
                {loading && <LoadingOverlay />}

                {activeTab === "map" && <MapView sensorsData={sensorsData} />}

                {activeTab === "statistics" && <Statistics sensorsData={sensorsData} />}
            </main>
        </div>
    );
}

export default App;
