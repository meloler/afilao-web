# Afilao web

Consultar [GUIA_DEL_PROYECTO.md](GUIA_DEL_PROYECTO.md) antes de continuar. Web y gestión propia de reservas en versión privada de prueba.

Desarrollo: node scripts/run-framework.mjs dev
Verificación de tipos: node node_modules/typescript/bin/tsc --noEmit
Verificación funcional contra el servidor local: node tools/check-reservations.mjs

Mantener las migraciones Drizzle y publicar mediante el flujo de Sites. No activar reservas reales con el plano o turnos provisionales.
