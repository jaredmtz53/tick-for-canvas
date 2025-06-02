import React, { useEffect } from "react";
import TimerProgress from "./TimerProgress";
import "./content.css"
function PomodoroTimer() {
  // used for the initial time input
  const [initialTime, setInitialTime] = React.useState(0);
  // used for the remaining time in the timer
  const [remainingTime, setRemainingTime] = React.useState(0);
  // used to track the status of the timer (running or paused)
  const [timerStatus, setTimerStatus] = React.useState(false); //False means paused, True means running

  useEffect(() => {
    chrome.storage.local.get(["remainingTime", "initialTime"], (result) => {
      setRemainingTime(result.remainingTime || 0);
      setInitialTime(result.initialTime || 0);
    });
    const handleMessage = (message, sender, sendResponse) => {
      if (message.type === "update_timer") {
        setRemainingTime(message.remainingTime);
        setTimerStatus(message.status);
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const formatTime = (timeInMs) => {
    const totalSeconds = Math.ceil(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTimerStatus = () => {
    setTimerStatus((prev) => {
      const newStatus = !prev;

      const durationToSend =
        remainingTime > 0 ? remainingTime : initialTime * 60 * 1000;
      chrome.runtime.sendMessage({
        type: "set_timer_status",
        status: newStatus,
        duration: durationToSend,
      });
      return newStatus;
    });
  };
  const toggleReset = () => {
    setRemainingTime(0);
    setTimerStatus(false);
    setInitialTime(0);
    chrome.runtime.sendMessage({
      type: "reset_timer",
    });
  };
  return (
    <div className="pomodoro-timer-container">
      <TimerProgress
        value={remainingTime}
        maxValue={initialTime * 60 * 1000}
        text={formatTime(remainingTime)}
      />
      <input
        className="input-initial-time"
        type="number"
        onChange={(e) => {
          toggleReset();
          const value = Number(e.target.value);
          setInitialTime(value);
          chrome.storage.local.set({ initialTime: value });
        }}
        min={1}
        max={120}
        disabled={timerStatus}
        placeholder="Enter time in minutes"
      />
      <div className="button-container">
        <button
          className="button-toggle-status"
          onClick={() => toggleTimerStatus()}
        >
          {timerStatus ? "Pause" : "Start"}
        </button>
        <button className="button-toggle-status" onClick={() => toggleReset()}>
          reset
        </button>
      </div>
    </div>
  );
}

export default PomodoroTimer;
