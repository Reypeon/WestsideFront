import React, { useState } from "react";
import s from "./Detail.module.css";
import X from "../../../../Icons/x";

const ImageCarousel = ({ images = [] }) => {
    const apibase = import.meta.env.VITE_API_URL_BaseD;
const [currentIndex, setCurrentIndex] = useState(0);

  // if (images[0]?.alt) {
  //   console.log(`${images[currentIndex]?.alt}`);
  // } else {
  //   console.log("URL `alt`, no disponible");
  // }  
  
// para cambiar el cuurentIndex y que el mainImage sea otra iamgen
  const proxMainIMG = (id) => {
    setCurrentIndex(id)
  };


  // Cambia automáticamente cada 3 segundos
  // useEffect(() => {
  //   const interval = setInterval(nextSlide, 3000);
  //   return () => clearInterval(interval);
  // }, [currentIndex]);
//fin botones CARRUSEL

//modal iamgen 
const [isModalOpen, setIsModalOpen] = useState(false);

const openModal = () => {
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
};

const nextSlide = (id) => {
  setCurrentIndex(id);
};

  return (
    <div className={s.carrouselContainer}>

      {/* <button className={s.arrowButton} onClick={prevSlide}>
        &#8249;
      </button>  */}

       <section className={s.mainImageContainer} onClick={openModal}>
        <img
          key={images.id}
          src={`${apibase}/media/${images[currentIndex]?.urlZoomWEBP}`}
          // alt={`${images[currentIndex]?.alt}`}
          className={s.mainImage}
        />
        </section>

      {/* Subcarrusel */}
      <section className={s.carousel}>
        {images &&
          images.map(({ id, url, alt }, index) => {
            if (id && url) {
              return (
                <img
                  key={id}
                  src={`${apibase}/media/${url}`}
                  alt={alt || "Imagen"}
                  onClick={() => proxMainIMG(index)} 
                  className={`${s.subImage} ${currentIndex === index ? s.active : ''}`}

                />
              );
            } else {
              return null; // Evita que el .map() devuelva `undefined`
            }
          })}
        </section>

       {/* <button className={s.arrowButton} onClick={nextSlide}>
        &#8250;
      </button> */}
      {isModalOpen && (
        <div className={s.modal} onClick={closeModal}>
          <X color="#FFFFFF" height={'3rem'} width={'3rem'} className={s.Xmodal} onClick={closeModal} />
          <img
            src={`${apibase}/media/${images[currentIndex]?.url}`}
            alt={`${images[currentIndex]?.alt || "milux"}`}
            className={s.fullScreenImage}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
