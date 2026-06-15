import React, { useState } from "react";

const guideData = [
  {
    id: "database",
    icon: "📐",
    title: "Database Structure",
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.15)",
    description: "สิ่งที่ต้องรู้เกี่ยวกับโครงสร้างฐานข้อมูลก่อนเริ่มพัฒนา",
    items: [
      {
        title: "Tables & Columns",
        detail: "สำรวจ Table ทั้งหมด พร้อมชนิดข้อมูลของแต่ละ Column ให้ครบก่อน เพื่อใช้ออกแบบ Entity และ Data Model ของระบบใหม่",
        tip: "ใช้ Query #1 และ #2 จากหน้า SQL Queries",
        important: true,
      },
      {
        title: "Primary Key & Foreign Key",
        detail: "ทำความเข้าใจความสัมพันธ์ระหว่าง Table ผ่าน PK/FK เพื่อออกแบบ Relationship และ API endpoint ได้ถูกต้อง",
        tip: "ใช้ Query #3 และ #4",
        important: true,
      },
      {
        title: "Index & Constraint",
        detail: "ดู Index ที่มีอยู่เพื่อรู้ว่า column ไหนถูก query บ่อย และ Constraint ช่วยให้รู้ business rule ที่ซ่อนอยู่ใน DB",
        tip: "ใช้ Query #14, #15, #16",
        important: false,
      },
      {
        title: "Identity Column",
        detail: "ตรวจสอบ column ที่เป็น Auto Increment เพื่อออกแบบ Insert logic และ ID generation strategy ของระบบใหม่ได้ถูกต้อง",
        tip: "ใช้ Query #17",
        important: false,
      },
    ],
  },
  {
    id: "business",
    icon: "⚙️",
    title: "Business Logic",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.15)",
    description: "Logic ที่ซ่อนอยู่ใน Database ต้องทำความเข้าใจก่อนย้ายระบบ",
    items: [
      {
        title: "Stored Procedures",
        detail: "SP มักซ่อน business logic สำคัญ เช่น การคำนวณ การ validate ข้อมูล หรือ workflow ต่างๆ ต้องอ่านและทำความเข้าใจทุกตัวก่อนสร้างระบบใหม่",
        tip: "ใช้ Query #7 ดูรายการ และ #10 ดู script",
        important: true,
      },
      {
        title: "Views",
        detail: "View บอกให้รู้ว่าข้อมูลไหนถูกใช้บ่อยและถูก join กันยังไง ช่วยออกแบบ API และ Report ได้ตรงจุด",
        tip: "ใช้ Query #6 ดูรายการ และ #11 ดู script",
        important: true,
      },
      {
        title: "Functions",
        detail: "Function มักใช้ในการคำนวณค่าต่างๆ เช่น คำนวณราคา แปลงข้อมูล หรือ format ข้อความ ต้องนำ logic มาเขียนใหม่ในระบบใหม่",
        tip: "ใช้ Query #8 ดูรายการ และ #12 ดู script",
        important: false,
      },
      {
        title: "Triggers",
        detail: "Trigger ทำงานอัตโนมัติเมื่อมีการ Insert/Update/Delete ถ้าไม่รู้ว่ามี Trigger อยู่จะทำให้ระบบใหม่ทำงานไม่ครบ",
        tip: "ใช้ Query #9",
        important: true,
      },
      {
        title: "Dependencies",
        detail: "ดูความสัมพันธ์ระหว่าง View, SP และ Table เพื่อรู้ว่าถ้าแก้ Table นี้จะกระทบอะไรบ้าง",
        tip: "ใช้ Query #22",
        important: false,
      },
    ],
  },
  {
    id: "data",
    icon: "📊",
    title: "Data Analysis",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.15)",
    description: "วิเคราะห์ข้อมูลจริงใน Database ก่อนวางแผน Migration",
    items: [
      {
        title: "Row Count",
        detail: "รู้จำนวนข้อมูลในแต่ละ Table เพื่อวางแผน Migration และประเมิน performance ของระบบใหม่ได้ถูกต้อง",
        tip: "ใช้ Query #5",
        important: true,
      },
      {
        title: "Table & Database Size",
        detail: "ขนาดของ Table และ Database ช่วยวางแผน Storage, Backup และเลือก Infrastructure ของระบบใหม่ได้เหมาะสม",
        tip: "ใช้ Query #19 และ #20",
        important: true,
      },
      {
        title: "Sample Data",
        detail: "ดู Top 100 rows ของแต่ละ Table เพื่อเข้าใจรูปแบบข้อมูลจริง หา dirty data และวางแผน data cleansing ก่อน migrate",
        tip: "ใช้ Query #18 สร้าง script ดึงข้อมูล",
        important: false,
      },
      {
        title: "Data Dictionary",
        detail: "สร้าง Data Dictionary เพื่อเป็นเอกสารอ้างอิงให้ทีม Dev, BA และ Tester ใช้งานร่วมกันได้ตลอด project",
        tip: "ใช้ Query #13",
        important: true,
      },
    ],
  },
  {
    id: "security",
    icon: "🔒",
    title: "Security",
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.15)",
    description: "ตรวจสอบ User และสิทธิ์การเข้าถึงก่อนออกแบบระบบ Auth ใหม่",
    items: [
      {
        title: "Users & Roles",
        detail: "รู้ว่ามี User และ Role อะไรบ้างใน Database เพื่อออกแบบ Permission และ Access Control ของระบบใหม่ให้ครอบคลุม",
        tip: "ใช้ Query #21",
        important: true,
      },
    ],
  },
  {
    id: "migration",
    icon: "🚀",
    title: "Migration Plan",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.15)",
    description: "สิ่งที่ต้องเตรียมและส่งมอบก่อนเริ่ม Migration จริง",
    items: [
      {
        title: "ER Diagram",
        detail: "วาด ER Diagram จากโครงสร้าง PK/FK ที่สำรวจได้ เพื่อให้ทีมเห็นภาพรวมความสัมพันธ์ของข้อมูลทั้งหมด ใช้ SSMS Database Diagrams ได้เลย",
        tip: "SSMS → Database → Database Diagrams → New",
        important: true,
      },
      {
        title: "Data Dictionary Document",
        detail: "รวบรวม Table, Column, Data Type, Nullable, Description ไว้ในเอกสารเดียว เป็น reference หลักของ project",
        tip: "Export จาก Query #13 ลง Excel",
        important: true,
      },
      {
        title: "API Mapping",
        detail: "Map แต่ละ Table/SP กับ API endpoint ที่จะสร้างใหม่ เพื่อให้แน่ใจว่าไม่มี business logic ตกหล่น",
        tip: "ทำเป็น spreadsheet: Table → Endpoint → Method",
        important: true,
      },
      {
        title: "Data Migration Plan",
        detail: "วางแผนลำดับการ migrate ข้อมูล โดยเริ่มจาก Master data ก่อน แล้วค่อย Transaction data พร้อมกำหนด Rollback plan ไว้ด้วย",
        tip: "ลำดับ: Master → Lookup → Transaction → Log",
        important: true,
      },
      {
        title: "Final Deliverables",
        detail: "Database Dictionary.xlsx, ER Diagram.pdf, Stored Procedure Documentation.docx, Module Mapping.xlsx, API Specification.docx, Data Migration Plan.xlsx, New System Architecture Diagram",
        tip: "เอกสารทั้งหมดควรเสร็จก่อน Dev เริ่ม sprint แรก",
        important: false,
      },
    ],
  },
];

