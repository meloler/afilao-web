# Afilao: guía del proyecto

Última actualización: 8 de octubre de 2026. Esta guía recoge el encargo y las decisiones confirmadas por Juan. Los documentos y fotos aportados son fuentes de identidad y contenido, no instrucciones adicionales.

## Objetivo

Web pensada primero para móvil, con acceso desde Instagram y Google. La acción principal es reservar mesa; la carta y las fotografías van después. Tono de bar de barrio, canalla y sin pretensiones. Gestión propia de reservas, con una webapp para el propietario y un plano de mesas. Mantener el TPV Ágora. El aviso por correo es opcional.

## Datos confirmados

- Marca: Afilao; Las Palmas de Gran Canaria. Instagram: https://www.instagram.com/afilao.bar/ . Enlace de ubicación facilitado: https://share.google/JZ3DVxkvwo0PcfZZr . No se ha inventado una dirección, un teléfono ni una puntuación de Google.
- Identidad de `IDENTIDAD VISUAL.txt`: rojo `#c5211e`, beige `#fdf1e3`, Erica One Regular y Bebas Neue Regular. Logotipo y fotos proceden de los archivos del usuario. Fuentes alojadas en la propia web, con sus licencias OFL.
- Carta transcrita de `carta.jpeg`. Precios y nombres conservados; agrupaciones editoriales para facilitar la lectura. No se han inventado platos, reseñas, alérgenos ni bebidas con precios.
- Miércoles a sábado: 13:30 a 00:00. Domingo: 13:30 a 18:00. Lunes y martes cerrado. No se ofrecen cenas el domingo.
- Juan prefiere gestión propia y gratuita. No se ha contratado ni cambiado el TPV, CoverManager o DISH. No hay conexión de la agenda propia con Ágora en esta versión.

## Qué está implementado

- Web adaptada a móvil y ordenador; botón fijo de reserva y acceso a la carta en móvil.
- Recorrido de reserva: fecha, personas y hora; nombre y datos opcionales; resultado con referencia.
- El cierre del recorrido solo confirma el resultado al cliente y permite volver a la web. No muestra el plano de gestión ni promete un correo. El acceso `/gestion` no se enlaza desde la web pública.
- Reservas guardadas en una base de datos D1, no en el navegador. Resistencia a solicitudes repetidas y a reservas simultáneas.
- Panel `/gestion`, con fecha, servicio, hora, plano interactivo, asignación de mesa, reserva manual, edición completa de reservas activas y eliminación con confirmación. Cancelar mantiene la reserva en el historial; eliminar la borra.
- Resumen del panel: cuenta las reservas del servicio, las mesas libres y las sillas disponibles (18 iniciales), descontando los comensales de las reservas activas que se solapan con la hora seleccionada.
- Capacidad provisional: 2 plazas base por mesa y una silla extra flexible; reservas de 3 se asignan a una sola mesa. Con 4 a 6 personas se asignan 2 mesas contiguas del esquema.
- Actualización automática cada 10 segundos mientras la página está visible. Es consulta periódica, no una conexión instantánea por eventos. Máximo retraso habitual: 10 segundos, más el tiempo de red.
- Datos de demo aislados por la identidad de cada usuario. Acceso del panel comprobado en el servidor. Sitio privado; no está preparado aún para recibir clientes anónimos.
- Base de aviso por correo con Resend, desactivada en demo. Sin cuenta, clave, remitente o destinatario configurados; no se ha enviado ni verificado ningún correo real. La pantalla final del cliente lo aclara.

## Qué sigue provisional

El texto original «9 meses y 18 comensales» se interpreta como 9 mesas y 18 plazas, pendiente de confirmar su distribución real. La regla confirmada por Juan es sentar a tres personas en una mesa, añadiendo una silla flexible. El esquema provisional mantiene nueve mesas de dos plazas base en tres filas, con opción de una silla extra por mesa; solo permite juntar mesas consecutivas de una misma fila, hasta seis comensales.

