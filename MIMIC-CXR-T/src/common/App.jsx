import React, { useState } from 'react';
import './App.css'
import Signup from '../profile/Signup';

function App() {
  const [mostrarRegistro, setMostrarRegistro] = useState(true);

  const toggleFormulario = () => {
    setMostrarRegistro(!mostrarRegistro);
  };
  return (
    <div className="App-page">
      <header >
        <nav className="navbar">
            <a href='/home'>Acerca de</a>
            <a href='/home'>Login</a>
            <a href='/translator'>Ir a traductor</a>
        </nav>
      </header>
    
      <main>
        <section className="left-section">
          <h1>Proyecto MIMIC-CXR-Translation</h1>
          <p>m ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mattis ullamcorper velit sed ullamcorper. Et odio pellentesque diam volutpat commodo sed. Justo nec ultrices dui sapien eget mi proin sed. Ipsum suspendisse ultrices gravida dictum fusce. Sit amet massa vitae tortor condimentum lacinia quis vel eros. Et malesuada f</p>
          <p>Más texto descriptivo aquí.</p>
        </section>


        <section className="right-section">
          <Signup />
        </section>
      </main>

      <footer>
        <p>© 2023 Tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;


