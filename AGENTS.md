# Guía de continuidad de Afilao

La guía del proyecto está en `GUIA_DEL_PROYECTO.md` en este proyecto y en la carpeta padre. Mantener ambas actualizadas con las decisiones confirmadas.

- El usuario no es técnico: cambios controlados y explicaciones breves en español.
- Sistema propio de reservas. Mantener Ágora como TPV. No contratar CoverManager ni DISH.
- Identidad obligatoria: rojo #c5211e, beige #fdf1e3, Erica One Regular y Bebas Neue Regular. Fotos y marca del usuario.
- Horario confirmado: miércoles a sábado 13:30–00:00; domingos 13:30–18:00. Lunes y martes cerrado.
- DEMO debe seguir activado hasta confirmar plano, capacidades, combinaciones, turnos, duración, acceso del propietario y puesta en marcha pública. No convertir datos provisionales en hechos.
- Los datos de prueba se aíslan por usuario; una agenda real deberá ser común al local y accesible solo para los administradores autorizados. SIWC por sí solo no acredita que alguien sea administrador.
- D1 es la fuente de verdad. No sustituir reservas por localStorage. Cambios de mesas y ocupación deben ser atómicos y ligados a mutation_token único por operación.
- No editar migraciones ya aplicadas; añadir nuevas. Mantener pruebas de concurrencia y revisar antes de publicar.
- El correo está preparado pero desactivado; no afirmar que envía avisos hasta configurarlo y verificar recepción.
- Publicaciones nuevas privadas; no añadir esta demo a Instagram/Google ni activar reservas reales sin la puesta en marcha acordada.
- Excepción acotada autorizada por el usuario: Preview de Afilao público para presentar reservas y gestión sin reservas reales. Enlace fijo actual: `afilao-demo-juans-projects-8e14424d.vercel.app`. Los dominios antiguos `afilao-ihomji1r6-juans-projects-8e14424d.vercel.app` y `afilao-3r5dwywke-juans-projects-8e14424d.vercel.app` conservan su acceso. Mantener las excepciones limitadas a esos tres dominios. Para futuras mejoras autorizadas, reasignar el alias fijo solo a un Preview READY; no añadir una excepción por cada despliegue ni promover la demo a producción. Retirar las excepciones cuando termine la revisión.
