import { customRef } from 'vue'

export function useDebouncedRef(value: unknown, delay = 200) {
  let timeout: number | undefined
  //customRef 接收一个回调cb，cb方法接收vue暴露的两个方法：track和trigger，
  // 在cb内部返回一个有get和set的对象，在对象中决定customRef什么时候触发track和trigger
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
