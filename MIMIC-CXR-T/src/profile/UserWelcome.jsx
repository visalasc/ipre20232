import { useState, useContext } from "react"

export default function UserWelcome() {
  const [nombre, setNombre] = useState(null);

  function handleChange(nombre) {
    setNombre(nombre);
  }

  return (
    <>
      <input
        onChange={e => handleChange(e.target.value)}
      />
      <p>Bienveni@, { nombre }!</p>
    </>
  )
}