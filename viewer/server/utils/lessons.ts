import { readdir, readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import type { Lesson, LessonSummary } from '../../shared/types/lesson'
import { parseLesson } from '../../shared/types/lesson'

const ID_RE = /^[A-Za-z0-9._-]+$/

export function lessonDir(): string {
  return resolve(process.cwd(), useRuntimeConfig().lessonDir)
}

/** id -> absolute path พร้อมกัน path traversal */
function lessonPath(id: string): string {
  if (!ID_RE.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ชื่อไฟล์บทเรียนไม่ถูกต้อง' })
  }

  const dir = lessonDir()
  const file = resolve(dir, `${id}.json`)

  if (!file.startsWith(dir + sep)) {
    throw createError({ statusCode: 400, statusMessage: 'ชื่อไฟล์บทเรียนไม่ถูกต้อง' })
  }

  return file
}

/** รายการบทเรียนทั้งหมดในโฟลเดอร์ — ไฟล์ที่พังจะถูกข้าม ไม่ทำให้ทั้งลิสต์ล่ม */
export async function listLessons(): Promise<LessonSummary[]> {
  let names: string[]
  try {
    names = await readdir(lessonDir())
  } catch {
    return []
  }

  const summaries: LessonSummary[] = []

  for (const name of names.filter(n => n.endsWith('.json')).sort()) {
    const id = name.slice(0, -'.json'.length)
    try {
      const lesson = await readLesson(id)
      summaries.push({
        id,
        title: lesson.title || id,
        subtitle: lesson.subtitle || '',
        moduleCount: lesson.modules.length
      })
    } catch {
      // ไฟล์เสีย/ไม่ตรงสคีมา — ข้ามไป
    }
  }

  return summaries
}

export async function readLesson(id: string): Promise<Lesson> {
  const file = lessonPath(id)

  let text: string
  try {
    text = await readFile(file, 'utf8')
  } catch {
    throw createError({ statusCode: 404, statusMessage: `ไม่พบบทเรียน "${id}"` })
  }

  try {
    return parseLesson(JSON.parse(text))
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: `อ่านบทเรียน "${id}" ไม่สำเร็จ: ${(err as Error).message}`
    })
  }
}
