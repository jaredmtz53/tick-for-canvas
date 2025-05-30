import { startTimer, pauseTimer, resetTimer } from "./timer";

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
  return true; // Keep the message channel open for sendResponse
});
