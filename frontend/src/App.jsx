import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import PanelPrincipal from "./pages/PanelPrincipal.jsx";
import Entrenamientos from "./pages/Entrenamientos.jsx";
import Jugadores from "./pages/Jugadores.jsx";
import Viajes from "./pages/Viajes.jsx";
import CitaMedica from "./pages/CitaMedica.jsx";
import RegistrarJugador from "./pages/RegistrarJugador.jsx";
import Layout from "./components/Layout.jsx";
import BuscarJugador from "./pages/BuscarJugador.jsx";
import RegistrarAspirante from "./pages/RegistrarAspirante.jsx";
import BuscarAspirante from "./pages/BuscarAspirante.jsx";
import PartidoGestion from "./pages/PartidoGestion.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PanelPrincipal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/entrenamientos" element={<Entrenamientos />} />
        <Route path="/jugadores" element={<Jugadores />} />
        <Route path="/viajes" element={<Viajes />} />
        <Route path="/citas-medicas" element={<CitaMedica />} />
        <Route path="/registrar-jugador" element={<RegistrarJugador />} />
        <Route path="/buscar-jugador" element={<BuscarJugador />} />
        <Route path="/registrar-aspirante" element={<RegistrarAspirante />} />
        <Route path="/buscar-aspirante" element={<BuscarAspirante />} /> {/* Agrega esta línea */}
        <Route path="/partido-gestion" element={<PartidoGestion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;