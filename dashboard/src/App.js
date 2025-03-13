import React from "react";
import MainComponent from "./Components/MainComponent";
import { ThemeProvider } from "./Components/Theme";


const App = () => {
  return (
    <ThemeProvider>
      <div style={{ padding: "16px" }}>
        <h1>React Theme Changer</h1>
        <MainComponent />
      </div>
    </ThemeProvider>
  );
};

export default App;
