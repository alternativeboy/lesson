<script setup lang="ts">
import type { Lesson, LessonSummary } from '~~/shared/types/lesson'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { data: lessons } = await useFetch<LessonSummary[]>('/api/lessons', { default: () => [] })

const queryId = typeof route.query.lesson === 'string' ? route.query.lesson : null
const startId = (queryId && lessons.value.some(l => l.id === queryId) ? queryId : lessons.value[0]?.id) ?? null

const { data: initial } = await useAsyncData(
  `lesson:${startId}`,
  () => (startId ? $fetch<Lesson>(`/api/lessons/${startId}`) : Promise.resolve(null))
)

const lesson = ref<Lesson | null>(initial.value)
const selectedId = ref<string | null>(startId)
const sourceLabel = ref(labelFor(startId))
const current = ref(0)
const done = ref(new Set<number>())

const modules = computed(() => lesson.value?.modules ?? [])
const currentModule = computed(() => modules.value[current.value])
const quiz = computed(() => currentModule.value?.quiz?.filter(q => q?.q) ?? [])

function labelFor(id: string | null) {
  if (!id) return ''
  return lessons.value.find(l => l.id === id)?.title ?? id
}

function applyLesson(next: Lesson, label: string) {
  lesson.value = next
  sourceLabel.value = label
  current.value = 0
  done.value = new Set()
  scrollToTop()
}

async function selectLesson(id: string) {
  try {
    const data = await $fetch<Lesson>(`/api/lessons/${id}`)
    selectedId.value = id
    applyLesson(data, labelFor(id))
    router.replace({ query: { ...route.query, lesson: id } })
  } catch (err) {
    toast.add({
      title: 'โหลดบทเรียนไม่สำเร็จ',
      description: (err as { statusMessage?: string, message?: string }).statusMessage
        ?? (err as Error).message,
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    })
  }
}

function onUpload(next: Lesson, filename: string) {
  selectedId.value = null
  applyLesson(next, filename)
  router.replace({ query: {} })
}

function goto(index: number) {
  current.value = index
  scrollToTop()
}

async function scrollToTop() {
  if (!import.meta.client) return
  // ปล่อยโฟกัสก่อน ไม่งั้นเบราว์เซอร์จะเลื่อนกลับไปหาปุ่มที่เพิ่งกด
  ;(document.activeElement as HTMLElement | null)?.blur()
  await nextTick()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  // บางเบราว์เซอร์/บางการตั้งค่าไม่ทำ smooth scroll ให้ — เลื่อนแบบทันทีเป็นตัวสำรอง
  setTimeout(() => {
    if (window.scrollY > 0) window.scrollTo(0, 0)
  }, 400)
}
</script>

<template>
  <div class="space-y-6">
    <LessonToolbar
      :lessons="lessons"
      :selected-id="selectedId"
      :source-label="sourceLabel"
      @select="selectLesson"
      @upload="onUpload"
    />

    <div v-if="lesson" class="space-y-1">
      <h2 class="text-2xl font-bold text-highlighted">
        {{ lesson.title }}
      </h2>
      <p v-if="lesson.subtitle" class="text-muted">
        {{ lesson.subtitle }}
      </p>
    </div>

    <UAlert
      v-if="!lesson"
      color="warning"
      variant="soft"
      icon="i-lucide-folder-open"
      title="ยังไม่มีบทเรียนให้แสดง"
      description="ไม่พบไฟล์ .json ในโฟลเดอร์ lesson/ — เพิ่มไฟล์เข้าไป หรือกด “โหลดไฟล์บทเรียน” เพื่อเลือกไฟล์จากเครื่องคุณ"
    />

    <div v-else class="grid items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside class="lg:sticky lg:top-6">
        <LessonNav
          :modules="modules"
          :current="current"
          :done="done"
          @select="goto"
        />
      </aside>

      <main v-if="currentModule" class="min-w-0">
        <div class="flex flex-wrap items-center gap-3">
          <span class="font-mono text-[11px] tracking-[0.14em] text-dimmed uppercase">
            โมดูล {{ current + 1 }} / {{ modules.length }}
          </span>
          <UBadge
            v-if="currentModule.tag"
            color="primary"
            variant="soft"
            size="sm"
            class="font-mono"
            :label="currentModule.tag"
          />
        </div>

        <h2 class="mt-1 text-2xl font-semibold text-highlighted">
          {{ currentModule.title || `โมดูล ${current + 1}` }}
        </h2>
        <p v-if="currentModule.intro" class="mt-1 text-muted">
          {{ currentModule.intro }}
        </p>

        <div class="mt-4 space-y-4">
          <LessonBlock
            v-for="(block, i) in currentModule.blocks || []"
            :key="`${current}-${i}`"
            :block="block"
          />
        </div>

        <LessonQuiz
          v-if="quiz.length"
          :key="`quiz-${current}`"
          :quiz="quiz"
          :done="done.has(current)"
          @complete="done.add(current)"
        />

        <template v-else>
          <UButton
            class="mt-6"
            :color="done.has(current) ? 'primary' : 'neutral'"
            :variant="done.has(current) ? 'solid' : 'outline'"
            :icon="done.has(current) ? 'i-lucide-check' : 'i-lucide-circle-dashed'"
            :label="done.has(current) ? 'อ่านแล้ว' : 'ทำเครื่องหมายว่าอ่านจบ'"
            @click="done.add(current)"
          />
          <UAlert
            v-if="done.has(current)"
            class="mt-4"
            color="primary"
            variant="soft"
            icon="i-lucide-circle-check"
            title="ทำเครื่องหมายว่าอ่านโมดูลนี้แล้ว"
          />
        </template>

        <div class="mt-8 flex justify-between gap-3">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
            label="ก่อนหน้า"
            :disabled="current === 0"
            @click="goto(current - 1)"
          />
          <UButton
            color="neutral"
            trailing-icon="i-lucide-arrow-right"
            label="ถัดไป"
            :disabled="current >= modules.length - 1"
            @click="goto(current + 1)"
          />
        </div>
      </main>
    </div>
  </div>
</template>
