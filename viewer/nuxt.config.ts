export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  icon: {
    // ใช้ไอคอนจาก @iconify-json/lucide ที่ติดตั้งไว้ในเครื่อง (ไม่ต้องยิง API ตอน SSR)
    serverBundle: { collections: ['lucide'] },
    clientBundle: { scan: true }
  },
  colorMode: {
    preference: 'light',
    fallback: 'light'
  },
  runtimeConfig: {
    // โฟลเดอร์ที่เก็บไฟล์บทเรียน .json (relative กับ cwd ตอนรัน)
    lessonDir: '../lesson'
  },
  devtools: { enabled: false }
})
