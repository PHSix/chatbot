export default async function retry<T>(fn: () => Promise<T>, count: number) {
  let error: unknown = null

  for (let i = 0; i < count; i++) {
    try {
      return await fn()
    } catch (err) {
      error = err
    }
  }

  throw error
}
