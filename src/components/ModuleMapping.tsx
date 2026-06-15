import React from "react";

const modules = [
  { module: "RFQ",      tables: ["RFQ_Header", "RFQ_Detail"],                icon: "📋", color: "#60a5fa" },
  { module: "PR",       tables: ["PR_Header", "PR_Detail"],                  icon: "📝", color: "#a78bfa" },
  { module: "PO",       tables: ["PO_Header", "PO_Detail"],                  icon: "🛒", color: "#34d399" },
  { module: "Vendor",   tables: ["vendor_information"],                      icon: "🏢", color: "#fb923c" },
  { module: "Customer", tables: ["customer_information"],                    icon: "👥", color: "#f472b6" },
  { module: "Employee", tables: ["employee_information"],                    icon: "👤", color: "#facc15" },
  { module: "User",     tables: ["users_information"],                       icon: "🔑", color: "#60a5fa" },
  { module: "Approval", tables: ["approval_workflow"],                       icon: "✅", color: "#34d399" },
  { module: "Email",    tables: ["email_log"],                               icon: "📧", color: "#a78bfa" },
  { module: "Audit",    tables: ["audit_log"],                               icon: "📜", color: "#f87171" },
];

const deliverables = [
  "Database Dictionary.xlsx",
  "ER Diagram.pdf",
  "Stored Procedure Documentation.docx",
  "Module Mapping.xlsx",
  "API Specification.docx",
  "Data Migration Plan.xlsx",
  "New System Architecture Diagram",
];

const ModuleMapping: React.FC = () => (
  <div style={s.wrap}>
    <div style={s.grid}>
      {modules.map(m => (
        <div key={m.module} style={s.card}>
          <div style={s.cardTop}>
            <span style={s.icon}>{m.icon}</span>
            <span style={{ ...s.moduleName, color: m.color }}>{m.module}</span>
          </div>
          <div style={s.tables}>
            {m.tables.map(t => (
              <span key={t} style={s.tableChip}>{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div style={s.deliverSection}>
      <p style={s.deliverTitle}>📦 Final Deliverables</p>
      <div style={s.deliverList}>
        {deliverables.map((d, i) => (
          <div key={d} style={s.deliverItem}>
            <span style={s.deliverNum}>{i + 1}</span>
            <span style={s.deliverName}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const s: Record<string, React.CSSProperties> = {
  wrap: { padding: 20 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 24 },
  card: { background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px" },
  cardTop: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  icon: { fontSize: 18 },
  moduleName: { fontSize: 15, fontWeight: 700 },
  tables: { display: "flex", flexDirection: "column", gap: 5 },
  tableChip: { fontSize: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 5, padding: "3px 8px", color: "#94a3b8", fontFamily: "monospace" },
  deliverSection: { background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 20px" },
  deliverTitle: { fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 },
  deliverList: { display: "flex", flexDirection: "column", gap: 8 },
  deliverItem: { display: "flex", alignItems: "center", gap: 10 },
  deliverNum: { width: 22, height: 22, background: "rgba(59,130,246,0.1)", color: "#60a5fa", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 },
  deliverName: { fontSize: 13, color: "#94a3b8" },
};

export default ModuleMapping;