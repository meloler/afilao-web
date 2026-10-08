'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const photos = [
  {
    src: '/assets/gildas.webp',
    mobileSrc: '/assets/gildas-mobile.webp',
    alt: 'Gildas de Afilao servidas en una bandeja sobre un taburete',
    caption: 'Gildas. Y que venga otra ronda.',
  },
  {
    src: '/assets/bocado.webp',
    alt: 'Una persona a punto de comer una gilda',
    caption: 'Un bocado y seguimos.',
  },
  {
    src: '/assets/brioche.webp',
    alt: 'Brioche de anchoa y queso sobre una bandeja',
    caption: 'Brioche de anchoa y queso Idiazabal',
  },
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
  {
    src: '/assets/bar.webp',
    mobileSrc: '/assets/bar-mobile.webp',
    alt: 'La barra de Afilao, con dos amigos tomando algo',
    caption: 'La barra de Afilao.',
  },
] as const;

export default function PhotoCarousel() {
  const [viewportRef, emblaApi] = useEmblaCarousel({ align: 'center', loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const updateSelected = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    updateSelected();
    emblaApi.on('select', updateSelected);
    emblaApi.on('reInit', updateSelected);
    return () => {
      emblaApi.off('select', updateSelected);
      emblaApi.off('reInit', updateSelected);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const viewport = emblaApi.rootNode();
    const slides = emblaApi.slideNodes();

    const updateDepth = () => {
      const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
      const positions = slides.map((slide) => {
        const bounds = slide.getBoundingClientRect();
        return (bounds.left + bounds.width / 2 - viewportCenter) / bounds.width;
      });

      slides.forEach((slide, index) => {
        const card = slide.querySelector<HTMLElement>('.afilao-carousel__card');
        if (!card) return;

        const offset = positions[index];
        const side = Math.max(-1, Math.min(1, offset));
        const distance = Math.min(Math.abs(offset), 1);
        const depth = reduceMotion ? 0 : 1;
        const scale = 1 - distance * 0.18 * depth;
        const tilt = -side * 14 * depth;
        const shift = -side * 9 * depth;

        card.style.transform = `translateX(${shift}%) rotateY(${tilt}deg) scale(${scale})`;
        card.style.opacity = String(1 - distance * 0.4 * depth);
        card.style.zIndex = String(100 - Math.round(Math.abs(offset) * 10));
      });
    };

    updateDepth();
    emblaApi.on('scroll', updateDepth);
    emblaApi.on('reInit', updateDepth);
    return () => {
      emblaApi.off('scroll', updateDepth);
      emblaApi.off('reInit', updateDepth);
    };
  }, [emblaApi, reduceMotion]);

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index, reduceMotion), [emblaApi, reduceMotion]);
  const scrollPrevious = useCallback(() => emblaApi?.scrollPrev(reduceMotion), [emblaApi, reduceMotion]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(reduceMotion), [emblaApi, reduceMotion]);
  return (
    <section className="afilao-carousel" aria-label="Fotos de Afilao" aria-roledescription="carrusel">
      <div
        className="afilao-carousel__viewport"
        ref={viewportRef}
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
        <div className="afilao-carousel__track">
          {photos.map((photo, index) => (
              <div className="afilao-carousel__slide" key={photo.src} aria-hidden={selectedIndex !== index}>
                <figure className="afilao-carousel__card">
                  <picture>
                    {photo.mobileSrc && <source media="(max-width: 767px)" srcSet={photo.mobileSrc} />}
                    <img src={photo.src} alt={photo.alt} loading="lazy" draggable={false} />
                  </picture>
                </figure>
              </div>
          ))}
        </div>
      </div>

      <p className="afilao-carousel__caption" aria-live="polite" aria-atomic="true">{photos[selectedIndex].caption}</p>

      <div className="afilao-carousel__controls">
        <button className="afilao-carousel__arrow" type="button" onClick={scrollPrevious} aria-label="Foto anterior">
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <div className="afilao-carousel__dots" role="group" aria-label="Elegir una foto">
          {photos.map((photo, index) => (
            <button
              className="afilao-carousel__dot"
              key={photo.src}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Foto ${index + 1}: ${photo.caption}`}
              aria-current={index === selectedIndex ? 'true' : undefined}
            />
          ))}
        </div>
        <button className="afilao-carousel__arrow" type="button" onClick={scrollNext} aria-label="Foto siguiente">
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
