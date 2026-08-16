<script setup lang="ts">
import type { QuizItem } from '~~/shared/types/lesson'

const props = defineProps<{ quiz: QuizItem[], done: boolean }>()
const emit = defineEmits<{ complete: [] }>()

// index ของตัวเลือกที่ผู้ใช้กด (null = ยังไม่ตอบ) — reset ทุกครั้งที่เปลี่ยนโมดูล
const picked = ref<(number | null)[]>([])

watch(
  () => props.quiz,
  () => { picked.value = props.quiz.map(() => null) },
  { immediate: true }
)

const allAnswered = computed(() => picked.value.length > 0 && picked.value.every(p => p !== null))

function choose(qi: number, oi: number) {
  if (picked.value[qi] !== null) return
  picked.value[qi] = oi
  if (allAnswered.value) emit('complete')
}

function optionColor(qi: number, oi: number, answer?: number) {
  if (picked.value[qi] === null) return 'neutral'
  if (oi === answer) return 'success'
  return picked.value[qi] === oi ? 'error' : 'neutral'
}

function optionIcon(qi: number, oi: number, answer?: number) {
  if (picked.value[qi] === null) return undefined
  if (oi === answer) return 'i-lucide-check'
  return picked.value[qi] === oi ? 'i-lucide-x' : undefined
}
</script>

<template>
  <section class="mt-8 border-t border-dashed border-default pt-7">
    <h2 class="text-lg font-semibold text-highlighted">
      เช็คความเข้าใจ
    </h2>
    <p class="text-sm text-muted">
      ตอบให้ครบทุกข้อเพื่อทำเครื่องหมายว่าเรียนโมดูลนี้จบ
    </p>

    <div class="mt-4 space-y-4">
      <UCard v-for="(item, qi) in quiz" :key="qi" :ui="{ body: 'px-5 py-4' }">
        <p class="mb-3 font-medium text-highlighted">
          <span class="me-1.5 font-semibold text-primary">{{ qi + 1 }}.</span>{{ item.q }}
        </p>

        <div class="space-y-2">
          <UButton
            v-for="(opt, oi) in item.options || []"
            :key="oi"
            block
            :color="optionColor(qi, oi, item.answer)"
            :variant="picked[qi] !== null && (oi === item.answer || picked[qi] === oi) ? 'soft' : 'outline'"
            :trailing-icon="optionIcon(qi, oi, item.answer)"
            :disabled="picked[qi] !== null"
            :ui="{ base: 'justify-between text-start disabled:opacity-100' }"
            @click="choose(qi, oi)"
          >
            <span v-html="inlineMd(opt)" />
          </UButton>
        </div>

        <p
          v-if="item.explain && picked[qi] !== null"
          class="mt-3 border-s-2 border-primary ps-3 text-sm text-muted"
        >
          {{ item.explain }}
        </p>
      </UCard>
    </div>

    <UAlert
      v-if="done"
      class="mt-5"
      color="primary"
      variant="soft"
      icon="i-lucide-circle-check"
      title="เยี่ยม! เรียนโมดูลนี้จบแล้ว"
    />
  </section>
</template>
