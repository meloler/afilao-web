'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const photos: { src: string; mobileSrc?: string; alt: string; caption: string }[] = [
  { src: '/assets/vaso-rojo.webp', alt: 'Un vaso de bebida roja con hielo sobre un posavasos', caption: 'Una y pa casa.' },
  {
    src: '/assets/gildas.webp',
    mobileSrc: '/assets/gildas-mobile.webp',
    alt: 'Gildas de Afilao servidas en una bandeja sobre un taburete',
    caption: 'Gildas. Y que venga otra ronda.',
  },
  {
    src: '/assets/brioche.webp',
    alt: 'Brioche de anchoa y queso sobre una bandeja',
    caption: 'Brioche de anchoa y queso Idiazabal',
  },
  {
    src: '/assets/bar.webp',
    mobileSrc: '/assets/bar-mobile.webp',
    alt: 'La barra de Afilao, con dos amigos tomando algo',
    caption: 'La barra de Afilao.',
  },
  { src: '/assets/tortilla.webp', alt: 'Una tortilla de papa abierta para compartir', caption: 'Tortilla de papa. Para compartir.' },
  { src: '/assets/cocina.webp', alt: 'Un cocinero de Afilao trabajando detrás del pase', caption: 'Al otro lado del pase.' },
  { src: '/assets/vaso-ambar.webp', alt: 'Un vaso de bebida ámbar con hielo sobre la mesa', caption: 'Y que venga otra ronda.' },
  { src: '/assets/albondigas.webp', alt: 'Albóndigas en salsa con papas servidas en un plato', caption: 'Albóndigas en salsa.' },
  {
    src: '/assets/bocado.webp',
    alt: 'Una persona a punto de comer una gilda',
    caption: 'Un bocado y seguimos.',
  },
  { src: '/assets/tomates.webp', alt: 'Un plato de tomates con queso fresco sobre la mesa', caption: 'Fresco, fresco.' },
  { src: '/assets/paso-cocina.webp', alt: 'Una persona con una camiseta roja de Afilao junto al pase de cocina', caption: 'El más afilao del barrio.' },
  { src: '/assets/tosta.webp', alt: 'Dos tostas con una cobertura cremosa y láminas oscuras', caption: 'Un bocado con fundamento.' },
  { src: '/assets/guiso-servido.webp', alt: 'Una persona sirviéndose de un cuenco de guiso con papas', caption: 'Para mojar pan.' },
  { src: '/assets/plato-tenedor.webp', alt: 'Un tenedor sobre un plato de la cocina de Afilao', caption: 'Aquí hay cocina.' },
  {
    src: '/assets/guiso.webp',
    alt: 'Guiso de callos y morros con papas',
    caption: 'Guiso de callos y morros',
  },
  {
    src: '/assets/sobremesa.webp',
    alt: 'Plato terminado y una cerveza en la mesa de Afilao',
    caption: 'De aquí no se sale con hambre.',
  },
];

export default function PhotoCarousel() {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  const speed = reduceMotion ? 0 : 550;
  const scrollPrevious = () => swiperRef.current?.slidePrev(speed);
  const scrollNext = () => swiperRef.current?.slideNext(speed);

  return (
    <section className="afilao-carousel" aria-label="Fotos de Afilao" aria-roledescription="carrusel">
      <div
        className="afilao-carousel__frame"
        tabIndex={0}
        aria-label="Desliza para ver las fotos; también puedes usar las flechas del teclado"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollPrevious();
          } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            scrollNext();
          }
        }}
      >
        <Swiper
          id="afilao-fotos"
          key={reduceMotion ? 'reduced' : 'coverflow'}
          className="afilao-carousel__viewport"
          modules={[EffectCoverflow, A11y]}
          effect={reduceMotion ? 'slide' : 'coverflow'}
          centeredSlides
          slidesPerView="auto"
          spaceBetween={12}
          loop
          grabCursor
          slideToClickedSlide
          speed={speed}
          initialSlide={selectedIndex}
          coverflowEffect={{ rotate: 45, stretch: 55, depth: 140, scale: 0.9, slideShadows: false }}
          a11y={{ itemRoleDescriptionMessage: 'foto', slideLabelMessage: '{{index}} de {{slidesLength}}' }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          onSlideChange={(swiper) => setSelectedIndex(swiper.realIndex)}
        >
          {photos.map((photo, index) => {
            const distance = Math.abs(selectedIndex - index);
            const nearby = Math.min(distance, photos.length - distance) <= 2;
            return (
            <SwiperSlide className="afilao-carousel__slide" key={photo.src} aria-hidden={selectedIndex !== index}>
              <figure className="afilao-carousel__card">
                {nearby && <picture>
                  {photo.mobileSrc && <source media="(max-width: 767px)" srcSet={photo.mobileSrc} />}
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" width="640" height="640" draggable={false} />
                </picture>}
              </figure>
            </SwiperSlide>
          ); })}
        </Swiper>
      </div>

      <p className="afilao-carousel__caption" aria-live="polite" aria-atomic="true">{photos[selectedIndex].caption}</p>

      <div className="afilao-carousel__controls">
        <button className="afilao-carousel__arrow" type="button" onClick={scrollPrevious} aria-label="Foto anterior" aria-controls="afilao-fotos">
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <p className="afilao-carousel__counter" aria-label={`Foto ${selectedIndex + 1} de ${photos.length}`}>
          <span>{String(selectedIndex + 1).padStart(2, '0')}</span><span aria-hidden="true"> / </span><span>{photos.length}</span>
        </p>
        <button className="afilao-carousel__arrow" type="button" onClick={scrollNext} aria-label="Foto siguiente" aria-controls="afilao-fotos">
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
      <p className="afilao-carousel__hint">Desliza y sigue el tapeo.</p>
    </section>
  );
}
