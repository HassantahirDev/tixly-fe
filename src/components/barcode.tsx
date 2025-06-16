import React from 'react';
import Svg, { Rect } from 'react-native-svg';

type BarcodeProps = {
  width?: number;
  height?: number;
};

export default function Barcode({ width = 100, height = 40 }: BarcodeProps) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {Array.from({ length: 30 }).map((_, i) => (
        <Rect
          key={i}
          x={i * (width / 30)} // Adjust x spacing based on width
          y={height * 0.125}    // 5 out of 40 (12.5%)
          width={width / 50}    // Keep bar width proportional
          height={height * 0.75} // 30 out of 40 (75%)
          fill="#000"
          opacity={Math.random() > 0.3 ? 1 : 0}
        />
      ))}
    </Svg>
  );
}
