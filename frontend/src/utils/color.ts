export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type RGBA = RGB & { a: number };

/**
 * Converts a hex color (#RGB, #RRGGBB, or #RRGGBBAA) to RGB.
 * Alpha is ignored if present.
 */
export const hexToRgb = (hex: string): RGB => {
  let value = hex.replace(/^#/, "");

  if (/^[\da-fA-F]{3}$/.test(value))
    value = value
      .split("")
      .map((char) => char + char)
      .join("");

  if (/^[\da-fA-F]{8}$/.test(value)) value = value.slice(0, 6);

  if (!/^[\da-fA-F]{6}$/.test(value))
    throw new Error(`Invalid hex color: ${hex}`);

  const num = Number.parseInt(value, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

/**
 * Converts a hex color to RGBA.
 * An optional alpha argument overrides any alpha in the hex string.
 */
export const hexToRgba = (hex: string, alpha?: number): RGBA => {
  const value = hex.replace(/^#/, "");
  const rgb = hexToRgb(hex);
  const embeddedAlpha = /^[\da-fA-F]{8}$/.test(value)
    ? Number.parseInt(value.slice(6, 8), 16) / 255
    : 1;
  const a = alpha ?? embeddedAlpha;

  if (!Number.isFinite(a) || a < 0 || a > 1)
    throw new Error(`Invalid alpha value: ${a}`);

  return { ...rgb, a };
};

/**
 * Converts RGB to hex (#RRGGBB).
 */
export const rgbToHex = ({ r, g, b }: RGB): string => {
  const channels = [r, g, b];

  if (
    channels.some(
      (channel) => !Number.isInteger(channel) || channel < 0 || channel > 255,
    )
  )
    throw new Error("RGB channels must be integers between 0 and 255");

  return (
    "#" +
    channels
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
};

/**
 * Converts RGBA to hex (#RRGGBBAA).
 */
export const rgbaToHex = ({ r, g, b, a }: RGBA): string => {
  if (!Number.isFinite(a) || a < 0 || a > 1)
    throw new Error("Alpha must be between 0 and 1");

  const rgbHex = rgbToHex({ r, g, b });
  const alphaHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();

  return `${rgbHex}${alphaHex}`;
};

/**
 * Formats RGB/RGBA objects as CSS color strings.
 */
export const toRgbString = ({ r, g, b }: RGB): string =>
  `rgb(${r}, ${g}, ${b})`;

export const toRgbaString = ({ r, g, b, a }: RGBA): string =>
  `rgba(${r}, ${g}, ${b}, ${a})`;
