import React from 'react';
import Svg, { Rect } from 'react-native-svg';

export default function Barcode() {
  return (
    <Svg width="100" height="40" viewBox="0 0 100 40">
      {/* Generate random barcode-like pattern */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Rect
          key={i}
          x={i * 3.5}
          y={5}
          width={2}
          height={30}
          fill="#000"
          opacity={Math.random() > 0.3 ? 1 : 0}
        />
      ))}
    </Svg>
  );
} 