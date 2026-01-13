
/**
 * Utility to convert hex color to HSL values (space separated)
 * as required by the design guidelines.
 */
export function hexToHslValues(hex: string): string {
  // Remove hash if present
  hex = hex.replace(/^#/, '');

  // Parse hex
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Applies primary color to document root CSS variables
 */
export function applyPrimaryColor(hexColor: string) {
  if (!hexColor) return;
  
  try {
    const hslValues = hexToHslValues(hexColor);
    document.documentElement.style.setProperty('--primary-custom', hslValues);
    document.documentElement.style.setProperty('--primary', hslValues);
    document.documentElement.style.setProperty('--sidebar-primary', hslValues);
    document.documentElement.style.setProperty('--sidebar-ring', hslValues);
    document.documentElement.style.setProperty('--ring', hslValues);
  } catch (error) {
    console.error('Error applying primary color:', error);
  }
}
