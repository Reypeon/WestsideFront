import s from "./loader.module.css";

const Loader = ({ mensaje = "CARGANDO...", height = "100vh"}) => {
const boxloader = {
  display: "flex",
  width: "100%",
  flexDirection: "column",
  minHeight: height,
  zIndex: 999,
  backgroundColor: "var(--colorfilterdos)",
  justifyContent: "center", // centra verticalmente (en flex-column)
  alignItems: "center",     // centra horizontalmente
  position: "relative"      // para que honeycomb absoluto se posicione aquí
};

  return (
    <span style={boxloader}>
      <div className={s.honeycomb}>
        <div className={s.honey}></div>
        <div className={s.honey}></div>
        <div className={s.honey}></div>
        <div className={s.honey}></div>
        <div className={s.honey}></div>
        <div className={s.honey}></div>
        <div className={s.honey}></div>
      </div>
      <p className={s.text}>{mensaje}</p>
    </span>
  );
};

export default Loader;
