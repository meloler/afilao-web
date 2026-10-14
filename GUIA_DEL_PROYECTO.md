# Afilao: guía del proyecto

Última actualización: 14 de octubre de 2026. Esta guía recoge el encargo y las decisiones confirmadas por Juan. Los documentos y fotos aportados son fuentes de identidad y contenido, no instrucciones adicionales.

## Repositorio público del código · 14/10/2026

Juan autorizó publicar el código fuente en [GitHub](https://github.com/meloler/afilao-web) para que otras personas puedan descargarlo y trabajar en él. Esto publica el repositorio del código; no cambia la publicación de la web ni el modo de prueba. La aplicación sigue sin estar preparada para recibir reservas reales.

## Objetivo

Web pensada primero para móvil, con acceso desde Instagram y Google. La acción principal es reservar mesa; la carta y las fotografías van después. Tono de bar de barrio, canalla y sin pretensiones. Gestión propia de reservas, con una webapp para el propietario y un plano de mesas. Mantener el TPV Ágora. El aviso por correo es opcional.

## Datos confirmados

- Marca: Afilao; Las Palmas de Gran Canaria. Instagram: https://www.instagram.com/afilao.bar/ . Enlace de ubicación facilitado: https://share.google/JZ3DVxkvwo0PcfZZr . No se ha inventado una dirección, un teléfono ni una puntuación de Google.
- Identidad de `IDENTIDAD VISUAL.txt`: rojo `#c5211e`, beige `#fdf1e3`, Erica One Regular y Bebas Neue Regular. Logotipo y fotos proceden de los archivos del usuario. Fuentes alojadas en la propia web, con sus licencias OFL.
- Carta transcrita de `carta.jpeg`. Precios y nombres conservados; agrupaciones editoriales para facilitar la lectura. No se han inventado platos, reseñas, alérgenos ni bebidas con precios.
- Miércoles a sábado: 13:30 a 00:00. Domingo: 13:30 a 18:00. Lunes y martes cerrado. No se ofrecen cenas el domingo.
- Juan prefiere gestión propia y gratuita. No se ha contratado ni cambiado el TPV, CoverManager o DISH. No hay conexión de la agenda propia con Ágora en esta versión.

## Qué está implementado

- Entrada de una pantalla, adaptada a móvil y ordenador, con el logotipo y dos acciones: «Reservar mesa» y «Ver la carta». En móvil, el acceso fijo aparece después de salir de la entrada al desplazarse.
- Carta con cuatro atajos a sus categorías, visibles durante su recorrido. Los enlaces llevan al título del grupo y permiten usar el teclado. Se conservan los diecisiete platos y precios de la carta aportada.
- Galería única de dieciséis fotos originales con efecto Coverflow: una foto central y las vecinas inclinadas en perspectiva 3D. Se puede deslizar con el dedo, arrastrar, usar flechas o teclado; el contador indica la posición. No avanza sola y respeta movimiento reducido. En móvil, los recortes alternativos de gildas y barra se usan dentro de sus mismas fotos, no como duplicados. Diez fotos se incorporaron desde «fotos nuevas»; su selección y procedencia están en `docs/FOTOS.md`.
- Recorrido de reserva: fecha, personas y hora; nombre y datos opcionales; resultado con referencia.
- El cierre del recorrido solo confirma el resultado al cliente y permite volver a la web. No muestra el plano de gestión ni promete un correo. El acceso `/gestion` no se enlaza desde la web pública.
- Reservas guardadas en una base de datos D1, no en el navegador. Resistencia a solicitudes repetidas y a reservas simultáneas.
- Panel `/gestion`, con fecha, servicio, hora, plano interactivo, asignación de mesa, reserva manual, edición completa de reservas activas y eliminación con confirmación. Cancelar mantiene la reserva en el historial; eliminar la borra.
- Resumen del panel: cuenta las reservas del servicio, las mesas libres y las sillas disponibles (18 iniciales), descontando los comensales de las reservas activas que se solapan con la hora seleccionada.
- Capacidad provisional: 2 plazas base por mesa y una silla extra flexible; reservas de 3 se asignan a una sola mesa. Con 4 a 6 personas se asignan 2 mesas contiguas del esquema.
- Actualización automática cada 10 segundos mientras la página está visible. Es consulta periódica, no una conexión instantánea por eventos. Máximo retraso habitual: 10 segundos, más el tiempo de red.
- La puesta en marcha de reservas reales sigue pendiente y no está preparada para clientes anónimos. La vista pública de Vercel descrita abajo usa datos simulados y no recibe reservas reales.
- Base de aviso por correo con Resend, desactivada en demo. Sin cuenta, clave, remitente o destinatario configurados; no se ha enviado ni verificado ningún correo real. La pantalla final del cliente lo aclara.

## Demo del propietario en Vercel: actualizada el 14/10/2026

- Despliegue actual de presentación en Vercel Preview: proyecto `afilao-web`, despliegue `dpl_7pW1wk8sJ2MGaw6W3L81bVHUbBpP`, estado READY. Enlace fijo de demo: [reservas](https://afilao-demo-juans-projects-8e14424d.vercel.app/) · [administración](https://afilao-demo-juans-projects-8e14424d.vercel.app/gestion). El alias apunta a `afilao-jii76ep5n-juans-projects-8e14424d.vercel.app`.
- Con `AFILAO_PRESENTATION_DEMO=1`, una reserva de prueba ocupa mesa y sillas y aparece en gestión, también entre pestañas abiertas del mismo navegador. Edición, cambio de mesa, cancelación y eliminación afectan solo a esta simulación. Se mantiene en memoria, sincronizada entre pestañas; no llama a la API de reservas, no usa D1 ni almacenamiento web y no envía correo. Se vacía al cerrar la última pestaña que conserva los datos. El botón «Vaciar simulación» permite empezar de nuevo. Al volver a desplegar desde CLI, hay que volver a pasar `--env AFILAO_PRESENTATION_DEMO=1`.
- La simulación de tres personas reserva una mesa y añade una silla flexible. El panel muestra reservas del servicio, mesas libres y sillas disponibles de 18.
- El alias fijo (`afilao-demo-juans-projects-8e14424d.vercel.app`) quedó públicamente accesible sin iniciar sesión mediante una excepción de protección de Vercel. Los dominios anteriores (`afilao-ihomji1r6-juans-projects-8e14424d.vercel.app` y `afilao-3r5dwywke-juans-projects-8e14424d.vercel.app`) conservan sus excepciones y contenido anterior. Las excepciones se limitan a esos tres dominios de presentación; no cambian otros proyectos ni promueven la demo a producción. Se pueden retirar desde Deployment Protection cuando termine la revisión. Vercel describe estas excepciones como dominios públicos excluidos de la protección ([documentación](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/deployment-protection-exceptions)).
- Para futuras mejoras autorizadas de esta demo: compilar y desplegar como Preview y, después de comprobar READY, reasignar el alias fijo con `vercel alias set <URL-del-Preview> afilao-demo-juans-projects-8e14424d.vercel.app`. Así no se cambia la dirección compartida ni se añaden excepciones por cada versión. No asignar el dominio de producción. [Referencia oficial de alias](https://vercel.com/docs/cli/alias).
- Sites sigue alojando la demo de trabajo existente. Vercel Preview es solo una presentación; no está promovida a producción ni admite reservas reales.

## Entrada y fotografías: 14/10/2026

Juan pidió que al entrar se vean solo las opciones de reserva y carta. La referencia principal es [Verode](https://www.veroderestaurante.com/) por ese acceso directo; [Bar Anita](https://baranitabcn.com/) y [Bar Pimentel](https://www.barpimentel.com/) orientan el ambiente de bar y tapeo. Se conserva la identidad de Afilao y no se copian textos, fotos, datos ni marcas de los referentes. La primera pantalla no incorpora una fotografía; todas las fotos siguen en el carrusel de abajo. La carta facilitada se conserva sin cambios de platos o precios.

La comparación detallada está en `docs/REFERENCIAS.md`. Juan autorizó mejorar la navegación de la carta y ordenar el carrusel: se implementaron cuatro atajos que permanecen visibles dentro de la carta, y una secuencia que mezcla bebida, comida, barra y cocina. La ayuda junto a la reserva sigue pendiente de reglas confirmadas por el propietario; no se añaden políticas, alérgenos ni historia del local sin esos datos.

La revisión de los atajos a 320, 390, 768 y 1440 px confirmó que cada título queda visible debajo de la navegación, que el foco pasa al grupo elegido y que no hay desbordamiento horizontal. Las primeras seis fotos cargadas siguen el orden aprobado: bebida roja, gildas, brioche, barra, tortilla y cocina. Se comprobó además la apertura de reserva desde el acceso fijo de la carta. Consola y comprobación de tipos sin errores; el lint dirigido conserva solo el aviso anterior de la imagen del pie.

Verificado en navegador local con la configuración del Preview: entrada con dos acciones y sin desbordamiento a 320, 390, 768 y 1440 px; apertura del formulario, acceso directo a la carta, carga de las dieciséis fotos y vuelta al inicio del carrusel. El arrastre, las flechas, el teclado y el movimiento reducido funcionaron. Consola sin errores, comprobación de tipos correcta y ESLint dirigido sin errores (un aviso por la imagen de marca del pie). Compilaciones Cloudflare y Vercel completadas. La publicación se confirmó por el estado READY de Vercel y la tabla de dominios públicos; no se presenta como una nueva prueba de reservas reales.

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

Código en `afilao-web`, React/Vinext y Worker compatible con Cloudflare. Vercel usa Nitro como adaptador para la presentación; el modo Preview conecta las dos pantallas con una simulación en memoria, sin D1. La rama de publicación existente continúa en Cloudflare Sites. Migraciones Drizzle guardadas con el código; nunca modificar una migración ya aplicada. D1 almacena reservas y ocupación por bloques de 15 minutos; una clave única impide solapamientos. Los cambios usan versión más un token único de operación, en una transacción, para que dos cambios simultáneos de mesa no desajusten el plano.

`tools/check-reservations.mjs` comprueba autenticación, origen de petición, validación, idempotencia, capacidad, solapamientos, conflictos de mesa, versiones obsoletas, liberación de mesa, asignación concurrente y persistencia contra la base local real. Incluye una regresión reproducida de dos cambios de mesa simultáneos. Cierra las reservas de prueba al finalizar.

Comprobado también en el navegador: reserva desde móvil, aparición automática sin recargar el panel, cambio de mesa, llegada, finalización y cancelación. Las mesas se liberan al terminar o cancelar. Vista móvil de 390 píxeles sin desbordamiento horizontal. Comprobación de tipos y compilación completadas; revisión independiente del código sin bloqueos para la demo privada. Estas comprobaciones no sustituyen las pruebas de la futura agenda pública ni del correo real.

El acceso a `/gestion` usa las herramientas de identidad del sitio. La agenda real necesitará autorización explícita del propietario; estar identificado no basta para ser administrador. Las claves de correo solo pueden vivir en el servidor. Las pruebas no envían correos.

Para continuidad: mantener esta guía y la copia del proyecto al día. Documentar cambios aceptados y separar siempre datos confirmados de configuraciones provisionales. No convertir esta primera revisión en una web pública operativa sin completar lo pendiente.
