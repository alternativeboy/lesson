<script setup lang="ts">
import type { Lesson, LessonSummary } from '~~/shared/types/lesson'
import { parseLesson, lessonFromText } from '~~/shared/types/lesson'

const props = defineProps<{
  lessons: LessonSummary[]
  selectedId: string | null
  sourceLabel: string
}>()

const emit = defineEmits<{
  select: [id: string]
  upload: [lesson: Lesson, label: string]
}>()

const toast = useToast()

const selected = computed({
  get: () => props.lessons.find(l => l.id === props.selectedId) ?? undefined,
  set: (item?: LessonSummary) => { if (item) emit('select', item.id) }
})

const file = ref<File | null>(null)

watch(file, (f) => {
  if (!f) return

  const reader = new FileReader()
  reader.onload = () => {
    const text = String(reader.result ?? '')
    try {
      const lesson = /\.json$/i.test(f.name)
        ? parseLesson(JSON.parse(text))
        : lessonFromText(f.name, text)
      emit('upload', lesson, f.name)
    } catch (err) {
      toast.add({
        title: 'อ่านไฟล์ไม่สำเร็จ',
        description: `${(err as Error).message} — กด “รูปแบบไฟล์” เพื่อดูโครงสร้างที่ถูกต้อง`,
        color: 'error',
        icon: 'i-lucide-triangle-alert'
      })
    }
    file.value = null
  }
  reader.onerror = () => {
    toast.add({ title: 'เปิดไฟล์ไม่ได้', color: 'error', icon: 'i-lucide-triangle-alert' })
    file.value = null
  }
  reader.readAsText(f)
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 rounded-lg border border-default bg-default p-3">
    <USelectMenu
      v-model="selected"
      :items="lessons"
      label-key="title"
      :search-input="false"
      placeholder="เลือกบทเรียน"
      icon="i-lucide-book-open"
      class="w-full sm:w-72"
      :ui="{ base: 'font-medium' }"
    >
      <template #item-label="{ item }">
        <span class="truncate">{{ item.title }}</span>
        <span class="ms-2 font-mono text-xs text-dimmed">{{ item.moduleCount }} โมดูล</span>
      </template>
    </USelectMenu>

    <UFileUpload
      v-model="file"
      accept=".json,.md,.txt"
      :preview="false"
      :dropzone="false"
    >
      <template #default="{ open }">
        <UButton
          icon="i-lucide-upload"
          label="โหลดไฟล์บทเรียน"
          @click="open()"
        />
      </template>
    </UFileUpload>

    <FormatHelpModal>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-file-code-2"
        label="รูปแบบไฟล์"
      />
    </FormatHelpModal>

    <div class="ms-auto flex items-center gap-2 font-mono text-xs text-dimmed">
      กำลังแสดง:
      <UBadge color="neutral" variant="subtle" :label="sourceLabel || '—'" />
    </div>
  </div>
</template>
