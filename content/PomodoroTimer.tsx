import React, { useEffect } from "react";
import TimerProgress from "./TimerProgress";
import "./content.css";
import { themes } from "../options/themes";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
function PomodoroTimer() {
  // used for the initial time input
  const [initialTime, setInitialTime] = React.useState(0);
  // used for the remaining time in the timer
  const [remainingTime, setRemainingTime] = React.useState(0);
  // used to track the status of the timer (running or paused)
  const [timerStatus, setTimerStatus] = React.useState(false); //False means paused, True means running

  const [theme, setTheme] = React.useState({
    colors: {
      accent: "#a8d44b",
      background: "#29911b",
    },
    image: "/assets/themes/avocado.png"
    
  });
  useEffect(() => {
    chrome.storage.local.get(["remainingTime", "initialTime"], (result) => {
      setRemainingTime(result.remainingTime || 0);
      setInitialTime(result.initialTime || 0);
    });

    chrome.storage.sync.get(["theme"], (result) => {
      const savedTheme = result.theme || "theme-avocado"; // Default to avocado theme
      console.log("Saved theme:", savedTheme);
      const themeObj = themes.find((theme) => theme.className === savedTheme);
      if (themeObj) {
        setTheme(themeObj);
      } else {
        console.warn("Theme not found, using default colors.");
        setTheme({
          colors: {
            accent: "#a8d44b",
            background: "#29911b",
          },
          image: "/assets/themes/avocado.png" 
        })
      }
    });

    const handleMessage = (message, sender, sendResponse) => {
      if (message.type === "update_timer") {
        setRemainingTime(message.remainingTime);
        setTimerStatus(message.status);
      }
      if (message.type === "theme_changed") {
        const themeObj = themes.find(
          (theme) => theme.className === message.theme
        );
        if (themeObj) {
          setTheme(themeObj);
        }
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
    const newStatus = !timerStatus;
    const durationToSend =
      remainingTime > 0 ? remainingTime : initialTime * 60 * 1000;

    setTimerStatus(newStatus);
    chrome.runtime.sendMessage({
      type: "set_timer_status",
      status: newStatus,
      duration: durationToSend,
    });
  };
  const resetTimer = () => {
    setRemainingTime(0);
    setTimerStatus(false);
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
        backgroundColor={theme.colors.background}
        accentColor={theme.colors.accent}
      />
      
      <input
        value={initialTime}
        className="input-initial-time"
        type="number"
        onChange={(e) => {
          resetTimer();
          const value = Math.max(1, Number(e.target.value)); // Ensure at least 1
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
        <button className="button-toggle-status" onClick={() => resetTimer()}>
          reset
        </button>
      </div>
    </div>
  );
}

export default PomodoroTimer;
