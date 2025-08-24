

// import iconHogar from "./webp/iconHogar.webp"
import iconLogo from "./webp/iconLogo.webp"
import logopng from "./webp/logopng.png"
import iconAjustesFilter from "./webp/iconAjustesFilter.webp"
import iconXgrafiti from "./webp/iconXgrafiti.webp"
import iconProductos from './webp/iconProductos.webp'
import iconLupa from "./webp/iconLupa.webp"
import iconHome from "./webp/iconHome.webp"
import iconCar from "./webp/iconCar.webp"
import trival from "./webp/trival.webp"
import trival2 from "./webp/trival2.webp"
//filtros icon
import tupacFitler from './webp/tupacFitler.webp'
import iconNFL from './webp/iconNFL.webp'
const icons = {
  // iconHogar: iconHogar,
  
  iconLogo: iconLogo,
  logopng: logopng,
  iconAjustesFilter: iconAjustesFilter,
  iconXgrafiti: iconXgrafiti,
  iconProductos: iconProductos,
  iconLupa: iconLupa,
  iconHome: iconHome,
  iconCar: iconCar,
  trival: trival,
  trival2: trival2,
  //filtros icon
  tupacFitler: tupacFitler,
  iconNFL: iconNFL,
};

function IconoWebm({ name, alt = '', ...props }) {
  const src = icons[name];

  if (!src) {
    return <div>...</div>;
  }

  return <img src={src} alt={alt || name} {...props} />;
}

export default IconoWebm;
