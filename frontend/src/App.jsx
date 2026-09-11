import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Tasks from "./components/Tasks";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);

  if (isLoggedIn) {
    return <Tasks />;
  }

  if (showRegister) {
    return <Register onRegister={() => setShowRegister(false)} />;
  }

  return (
    <Login
      onLogin={() => setIsLoggedIn(true)}
      onRegister={() => setShowRegister(true)}
    />
  );
}

export default App;