import { useState } from 'react';
import axios from 'axios';
import './Login.css'; 
import { Container, Row, Col } from 'react-bootstrap';

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
        firstName: firstName,
        lastName: lastName,
        role: "User",
        email: email,
        password: password
      }).then((response) => {
        console.log(response, 'Registro exitoso! Ahora puedes volver y loguearte');
        setError(false);
        setMsg('Registro exitoso! Ahora puedes volver y loguearte');
      }).catch((error) => {      
      console.error('Ocurrió un error:', error);
      setError(true); // aquí puede haber más lógica para tratar los errores
      });
    }

  return (
    <Container>
    
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
          Contraseña:
          <input 
            type="password" 
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <input type="submit" value="Registrarse" />
      </form>
    </div>
    </Container>
  );
}

export default Signup;
