import React, { useEffect, useState } from "react";
import TimerProgress from "./TimerProgress";
import "./timer.css";
import { themes } from "../options/themes";
function PomodoroTimer() {
  const [pomodoro, setPomodoro] = useState(25);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerStatus, setTimerStatus] = useState(false);

  const defaultTheme = {
    colors: {
      accent: "#a8d44b",
      background: "#29911b",
    },
    image: "/assets/themes/avocado.png",
  };

  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    chrome.storage.local.get(["remainingTime"], (result) => {
      setRemainingTime(result.remainingTime || 0);
    });
    
    chrome.storage.sync.get(["theme", "pomodoro"], (result) => {
      setPomodoro(result.pomodoro || 25);
      const savedTheme = result.theme || "theme-avocado";
      const themeObj = themes.find((theme) => theme.className === savedTheme);
      if (themeObj) {
        setTheme(themeObj);
      } else {
        console.warn("Theme not found, using default theme.");
        setTheme(defaultTheme);
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
      remainingTime > 0 ? remainingTime : pomodoro * 60 * 1000;

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
      <button
        className="top-right-setting-button"
        onClick={() => {
          chrome.runtime.sendMessage({ type: "open_settings" });
        }}
      >
        <img
          src={chrome.runtime.getURL("assets/icons/gear.svg")}
          alt="Settings"
        />
      </button>

      <TimerProgress
        value={remainingTime}
        maxValue={pomodoro * 60 * 1000}
        text={formatTime(remainingTime)}
        backgroundColor={theme.colors.background}
        accentColor={theme.colors.accent}
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
