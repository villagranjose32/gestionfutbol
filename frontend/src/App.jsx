import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './pages/Login.jsx';
import Inicio from './pages/Inicio.jsx';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
