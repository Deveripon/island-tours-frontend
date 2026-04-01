'use client';

import { useEffect, useState } from 'react';
import { CustomProgress } from './custom-progress';

// Color interpolation utility
function interpolateColor(start, end, factor) {
    const hexToRgb = hex => hex.match(/\w\w/g)?.map(c => parseInt(c, 16)) ?? [0, 0, 0];

    const rgbToHex = rgb =>
        '#' +
        rgb
            .map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('');

    const startRGB = hexToRgb(start);
    const endRGB = hexToRgb(end);

    const result = startRGB.map((c, i) => Math.round(c + (endRGB[i] - c) * factor));

    return rgbToHex(result);
}

export function AnimatedProgress({ target = 100, speed = 10, className = '' }) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setValue(prev => {
                if (prev >= target) {
                    clearInterval(interval);
                    return target;
                }
                return prev + 1;
            });
        }, speed);

        return () => clearInterval(interval);
    }, [target, speed]);

    const progressRatio = Math.min(value / target, 1);

    const backgroundColor = interpolateColor('#1f2937', '#3b82f6', progressRatio);

    return <CustomProgress value={value} className={className} barStyle={{ backgroundColor }} />;
}

