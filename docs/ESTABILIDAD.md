# AFILAO: estabilidad local · 15/10/2026

Se continuó la copia existente en la rama codex/afilao-work, desde 619e32f, coincidente con HEAD remoto al revisar. Git no tenía cambios pendientes. Se guardó una copia Git completa y el estado local previo en la carpeta work del chat de estabilización; también existe la rama safety/afilao-before-stabilization-20261015. No se descartaron archivos.

## Fallos encontrados y solución

- D1 local no contenía tablas: guardar y consultar reservas devolvía HTTP 503. Se aplicaron las dos migraciones existentes exclusivamente a la base local. Se añadió npm run db:migrate:local con configuración local explícita; no se modificaron migraciones ni datos remotos.
- El enlace de vuelta del panel incumplía la regla de navegación de Next. Se cambió a Link y el análisis ya no tiene errores.
- Las pruebas elegían una fecha 14 días después incluso en lunes, martes o domingo, aunque prueban también cenas. Ahora avanzan a un día con ambos servicios.
- Node y npm no estaban en PATH. Las dependencias ya estaban completas; se reutilizaron Node 24.19.0 del entorno y npm del chat anterior, sin reinstalar ni actualizar paquetes. El README explica instalación reproducible, migración y arranque. El acceso Abrir AFILAO.command entregado en este chat usa el Node disponible en este Mac.

## Verificación

Compilación Cloudflare completada, tipos correctos, ESLint sin errores (dos avisos existentes de imágenes). Pruebas contra D1 local aprobadas: autenticación, origen, validación, idempotencia, capacidad, solapamientos, cambios simultáneos de mesa, versiones, liberación y persistencia. Las reservas de prueba se cerraron. Reinicio del servidor y segunda ejecución de reservas correctos. Portada y gestión responden HTTP 200.

## Sobre los bloqueos de Work

No se reprodujo un bloqueo de la aplicación durante esta revisión ni había servidores de AFILAO activos al comenzar. Se observó actividad elevada de fileproviderd y bird (sincronización de archivos/iCloud); es un indicio de carga externa, no una causa demostrada. No se encontraron informes de caída con nombres Codex/ChatGPT/Electron en DiagnosticReports. No se cambiaron ajustes del sistema ni se detuvieron aplicaciones ajenas.

Mantener una sola instancia del servidor; detenerla con Ctrl+C antes de compilar. No borrar .wrangler/state ni reinstalar dependencias en cada arranque. Si Work vuelve a bloquearse, falta capturar el incidente en ese momento para atribuirlo con certeza.

Se conserva el diseño existente y DEMO. No se activaron reservas reales ni se publicó un despliegue. Los commits son locales.
