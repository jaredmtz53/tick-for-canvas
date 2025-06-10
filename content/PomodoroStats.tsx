import React from "react";
import { useEffect, useState } from "react";
import { themes } from "../options/themes";
import "./stats.css"
function PomodoroStats() {
  const [pomodoroStats, setPomodoroStats] = useState(0);
  const [theme, setTheme] = useState(themes[0]);
  useEffect(() => {
    const today = new Date().toJSON().slice(0, 10);

    chrome.storage.sync.get(["pomodoroStats", "theme"], (result) => {
      const stats = result.pomodoroStats || {};
      const currentTheme =
        themes.find((t) => t.className === result.theme) || themes[0];
      setTheme(currentTheme);
      console.log("Current theme:", currentTheme);
      setPomodoroStats(stats[today] || 0);
    });

    
  }, []);
  return (
    <div>
      
      <div className="pomodoro-icons-container">
        {Array.from({ length: pomodoroStats }).map((_, i) => (
          <img className="pomodoro-icon-img" key={i} src={chrome.runtime.getURL(theme.image)} alt="Pomodoro" />
        ))}
      </div>
    </div>
  );
}

export default PomodoroStats;
