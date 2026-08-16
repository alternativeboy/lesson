# Lesson Viewer (Nuxt UI)

ตัวอ่านบทเรียนเวอร์ชัน Nuxt 4 + Nuxt UI v4 — โครงเดียวกับ `../lesson-viewer.html` เดิม
แต่ประกอบจากคอมโพเนนต์ของ Nuxt UI และอ่านไฟล์บทเรียนจากโฟลเดอร์ `../lesson/` ให้อัตโนมัติ

## รัน

ต้องใช้ Node 22 (nuxt 4.5 ไม่รองรับ Node 20 — มี `.nvmrc` ให้แล้ว)

```bash
nvm use          # 22.23.2
npm install
npm run dev      # http://localhost:3000
```

build/preview:

```bash
npm run build
npm run preview
```

## บทเรียนมาจากไหน

- **อัตโนมัติ** — ทุกไฟล์ `*.json` ใน `../lesson/` จะขึ้นในดรอปดาวน์ (เปลี่ยนโฟลเดอร์ได้ด้วย
  `NUXT_LESSON_DIR=/path/to/dir npm run dev`) ไฟล์ที่ผิดสคีมาจะถูกข้าม ไม่ทำให้ทั้งลิสต์ล่ม
- **อัปโหลดเอง** — ปุ่ม “โหลดไฟล์บทเรียน” รับ `.json` (ตามสคีมา) และ `.md`/`.txt`
  (ห่อเป็นบทเรียนโมดูลเดียว) อ่านในเบราว์เซอร์ ไม่ส่งไฟล์ขึ้น server

โครงสร้างไฟล์บทเรียนดูได้จากปุ่ม “รูปแบบไฟล์” ในแอป (มี prompt สำหรับสั่ง AI สร้างเนื้อหาให้คัดลอกด้วย)

## โครงไฟล์

| ไฟล์ | หน้าที่ |
|---|---|
| `shared/types/lesson.ts` | type + `parseLesson()` ใช้ร่วมกันทั้ง client และ server |
| `server/utils/lessons.ts` | อ่านโฟลเดอร์บทเรียน + กัน path traversal |
| `app/pages/index.vue` | ตัวอ่านทั้งหมด (toolbar / sidebar / เนื้อหา / quiz) |
| `app/components/Lesson*.vue` | toolbar, nav, block, quiz |
| `app/utils/markdown-lite.ts` | markdown ย่อ (`**bold**`, `` `code` ``, หัวข้อ, list, code fence) |
