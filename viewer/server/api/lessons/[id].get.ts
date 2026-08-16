export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ต้องระบุชื่อบทเรียน' })
  }

  return await readLesson(id)
})
