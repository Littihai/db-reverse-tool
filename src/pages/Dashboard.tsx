import React, { useState, useMemo } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SqlCard from "../components/SqlCard";
import Checklist from "../components/Checklist";
import ModuleMapping from "../components/ModuleMapping";
import CustomQueryModal from "../components/CustomQueryModal";
import { useCustomQueries } from "../hooks/useCustomQueries";
import { CustomQuery } from "../types/query";

const BUILT_IN_QUERIES = [
  { id: 1,  title: "1. ดูรายการ Table ทั้งหมด",           category: "Structure",       sql: `SELECT\n    TABLE_SCHEMA,\n    TABLE_NAME\nFROM INFORMATION_SCHEMA.TABLES\nWHERE TABLE_TYPE = 'BASE TABLE'\nORDER BY TABLE_NAME;` },
  { id: 2,  title: "2. ดู Column ของทุก Table",           category: "Structure",       sql: `SELECT\n    TABLE_NAME,\n    COLUMN_NAME,\n    DATA_TYPE,\n    CHARACTER_MAXIMUM_LENGTH,\n    IS_NULLABLE\nFROM INFORMATION_SCHEMA.COLUMNS\nORDER BY TABLE_NAME, ORDINAL_POSITION;` },
  { id: 3,  title: "3. ดู Primary Key",                   category: "Structure",       sql: `SELECT\n    KU.TABLE_NAME,\n    KU.COLUMN_NAME\nFROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC\nINNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KU\n    ON TC.CONSTRAINT_NAME = KU.CONSTRAINT_NAME\nWHERE TC.CONSTRAINT_TYPE = 'PRIMARY KEY'\nORDER BY KU.TABLE_NAME;` },
  { id: 4,  title: "4. ดู Foreign Key",                   category: "Structure",       sql: `SELECT\n    fk.name AS FK_Name,\n    tp.name AS ParentTable,\n    cp.name AS ParentColumn,\n    tr.name AS ReferencedTable,\n    cr.name AS ReferencedColumn\nFROM sys.foreign_keys fk\nINNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id\nINNER JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id\nINNER JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id\nINNER JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id\nINNER JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id\nORDER BY tp.name;` },
  { id: 5,  title: "5. ดูจำนวนข้อมูลในแต่ละ Table",      category: "Data",            sql: `SELECT\n    t.NAME AS TableName,\n    SUM(p.rows) AS RowCounts\nFROM sys.tables t\nINNER JOIN sys.partitions p ON t.object_id = p.object_id\nWHERE p.index_id IN (0,1)\nGROUP BY t.NAME\nORDER BY RowCounts DESC;` },
  { id: 6,  title: "6. ดู View ทั้งหมด",                 category: "Business Logic",  sql: `SELECT\n    TABLE_NAME\nFROM INFORMATION_SCHEMA.VIEWS\nORDER BY TABLE_NAME;` },
  { id: 7,  title: "7. ดู Stored Procedure ทั้งหมด",     category: "Business Logic",  sql: `SELECT\n    name\nFROM sys.procedures\nORDER BY name;` },
  { id: 8,  title: "8. ดู Function ทั้งหมด",             category: "Business Logic",  sql: `SELECT\n    name,\n    type_desc\nFROM sys.objects\nWHERE type IN ('FN','IF','TF')\nORDER BY name;` },
  { id: 9,  title: "9. ดู Trigger ทั้งหมด",              category: "Business Logic",  sql: `SELECT\n    name,\n    OBJECT_NAME(parent_id) AS TableName\nFROM sys.triggers\nORDER BY name;` },
  { id: 10, title: "10. ดู Script ของ Stored Procedure", category: "Business Logic",  sql: `EXEC sp_helptext 'ชื่อStoredProcedure';\n\n-- ตัวอย่าง\nEXEC sp_helptext 'USP_RFQ_Report';` },
  { id: 11, title: "11. ดู Script ของ View",             category: "Business Logic",  sql: `EXEC sp_helptext 'ชื่อView';\n\n-- ตัวอย่าง\nEXEC sp_helptext 'VW_RFQ_Report';` },
  { id: 12, title: "12. ดู Script ของ Function",         category: "Business Logic",  sql: `EXEC sp_helptext 'ชื่อFunction';\n\n-- ตัวอย่าง\nEXEC sp_helptext 'UF_GetVendorName';` },
  { id: 13, title: "13. Data Dictionary",                category: "Structure",       sql: `SELECT\n    t.name AS TableName,\n    c.name AS ColumnName,\n    ty.name AS DataType,\n    c.max_length,\n    c.is_nullable\nFROM sys.tables t\nINNER JOIN sys.columns c ON t.object_id = c.object_id\nINNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id\nORDER BY t.name, c.column_id;` },
  { id: 14, title: "14. ดู Index ทั้งหมด",               category: "Structure",       sql: `SELECT\n    t.name AS TableName,\n    i.name AS IndexName,\n    i.type_desc\nFROM sys.indexes i\nINNER JOIN sys.tables t ON i.object_id = t.object_id\nWHERE i.name IS NOT NULL\nORDER BY t.name;` },
  { id: 15, title: "15. ดู Unique Constraint",           category: "Structure",       sql: `SELECT\n    tc.TABLE_NAME,\n    tc.CONSTRAINT_NAME\nFROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc\nWHERE tc.CONSTRAINT_TYPE = 'UNIQUE';` },
  { id: 16, title: "16. ดู Default Constraint",          category: "Structure",       sql: `SELECT\n    OBJECT_NAME(parent_object_id) AS TableName,\n    name AS ConstraintName\nFROM sys.default_constraints\nORDER BY TableName;` },
  { id: 17, title: "17. ดู Identity Column",             category: "Structure",       sql: `SELECT\n    OBJECT_NAME(object_id) AS TableName,\n    name AS ColumnName\nFROM sys.columns\nWHERE is_identity = 1;` },
  { id: 18, title: "18. Top 100 Records ทุก Table",      category: "Data",            sql: `SELECT\n    'SELECT TOP 100 * FROM [' + TABLE_NAME + '];'\nFROM INFORMATION_SCHEMA.TABLES\nWHERE TABLE_TYPE = 'BASE TABLE';` },
  { id: 19, title: "19. ดูขนาด Table",                   category: "Data",            sql: `EXEC sp_MSforeachtable '\nEXEC sp_spaceused ''?''\n';` },
  { id: 20, title: "20. ดู Database Size",               category: "Data",            sql: `EXEC sp_helpdb;` },
  { id: 21, title: "21. ดู User และ Permission",          category: "Security",        sql: `SELECT\n    name,\n    type_desc\nFROM sys.database_principals\nORDER BY name;` },
  { id: 22, title: "22. ดู Dependency ของ View/SP",      category: "Business Logic",  sql: `SELECT\n    OBJECT_NAME(referencing_id) AS ReferencingObject,\n    referenced_entity_name\nFROM sys.sql_expression_dependencies\nORDER BY ReferencingObject;` },
];

