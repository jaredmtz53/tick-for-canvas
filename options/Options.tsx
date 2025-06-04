import React from "react";
import { themes } from "./themes";
import "./theme.css";
function options() {
  const [selectedTheme, setSelectedTheme] = React.useState("");

  React.useEffect(() => {
    chrome.storage.sync.get(["theme"], (result) => {
      const savedTheme = result.theme || "theme-avocado"; // Default to avocado theme
      setSelectedTheme(savedTheme);
      
    })

  })
  
  const handleThemeChange = (themeClass: string) => {
    setSelectedTheme(themeClass);
    chrome.storage.sync.set({ theme: themeClass }, () => {
      console.log(`Theme set to ${themeClass}`);
      chrome.runtime.sendMessage({
        type: "theme_changed",
        theme: themeClass,
      })
      
    });
  };
  return (
    <div>
      <h1>Settings Page</h1>
      <h2>Refresh canvas to see changes</h2>
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

export default options;
