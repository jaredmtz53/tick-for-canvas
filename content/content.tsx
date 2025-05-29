import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import PomodoroTimer from "./PomodoroTimer";

const main = () => {
  const sideBar = document.getElementById("right-side-wrapper");
  const container = document.createElement("div");
  sideBar?.appendChild(container);
  const root = createRoot(container).render(
    <div>
      <PomodoroTimer />
      
    </div>
  );
};
main();
