# 🗄️ DB Reverse Engineering Tool

## 💻 SQL Server Database Explorer สำหรับสำรวจโครงสร้างฐานข้อมูล เพื่อเตรียมพัฒนาระบบใหม่, Data Migration และออกแบบ API

🔗 **Live:** https://db-reverse-engineering.web.app

---

### ✨ Features

- 📋 22 Built-in SQL Queries พร้อมใช้งานทันที
- ➕ Custom Query — เพิ่ม/แก้ไข/ลบ query ของตัวเองได้
- 🔒 Private / Public — กำหนดการมองเห็นต่อ user อื่นได้
- 🔍 Search & Filter — ค้นหาและกรองตามหมวดหมู่
- 📖 Pre-Build Guide — คู่มือสิ่งที่ควรมีก่อนสร้างระบบใหม่
- 📋 Copy Query — คัดลอก SQL ได้ทันที
- ☁️ Real-time Sync — ข้อมูล sync ข้ามเครื่องผ่าน Firestore
- 🔐 Google Login — เข้าใช้งานด้วย Google Account

---

### 🏗 Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Firestore](https://img.shields.io/badge/Firestore-FF6F00?style=for-the-badge&logo=firebase&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

### 📁 Project Structure

```
src/
├── components/
│   ├── SqlCard.tsx            # การ์ด SQL query
│   ├── PreBuildGuide.tsx      # คู่มือก่อนสร้างระบบ
│   └── CustomQueryModal.tsx   # Modal เพิ่ม/แก้ไข query
├── pages/
│   ├── LoginPage.tsx          # หน้า Login
│   └── Dashboard.tsx          # หน้าหลัก
├── hooks/
│   └── useCustomQueries.ts    # Firestore hook + Optimistic Update
├── types/
│   └── query.ts               # TypeScript interfaces
├── firebase.ts                # Firebase config
└── App.tsx                    # Router
```

---

### 📋 SQL Query Categories

| หมวดหมู่ | รายการ |
|---|---|
| Structure | Tables, Columns, Primary Key, Foreign Key, Index, Constraint, Identity |
| Business Logic | Views, Stored Procedures, Functions, Triggers, Dependencies |
| Data | Row Count, Table Size, Database Size, Sample Data |
| Security | Users, Roles, Permissions |

---

### 🔐 Access Control

| ประเภท | การมองเห็น |
|---|---|
| Built-in Queries | ทุกคนที่ login เห็นได้ |
| Custom Private 🔒 | เห็นเฉพาะเจ้าของ |
| Custom Public 🌐 | ทุกคนที่ login เห็นได้ |

---

### 📊 Firestore Data Structure

```
queries (collection)
└── {documentId}
    ├── title:         string
    ├── sql:           string
    ├── category:      string
    ├── visibility:    "private" | "public"
    ├── createdBy:     string (uid)
    ├── createdByName: string
    └── createdAt:     timestamp
```

---

### ⚡ Getting Started

```bash
# Clone repository
git clone https://github.com/Littihai/db-reverse-tool.git
cd db-reverse-tool

# Install dependencies
npm install

# Start development
npm start

# Build & Deploy
npm run build
firebase deploy
```

---

### 🔒 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /queries/{queryId} {
      allow read: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         resource.data.visibility == "public");
      allow create: if request.auth != null &&
        request.resource.data.createdBy == request.auth.uid;
      allow update, delete: if request.auth != null &&
        resource.data.createdBy == request.auth.uid;
    }
  }
}
```

---

### 📫 Contact

littichai_y@ts-engineering.com
