export const logCompletedPomodoro = () => {
    const today = new Date().toJSON().slice(0, 10);
    chrome.storage.local.get(["pomodoroStats"], (result) => {
        const status = result.pomodoroStats || {};
        status[today] = (status[today] || 0) + 1;
        chrome.storage.local.set({ pomodoroStats: status }, () => {
            console.log(`Pomodoro completed for ${today}. Total: ${status[today]}`);
        });
    })
}


