import Taro from '@tarojs/taro'

let toastInstance = false
export const showToast = (
  title,
  icon?: 'none' | 'success' | 'loading',
  duration?: number,
  options?: any
) => {
  const durationTime = duration || 1500
  const iconTemplate = icon || 'none'
  if (toastInstance) {
    return
  }
  toastInstance = true
  return new Promise((resolve) => {
    Taro.showToast({
      title: title || '',
      icon: iconTemplate,
      image: (options && options.image) || '',
      duration: durationTime,
      mask: (options && options.mask) || true,
    })
    setTimeout(() => {
      Taro.hideToast()
      toastInstance = false
      resolve(true)
    }, durationTime)
  })
}
