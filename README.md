# Afilao web

Código fuente público: [meloler/afilao-web](https://github.com/meloler/afilao-web). Puedes descargarlo o clonarlo para trabajar en él. La web y la gestión siguen en versión de prueba; no se deben usar para recibir reservas reales.

Antes de continuar, consulta la [guía del proyecto](GUIA_DEL_PROYECTO.md).

```sh
git clone https://github.com/meloler/afilao-web.git
cd afilao-web
npm install
```

Desarrollo: node scripts/run-framework.mjs dev
Verificación de tipos: node node_modules/typescript/bin/tsc --noEmit
Verificación funcional contra el servidor local: node tools/check-reservations.mjs

Mantener las migraciones Drizzle y publicar mediante el flujo de Sites. No activar reservas reales con el plano o turnos provisionales.
