

// import iconHogar from "./webp/iconHogar.webp"
// import westsideLogo from "./webp/westsideLogo.webp"
import iconAjustesFilter from "./webp/iconAjustesFilter.webp"
import iconXgrafiti from "./webp/iconXgrafiti.webp"
import iconFlecha from "./webp/iconFlecha.webp"
//filtros icon
import tupacFitler from './webp/tupacFitler.webp'
import iconNFL from './webp/iconNFL.webp'
const icons = {
  // iconHogar: iconHogar,
  
  // westsideLogo: westsideLogo,
  iconAjustesFilter: iconAjustesFilter,
  iconXgrafiti: iconXgrafiti,
  iconFlecha: iconFlecha,

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
