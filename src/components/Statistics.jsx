function Statistics({ sensorsData }) {
    const getFullnessColor = (fullness) => {
        if (fullness >= 100) return "#ff0000";
        if (fullness >= 50) return "#ffaa00";
        return "#00ff00";
    };

    const getFullnessText = (fullness) => {
        if (fullness >= 100) return "Puna";
        if (fullness >= 50) return "Napola puna";
        return "Prazna";
    };

    return (
        <div className="statistics-container">
            <h2>Trash Can Statistics</h2>

            <div className="stats-grid">
                {Object.entries(sensorsData).map(([sensorId, data]) => (
                    <StatCard
                        key={sensorId}
                        sensorId={sensorId}
                        data={data}
                        getFullnessColor={getFullnessColor}
                        getFullnessText={getFullnessText}
                    />
                ))}
            </div>

            <SummarySection sensorsData={sensorsData} />
        </div>
    );
}

function StatCard({ sensorId, data, getFullnessColor, getFullnessText }) {
    return (
        <div className="stat-card">
            <div className="stat-header">
                <h3>Kanta #{sensorId}</h3>
                <div className="fullness-indicator" style={{ backgroundColor: getFullnessColor(data.fullness) }}></div>
            </div>

            <div className="stat-content">
                <div className="stat-item">
                    <span className="stat-label">Status:</span>
                    <span className="stat-value">{getFullnessText(data.fullness)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Punoća:</span>
                    <span className="stat-value">{data.fullness}%</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Otvorena puta:</span>
                    <span className="stat-value">{data.counter}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Lokacija:</span>
                    <span className="stat-value coordinates">
                        {data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)}
                    </span>
                </div>

                <div className="fullness-bar">
                    <div
                        className="fullness-progress"
                        style={{
                            width: `${data.fullness}%`,
                            backgroundColor: getFullnessColor(data.fullness),
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

function SummarySection({ sensorsData }) {
    const totalCans = Object.keys(sensorsData).length;
    const fullCans = Object.values(sensorsData).filter((d) => d.fullness >= 100).length;
    const halfFullCans = Object.values(sensorsData).filter((d) => d.fullness >= 50 && d.fullness < 100).length;
    const emptyCans = Object.values(sensorsData).filter((d) => d.fullness < 50).length;

    return (
        <div className="summary-section">
            <h3>Summary</h3>
            <div className="summary-grid">
                <div className="summary-item">
                    <span className="summary-label">Ukupan broj kanti:</span>
                    <span className="summary-value">{totalCans}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Pune kante:</span>
                    <span className="summary-value">{fullCans}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Napola pune kante:</span>
                    <span className="summary-value">{halfFullCans}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Prazne kante:</span>
                    <span className="summary-value">{emptyCans}</span>
                </div>
            </div>
        </div>
    );
}

export default Statistics;
