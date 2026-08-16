<script setup lang="ts">
import type { LessonBlock, CalloutVariant } from '~~/shared/types/lesson'

const props = defineProps<{ block: LessonBlock }>()

const CALLOUT: Record<CalloutVariant, { color: 'primary' | 'warning' | 'info' | 'error', label: string, icon: string }> = {
  model: { color: 'primary', label: 'โมเดลความคิด', icon: 'i-lucide-brain' },
  example: { color: 'warning', label: 'ตัวอย่างจริง', icon: 'i-lucide-lightbulb' },
  note: { color: 'info', label: 'หมายเหตุ', icon: 'i-lucide-info' },
  warn: { color: 'error', label: 'ข้อควรระวัง', icon: 'i-lucide-triangle-alert' }
}

const type = computed(() => props.block.type || 'text')
const callout = computed(() => CALLOUT[props.block.variant as CalloutVariant] || CALLOUT.note)
</script>

<template>
  <UAlert
    v-if="type === 'callout'"
    :color="callout.color"
    :icon="callout.icon"
    variant="soft"
    :title="block.heading || callout.label"
    :ui="{ title: 'font-mono text-[11px] uppercase tracking-[0.12em] font-medium', description: 'space-y-2 mt-1' }"
  >
    <template #description>
      <div class="space-y-2" v-html="mdToHtml(block.body)" />
    </template>
  </UAlert>

  <UCard v-else :ui="{ header: 'px-5 py-3', body: 'px-5 py-4' }">
    <template v-if="block.heading" #header>
      <h3 class="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
        <span class="size-1.5 rounded-xs bg-primary" />
        {{ block.heading }}
      </h3>
    </template>

    <component
      :is="block.ordered ? 'ol' : 'ul'"
      v-if="type === 'list'"
      :class="[
        'space-y-2 ps-5',
        block.ordered ? 'list-decimal' : 'list-disc',
        'marker:font-medium marker:text-primary'
      ]"
    >
      <li v-for="(item, i) in block.items || []" :key="i" class="text-default" v-html="inlineMd(item)" />
    </component>

    <pre
      v-else-if="type === 'code'"
      class="overflow-x-auto rounded-lg bg-inverted p-4 font-mono text-sm text-inverted"
    ><code>{{ block.body }}</code></pre>

    <div v-else class="space-y-2.5" v-html="mdToHtml(block.body)" />
  </UCard>
</template>
