/**
 * Theme CSS variables injector
 */

let previousTheme = null

export const useThemeVars = () => {
  /**
   * Apply theme colors to :root CSS variables
   */
  const applyTheme = (colors) => {
    if (!colors) return
    
    const root = document.documentElement
    
    Object.entries(colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case for CSS variables
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      root.style.setProperty(cssVar, value)
    })
  }
  
  /**
   * Snapshot current theme (for preview mode)
   */
  const snapshot = () => {
    const root = document.documentElement
    const computedStyle = getComputedStyle(root)
    
    previousTheme = {
      bg: computedStyle.getPropertyValue('--bg'),
      bgElev: computedStyle.getPropertyValue('--bg-elev'),
      fg: computedStyle.getPropertyValue('--fg'),
      border: computedStyle.getPropertyValue('--border'),
      muted: computedStyle.getPropertyValue('--muted'),
      primary: computedStyle.getPropertyValue('--primary'),
      success: computedStyle.getPropertyValue('--success'),
      danger: computedStyle.getPropertyValue('--danger'),
      warning: computedStyle.getPropertyValue('--warning'),
      info: computedStyle.getPropertyValue('--info')
    }
  }
  
  /**
   * Revert to previous theme
   */
  const revert = () => {
    if (previousTheme) {
      applyTheme(previousTheme)
      previousTheme = null
    }
  }
  
  return {
    applyTheme,
    snapshot,
    revert
  }
}

export default useThemeVars
