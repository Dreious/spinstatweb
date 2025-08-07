import { useState, useEffect } from "react";

const MatchControl = () => {
  const [step, setStep] = useState("start"); // start | selectHall | selectCourt | ready | running
  const [selectedHall, setSelectedHall] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const halls = ["Ankara Bilkent Sports International", "İstanbul Ataşehir Sports", "İzmir Bornova Club"];
  const courts = ["Kort 1", "Kort 2", "Kort 3"];

  // Timer
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

  const handleStartClick = () => {
    setStep("selectHall");
  };

  const handleHallSelect = (e) => {
    setSelectedHall(e.target.value);
    setStep("selectCourt");
  };

  const handleCourtSelect = (e) => {
    setSelectedCourt(e.target.value);
    setStep("ready");
  };

  const handleMatchStart = () => {
    setTimerActive(true);
    setStep("running");
  };

  const handleMatchEnd = () => {
    setTimerActive(false);
    setStep("start");
    setSelectedHall("");
    setSelectedCourt("");
    setTime(0);
  };

  // Timer format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Maç Kontrol</h1>

      {step === "start" && (
        <button
          onClick={handleStartClick}
          style={buttonStyle("#28a745")}
        >
          Maça Başla
        </button>
      )}

      {step === "selectHall" && (
        <div>
          <h3>Spor Salonunu Seç</h3>
          <select value={selectedHall} onChange={handleHallSelect} style={selectStyle}>
            <option value="">Seçiniz</option>
            {halls.map((hall, idx) => (
              <option key={idx} value={hall}>
                {hall}
              </option>
            ))}
          </select>
        </div>
      )}

      {step === "selectCourt" && (
        <div>
          <h3>{selectedHall} için Kort Seç</h3>
          <select value={selectedCourt} onChange={handleCourtSelect} style={selectStyle}>
            <option value="">Seçiniz</option>
            {courts.map((court, idx) => (
              <option key={idx} value={court}>
                {court}
              </option>
            ))}
          </select>
        </div>
      )}

      {step === "ready" && (
        <div>
          <h3>
            Seçilen: {selectedHall} - {selectedCourt}
          </h3>
          <button
            onClick={handleMatchStart}
            style={buttonStyle("#007bff")}
          >
            Başlat
          </button>
        </div>
      )}

      {step === "running" && (
        <div>
          <h2>Maç Devam Ediyor</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{formatTime(time)}</p>
          <button
            onClick={handleMatchEnd}
            style={buttonStyle("#dc3545")}
          >
            Maçı Bitir
          </button>
        </div>
      )}
    </div>
  );
};

// Stil Fonksiyonları
const buttonStyle = (bgColor) => ({
  padding: "15px 30px",
  margin: "10px",
  fontSize: "18px",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
});

const selectStyle = {
  padding: "10px",
  fontSize: "16px",
  marginTop: "10px",
};

export default MatchControl;
