/**
 * Convert hex color to OKLCH format
 * OKLCH is a perceptually uniform color space
 */
export function hexToOklch(hex) {
    // Remove # if present
    hex = hex.replace('#', '');

    // Handle 3-digit hex
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map(char => char + char)
            .join('');
    }

    // Convert to RGB (0-1 range)
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Apply sRGB gamma correction
    const toLinear = c => {
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const rLin = toLinear(r);
    const gLin = toLinear(g);
    const bLin = toLinear(b);

    // Convert to XYZ (D65 illuminant)
    const x = 0.4124564 * rLin + 0.3575761 * gLin + 0.1804375 * bLin;
    const y = 0.2126729 * rLin + 0.7151522 * gLin + 0.072175 * bLin;
    const z = 0.0193339 * rLin + 0.119192 * gLin + 0.9503041 * bLin;

    // Convert XYZ to OKLAB
    const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
    const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
    const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);

    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

    // Convert OKLAB to OKLCH
    const C = Math.sqrt(a * a + b_ * b_);
    let H = (Math.atan2(b_, a) * 180) / Math.PI;
    if (H < 0) H += 360;

    // Round to 4 decimal places for CSS
    const lightness = Math.round(L * 10000) / 10000;
    const chroma = Math.round(C * 10000) / 10000;
    const hue = Math.round(H * 10000) / 10000;

    return `oklch(${lightness} ${chroma} ${hue})`;
}

/**
 * Adjust lightness in OKLCH color
 */
export function adjustOklchLightness(oklchString, adjustment) {
    const match = oklchString.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
    if (!match) return oklchString;

    const [, l, c, h] = match;
    const newL = Math.max(0, Math.min(1, parseFloat(l) + adjustment));

    return `oklch(${newL.toFixed(4)} ${c} ${h})`;
}

/**
 * Adjust chroma in OKLCH color
 */
export function adjustOklchChroma(oklchString, adjustment) {
    const match = oklchString.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
    if (!match) return oklchString;

    const [, l, c, h] = match;
    const newC = Math.max(0, parseFloat(c) + adjustment);

    return `oklch(${l} ${newC.toFixed(4)} ${h})`;
}

/**
 * Get contrasting foreground color based on lightness
 */
export function getOklchContrast(oklchString) {
    const match = oklchString.match(/oklch\(([\d.]+)/);
    if (!match) return 'oklch(1 0 0)'; // white fallback

    const lightness = parseFloat(match[1]);
    // If lightness > 0.5, use dark text, otherwise use light text
    return lightness > 0.5 ? 'oklch(0.1743 0.0227 283.7998)' : 'oklch(1 0 0)';
}

/**
 * Generate all color variants in OKLCH format
 */
export function generateColorVariants(primaryHex, secondaryHex, accentHex) {

    // Convert to OKLCH
    const primary = hexToOklch(primaryHex);
    const primaryForeground = getOklchContrast(primary);


    // Generate primary variants
    const primaryLight = adjustOklchLightness(primary, 0.1);
    const primaryDark = adjustOklchLightness(primary, -0.1);

    // Convert secondary and accent if provided
    let secondary, secondaryForeground;
    if (secondaryHex) {
        secondary = hexToOklch(secondaryHex);
        secondaryForeground = getOklchContrast(secondary);
    } else {
        // Derive from primary
        secondary = adjustOklchChroma(adjustOklchLightness(primary, 0.2), -0.05);
        secondaryForeground = getOklchContrast(secondary);
    }

    let accent, accentForeground;
    if (accentHex) {
        accent = hexToOklch(accentHex);
        accentForeground = getOklchContrast(accent);
    } else {
        // Derive from primary
        accent = adjustOklchLightness(primary, 0.15);
        accentForeground = getOklchContrast(accent);
    }

    const variants = {
        // Core primary colors
        primary,
        primaryForeground,
        primaryLight,
        primaryDark,

        // Secondary colors
        secondary,
        secondaryForeground,

        // Accent colors
        accent,
        accentForeground,

        // Ring (focus state)
        ring: primary,
    };


    return variants;
}
