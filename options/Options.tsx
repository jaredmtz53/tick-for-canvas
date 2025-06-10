import React, { useEffect, useState } from "react";
import { themes } from "./themes";
import "./options.css";
function Options() {
  // Theme settings
  const [selectedTheme, setSelectedTheme] = React.useState("");
  // Pomodoro settings
  const [pomodoro, setPomodoro] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  
  const [invalidFields, setInvalidFields] = useState({
    pomodoro: false,
    shortBreak: false,
    longBreak: false,
    longBreakInterval: false,
  });
  
  useEffect(() => {
    chrome.storage.sync.get(
      ["pomodoro", "shortBreak", "longBreak", "longBreakInterval"],
      (result) => {
        setPomodoro(result.pomodoro || 25);
        setShortBreak(result.shortBreak || 5);
        setLongBreak(result.longBreak || 15);
        setLongBreakInterval(result.longBreakInterval || 4);
      }
    );
  }, []);

  const handleThemeChange = (themeClass: string) => {
    setSelectedTheme(themeClass);
    chrome.storage.sync.set({ theme: themeClass }, () => {
      console.log(`Theme set to ${themeClass}`);
      chrome.runtime.sendMessage({
        type: "theme_changed",
        theme: themeClass,
      });
    });
  };
  const createChangeHandler = (key, setter) => (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) return;
  
    const limits = {
      pomodoro: [5, 120],
      shortBreak: [1, 30],
      longBreak: [1, 60],
      longBreakInterval: [1, 10],
    };
  
    const [min, max] = limits[key];
    const isValid = value >= min && value <= max;
  
    setInvalidFields((prev) => ({
      ...prev,
      [key]: !isValid,
    }));
  
    if (isValid) {
      setter(value);
      chrome.storage.sync.set({ [key]: value });
    }
  };
  return (
    <div>
      <h1>Settings Page</h1>
      <h2>Refresh canvas to see changes</h2>

      <h1>Pomodoro Timer</h1>
      <div className="timer-options">
        <div>
          <label>Pomodoro</label>
          <input
            type="number"
            value={pomodoro}
            onChange={createChangeHandler("pomodoro", setPomodoro)}
            
            className={invalidFields.pomodoro ? "input-error" : ""}
          />
        </div>
        <div>
          <label>Short Break</label>
          <input
            type="number"
            value={shortBreak}
            onChange={createChangeHandler("shortBreak", setShortBreak)}
            
            className={invalidFields.shortBreak ? "input-error" : ""}
          />
        </div>
        <div>
          <label>Long Break</label>
          <input
            type="number"
            value={longBreak}
            onChange={createChangeHandler("longBreak", setLongBreak)}
            
            className={invalidFields.longBreak ? "input-error" : ""}
          />
        </div>
        <div>
          <label>Long Break Interval</label>
          <input
            type="number"
            value={longBreakInterval}
            onChange={createChangeHandler( "longBreakInterval",setLongBreakInterval )}
            
            className={invalidFields.longBreakInterval ? "input-error" : ""}
          />
        </div>
      </div>

      <div className="theme-select">
        <h2>Select Theme:</h2>
        <div className="theme-grid">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className="theme-card"
              onClick={() => handleThemeChange(theme.className)}
            >
              <img src={theme.image} alt={theme.name} className="theme-image" />
              <p>{theme.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Options;
