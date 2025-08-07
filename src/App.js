import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

import YouTubeLive from "./components/Youtubelive";
 // Yeni eklenen sayfa
import MatchControl from "./pages/MatchControl";
function App() {
  return (
    <Router>
      {/* Alt Navigasyon */}
      <nav style={{
        padding: "15px",
        backgroundColor: "#FF6B00",
        position: "fixed",
        bottom: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)"
      }}>
        <Link to="/" style={linkStyle}>Ana Sayfa</Link>

        {/* Video galerisi şimdilik kapalı */}
        {/* <Link to="/gallery" style={linkStyle}>Video Galerisi</Link> */}

        <Link to="/live" style={linkStyle}>Canlı Yayın</Link>
        <Link to="/matchcontrol" style={linkStyle}>Maça Başla</Link>
      </nav>

      {/* Sayfa İçerikleri */}
      <div style={{ paddingBottom: "80px", paddingTop: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/gallery" element={<VideoGallery />} /> */}
          <Route path="/live" element={<YouTubeLive />} />
          <Route path="/matchcontrol" element={<MatchControl />} />
        </Routes>
      </div>
    </Router>
  );
}

// Link Stili
const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "20px",
  fontSize: "16px",
  transition: "background-color 0.3s"
};

export default App;