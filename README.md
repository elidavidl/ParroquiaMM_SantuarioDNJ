# Web del Santuario Divino Niño Jesús

Parroquia María Misionera – Santuario Diocesano del Divino Niño Jesús (Pamplona Baja, San Juan de Miraflores, Lima).

Proyecto con **Vite + Tailwind CSS 3**, a partir del diseño exportado de Google Stitch (`../code.html`, `../DESIGN.md`).

## Ejecutar en localhost

Requisito: [Node.js 18 o superior](https://nodejs.org).

```bash
npm install
npm run dev        # abre http://localhost:5173
```

En Windows también puedes hacer doble clic en **`iniciar.bat`**.

Otros comandos:

```bash
npm run build      # genera la carpeta dist/ lista para publicar
npm run preview    # prueba la versión final en http://localhost:4173
```

## Dónde editar

| Qué | Dónde |
| --- | --- |
| WhatsApp, teléfono, correo, horarios del pie | `src/config.js` |
| Textos, secciones y fotos | `index.html` |
| Colores y tipografías | `tailwind.config.js` (vienen de `DESIGN.md`) |
| Comportamiento (menú, formularios, calendario) | `src/main.js` |

## Qué hace la web

- Menú fijo con resaltado de la sección actual y menú tipo hamburguesa en celular.
- Botones de WhatsApp que usan el número de `src/config.js`. Mientras esté vacío, llevan al formulario de contacto.
- Formularios de intención de misa y de consulta: abren WhatsApp con el mensaje listo, o el correo de la parroquia si aún no hay número.
- «Agregar a mi calendario» descarga un archivo `.ics` (novena mensual y misa de niños).
- Mapa de Google, enlaces a Google Maps y Waze, y datos para buscadores (SEO).

Lee **`CONFIRMAR.md`** antes de publicar.
