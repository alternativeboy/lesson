<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'th' },
  title: 'ตัวอ่านบทเรียน · Reusable Lesson Viewer'
})
</script>

<template>
  <UApp>
    <UContainer class="max-w-6xl py-10 pb-24">
      <header class="mb-6">
        <div class="mb-3 flex items-center gap-2.5 font-mono text-xs tracking-[0.18em] text-primary uppercase">
          <span class="h-px w-6 bg-primary" />
          reusable · ตัวอ่านบทเรียน
        </div>
        <h1 class="text-3xl font-bold text-highlighted">
          Lesson Viewer
        </h1>
        <p class="mt-2 max-w-[62ch] text-muted">
          โครงเดียว ใช้ซ้ำได้กับบทเรียนหัวข้ออะไรก็ได้ — เลือกบทเรียนจากโฟลเดอร์
          <code class="font-mono text-default">lesson/</code>
          หรือโหลดไฟล์ <code class="font-mono text-default">.json</code> / <code class="font-mono text-default">.md</code> ของคุณเอง
        </p>
      </header>

      <NuxtPage />
    </UContainer>
  </UApp>
</template>
