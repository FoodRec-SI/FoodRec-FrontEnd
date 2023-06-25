import "./App.css";
import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./pages/routes";
import {QueryClient , QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import "primereact/resources/primereact.min.css";

import 'primeicons/primeicons.css';                                 
import 'primeflex/primeflex.css';     
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.css';  


function App() {
  const [title, setTitle] = useState("");
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
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
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
