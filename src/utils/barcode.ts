/**
 * Code 128 & Barcode Utilities for GO OTOMOTIF
 * Generates authentic 1D Barcode SVG patterns and handles Web Audio scanner beeps
 */

// Code 128 patterns (107 patterns, each pattern is 11 modules wide, stop pattern is 13 modules)
const CODE128_PATTERNS: string[] = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", // 0-9
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", // 10-19
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", // 20-29
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", // 30-39
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", // 40-49
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", // 50-59
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", // 60-69
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", // 70-79
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", // 80-89
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", // 90-99
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112" // 100-106 (106 is STOP)
];

const START_B = 104;
const STOP = 106;

/**
 * Encode string into Code 128B binary bars (1 = black bar, 0 = space)
 */
export function encodeCode128(text: string): string {
  if (!text) return '';
  const sanitized = text.trim();
  
  // Calculate checksum
  let checksum = START_B;
  const indices: number[] = [START_B];

  for (let i = 0; i < sanitized.length; i++) {
    const charCode = sanitized.charCodeAt(i);
    const value = charCode - 32;
    if (value >= 0 && value <= 95) {
      indices.push(value);
      checksum += value * (i + 1);
    }
  }

  const checkValue = checksum % 103;
  indices.push(checkValue);
  indices.push(STOP);

  // Convert pattern to module string
  let binaryString = '';
  for (const idx of indices) {
    const pattern = CODE128_PATTERNS[idx] || CODE128_PATTERNS[0];
    let isBar = true;
    for (let j = 0; j < pattern.length; j++) {
      const width = parseInt(pattern[j], 10);
      binaryString += (isBar ? '1' : '0').repeat(width);
      isBar = !isBar;
    }
  }

  return binaryString;
}

/**
 * Generate full SVG markup string for Code 128 barcode
 */
export function generateBarcodeSvgMarkup(code: string, width = 240, height = 56): string {
  const binaryBars = encodeCode128(code);
  if (!binaryBars) return '';
  const barWidth = width / binaryBars.length;
  let rects = '';
  for (let i = 0; i < binaryBars.length; i++) {
    if (binaryBars[i] === '1') {
      rects += `<rect x="${(i * barWidth).toFixed(2)}" y="0" width="${barWidth.toFixed(2)}" height="${height}" fill="#18181b" />`;
    }
  }
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">${rects}</svg>`;
}

/**
 * Play barcode scanner success beep using Web Audio API
 */
export function playScannerBeep(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (err) {
    console.warn('AudioContext playback error', err);
  }
}
