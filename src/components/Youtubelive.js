import { useState } from "react";

const YouTubeLive = () => {
  const [selectedCategory, setSelectedCategory] = useState("Ankara Bilkent Sports International");
  const [selectedCourt, setSelectedCourt] = useState("Kort 1");

  // Kategoriler (şimdilik tek kategori)
  const categories = ["Ankara Bilkent Sports International"];

  // Kortlar
  const courts = ["Kort 1", "Kort 2"];

  // Kortlara göre video ID’leri
  const videos = {
    "Kort 1": "abc123XYZ", // Buraya kendi canlı yayın ID’nizi girin
    "Kort 2": "mKCieTImjvU" // Verdiğin YouTube linkinin ID'si
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Canlı Yayın</h1>

      {/* Kategori Seçimi */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Kategori:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Kort Seçimi */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Kort:</label>
        <select value={selectedCourt} onChange={(e) => setSelectedCourt(e.target.value)}>
          {courts.map((court, index) => (
            <option key={index} value={court}>{court}</option>
          ))}
        </select>
      </div>

      {/* YouTube Embed */}
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src={`https://www.youtube.com/embed/${videos[selectedCourt]}?autoplay=1`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
          title="YouTube Live"
        />
      </div>
    </div>
  );
};

export default YouTubeLive;
