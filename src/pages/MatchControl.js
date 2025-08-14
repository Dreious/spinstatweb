import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const MatchControl = () => {
  const [step, setStep] = useState("start"); // start | selectMethod | qrScan | manualEntry | ready | running
  const [matchCode, setMatchCode] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [qrText, setQrText] = useState("");
  const [scannerRunning, setScannerRunning] = useState(false);

  const divId = useRef(`qr-${Math.random().toString(36).slice(2)}`);
  const scannerRef = useRef(null);

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

  // QR Scanner
  useEffect(() => {
    if (step !== "qrScan") {
      // Clean up scanner when leaving qrScan step
      if (scannerRef.current && scannerRunning) {
        scannerRef.current
          .stop()
          .then(() => {
            setScannerRunning(false);
            scannerRef.current.clear();
            scannerRef.current = null;
          })
          .catch(() => {
            setScannerRunning(false);
            scannerRef.current = null;
          });
      }
      return;
    }

    if (scannerRunning) return; // Prevent multiple scanners

    const scanner = new Html5Qrcode(divId.current);
    scannerRef.current = scanner;

    (async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        const camId =
          cameras.find((c) => /back|rear|environment/i.test(c.label))?.id ||
          cameras[0]?.id;
        if (!camId) throw new Error("Kamera bulunamadı");

        await scanner.start(
          camId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            videoConstraints: {
              width: 300,
              height: 300,
              aspectRatio: 1.0,
              facingMode: "environment", // Force back camera
            },
          },
          (decoded) => {
            setQrText(decoded);
            setMatchCode(decoded);
            alert(`QR Kod Okundu: ${decoded}`);
            if (scannerRunning) {
              scanner
                .stop()
                .then(() => {
                  setScannerRunning(false);
                  setStep("ready");
                })
                .catch(() => {
                  setScannerRunning(false);
                  setStep("ready");
                });
            }
          },
          (err) => {} // noise
        );
        setScannerRunning(true);
      } catch (e) {
        console.error(e);
        setScannerRunning(false);
      }
    })();

    return () => {
      if (scannerRef.current && scannerRunning) {
        scannerRef.current
          .stop()
          .then(() => {
            setScannerRunning(false);
            scannerRef.current.clear();
            scannerRef.current = null;
          })
          .catch(() => {
            setScannerRunning(false);
            scannerRef.current = null;
          });
      }
    };
  }, [step, scannerRunning]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRunning) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear();
        setScannerRunning(false);
      }
    };
  }, []);

  const handleStartClick = () => {
    setStep("selectMethod");
  };

  const handleQRScan = () => {
    setStep("qrScan");
  };

  const handleManualEntry = () => {
    setStep("manualEntry");
  };

  const handleManualCodeChange = (e) => {
    const value = e.target.value.slice(0, 6); // Limit to 6 characters
    setManualCode(value);
  };

  const handleManualCodeSubmit = () => {
    if (manualCode.length === 6) {
      setMatchCode(manualCode);
      setStep("ready");
    }
  };

  const handleMatchStart = () => {
    setTimerActive(true);
    setStep("running");
  };

  const handleMatchEnd = () => {
    if (scannerRef.current && scannerRunning) {
      scannerRef.current.stop().catch(() => {});
      setScannerRunning(false);
    }
    setTimerActive(false);
    setStep("start");
    setMatchCode("");
    setManualCode("");
    setQrText("");
    setTime(0);
  };

  const handleBackToStart = () => {
    if (scannerRef.current && scannerRunning) {
      scannerRef.current
        .stop()
        .then(() => {
          setScannerRunning(false);
          setStep("start");
          setMatchCode("");
          setManualCode("");
          setQrText("");
        })
        .catch(() => {
          setScannerRunning(false);
          setStep("start");
          setMatchCode("");
          setManualCode("");
          setQrText("");
        });
    } else {
      setStep("start");
      setMatchCode("");
      setManualCode("");
      setQrText("");
    }
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
        <button onClick={handleStartClick} style={buttonStyle("#28a745")}>
          Maça Başla
        </button>
      )}

      {step === "selectMethod" && (
        <div>
          <h3>Maç Kodunu Nasıl Girmek İstiyorsunuz?</h3>
          <button onClick={handleQRScan} style={buttonStyle("#007bff")}>
            QR Kod Okut
          </button>
          <button onClick={handleManualEntry} style={buttonStyle("#6c757d")}>
            Manuel Giriş
          </button>
        </div>
      )}

      {step === "qrScan" && (
        <div>
          <h3>QR Kodu Okutun</h3>
          <div
            id={divId.current}
            style={{
              width: 300,
              height: 300,
              margin: "20px auto",
              border: "2px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          />
          <p style={{ margin: "20px 0", fontSize: "16px" }}>
            {qrText || "QR kod bekleniyor..."}
          </p>
          <div style={{ marginTop: "30px" }}>
            <button onClick={handleBackToStart} style={buttonStyle("#6c757d")}>
              Geri
            </button>
          </div>
        </div>
      )}

      {step === "manualEntry" && (
        <div>
          <h3>6 Haneli Maç Kodunu Girin</h3>
          <input
            type="text"
            value={manualCode}
            onChange={handleManualCodeChange}
            placeholder="XXXXXX"
            style={inputStyle}
            maxLength={6}
          />
          <br />
          <button
            onClick={handleManualCodeSubmit}
            disabled={manualCode.length !== 6}
            style={buttonStyle(manualCode.length === 6 ? "#28a745" : "#6c757d")}
          >
            Onayla
          </button>
          <button onClick={handleBackToStart} style={buttonStyle("#6c757d")}>
            Geri
          </button>
        </div>
      )}

      {step === "ready" && (
        <div>
          <h3>Maç Kodu: {matchCode}</h3>
          <button onClick={handleMatchStart} style={buttonStyle("#007bff")}>
            Maçı Başlat
          </button>
          <button onClick={handleBackToStart} style={buttonStyle("#6c757d")}>
            Geri
          </button>
        </div>
      )}

      {step === "running" && (
        <div>
          <h2>Maç Devam Ediyor</h2>
          <h3>Maç Kodu: {matchCode}</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {formatTime(time)}
          </p>
          <button onClick={handleMatchEnd} style={buttonStyle("#dc3545")}>
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

const inputStyle = {
  padding: "15px",
  fontSize: "18px",
  marginTop: "10px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "2px solid #ddd",
  textAlign: "center",
  letterSpacing: "2px",
  width: "200px",
};

export default MatchControl;
