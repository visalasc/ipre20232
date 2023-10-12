import React, { useState } from 'react';
import './App.css'
import Signup from '../profile/Signup';
import MyNavBar from '../Components/Nav';
import AuthProvider from '../auth/AuthProvider';


function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <AuthProvider>
    <div className="App-page">
      <MyNavBar/>
      <main>
        <section className="left-section">
          <h1>Proyecto MIMIC-CXR-Translation</h1>
          <p>m ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mattis ullamcorper velit sed ullamcorper. Et odio pellentesque diam volutpat commodo sed. Justo nec ultrices dui sapien eget mi proin sed. Ipsum suspendisse ultrices gravida dictum fusce. Sit amet massa vitae tortor condimentum lacinia quis vel eros. Et malesuada f</p>
          <p>Información del proyecto</p>
        </section>


        <section className="right-section">
          <Signup />
        </section>
      </main>

      <footer>
        <p>© 2023 Todos los derechos reservados.</p>
      </footer>
    </div>
    </AuthProvider>
  );
}

export default App;


