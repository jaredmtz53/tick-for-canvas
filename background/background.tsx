import { startTimer, pauseTimer, resetTimer } from "./timer";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    theme: "theme-avocado", 
    longBreak: 15,
    shortBreak: 5,
    pomodoro: 25,
    longBreakInterval: 4
  }, () => {
    console.log("Default theme set to avocado.");
  })
})




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "set_timer_status") {
    if (request.status) {
      startTimer(request.duration);
    } else {
      pauseTimer();
    }
    sendResponse({ success: true });
  }

  else if (request.type === "reset_timer") {
    resetTimer();
    sendResponse({ success: true });
  }
  else if (request.type === "open_settings") {
    chrome.runtime.openOptionsPage();
    sendResponse({ success: true });
  }
  return true; // Keep the message channel open for sendResponse
});
