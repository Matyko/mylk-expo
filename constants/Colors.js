const tintColor = '#2f95dc';

export default {
  tintColor,
  primaryBackground: '#3dbd94',
  primaryText: '#fff',
  tabIconDefault: '#ccc',
  tabIconSelected: this.primaryBackground,
  info: '#4289d6',
  infoText: '#fff',
  success: '#91d66f',
  successText: '#fff',
  danger: '#ff4b18',
  dangerText: '#fff',
  warning: '#ebbb2e',
  warningText: '#fff',
  noticeBackground: tintColor,
  noticeText: '#fff',
  darker: '#333',
  dark: '#888',
  light: '#bbb',
  lighter: '#ddd',
  white: '#fff',
  black: '#444',
  transparent: 'transparent',
};

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
