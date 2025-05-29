import React, { useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// @ts-ignore

function PomodoroTimer() {
  const [fixedTime, setFixedTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState(0);

  useEffect(() => {
    const handleMessage = (request: any) => {
      if (request.type === "timerTick") {
        setRemainingTime(request.remainingTime);
      }
    };
    chrome.storage.local.get(["timerStatus"], (res) => {
        console.log("Current timer status:", res.timerStatus);
      setIsPlaying(res.timerStatus ?? false);
    });
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const sendUpdateStatus = () => {
    const newStatus = !isPlaying;
    setIsPlaying(newStatus);

    let durationToSend;
    if (newStatus) {
      if (remainingTime > 0) {
        durationToSend = remainingTime;
      } else {
        durationToSend = fixedTime * 60 * 1000; // Convert minutes to milliseconds
      }
    } else {
      durationToSend = remainingTime;
    }
    chrome.runtime.sendMessage({
      type: "set_timer_status",
      status: newStatus,
      duration: durationToSend, // Convert minutes to milliseconds
    });
  };

  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.ceil(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsPlaying(false);
    setRemainingTime(0);
    chrome.runtime.sendMessage({
      type: "reset_timer",
      timerStatus: false,
    });
  };

  const totalDuration = fixedTime * 60 * 1000;
  const percentage = totalDuration > 0
  ? ((totalDuration - remainingTime) / totalDuration) * 100
  : 0;
  
  return (
    <div>
      <h1>Pomodoro Timer</h1>
        <h2>{formatTime(remainingTime)}</h2>
      <input
        min={1}
        onChange={(e) => setFixedTime(Number(e.target.value))}
        type="number"
      />
      <button
        onClick={() => {
          sendUpdateStatus();
        }}
      >
        {isPlaying ? "Pause" : "Start"}
      </button>
      <button onClick={() => handleReset()}>Reset</button>
    </div>
  );
}

export default PomodoroTimer;
