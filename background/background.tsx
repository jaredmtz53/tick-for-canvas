let intervalId: ReturnType<typeof setInterval> | null = null;
let endTime: number;
const startTimer = (duration) => {
  if (intervalId) clearInterval(intervalId);
  endTime = Date.now() + duration;
  chrome.storage.local.set({ timerStatus: true }); 
  intervalId = setInterval(() => {
    const timeLeft = endTime - Date.now();
    console.log("Time left: ", timeLeft);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      console.log("Tab ID: ", tab.id);
      if (tab?.id) {
        chrome.tabs
          .sendMessage(tab.id, {
            type: "timerTick",
            remainingTime: timeLeft,
          })
          .catch((error) => {
            console.error("Error sending message to content script:", error);
          });
      }
    });
    if (timeLeft <= 0) {
      clearInterval(intervalId!);
      intervalId = null;
      chrome.storage.local.set({ timerStatus: false, duration: 0 });
      console.log("Timer finished");
    }
  }, 1000);
};
const PauseTimer = () => {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;

  const remainingTime = endTime - Date.now();
  chrome.storage.local.set({
    duration: remainingTime,
    timerStatus: false,
  });
  console.log("Timer paused, remaining time: ", remainingTime);
};

const resetTimer = () => {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  endTime = 0;

  chrome.storage.local.set({
    timerStatus: false,
    duration: 0,
  });
  console.log("Timer reset");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "set_timer_status") {
    chrome.storage.local.set(
      {
        timerStatus: request.status,
        duration: request.duration,
      },
      () => {
        if (request.status) {
          startTimer(request.duration);
        } else {
          PauseTimer();
        }
      }
    );
  }
  else if (request.type === "reset_timer") {
    resetTimer();
  }
});
