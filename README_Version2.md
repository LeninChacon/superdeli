# Desplegar Demo.html a Cloudflare Workers (Workers Sites)

Estos pasos asumen que tienes los archivos en una carpeta local `superdeli-workers` con la estructura:

- superdeli-workers/
  - wrangler.toml
  - public/
    - index.html

Pasos rápidos:

1. Instala wrangler (CLI de Cloudflare):
   ```bash
   npm install -g wrangler
   ```
   O usa `npx wrangler` si prefieres no instalar globalmente.

2. Crea proyecto y carpeta pública (si no lo has hecho):
   ```bash
   mkdir superdeli-workers
   cd superdeli-workers
   mkdir public
   # pega public/index.html (el proporcionado) dentro de public/
   # pega wrangler.toml en la raíz del proyecto
   ```

3. (Opcional) Si prefieres descargar directamente desde tu repo original:
   ```bash
   curl -L -o public/index.html https://raw.githubusercontent.com/LeninChacon/superdeli/9bb86702b0dcea4cc37d47c0ab1ce6f3e16c2ff2/Demo.html
   ```

4. Autenticar wrangler:
   ```bash
   wrangler login
   ```
   Esto abre el navegador y configura tu cuenta.

5. Publicar:
   ```bash
   wrangler publish
   ```
   Al finalizar verás la URL `https://<nombre-del-workers>.workers.dev`.

Notas y sugerencias:
- Sustituye la variable `phone` en `public/index.html` por tu número real (formato internacional sin +, p. ej. `573001234567`).
- Si `wrangler publish` pide `account_id`, cópialo desde tu panel Cloudflare y añádelo en `wrangler.toml`.
- Si quieres usar un dominio propio, añade la configuración `routes` o usa la sección de dominios en el panel de Cloudflare.
- Si prefieres no usar Workers Sites, puedo generar un `worker.js` que devuelva el HTML embebido (útil para pruebas rápidas).