import { logCompletedPomodoro } from "./stats";

let intervalId: ReturnType<typeof setInterval> | null = null;
let endTime: number;

export const startTimer = (inputDuration?: number) => {
  chrome.storage.local.get("remainingTime", (result) => {
    const durationToUse = result.remainingTime > 0 ? result.remainingTime : inputDuration || 0;

    // set status and endTime
     endTime = Date.now() + durationToUse;

    chrome.storage.local.set({ status: true, endTime });

    // start the interval
    intervalId = setInterval(() => {
      const timeLeft = Math.max(0, endTime - Date.now());

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab?.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: "update_timer",
            remainingTime: timeLeft,
            status: timeLeft > 0,
          });
        }
      });

      if (timeLeft <= 0) {
        logCompletedPomodoro();
        pauseTimer();
      }
    }, 1000);
  });
};
export const pauseTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    chrome.storage.local.set({
      status: false,
      remainingTime: Math.max(0, endTime - Date.now()),
    });
  }
};

export const resetTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  chrome.storage.local.set({
    status: false,
    remainingTime: 0,
  });
};
