/**
 * markdown แบบย่อ — port มาจาก lesson-viewer.html เดิม
 * รองรับ: **ตัวหนา**, `โค้ด`, หัวข้อ #/##/###, bullet list และ code fence
 * ทุก input ถูก escape ก่อนใส่แท็กเสมอ v-html จึงปลอดภัย
 */

export function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function inlineMd(s: unknown): string {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code class="rounded bg-elevated px-1.5 py-0.5 font-mono text-[0.9em] text-primary">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
}

const P = '<p class="text-default">'
const UL = '<ul class="mt-2 list-disc space-y-1 ps-5 marker:text-primary">'

export function mdToHtml(src: unknown): string {
  const lines = String(src ?? '').replace(/\r/g, '').split('\n')
  let html = ''
  let i = 0

  while (i < lines.length) {
    const line = lines[i]!

    if (/^```/.test(line)) {
      i++
      let code = ''
      while (i < lines.length && !/^```/.test(lines[i]!)) {
        code += lines[i] + '\n'
        i++
      }
      i++
      html += `<pre class="mt-3 overflow-x-auto rounded-lg bg-inverted p-4 font-mono text-sm text-inverted"><code>${escapeHtml(code.replace(/\n$/, ''))}</code></pre>`
      continue
    }

    const h = line.match(/^(#{1,3})\s+(.*)$/)
    if (h) {
      const size = ['text-lg', 'text-base', 'text-[15px]'][h[1]!.length - 1]
      html += `<p class="mt-3 mb-1 font-semibold text-highlighted ${size}">${inlineMd(h[2])}</p>`
      i++
      continue
    }

    if (/^\s*[-*]\s+/.test(line)) {
      html += UL
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i]!)) {
        html += `<li>${inlineMd(lines[i]!.replace(/^\s*[-*]\s+/, ''))}</li>`
        i++
      }
      html += '</ul>'
      continue
    }

    if (/^\s*$/.test(line)) {
      i++
      continue
    }

    let para = line
    i++
    while (
      i < lines.length
      && !/^\s*$/.test(lines[i]!)
      && !/^(#{1,3})\s/.test(lines[i]!)
      && !/^\s*[-*]\s+/.test(lines[i]!)
      && !/^```/.test(lines[i]!)
    ) {
      para += ' ' + lines[i]
      i++
    }
    html += `${P}${inlineMd(para)}</p>`
  }

  return html
}