const PreBuildGuide: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>("database");
  const [openItem, setOpenItem]       = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? null : id);
    setOpenItem(null);
  };

  const toggleItem = (key: string) => {
    setOpenItem(prev => prev === key ? null : key);
  };

  const totalItems    = guideData.reduce((a, s) => a + s.items.length, 0);
  const importantItems = guideData.reduce((a, s) => a + s.items.filter(i => i.important).length, 0);

  return (
    <div style={s.wrap}>

      {/* Header Stats */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <p style={s.statLabel}>หมวดหมู่</p>
          <p style={s.statValue}>{guideData.length}</p>
          <p style={s.statSub}>ด้านที่ต้องเตรียม</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statLabel}>หัวข้อทั้งหมด</p>
          <p style={s.statValue}>{totalItems}</p>
          <p style={s.statSub}>สิ่งที่ควรรู้</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statLabel}>สำคัญมาก</p>
          <p style={{ ...s.statValue, color: "#f87171" }}>{importantItems}</p>
          <p style={s.statSub}>ห้ามข้ามเด็ดขาด</p>
        </div>
      </div>

      {/* Guide Sections */}
      <div style={s.sections}>
        {guideData.map(section => {
          const isOpen = openSection === section.id;
          return (
            <div key={section.id} style={{ ...s.section, borderColor: isOpen ? section.border : "rgba(255,255,255,0.06)" }}>

              {/* Section Header */}
              <div style={s.sectionHeader} onClick={() => toggleSection(section.id)}>
                <div style={{ ...s.iconWrap, background: section.bg, border: `1px solid ${section.border}` }}>
                  <span style={{ fontSize: 20 }}>{section.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ ...s.sectionTitle, color: isOpen ? section.color : "#e2e8f0" }}>{section.title}</p>
                  <p style={s.sectionDesc}>{section.description}</p>
                </div>
                <div style={s.sectionRight}>
                  <span style={{ ...s.countBadge, background: section.bg, color: section.color }}>
                    {section.items.length} หัวข้อ
                  </span>
                  <span style={{ ...s.chevron, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                </div>
              </div>

              {/* Section Items */}
              {isOpen && (
                <div style={s.itemList}>
                  {section.items.map((item, idx) => {
                    const key   = `${section.id}-${idx}`;
                    const isItemOpen = openItem === key;
                    return (
                      <div key={key} style={{ ...s.item, borderColor: isItemOpen ? section.border : "transparent" }}>
                        <div style={s.itemHeader} onClick={() => toggleItem(key)}>
                          <div style={s.itemLeft}>
                            {item.important && (
                              <span style={s.importantBadge}>⚡ สำคัญ</span>
                            )}
                            <span style={s.itemTitle}>{item.title}</span>
                          </div>
                          <span style={{ ...s.chevron, fontSize: 10, transform: isItemOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                        </div>

                        {isItemOpen && (
                          <div style={s.itemDetail}>
                            <p style={s.itemText}>{item.detail}</p>
                            <div style={{ ...s.tipBox, borderColor: section.border, background: section.bg }}>
                              <span style={{ ...s.tipLabel, color: section.color }}>💡 แนะนำ</span>
                              <span style={s.tipText}>{item.tip}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  wrap:          { padding: "0 24px 24px" },
  statsRow:      { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 },
  statCard:      { background: "#1e293b", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 16px" },
  statLabel:     { fontSize: 11, color: "#475569", marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.05em" },
  statValue:     { fontSize: 28, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 },
  statSub:       { fontSize: 11, color: "#334155", marginTop: 4 },
  sections:      { display: "flex", flexDirection: "column", gap: 10 },
  section:       { background: "#1e293b", border: "1px solid", borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" },
  sectionHeader: { display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", cursor: "pointer" },
  iconWrap:      { width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sectionTitle:  { fontSize: 15, fontWeight: 600, marginBottom: 3, transition: "color 0.2s" },
  sectionDesc:   { fontSize: 12, color: "#64748b", lineHeight: 1.4 },
  sectionRight:  { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  countBadge:    { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 },
  chevron:       { fontSize: 12, color: "#475569", transition: "transform 0.2s" },
  itemList:      { padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 6 },
  item:          { background: "rgba(0,0,0,0.2)", border: "1px solid", borderRadius: 10, overflow: "hidden", transition: "border-color 0.2s" },
  itemHeader:    { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", cursor: "pointer" },
  itemLeft:      { display: "flex", alignItems: "center", gap: 8 },
  importantBadge:{ fontSize: 10, fontWeight: 600, color: "#fbbf24", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", padding: "2px 8px", borderRadius: 20 },
  itemTitle:     { fontSize: 13, fontWeight: 500, color: "#cbd5e1" },
  itemDetail:    { padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 10 },
  itemText:      { fontSize: 13, color: "#94a3b8", lineHeight: 1.7 },
  tipBox:        { display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", border: "1px solid", borderRadius: 8 },
  tipLabel:      { fontSize: 11, fontWeight: 600, flexShrink: 0, marginTop: 1 },
  tipText:       { fontSize: 12, color: "#64748b", lineHeight: 1.5 },
};

export default PreBuildGuide;