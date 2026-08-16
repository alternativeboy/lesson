<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { LessonModule } from '~~/shared/types/lesson'

const props = defineProps<{
  modules: LessonModule[]
  current: number
  done: Set<number>
}>()

const emit = defineEmits<{ select: [index: number] }>()

const items = computed<NavigationMenuItem[]>(() =>
  props.modules.map((m, i) => ({
    label: m.title || `โมดูล ${i + 1}`,
    icon: props.done.has(i) ? 'i-lucide-circle-check' : 'i-lucide-circle-dashed',
    active: i === props.current,
    onSelect: () => emit('select', i)
  }))
)

const percent = computed(() =>
  props.modules.length ? Math.round((props.done.size / props.modules.length) * 100) : 0
)
</script>

<template>
  <div class="space-y-4">
    <p class="ms-1 font-mono text-[11px] tracking-[0.14em] text-dimmed uppercase">
      โมดูล
    </p>

    <UNavigationMenu
      orientation="vertical"
      :items="items"
      :ui="{ link: 'py-2', linkLeadingIcon: 'shrink-0' }"
    />

    <div class="ms-1 space-y-1.5">
      <UProgress :model-value="percent" size="sm" />
      <p class="font-mono text-xs text-dimmed">
        {{ done.size }}/{{ modules.length }} โมดูล
      </p>
    </div>
  </div>
</template>
