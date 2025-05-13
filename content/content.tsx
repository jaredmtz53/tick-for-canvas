import React from "react";
import { createRoot } from "react-dom/client";


function PromodoroTimer() {
    return (
        <div>
            <h1>Pomodoro Timer</h1>
            <p>Work for 25 minutes, then take a 5-minute break.</p>
        </div>
    );
}


function main() {
    const sideBar = document.getElementById("right-side-wrapper");
    if (!sideBar) {
        console.warn("Right side bar not found");
        return;
    }
    const container = document.createElement("div");
    sideBar.appendChild(container);
    const root = createRoot(container);
    root.render(<PromodoroTimer />);
   
}
main();