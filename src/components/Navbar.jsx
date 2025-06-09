function Navbar({ activeTab, onTabChange }) {
    return (
        <nav className="tab-navigation">
            <button className={`tab ${activeTab === "map" ? "active" : ""}`} onClick={() => onTabChange("map")}>
                Karta
            </button>
            <button
                className={`tab ${activeTab === "statistics" ? "active" : ""}`}
                onClick={() => onTabChange("statistics")}
            >
                Statistika
            </button>
        </nav>
    );
}

export default Navbar;