const categories = ["ทั้งหมด", "Structure", "Business Logic", "Data", "Security", "Custom"];
type Tab = "queries" | "checklist" | "mapping";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { queries: customQueries, loading, addQuery, updateQuery, deleteQuery } = useCustomQueries();

  const [tab,       setTab]       = useState<Tab>("queries");
  const [cat,       setCat]       = useState("ทั้งหมด");
  const [search,    setSearch]    = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<CustomQuery | null>(null);

  const handleSave = async (data: Omit<CustomQuery, "id"|"createdAt"|"createdBy"|"createdByName"|"isCustom">) => {
    if (editing) await updateQuery(editing.id, data);
    else         await addQuery(data);
    setEditing(null);
  };

  const handleEdit   = (q: CustomQuery) => { setEditing(q); setShowModal(true); };
  const handleDelete = async (id: string) => { await deleteQuery(id); };

  const myQueries     = customQueries.filter(q => q.createdBy === user?.uid);
  const publicQueries = customQueries.filter(q => q.visibility === "public" && q.createdBy !== user?.uid);

  const filtered = useMemo(() => {
    const all = [...BUILT_IN_QUERIES, ...customQueries];
    return all.filter(q => {
      const matchCat    = cat === "ทั้งหมด" || q.category === cat;
      const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) || q.sql.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [cat, search, customQueries]);

  const handleLogout = async () => { await signOut(auth); navigate("/"); };

  const stats = [
    { label: "Built-in",  value: String(BUILT_IN_QUERIES.length), sub: "SQL queries" },
    { label: "ของฉัน",    value: String(myQueries.length),        sub: "Custom queries" },
    { label: "Public",    value: String(publicQueries.length),    sub: "จากผู้ใช้อื่น" },
    { label: "Modules",   value: "10",                            sub: "RFQ · PR · PO ···" },
  ];

  return (
    <div style={s.page}>
      {/* Navbar */}
      <div style={s.navbar}>
        <div style={s.logo}>🗄️ <span style={{ color: "#60a5fa" }}>DB</span> Reverse Tool</div>
        <div style={s.navRight}>
          {user?.photoURL
            ? <img src={user.photoURL} alt="" style={s.avatar} />
            : <div style={s.avatarFallback}>{user?.displayName?.[0]}</div>
          }
          <span style={s.userName}>{user?.displayName}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>ออกจากระบบ</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabBar}>
        {([["queries","📋 SQL Queries"],["checklist","✅ Checklist"],["mapping","🗂️ Module Mapping"]] as [Tab,string][]).map(([key,label]) => (
          <button key={key} style={{ ...s.tab, ...(tab === key ? s.tabActive : {}) }} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        {stats.map(st => (
          <div key={st.label} style={s.statCard}>
            <p style={s.statLabel}>{st.label}</p>
            <p style={s.statValue}>{st.value}</p>
            <p style={s.statSub}>{st.sub}</p>
          </div>
        ))}
      </div>

      {tab === "queries" && (
        <div style={s.content}>
          {/* Toolbar */}
          <div style={s.toolbar}>
            <div style={s.searchBox}>
              <span>🔍</span>
              <input
                style={s.searchInput}
                placeholder="ค้นหา query..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button style={s.clearBtn} onClick={() => setSearch("")}>✕</button>}
            </div>
            <button style={s.addBtn} onClick={() => { setEditing(null); setShowModal(true); }}>
              ➕ เพิ่ม Query
            </button>
          </div>

          {/* Filter chips */}
          <div style={s.chips}>
            {categories.map(c => (
              <button key={c} style={{ ...s.chip, ...(cat === c ? s.chipActive : {}) }} onClick={() => setCat(c)}>
                {c}
                {c === "Custom" && customQueries.length > 0 && (
                  <span style={s.countBadge}>{customQueries.length}</span>
                )}
              </button>
            ))}
          </div>

          {loading && <p style={{ color: "#475569", fontSize: 13, padding: "20px 0" }}>⏳ กำลังโหลด...</p>}

          {/* My Custom Queries */}
          {!loading && myQueries.length > 0 && (cat === "ทั้งหมด" || cat === "Custom") && (
            <>
              <p style={s.sectionLabel}>🔑 Query ของฉัน ({myQueries.length})</p>
              <div style={{ ...s.grid, marginBottom: 24 }}>
                {myQueries
                  .filter(q => search === "" || q.title.toLowerCase().includes(search.toLowerCase()))
                  .map(q => (
                    <SqlCard key={q.id} {...q}
                      onEdit={() => handleEdit(q)}
                      onDelete={() => handleDelete(q.id)}
                    />
                  ))}
              </div>
            </>
          )}

          {/* Public Custom Queries from others */}
          {!loading && publicQueries.length > 0 && (cat === "ทั้งหมด" || cat === "Custom") && (
            <>
              <p style={s.sectionLabel}>🌐 Public Queries จากผู้ใช้อื่น ({publicQueries.length})</p>
              <div style={{ ...s.grid, marginBottom: 24 }}>
                {publicQueries
                  .filter(q => search === "" || q.title.toLowerCase().includes(search.toLowerCase()))
                  .map(q => <SqlCard key={q.id} {...q} />)}
              </div>
            </>
          )}

          {/* Built-in */}
          {cat !== "Custom" && (
            <>
              {(myQueries.length > 0 || publicQueries.length > 0) && cat === "ทั้งหมด" && (
                <p style={s.sectionLabel}>📋 Built-in Queries</p>
              )}
              <div style={s.grid}>
                {filtered.filter(q => !(q as any).isCustom).map(q => <SqlCard key={q.id} {...q} />)}
              </div>
            </>
          )}

          {filtered.length === 0 && !loading && (
            <div style={s.empty}>
              <p style={{ fontSize: 32 }}>🔍</p>
              <p style={{ color: "#64748b", marginTop: 8 }}>ไม่พบ query ที่ตรงกัน</p>
            </div>
          )}
        </div>
      )}

      {tab === "checklist" && <Checklist />}
      {tab === "mapping"   && <ModuleMapping />}

      {showModal && (
        <CustomQueryModal
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
          editing={editing}
        />
      )}
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0f172a" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 },
  logo: { fontSize: 16, fontWeight: 700, color: "#e2e8f0" },
  navRight: { display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 30, height: 30, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.1)" },
  avatarFallback: { width: 30, height: 30, borderRadius: "50%", background: "rgba(59,130,246,0.2)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 },
  userName: { fontSize: 13, color: "#94a3b8" },
  logoutBtn: { fontSize: 12, color: "#f87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 6, padding: "5px 12px", cursor: "pointer" },
  tabBar: { display: "flex", gap: 2, padding: "0 24px", background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  tab: { fontSize: 13, padding: "12px 16px", background: "transparent", border: "none", color: "#64748b", cursor: "pointer", borderBottom: "2px solid transparent", transition: "all 0.15s" },
  tabActive: { color: "#60a5fa", borderBottomColor: "#3b82f6" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, padding: "16px 24px" },
  statCard: { background: "#1e293b", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 16px" },
  statLabel: { fontSize: 11, color: "#475569", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" },
  statValue: { fontSize: 26, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 },
  statSub: { fontSize: 11, color: "#334155", marginTop: 4 },
  content: { padding: "0 24px 24px" },
  toolbar: { display: "flex", gap: 10, marginBottom: 12, alignItems: "center" },
  searchBox: { flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 12px" },
  searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#e2e8f0" },
  clearBtn: { background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13 },
  addBtn: { fontSize: 13, padding: "8px 18px", background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" as const },
  chips: { display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 16 },
  chip: { fontSize: 12, padding: "5px 14px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, background: "transparent", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 },
  chipActive: { background: "rgba(59,130,246,0.12)", borderColor: "#3b82f6", color: "#60a5fa" },
  countBadge: { background: "#fb923c", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 },
  sectionLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 10, textTransform: "uppercase" as const, color: "#475569" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 },
  empty: { textAlign: "center", padding: "60px 20px" },
};

export default Dashboard;