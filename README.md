# Afilao web

Código fuente público: [meloler/afilao-web](https://github.com/meloler/afilao-web). Puedes descargarlo o clonarlo para trabajar en él. La web y la gestión siguen en versión de prueba; no se deben usar para recibir reservas reales.

Antes de continuar, consulta la [guía del proyecto](GUIA_DEL_PROYECTO.md).

```sh
git clone https://github.com/meloler/afilao-web.git
cd afilao-web
npm run install:ci
npm run db:migrate:local
npm run dev
```

Requiere Node >=22.13 y npm. La instalación usa las versiones del archivo de bloqueo.

La migración inicializa únicamente D1 local en `.wrangler/state`; no toca la base remota. No borrar esa carpeta: conserva las reservas locales. El servidor queda en http://127.0.0.1:5173. Detener con Ctrl+C antes de iniciar otra instancia o compilar.

Desarrollo: `npm run dev`
Verificación de tipos: node node_modules/typescript/bin/tsc --noEmit
Verificación funcional contra el servidor local: node tools/check-reservations.mjs

Mantener las migraciones Drizzle y publicar mediante el flujo de Sites. No activar reservas reales con el plano o turnos provisionales.

Diagnóstico y comprobaciones del entorno: [ESTABILIDAD.md](docs/ESTABILIDAD.md).
