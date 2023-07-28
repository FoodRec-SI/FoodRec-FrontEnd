import "./App.css";
import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./pages/routes";
import "primereact/resources/primereact.min.css";



function App() {
  // const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen), setShowBackdrop(!showBackdrop);
  };

  

  return (
    <div className="App">
      <BrowserRouter>
        <div className="header">
          <Navbar toggle = {toggle} />
        </div>
        <div className="sidebar">
        <Sidebar isOpen={isOpen} showBackdrop={showBackdrop} setIsOpen ={setIsOpen} toggle ={toggle}/>
        </div>
        <div className="content">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
