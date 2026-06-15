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
      {/* Background Grid */}
      <div style={s.grid} />

      {/* Glow Effects */}
      <div style={s.glowBlue} />
      <div style={s.glowPurple} />

      <div style={s.wrapper}>
        {/* Left Panel */}
        <div style={s.leftPanel}>
          <div style={s.brand}>
            <div style={s.brandIcon}>🗄️</div>
            <span style={s.brandName}>DB Reverse Tool</span>
          </div>

          <div style={s.heroText}>
            <h1 style={s.heroTitle}>
              สำรวจโครงสร้าง<br />
              <span style={s.heroHighlight}>ฐานข้อมูล SQL Server</span><br />
              ได้ทุกที่ทุกเวลา
            </h1>
            <p style={s.heroSub}>
              เครื่องมือสำหรับ Developer และ DBA<br />
              เพื่อเตรียมพัฒนาระบบใหม่และ Data Migration
            </p>
          </div>

          {/* Features List */}
          <div style={s.featureList}>
            {[
              { icon: "📋", text: "22 SQL Queries พร้อมใช้งาน" },
              { icon: "➕", text: "เพิ่ม Custom Query ได้ทันที" },
              { icon: "🔒", text: "กำหนด Private / Public Query" },
              { icon: "📖", text: "Pre-Build Guide ครบทุกขั้นตอน" },
              { icon: "☁️", text: "Sync ข้ามเครื่องผ่าน Firestore" },
            ].map(f => (
              <div key={f.text} style={s.featureItem}>
                <span style={s.featureIcon}>{f.icon}</span>
                <span style={s.featureText}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div style={s.techRow}>
            {["React", "TypeScript", "Firebase"].map(t => (
              <span key={t} style={s.techBadge}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right Panel — Login Card */}
        <div style={s.rightPanel}>
          <div style={s.card}>
            {/* Card Header */}
            <div style={s.cardHeader}>
              <div style={s.cardIcon}>🗄️</div>
              <h2 style={s.cardTitle}>เข้าสู่ระบบ</h2>
              <p style={s.cardSub}>ใช้ Google Account เพื่อเข้าใช้งาน</p>
            </div>

            {/* Divider */}
            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerText}>Sign in with</span>
              <div style={s.dividerLine} />
            </div>

            {/* Google Button */}
            <button
              style={{ ...s.googleBtn, opacity: loading ? 0.7 : 1 }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <div style={s.loadingRow}>
                  <div style={s.spinner} />
                  <span>กำลังเข้าสู่ระบบ...</span>
                </div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                    <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Note */}
            <div style={s.noteBox}>
              <span style={s.noteDot}>•</span>
              <p style={s.noteText}>เฉพาะผู้ที่มีลิงก์เท่านั้นที่สามารถเข้าถึงได้</p>
            </div>

            {/* Footer */}
            <p style={s.cardFooter}>
              Built with React + Firebase · © 2026 Ritz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#080d1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  glowBlue: {
    position: "absolute",
    width: 600,
    height: 600,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)",
    top: -150,
    left: -100,
    pointerEvents: "none",
  },
  glowPurple: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)",
    bottom: -100,
    right: -50,
    pointerEvents: "none",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: 80,
    padding: "40px 60px",
    position: "relative",
    zIndex: 1,
    maxWidth: 1100,
    width: "100%",
  },

  // Left Panel
  leftPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  brandIcon: { fontSize: 24 },
  brandName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#60a5fa",
    letterSpacing: "-0.3px",
  },
  heroText: { display: "flex", flexDirection: "column", gap: 14 },
  heroTitle: {
    fontSize: 38,
    fontWeight: 800,
    color: "#f1f5f9",
    lineHeight: 1.25,
    letterSpacing: "-0.5px",
  },
  heroHighlight: {
    background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 1.7,
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    flexShrink: 0,
  },
  featureText: {
    fontSize: 14,
    color: "#94a3b8",
  },
  techRow: {
    display: "flex",
    gap: 8,
  },
  techBadge: {
    fontSize: 11,
    color: "#475569",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: "4px 12px",
  },

  // Right Panel
  rightPanel: {
    flexShrink: 0,
    width: 380,
  },
  card: {
    background: "rgba(15,23,42,0.8)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "36px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  cardHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    textAlign: "center",
  },
  cardIcon: {
    width: 56,
    height: 56,
    background: "rgba(59,130,246,0.1)",
    border: "1px solid rgba(59,130,246,0.2)",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#f1f5f9",
  },
  cardSub: {
    fontSize: 13,
    color: "#64748b",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(255,255,255,0.06)",
  },
  dividerText: {
    fontSize: 12,
    color: "#475569",
    whiteSpace: "nowrap" as const,
  },
  googleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
    padding: "13px 20px",
    background: "#fff",
    color: "#1e293b",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(0,0,0,0.15)",
    borderTopColor: "#1e293b",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  noteBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: "10px 14px",
  },
  noteDot: {
    color: "#334155",
    fontSize: 16,
    lineHeight: 1.4,
    flexShrink: 0,
  },
  noteText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 1.6,
  },
  cardFooter: {
    fontSize: 11,
    color: "#334155",
    textAlign: "center" as const,
  },
};

export default LoginPage;