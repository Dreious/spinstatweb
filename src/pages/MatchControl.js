import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const MatchControl = () => {
  const { user } = useAuth();
  const [step, setStep] = useState("start");
  const [matchCode, setMatchCode] = useState("");
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleMatchStart = async () => {
    if (!matchCode || !user) {
      alert("Kod girin ve giriş yapmış olun.");
      return;
    }

    try {
      // 1️⃣ API isteği
      const res = await fetch(`https://e97aeec9e2a3.ngrok-free.app/v1/courts/${matchCode}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          userId: user.uid, // Kullanıcının Firestore UID'si
          source: "admin",
          meta: { quality: "1080p", duration: 3600 }
        })
      });

      if (!res.ok) {
        throw new Error(`API isteği başarısız: ${res.status}`);
      }

      // 2️⃣ Firestore'a maç geçmişini kaydet
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let matchHistory = {};
      if (userSnap.exists() && userSnap.data().matchHistory) {
        matchHistory = userSnap.data().matchHistory;
      }

      const matchCount = Object.keys(matchHistory).length;
      const nextMatchKey = `match${matchCount + 1}`;

      matchHistory[nextMatchKey] = {
        kort: matchCode,
        matchStartTime: new Date(),
      };

      await updateDoc(userRef, { matchHistory });

      // 3️⃣ Timer başlat
      setTimerActive(true);
      setStep("running");
    } catch (error) {
      console.error("Hata:", error);
      alert("Maç başlatılamadı. Lütfen tekrar deneyin.");
    }
  };

  const handleMatchEnd = async () => {
    if (!matchCode || !user) {
      alert("Kod girin ve giriş yapmış olun.");
      return;
    }

    try {
      // 1️⃣ API isteği
      const res = await fetch(`https://e97aeec9e2a3.ngrok-free.app/v1/courts/${matchCode}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "stop",
          userId: user.uid,
          source: "admin"
        })
      });

      if (!res.ok) {
        throw new Error(`API isteği başarısız: ${res.status}`);
      }

      // 2️⃣ Timer durdur
      setTimerActive(false);
      setStep("start");
      setMatchCode("");
      setTime(0);
    } catch (error) {
      console.error("Hata:", error);
      alert("Maç bitirilemedi. Lütfen tekrar deneyin.");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Maç Kontrol</h1>

      {step === "start" && (
        <div>
          <input
            type="text"
            placeholder="Kort Kodu (örn: court-001)"
            value={matchCode}
            onChange={(e) => setMatchCode(e.target.value)}
            style={inputStyle}
          />
          <br />
          <button onClick={handleMatchStart} style={buttonStyle("#28a745")}>
            Maça Başla
          </button>
        </div>
      )}

      {step === "running" && (
        <div>
          <h2>Maç Devam Ediyor</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            Süre: {formatTime(time)}
          </p>
          <button onClick={handleMatchEnd} style={buttonStyle("#dc3545")}>
            Maçı Bitir
          </button>
        </div>
      )}
    </div>
  );
};

// Stiller
const buttonStyle = (bgColor) => ({
  padding: "15px 30px",
  marginTop: "10px",
  fontSize: "18px",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
});

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  marginBottom: "10px",
  width: "250px",
};

export default MatchControl;