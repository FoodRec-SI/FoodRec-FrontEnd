import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Navbar  from './components/Navbar/Navbar'
import { BrowserRouter, Routes , Route } from 'react-router-dom'

import routes from './pages/routes'

function App() {
  

  return (
    <div className="App">
      <BrowserRouter>
      <div className="header">
      <Navbar/>
      </div>
      <div className="sidebar">
      <Sidebar/>
      </div>
      <div className="content">
    
      <Routes>
        {routes.map(({ element,path,title:title}) => {
          return <Route key={title} element={element} path={`/${path}`}  />;
        })}
      </Routes>
    
   
    </div>
    </BrowserRouter>
    </div>
  )
}

export default App
