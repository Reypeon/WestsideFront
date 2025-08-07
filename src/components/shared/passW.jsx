import { useState } from 'react';
import s from './passW.module.css'; // creá este módulo CSS si querés estilos

const PasswordGate = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState('');
  const password =  import.meta.env.PASSWORD; 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === password) {
      setAuthorized(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  if (authorized) return children;

  return (
    <div className={s.gate}>
      <form onSubmit={handleSubmit}>
        <h2>Ingresá la contraseña</h2>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Contraseña"
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default PasswordGate;
