# Café Raíces de Colombia — sitio web

*De nuestras raíces a tu taza.*

**Sitio publicado:** https://msinisterra-cloud.github.io/cafe-raices-de-colombia/

Tienda virtual B2C/D2C de café 100 % arábica tostado en origen en Popayán, Cauca. Es el proyecto final del curso **Comercio Electrónico** de la Universidad Nacional de Colombia, sede Palmira (2026). Docente: M. Sc. Luis Adrián Lasso Cardona.

## Equipo

- Brillyth Shirley Castro Obregón
- Angie Pamela Marroquín Angulo
- Marvin Esneyder Sinisterra Montenegro
- Victor Daniel Zambrano Cuasapud

## Qué incluye

- **Páginas:** 16 páginas en HTML, CSS y JavaScript, sin frameworks ni pasos de compilación.
- **Tienda:**
  - Catálogo con filtros.
  - Ficha de producto única: `producto.html?id=media-libra | libra | kilo`.
  - Carrito guardado en `localStorage`.
  - Checkout en 5 pasos, que termina enviando el pedido por WhatsApp.
- **Fidelización:** Club Raíces (suscripción con 10 %), código BIENVENIDA10, recordatorio de recompra y Mi cuenta simulada.
- **Atención al cliente:** chat con respuestas automáticas, botón de WhatsApp, preguntas frecuentes y formularios validados.
- **Contenido:** reseñas con estrellas (empiezan vacías), quiz «Encuentra tu café», recetas, origen y trazabilidad por lote, logística verde, ubicación con Google Maps, video de YouTube y páginas legales.
- **Pendientes:** los datos que faltan aparecen como **[POR CONFIRMAR]** resaltados en amarillo (clase `.pendiente`). La lista completa está en [NOTAS.md](NOTAS.md).

## Estructura

```
index.html  nosotros.html  tienda.html  producto.html  club.html  kits.html
quiz.html  preparar.html  origen.html  logistica.html  ubicacion.html
ayuda.html  carrito.html  cuenta.html  novedades.html  legal.html
css/estilos.css      → único archivo de estilos (variables de color al inicio)
js/productos.js      → productos, precios, promociones, envío (UN solo lugar)
js/main.js           → encabezado, pie, chat, WhatsApp, cookies, carrito, formularios…
img/empaque.png      → empaque de las tres presentaciones (inicio y logística)
img/bolsa-*.png      → una bolsa por presentación (tienda, ficha, quiz y carrito)
img/logo.svg         → logotipo PROVISIONAL (texto); reemplazar con el definitivo
img/favicon.svg
docs/Portafolio_Cafe_Raices_de_Colombia.pdf
.nojekyll            → evita que GitHub Pages procese el sitio con Jekyll
```

## Datos que se cambian en un solo lugar

| Dato | Archivo | Dónde |
|---|---|---|
| Número de WhatsApp | `js/main.js` | constante `WHATSAPP_NUMERO` (primeras líneas) |
| Video de YouTube | `js/main.js` | `YOUTUBE_VIDEO_ID` y `YOUTUBE_VIDEO_RECETA_ID` |
| Razón social, NIT, dirección, teléfono, correo y horario | `js/main.js` | objeto `VENDEDOR` |
| Redes sociales | `js/main.js` | arreglo `REDES` (cambiar `url` y poner `pendiente: false`) |
| Precios, envío, IVA, kits y datos de origen | `js/productos.js` | objeto `CATALOGO` |
| Colores y tipografías | `css/estilos.css` | bloque `:root` |

## Probar en local

Abre `index.html` directamente en el navegador, o mejor, levanta un servidor local en la carpeta del sitio:

```bash
python -m http.server 8000
```

y entra a http://localhost:8000.

## Publicar en GitHub Pages (gratis)

1. Crea una cuenta en https://github.com (si no tienes) e inicia sesión.
2. Crea un repositorio nuevo, **público**, por ejemplo `cafe-raices`.
3. Sube los archivos del sitio. Dentro del repositorio, elige **Add file → Upload files** y arrastra **el contenido** de esta carpeta (no la carpeta), así `index.html` queda en la raíz. Luego elige **Commit changes**.
4. Ve a **Settings → Pages**.
5. En **Build and deployment → Source**, elige **Deploy from a branch**, luego la rama `main` y la carpeta `/ (root)`, y elige **Save**.
6. Espera 1 o 2 minutos. La URL será `https://USUARIO.github.io/cafe-raices/`. Esa es la URL que se entrega al profesor.
7. Con la URL definitiva, actualiza `og:image` y `og:url` en cada página con la ruta completa (ver NOTAS.md).

Con Git instalado, también puedes subirlo así:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Primera versión del sitio Café Raíces de Colombia"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/USUARIO/cafe-raices.git
```

```bash
git push -u origin main
```

## Limitaciones de esta versión

GitHub Pages solo sirve archivos estáticos. Por eso:

- El pago se coordina por WhatsApp. El lugar donde se conectaría Wompi o Mercado Pago está comentado en `js/main.js`, en el paso 4 del checkout.
- Los formularios muestran la confirmación en pantalla, pero no envían correos. La conexión con Formspree está comentada en `js/main.js`.
- Las reseñas, la cuenta y la suscripción se guardan solo en el navegador de cada visitante; es una demostración.
