// src/pages/Auth.js

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase"; // Firestore bağlantısı
import { doc, setDoc } from "firebase/firestore"; // Firestore fonksiyonları

function Auth() {
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        const userCredential = await register(email, password);
        const user = userCredential.user;

        // Firestore'a kullanıcı bilgilerini kaydet (isim olarak da email yazıyoruz)
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          isim: user.email, // 👈 isim alanına da maili yaz
          createdAt: new Date(),
        });

        console.log("Firestore'a kullanıcı kaydedildi:", user.email);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError("Hata: " + err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>{isRegister ? "Kayıt Ol" : "Giriş Yap"}</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          {isRegister ? "Kayıt Ol" : "Giriş Yap"}
        </button>
      </form>
      <p>
        {isRegister ? "Zaten bir hesabın var mı?" : "Hesabın yok mu?"}{" "}
        <button onClick={() => setIsRegister(!isRegister)} style={toggleStyle}>
          {isRegister ? "Giriş Yap" : "Kayıt Ol"}
        </button>
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Auth;

// Stiller
const containerStyle = {
  maxWidth: "400px",
  margin: "80px auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "#FF6B00",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const toggleStyle = {
  background: "none",
  border: "none",
  color: "#FF6B00",
  cursor: "pointer",
  textDecoration: "underline",
};
