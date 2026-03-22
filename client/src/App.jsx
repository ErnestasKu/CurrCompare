import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import Dashboard from "./views/Dashboard";
import Header from "./views/Header";

function App() {
  const SCREENS = ["DASHBOARD"];
  const [activeScreen, setActiveScreen] = useState(SCREENS[0]);

  function renderSwitch(screenNr) {
    switch (screenNr) {
      case "DASHBOARD":
        return <Dashboard />;
      case "PROFILE":
        <></>;
    }
  }

  return (
    <div className={"flex flex-col h-screen border"}>
      <Header />
      <div className="flex-1 overflow-auto min-h-0">
        {renderSwitch(activeScreen)}
      </div>
    </div>
  );
}

export default App;
