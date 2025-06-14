// TimerProgress.tsx
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  value: number; // e.g. remainingTime
  maxValue: number; // e.g. initialTime
  text: string; // Optional text to display inside the progress bar
  accentColor?: string; // Optional accent color for the progress bar
  backgroundColor?: string; // Optional background color for the progress bar
}

const TimerProgress: React.FC<Props> = ({ value, maxValue , text, accentColor, backgroundColor}) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div style={{ width: "200px", height: "200px",textAnchor: "middle", dominantBaseline: "middle" }}>
      <CircularProgressbar
        value={percentage}
        text={text}
        maxValue={100}
        styles={buildStyles({
          textSize: "16px",
          textColor: "#000",
          pathColor: accentColor,
          trailColor: backgroundColor,
        })}
      />
    </div>
  );
};

export default TimerProgress;