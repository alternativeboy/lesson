<script setup lang="ts">
const toast = useToast()

const schema = `{
  "title": "ชื่อบทเรียน",
  "subtitle": "คำโปรย (ไม่บังคับ)",
  "modules": [
    {
      "title": "ชื่อโมดูล",
      "tag": "ป้ายสั้น ๆ (ไม่บังคับ)",
      "intro": "เกริ่นนำสั้น ๆ",
      "blocks": [
        { "type":"text", "heading":"หัวข้อ", "body":"ใส่ **ตัวหนา** \`โค้ด\` และขึ้นบรรทัดใหม่ได้" },
        { "type":"list", "heading":"หัวข้อ", "items":["ข้อ 1","ข้อ 2"], "ordered":false },
        { "type":"callout", "variant":"model", "heading":"โมเดลความคิด", "body":"..." },
        { "type":"code", "body":"print('hi')" }
      ],
      "quiz": [
        { "q":"คำถาม?", "options":["ก","ข","ค"], "answer":0, "explain":"ทำไมข้อนี้ถูก" }
      ]
    }
  ]
}`

const prompt = `ช่วยสร้างบทเรียนเรื่อง [ใส่หัวข้อของคุณ] เป็นไฟล์ JSON ตามสคีมานี้เป๊ะ ๆ ตอบกลับเป็น JSON ล้วนเท่านั้น ห้ามมีข้อความอื่นหรือ markdown fence:

{"title":"...","subtitle":"...","modules":[{"title":"...","tag":"...","intro":"...","blocks":[{"type":"text","heading":"...","body":"รองรับ **ตัวหนา** และ \`โค้ด\`"},{"type":"list","heading":"...","items":["..."],"ordered":false},{"type":"callout","variant":"model|example|note|warn","heading":"...","body":"..."}],"quiz":[{"q":"...","options":["...","..."],"answer":0,"explain":"..."}]}]}

ให้มี 4-6 โมดูล แต่ละโมดูลมีเนื้อหาละเอียดพอเข้าใจได้ด้วยตัวเอง และมี quiz 2-3 ข้อ`

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(prompt)
    toast.add({ title: 'คัดลอก prompt แล้ว', color: 'primary', icon: 'i-lucide-check' })
  } catch {
    toast.add({ title: 'คัดลอกไม่สำเร็จ', description: 'ลองเลือกข้อความแล้วกด Cmd+C', color: 'error' })
  }
}
</script>

<template>
  <UModal
    title="รูปแบบไฟล์ & วิธีสร้างเนื้อหาใหม่"
    description="ไฟล์บทเรียนเป็น JSON ที่มี modules เป็นรายการ แต่ละโมดูลมี blocks (เนื้อหา) และ quiz (ไม่บังคับ)"
    :ui="{ content: 'max-w-3xl max-h-[85vh]', body: 'overflow-y-auto' }"
  >
    <slot />

    <template #body>
      <div class="space-y-5">
        <div>
          <p class="mb-2 text-xs font-semibold tracking-[0.08em] text-dimmed uppercase">
            โครงสร้างเต็ม
          </p>
          <pre class="overflow-x-auto rounded-lg bg-inverted p-4 font-mono text-xs leading-relaxed text-inverted"><code>{{ schema }}</code></pre>
        </div>

        <div>
          <p class="mb-2 text-xs font-semibold tracking-[0.08em] text-dimmed uppercase">
            callout ใส่ variant ได้ 4 แบบ
          </p>
          <div class="flex flex-wrap gap-2">
            <UBadge color="primary" variant="soft" label="model" class="font-mono" />
            <UBadge color="warning" variant="soft" label="example" class="font-mono" />
            <UBadge color="info" variant="soft" label="note" class="font-mono" />
            <UBadge color="error" variant="soft" label="warn" class="font-mono" />
          </div>
        </div>

        <div>
          <p class="mb-2 text-xs font-semibold tracking-[0.08em] text-dimmed uppercase">
            prompt สำหรับสั่ง AI สร้างเนื้อหา
          </p>
          <UTextarea
            :model-value="prompt"
            readonly
            :rows="8"
            class="w-full"
            :ui="{ base: 'font-mono text-xs' }"
          />
          <UButton
            class="mt-2"
            color="neutral"
            variant="outline"
            icon="i-lucide-copy"
            label="คัดลอก prompt"
            @click="copyPrompt"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
