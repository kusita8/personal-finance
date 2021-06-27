import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import navbardata from './static/data/navbar.json'
import dashboarddata from './static/data/dashboard.json'
import './app.scss'

import AccionesState from './context/acciones/accionesState'

function App() {
  return (
    <AccionesState>
      <div className="fl">
        <Navbar data={navbardata} />
        <Dashboard data={dashboarddata} />
      </div>
    </AccionesState>
  );
}

export default App;
