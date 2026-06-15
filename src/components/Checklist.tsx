import React, { useState } from "react";

const data = [
  { section: "Database Structure", icon: "📐", color: "#60a5fa", items: ["Tables", "Columns", "Data Types", "Primary Keys", "Foreign Keys", "Indexes", "Unique Constraints", "Default Constraints"] },
  { section: "Business Logic",     icon: "⚙️", color: "#a78bfa", items: ["Views", "Stored Procedures", "Functions", "Triggers"] },
  { section: "Data Analysis",      icon: "📊", color: "#34d399", items: ["Row Count", "Table Size", "Database Size", "Top Sample Data"] },
  { section: "Security",           icon: "🔒", color: "#f87171", items: ["Users", "Roles", "Permissions"] },
  { section: "Migration",          icon: "🚀", color: "#fb923c", items: ["ER Diagram", "Data Dictionary", "Module Mapping", "API Mapping", "Data Migration Plan"] },
];

const Checklist: React.FC = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setChecked(p => ({ ...p, [key]: !p[key] }));
  const total = data.reduce((a, s) => a + s.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div style={s.wrap}>
      {/* Progress Header */}
      <div style={s.progressCard}>
        <div style={s.progressTop}>
          <div>
            <p style={s.progressLabel}>ความคืบหน้าโดยรวม</p>
            <p style={s.progressNum}>{done} <span style={{ fontSize: 16, color: "#64748b" }}>/ {total} รายการ</span></p>
          </div>
          <div style={{ ...s.pctCircle, background: pct === 100 ? "rgba(52,211,153,0.1)" : "rgba(59,130,246,0.1)" }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: pct === 100 ? "#34d399" : "#60a5fa" }}>{pct}%</span>
          </div>
        </div>
        <div style={s.bar}>
          <div style={{ ...s.barFill, width: `${pct}%`, background: pct === 100 ? "#34d399" : "#3b82f6", transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* Sections */}
      <div style={s.sections}>
        {data.map(sec => {
          const secDone = sec.items.filter(i => checked[`${sec.section}-${i}`]).length;
          return (
            <div key={sec.section} style={s.section}>
              <div style={s.secHeader}>
                <span style={s.secIcon}>{sec.icon}</span>
                <span style={s.secTitle}>{sec.section}</span>
                <span style={{ ...s.secCount, color: sec.color }}>{secDone}/{sec.items.length}</span>
              </div>
              <div style={s.items}>
                {sec.items.map(item => {
                  const key = `${sec.section}-${item}`;
                  const isDone = !!checked[key];
                  return (
                    <div key={key} style={s.item} onClick={() => toggle(key)}>
                      <div style={{ ...s.checkbox, borderColor: isDone ? sec.color : "#334155", background: isDone ? sec.color : "transparent" }}>
                        {isDone && <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 13, color: isDone ? "#475569" : "#cbd5e1", textDecoration: isDone ? "line-through" : "none", transition: "all 0.2s" }}>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  wrap: { padding: 20, maxWidth: 680 },
  progressCard: { background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px", marginBottom: 20 },
  progressTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  progressLabel: { fontSize: 12, color: "#64748b", marginBottom: 4 },
  progressNum: { fontSize: 28, fontWeight: 700, color: "#f1f5f9" },
  pctCircle: { width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  bar: { height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
  sections: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  section: { background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px" },
  secHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.05)" },
  secIcon: { fontSize: 16 },
  secTitle: { fontSize: 13, fontWeight: 600, color: "#e2e8f0", flex: 1 },
  secCount: { fontSize: 12, fontWeight: 600 },
  items: { display: "flex", flexDirection: "column", gap: 6 },
  item: { display: "flex", alignItems: "center", gap: 10, padding: "5px 0", cursor: "pointer" },
  checkbox: { width: 18, height: 18, border: "1.5px solid", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" },
};

export default Checklist;