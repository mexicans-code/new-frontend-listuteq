// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DashboardLayout from './components/DashboardLayaut';
import Home from './pages/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Usuarios from './pages/dashboard/Usuarios';  
import Programas from './pages/dashboard/Programas';
import Materias from './pages/dashboard/Materias';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            
            <Route path="divisiones" element={<Dashboard />} />
            <Route path="programas" element={<Programas />} />
            <Route path="materias" element={<Materias />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
