import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; 

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        password: password
      }).then((response) => {
        console.log('Registro exitoso! Ahora puedes volver y loguearte');
        setError(false);
        setMsg('Registro exitoso! Ahora puedes volver y loguearte');
      }).catch((error) => {      
      console.error('Ocurrió un error:', error);
      setError(true); // aquí puede haber más lógica para tratar los errores
      });
    }

  return (
    <div className="container-login">
    <h3 >Regístrate aquí:</h3>
    <div className="Login">
      {msg.length > 0 && <div className="successMsg"> {msg} </div>}

      {error && <div className="error">Hubo un error con el Registro, por favor trata nuevamente.</div>}
      
      <form onSubmit={handleSubmit}>

        <label>
          Nombre:
          <input 
            type="text" 
            name="firstName"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </label>

        <label>
          Apellido:
          <input 
            type="text" 
            name="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </label>

        <label>
          Email:
          <input 
            type="email" 
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Rol:
          <input 
            type="text" 
            name="role"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          />
        </label>
        <label>
          Contraseña:
          <input 
            type="password" 
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
    </div>
  );
}

export default Signup;
