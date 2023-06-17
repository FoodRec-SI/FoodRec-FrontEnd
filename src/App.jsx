import "./App.css";
import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./pages/routes";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import "primereact/resources/primereact.min.css";

import 'primeicons/primeicons.css';                                 
import 'primeflex/primeflex.css';     

import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.css';  


const queryClient = new QueryClient();

function App() {
  const [title, setTitle] = useState("");

  return (
    <div className="App">
    <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </div>
  );
}

export default App;
