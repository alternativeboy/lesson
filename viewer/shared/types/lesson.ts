export type BlockType = 'text' | 'list' | 'callout' | 'code'
export type CalloutVariant = 'model' | 'example' | 'note' | 'warn'

export interface LessonBlock {
  type?: BlockType
  heading?: string
  body?: string
  items?: string[]
  ordered?: boolean
  variant?: CalloutVariant
}

export interface QuizItem {
  q?: string
  options?: string[]
  answer?: number
  explain?: string
}

export interface LessonModule {
  title?: string
  tag?: string
  intro?: string
  blocks?: LessonBlock[]
  quiz?: QuizItem[]
}

export interface Lesson {
  title?: string
  subtitle?: string
  modules: LessonModule[]
}

export interface LessonSummary {
  id: string
  title: string
  subtitle: string
  moduleCount: number
}

/**
 * ตรวจว่า object ที่ได้มาเป็นบทเรียนตามสคีมาจริง ๆ — ใช้ร่วมกันทั้งฝั่ง server
 * (ตอนอ่านไฟล์จากโฟลเดอร์ lesson/) และฝั่ง client (ตอนผู้ใช้อัปโหลดไฟล์เอง)
 */
export function parseLesson(raw: unknown): Lesson {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('ไฟล์นี้ไม่ใช่ JSON object ของบทเรียน')
  }

  const obj = raw as Record<string, unknown>

  if (!Array.isArray(obj.modules) || obj.modules.length === 0) {
    throw new Error('ไม่พบ "modules" ที่ถูกต้อง (ต้องเป็น array และมีอย่างน้อย 1 โมดูล)')
  }

  return {
    title: typeof obj.title === 'string' ? obj.title : 'บทเรียน',
    subtitle: typeof obj.subtitle === 'string' ? obj.subtitle : '',
    modules: obj.modules as LessonModule[]
  }
}

/** ห่อไฟล์ .md/.txt ให้กลายเป็นบทเรียนโมดูลเดียว */
export function lessonFromText(name: string, text: string): Lesson {
  const base = name.replace(/\.[^.]+$/, '')
  return {
    title: base,
    subtitle: '',
    modules: [{ title: base, intro: '', blocks: [{ type: 'text', body: text }] }]
  }
}
