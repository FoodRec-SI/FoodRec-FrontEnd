import './App.css'
import { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Navbar  from './components/Navbar/Navbar'
import { BrowserRouter, Routes , Route } from 'react-router-dom'


import routes from './pages/routes'

function App() {

  const [title, setTitle] = useState(""); 

  return (
    <div className="App">
      <BrowserRouter>
      <div className="header">
      <Navbar title={title}/>
      </div>
      <div className="sidebar">
      <Sidebar setTitle={setTitle}/>
      </div>
      <div className="content">

      <Routes>
        {routes.map(({ element,path,title:title}) => {
          return <Route key={title}  element={element} path={`/${path}`}  />;
        })}
      </Routes>
    
   
    </div>
    </BrowserRouter>
    </div>
  )
}

export default App;
