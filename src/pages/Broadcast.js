import { useState } from "react";
import YouTubeLive from "./components/Youtubelive";
import React from "react";

const Broadcast = () => {
  const [selectedCategory, setSelectedCategory] = useState("Ankara Bilkent Sports International");
  const [selectedCourt, setSelectedCourt] = useState("Kort 1");

  const categories = ["Ankara Bilkent Sports International"];
  const courts = ["Kort 1", "Kort 2"];

  // Kortlara göre video ID’leri
  const videos = {
    "Kort 1": "abc123XYZ", // Kendi canlı yayın ID’nizi girin
    "Kort 2": "mKCieTImjvU"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Canlı Yayın</h1>

      {/* Kategori seçimi */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Kategori:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Kort seçimi */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Kort:</label>
        <select value={selectedCourt} onChange={(e) => setSelectedCourt(e.target.value)}>
          {courts.map((court, index) => (
            <option key={index} value={court}>{court}</option>
          ))}
        </select>
      </div>

      {/* Yayın */}
      <YouTubeLive videoId={videos[selectedCourt]} />
    </div>
  );
};

export default Broadcast;