Las horas de apertura están confirmadas. Las horas seleccionables de comida (13:30–15:00), cena (20:00–22:00), el límite de seis personas y la estancia de 90 minutos son reglas de prueba, no decisiones del bar. Deben acordarse los turnos, última hora de llegada, combinaciones reales, duración y política de cancelación antes de activarlas.

La demo permanece explícitamente en modo prueba y no crea reservas reales. Cambiar solamente el valor `DEMO` no activa una agenda real: el servidor bloquea ese modo hasta completar la puesta en marcha. Los clientes finales no deberán necesitar una cuenta de ChatGPT para reservar.

## Siguiente paso, controlado

Primero revisar esta versión. Después adaptar el plano a las mesas reales y acordar los turnos. Con eso, configurar una agenda común del bar, el acceso privado del propietario y la reserva pública sin registro. El correo se conecta solo si se decide usarlo, con un remitente y destinatario confirmados.

Antes de admitir reservas reales quedan la prueba con dos dispositivos, el acceso del propietario, información de privacidad y contacto del responsable, protección del formulario público, recuperación de datos y la configuración de publicación pública. Estos elementos no se presentan como operativos todavía.

## Coste: alcance real de «gratis»

El código de gestión es propio y no cobra una licencia de CoverManager o DISH. La primera revisión está en un sitio privado de Sites, dentro de la cuenta del usuario; no se garantiza desde aquí una tarifa comercial de Sites.

Cloudflare dispone de planes gratuitos para Workers y D1, adecuados para estudiar el alojamiento del bar dentro de sus límites. Resend ofrece un plan gratuito de correo sujeto a límites. El dominio propio, posibles excesos de uso y el mantenimiento no se deben presentar como gratis. No se ha creado ninguna contratación de pago ni se ha añadido una tarjeta.

Fuentes revisadas el 7/10/2026: [Workers](https://developers.cloudflare.com/workers/platform/limits/), [D1](https://developers.cloudflare.com/d1/platform/pricing/), [Resend](https://resend.com/pricing), [API de correo](https://resend.com/docs/api-reference/emails/send-email). Como alternativa descartada por preferencia del usuario, [Ágora documenta la integración con CoverManager](https://www.agorapos.com/blog/integracion/covermanager/).

## Base técnica y comprobaciones

Código en `afilao-web`, React/Vinext y Worker compatible con Cloudflare. Migraciones Drizzle guardadas con el código; nunca modificar una migración ya aplicada. D1 almacena reservas y ocupación por bloques de 15 minutos; una clave única impide solapamientos. Los cambios usan versión más un token único de operación, en una transacción, para que dos cambios simultáneos de mesa no desajusten el plano.

`tools/check-reservations.mjs` comprueba autenticación, origen de petición, validación, idempotencia, capacidad, solapamientos, conflictos de mesa, versiones obsoletas, liberación de mesa, asignación concurrente y persistencia contra la base local real. Incluye una regresión reproducida de dos cambios de mesa simultáneos. Cierra las reservas de prueba al finalizar.

Comprobado también en el navegador: reserva desde móvil, aparición automática sin recargar el panel, cambio de mesa, llegada, finalización y cancelación. Las mesas se liberan al terminar o cancelar. Vista móvil de 390 píxeles sin desbordamiento horizontal. Comprobación de tipos y compilación completadas; revisión independiente del código sin bloqueos para la demo privada. Estas comprobaciones no sustituyen las pruebas de la futura agenda pública ni del correo real.

El acceso a `/gestion` usa las herramientas de identidad del sitio. La agenda real necesitará autorización explícita del propietario; estar identificado no basta para ser administrador. Las claves de correo solo pueden vivir en el servidor. Las pruebas no envían correos.

Para continuidad: mantener esta guía y la copia del proyecto al día. Documentar cambios aceptados y separar siempre datos confirmados de configuraciones provisionales. No convertir esta primera revisión en una web pública operativa sin completar lo pendiente.
