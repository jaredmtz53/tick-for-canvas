export const logCompletedPomodoro = async () => {
  const today = new Date().toJSON().slice(0, 10);
  const stats = (await getStorage("pomodoroStats")) || {};

  stats[today] = (stats[today] || 0) + 1;

  await setStorage({ pomodoroStats: stats });

  console.log(`Pomodoro completed for ${today}. Total: ${stats[today]}`);
};

const getStorage = (key: string): Promise<any> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result[key]);
    });
  });
};

const setStorage = (data: object): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(data, () => resolve());
  });
};
