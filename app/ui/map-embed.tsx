'use client';
import { useState } from 'react';

const mapEmbedUrl = 'https://maps.google.com/maps?q=C.%20los%20Mart%C3%ADnez%20de%20Escobar%2C%2016%2C%2035007%20Las%20Palmas%20de%20Gran%20Canaria%2C%20Las%20Palmas&z=16&output=embed';

export default function MapEmbed() {
  const [enabled, setEnabled] = useState(false);
  return <div className="back-cover-map">
    {enabled ? <iframe title="Ubicación de Afilao en Google Maps" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /> : <div className="map-consent"><p>El mapa se conecta con Google y puede enviarle datos técnicos de tu navegador.</p><button type="button" onClick={() => setEnabled(true)}>Cargar mapa de Google</button></div>}
  </div>;
}
