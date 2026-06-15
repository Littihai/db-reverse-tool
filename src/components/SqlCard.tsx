import React, { useState } from "react";
import { auth } from "../firebase";

interface Props {
  id: number | string;
  title: string;
  sql: string;
  category: string;
  isCustom?: boolean;
  visibility?: "private" | "public";
  createdBy?: string;
  createdByName?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const categoryStyle: Record<string, { bg: string; color: string }> = {
  Structure:        { bg: "rgba(59,130,246,0.12)",  color: "#60a5fa" },
  "Business Logic": { bg: "rgba(167,139,250,0.12)", color: "#a78bfa" },
  Data:             { bg: "rgba(52,211,153,0.12)",  color: "#34d399" },
  Security:         { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
  Custom:           { bg: "rgba(251,146,60,0.12)",  color: "#fb923c" },
};

const SqlCard: React.FC<Props> = ({
  id, title, sql, category,
  isCustom, visibility, createdBy, createdByName,
  onEdit, onDelete,
}) => {
  const [copied,     setCopied]     = useState(false);
  const [expanded,   setExpanded]   = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const style    = categoryStyle[category] || categoryStyle.Custom;
  const isLong   = sql.split("\n").length > 4;
  const isOwner  = auth.currentUser?.uid === createdBy;
  const isPublic = visibility === "public";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={s.numBadge}>{typeof id === "number" ? id : "★"}</div>
        <span style={{ ...s.badge, background: style.bg, color: style.color }}>{category}</span>

        {isCustom && (
          <span style={isPublic ? s.publicBadge : s.privateBadge}>
            {isPublic ? "🌐 Public" : "🔒 Private"}
          </span>
        )}

        <div style={s.actions}>
          {isCustom && isOwner && (
            <>
              <button style={s.iconBtn} onClick={e => { e.stopPropagation(); onEdit?.(); }}>✏️</button>
              {confirmDel ? (
                <>
                  <button style={{ ...s.iconBtn, color: "#f87171", fontSize: 11 }} onClick={e => { e.stopPropagation(); onDelete?.(); }}>ยืนยันลบ</button>
                  <button style={s.iconBtn} onClick={e => { e.stopPropagation(); setConfirmDel(false); }}>ยกเลิก</button>
                </>
              ) : (
                <button style={s.iconBtn} onClick={e => { e.stopPropagation(); setConfirmDel(true); }}>🗑️</button>
              )}
            </>
          )}
          <button style={{ ...s.copyBtn, color: copied ? "#34d399" : "#64748b" }} onClick={handleCopy}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      <p style={s.title}>{title.replace(/^\d+\.\s*/, "")}</p>

      {isCustom && isPublic && createdByName && (
        <p style={s.createdBy}>👤 {createdByName}</p>
      )}

      <div style={{ ...s.codeWrap, maxHeight: expanded ? 400 : 100, transition: "max-height 0.3s ease" }}>
        <pre style={s.code}>{sql}</pre>
        {isLong && !expanded && <div style={s.fade} />}
      </div>

      {isLong && (
        <button style={s.expandBtn} onClick={() => setExpanded(!expanded)}>
          {expanded ? "▲ ย่อลง" : "▼ ดู query เต็ม"}
        </button>
      )}
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  card:         { background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px" },
  header:       { display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" },
  numBadge:     { width: 22, height: 22, background: "rgba(255,255,255,0.06)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#64748b", fontWeight: 600, flexShrink: 0 },
  badge:        { fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20 },
  privateBadge: { fontSize: 10, color: "#60a5fa", background: "rgba(59,130,246,0.1)",  border: "1px solid rgba(59,130,246,0.2)",  padding: "2px 8px", borderRadius: 20 },
  publicBadge:  { fontSize: 10, color: "#34d399", background: "rgba(52,211,153,0.1)",  border: "1px solid rgba(52,211,153,0.2)",  padding: "2px 8px", borderRadius: 20 },
  actions:      { marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 },
  iconBtn:      { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 5, padding: "2px 7px", cursor: "pointer", fontSize: 12, color: "#94a3b8" },
  copyBtn:      { fontSize: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 5, padding: "3px 10px", cursor: "pointer" },
  title:        { fontSize: 13, fontWeight: 600, color: "#cbd5e1", marginBottom: 8, lineHeight: 1.4 },
  createdBy:    { fontSize: 11, color: "#475569", marginBottom: 8 },
  codeWrap:     { position: "relative", overflow: "hidden", borderRadius: 8 },
  code:         { background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "10px 12px", fontSize: 11.5, color: "#7dd3fc", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0, fontFamily: "'Fira Code','Consolas',monospace" },
  fade:         { position: "absolute", bottom: 0, left: 0, right: 0, height: 32, background: "linear-gradient(transparent, #1e293b)", pointerEvents: "none" },
  expandBtn:    { marginTop: 8, fontSize: 11, color: "#60a5fa", background: "none", border: "none", cursor: "pointer" },
};

export default SqlCard;