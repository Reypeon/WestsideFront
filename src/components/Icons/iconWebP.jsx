

import iconTeclado from "./webp/iconTeclado.webp"
import iconWifi from "./webp/iconWifi.webp"
import iconJoystick from "./webp/iconJoystick.webp"
import iconParlantes from "./webp/iconParlantes.webp"
import iconIluminacion from "./webp/iconIluminacion.webp"
import iconAuris from "./webp/iconAuris.webp"
import iconCargador from "./webp/iconCargador.webp"
import iconCable from "./webp/iconCable.webp"
import iconBelleza from "./webp/iconBelleza.webp"
import iconSmartWatch from "./webp/iconSmartWatch.webp"
import iconCamaras from "./webp/iconCamaras.webp"
import iconAccesoriosCelu from "./webp/iconAccesoriosCelu.webp"
import icontv from "./webp/icontv.webp"
import iconHerramientas from "./webp/iconHerramientas.webp"
import iconHogar from "./webp/iconHogar.webp"

import Logo from "./webp/Logo.webp"
import LogoDos from "./webp/LogoDos.webp"
import LogoTres from "./webp/LogoTres.webp"

const icons = {
  iconTeclado: iconTeclado,
  iconWifi: iconWifi,
  iconJoystick: iconJoystick,
  iconParlantes: iconParlantes,
  iconIluminacion: iconIluminacion,
  iconAuris: iconAuris,
  iconCargador: iconCargador,
  iconCable: iconCable,
  iconBelleza: iconBelleza,
  icontv: icontv,
  iconHerramientas: iconHerramientas,
  iconHogar: iconHogar,
  iconSmartWatch: iconSmartWatch,
  iconCamaras: iconCamaras,
  iconAccesoriosCelu: iconAccesoriosCelu,
  Logo:Logo,
  LogoDos: LogoDos,
  LogoTres: LogoTres

};

function IconoWebm({ name, alt = '', ...props }) {
  const src = icons[name];

  if (!src) {
    return <div>...</div>;
  }

  return <img src={src} alt={alt || name} {...props} />;
}

export default IconoWebm;
