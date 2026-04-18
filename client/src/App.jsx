import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import Dashboard from "./views/Dashboard";
import Header from "./views/Header";
import Historic from "./views/Historic";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  // const SCREENS = ["DASHBOARD"];
  // const [activeScreen, setActiveScreen] = useState(SCREENS[0]);

  // function renderSwitch(screenNr) {
  //   switch (screenNr) {
  //     case "DASHBOARD":
  //       return <Dashboard />;
  //     case "HISTORIC":
  //       return <Historic />;
  //     case "PROFILE":
  //       <></>;
  //   }
  // }

  // return (
  //   <div className={"flex flex-col h-screen"}>
  //     <Header activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
  //     <div
  //     //  className="flex-1 overflow-auto min-h-0"
  //     >
  //       {renderSwitch(activeScreen)}
  //     </div>
  //   </div>
  // );
  
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <Header />

        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/historic" element={<Historic />} />

            <Route
              path="*"
              element={<div className="p-10 text-center text-4xl">Page not found</div>}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
