// src/App.js

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import YouTubeLive from "./components/Youtubelive";
import MatchControl from "./pages/MatchControl";
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      {/* Üst Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <span style={{ marginRight: "10px" }}>
          Giriş Yapan: <strong>{user.email}</strong>
        </span>
        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#FF6B00",
            color: "white",
            cursor: "pointer",
          }}
        >
          Çıkış Yap
        </button>
      </div>

      {/* Navigasyon Menüsü */}
      <nav
        style={{
          padding: "15px",
          backgroundColor: "#FF6B00",
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Link to="/" style={linkStyle}>
          Ana Sayfa
        </Link>
        <Link to="/live" style={linkStyle}>
          Canlı Yayın
        </Link>
        <Link to="/matchcontrol" style={linkStyle}>
          Maça Başla
        </Link>
      </nav>

      {/* Sayfa İçeriği */}
      <div style={{ paddingBottom: "80px", paddingTop: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<YouTubeLive />} />
          <Route path="/matchcontrol" element={<MatchControl />} />
        </Routes>
      </div>
    </Router>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "20px",
  fontSize: "16px",
};

export default App;
