import "./App.css";
import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./pages/routes";
import "primereact/resources/primereact.min.css";

import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primereact/resources/primereact.css";

function App() {
  const [title, setTitle] = useState("");

  return (
    <div className="App">
      <BrowserRouter>
        <div className="header">
          <Navbar title={title} />
        </div>
        <div className="sidebar">
          <Sidebar setTitle={setTitle} />
        </div>
        <div className="content">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
