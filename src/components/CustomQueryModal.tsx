import React, { useState, useEffect } from "react";
import { CustomQuery } from "../types/query";

interface Props {
  onClose: () => void;
  onSave: (data: Omit<CustomQuery, "id" | "createdAt" | "createdBy" | "createdByName" | "isCustom">) => void;
  editing?: CustomQuery | null;
}

const categories = ["Structure", "Business Logic", "Data", "Security", "Custom"];

const CustomQueryModal: React.FC<Props> = ({ onClose, onSave, editing }) => {
  const [title,      setTitle]      = useState(editing?.title      || "");
  const [sql,        setSql]        = useState(editing?.sql        || "");
  const [category,   setCategory]   = useState(editing?.category   || "Custom");
  const [visibility, setVisibility] = useState<"private"|"public">(editing?.visibility || "private");
  const [error,      setError]      = useState("");

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setSql(editing.sql);
      setCategory(editing.category);
      setVisibility(editing.visibility);
    }
  }, [editing]);

  const handleSave = () => {
    if (!title.trim()) { setError("กรุณาใส่ชื่อ Query"); return; }
    if (!sql.trim())   { setError("กรุณาใส่ SQL");       return; }
    onSave({ title, sql, category, visibility });
    onClose();
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={s.header}>
          <h2 style={s.title}>{editing ? "✏️ แก้ไข Query" : "➕ เพิ่ม Query ใหม่"}</h2>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.body}>
          {/* Title */}
          <div style={s.field}>
            <label style={s.label}>ชื่อ Query <span style={{ color: "#f87171" }}>*</span></label>
            <input
              style={s.input}
              placeholder="เช่น ดู Table ที่ไม่มี Index"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(""); }}
            />
          </div>

          {/* Category */}
          <div style={s.field}>
            <label style={s.label}>หมวดหมู่</label>
            <div style={s.row}>
              {categories.map(c => (
                <button key={c}
                  style={{ ...s.chip, ...(category === c ? s.chipActive : {}) }}
                  onClick={() => setCategory(c)}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div style={s.field}>
            <label style={s.label}>การมองเห็น</label>
            <div style={s.visRow}>
              <div
                style={{ ...s.visCard, ...(visibility === "private" ? s.visActive : {}) }}
                onClick={() => setVisibility("private")}
              >
                <span style={s.visIcon}>🔒</span>
                <div>
                  <p style={s.visTitle}>ส่วนตัว (Private)</p>
                  <p style={s.visSub}>มองเห็นเฉพาะคุณเท่านั้น</p>
                </div>
                {visibility === "private" && <span style={s.visTick}>✓</span>}
              </div>
              <div
                style={{ ...s.visCard, ...(visibility === "public" ? s.visPubActive : {}) }}
                onClick={() => setVisibility("public")}
              >
                <span style={s.visIcon}>🌐</span>
                <div>
                  <p style={s.visTitle}>สาธารณะ (Public)</p>
                  <p style={s.visSub}>ทุกคนที่เข้าระบบมองเห็นได้</p>
                </div>
                {visibility === "public" && <span style={{ ...s.visTick, color: "#34d399" }}>✓</span>}
              </div>
            </div>
          </div>

          {/* SQL */}
          <div style={s.field}>
            <label style={s.label}>SQL <span style={{ color: "#f87171" }}>*</span></label>
            <textarea
              style={s.textarea}
              placeholder={"SELECT *\nFROM sys.tables\nWHERE ..."}
              value={sql}
              onChange={e => { setSql(e.target.value); setError(""); }}
              rows={10}
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          {sql.trim() && (
            <div style={s.field}>
              <label style={s.label}>Preview</label>
              <pre style={s.preview}>{sql}</pre>
            </div>
          )}

          {error && <p style={s.error}>⚠️ {error}</p>}
        </div>

        {/* Footer */}
        <div style={s.footer}>
          <div style={s.visibilityBadge}>
            {visibility === "private"
              ? <span style={s.privateBadge}>🔒 Private</span>
              : <span style={s.publicBadge}>🌐 Public</span>
            }
          </div>
          <button style={s.cancelBtn} onClick={onClose}>ยกเลิก</button>
          <button style={s.saveBtn} onClick={handleSave}>
            {editing ? "💾 บันทึก" : "➕ เพิ่ม Query"}
          </button>
        </div>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 },
  modal: { background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, width: "100%", maxWidth: 580, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  title: { fontSize: 16, fontWeight: 600, color: "#f1f5f9" },
  closeBtn: { background: "none", border: "none", color: "#64748b", fontSize: 18, cursor: "pointer" },
  body: { flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, color: "#94a3b8", fontWeight: 500 },
  input: { background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#e2e8f0", outline: "none" },
  row: { display: "flex", gap: 6, flexWrap: "wrap" as const },
  chip: { fontSize: 12, padding: "5px 14px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, background: "transparent", color: "#64748b", cursor: "pointer" },
  chipActive: { background: "rgba(59,130,246,0.12)", borderColor: "#3b82f6", color: "#60a5fa" },
  visRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  visCard: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "1.5px solid rgba(255,255,255,0.06)", borderRadius: 10, cursor: "pointer", transition: "all 0.15s", position: "relative" },
  visActive: { borderColor: "#60a5fa", background: "rgba(59,130,246,0.06)" },
  visPubActive: { borderColor: "#34d399", background: "rgba(52,211,153,0.06)" },
  visIcon: { fontSize: 22, flexShrink: 0 },
  visTitle: { fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 2 },
  visSub: { fontSize: 11, color: "#64748b" },
  visTick: { position: "absolute", top: 8, right: 10, fontSize: 13, color: "#60a5fa", fontWeight: 700 },
  textarea: { background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 12, fontSize: 12, color: "#7dd3fc", outline: "none", resize: "vertical", fontFamily: "'Fira Code','Consolas',monospace", lineHeight: 1.7 },
  preview: { background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, fontSize: 11.5, color: "#7dd3fc", lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap", maxHeight: 120, overflowY: "auto" },
  error: { fontSize: 12, color: "#f87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 6, padding: "8px 12px" },
  footer: { padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 },
  visibilityBadge: { flex: 1 },
  privateBadge: { fontSize: 12, color: "#60a5fa", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 20, padding: "4px 12px" },
  publicBadge: { fontSize: 12, color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 20, padding: "4px 12px" },
  cancelBtn: { fontSize: 13, padding: "8px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#64748b", cursor: "pointer" },
  saveBtn: { fontSize: 13, padding: "8px 20px", background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600 },
};

export default CustomQueryModal;