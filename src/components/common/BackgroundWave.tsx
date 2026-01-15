"use client";

import Wave from "react-wavify";

type BackgroundWaveProps = {
  color?: string;
  height?: number;
  amplitude?: number;
  speed?: number;
  points?: number;
  className?: string;
};

export default function BackgroundWave({
  color = "#3B82F6",
  height = 40,
  amplitude = 40,
  speed = 0.25,
  points = 3,
  className = "",
}: BackgroundWaveProps) {
  return (
    <Wave
      fill={color}
      paused={false}
      options={{
        height,
        amplitude,
        speed,
        points,
      }}
      className={className}
    />
  );
}
