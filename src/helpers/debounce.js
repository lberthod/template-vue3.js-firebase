export function debounce(fn, delay = 300) {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function throttle(fn, interval = 300) {
  let lastTime = 0
  let pending = null
  return (...args) => {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn(...args)
    } else {
      pending = args
      setTimeout(() => {
        if (pending) {
          lastTime = Date.now()
          fn(...pending)
          pending = null
        }
      }, interval - (now - lastTime))
    }
  }
}
