const tintColor = '#2f95dc';

export default {
  tintColor,
  primaryBackground: '#4b5cbd',
  // primaryBackground: '#3dbd94',
  // primaryBackground: '#ff3d6c',
  primaryText: '#fff',
  tabIconDefault: '#ccc',
  tabIconSelected: this.primaryBackground,
  tabBar: '#fefefe',
  successBackground: '#91d66f',
  successText: '#fff',
  errorBackground: '#ff4b18',
  errorText: '#fff',
  warningBackground: '#EAEB5E',
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
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
