import './App.css'
import Sidebar from './components/sidebar/Sidebar'
import { BrowserRouter, Routes , Route } from 'react-router-dom'

import routes from './pages/routes'

function App() {
  

  return (
    <div className="App">
    <BrowserRouter>
      <Sidebar/>

      <Routes>
        {routes.map(({ element,path,title:title}) => {
          return <Route key={title} element={element} path={`/${path}`}  />;
        })}
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
