import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.bg1} />
      <div style={s.bg2} />
      <div style={s.card}>
        <div style={s.iconWrap}>
          <span style={{ fontSize: 32 }}>🗄️</span>
        </div>
        <h1 style={s.title}>DB Reverse Tool</h1>
        <p style={s.sub}>สำรวจโครงสร้างฐานข้อมูล SQL Server<br />เพื่อพัฒนาระบบใหม่และ Data Migration</p>

        <div style={s.features}>
          {["22 SQL Queries พร้อมใช้", "Checklist ครบ 5 หมวด", "Module Mapping", "Copy Query ได้ทันที"].map(f => (
            <div key={f} style={s.featureItem}>
              <span style={s.checkIcon}>✓</span>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{f}</span>
            </div>
          ))}
        </div>

        <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
          {loading ? (
            <span>กำลังเข้าสู่ระบบ...</span>
          ) : (
            <>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{ width: 18 }} />
              <span>Sign in with Google</span>
            </>
          )}
        </button>
        <p style={s.note}>🔒 เฉพาะผู้ที่มีลิงก์เข้าถึงได้เท่านั้น</p>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  bg1: { position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", top: -100, right: -100, pointerEvents: "none" },
  bg2: { position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", bottom: -50, left: -50, pointerEvents: "none" },
  card: { background: "rgba(30,41,59,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 400, position: "relative", zIndex: 1 },
  iconWrap: { width: 64, height: 64, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 },
  sub: { fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 24 },
  features: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 28, padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" },
  featureItem: { display: "flex", alignItems: "center", gap: 10 },
  checkIcon: { width: 18, height: 18, background: "rgba(52,211,153,0.15)", color: "#34d399", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 },
  btn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "12px 20px", background: "#fff", color: "#1e293b", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 16 },
  note: { textAlign: "center", fontSize: 11, color: "#475569" },
};

export default LoginPage;