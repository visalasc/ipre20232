import React, { useState } from 'react';
import './App.css'

function App() {
  return (
    <div className="App-page">
      <header >
        <nav className="navbar">
          <ul>
          <a href='/home'>Ir a User Welcome</a>
          <a href='/translator'>Ir a translator</a>
       </ul>
        </nav>
      </header>
    
      <main>
        <section className="left-section">
          <h1>Título Grande</h1>
          <p>Texto explicativo sobre tu proyecto.</p>
          <p>Más texto descriptivo aquí.</p>
        </section>

        <section className="right-section">
          <h2>Registro de Usuarios</h2>
          <form>
            {/* Agrega tus campos de registro aquí */}
          </form>
        </section>
      </main>
      <footer>
        <p>© 2023 Tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;


