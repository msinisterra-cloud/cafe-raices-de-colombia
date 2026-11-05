# NOTAS para continuar — Café Raíces de Colombia

Primera versión creada el 4 de noviembre de 2026. Este archivo sirve para retomar el trabajo en otra sesión.

Para encontrar todos los pendientes, busca `POR CONFIRMAR` en la carpeta. En pantalla aparecen resaltados en amarillo (clase `.pendiente`).

---

## 1. Tabla de verificación (enunciado → sitio)

| # | Requisito del enunciado | Página(s) donde se cumple | Estado |
|---|---|---|---|
| 1.1 | Presentación de la empresa: quiénes somos, a qué se dedica, qué ofrece | `nosotros.html` | ✅ |
| 1.2 | Historia | `nosotros.html#t-historia` | ⚠️ falta la historia completa (año, fundadores, hitos) |
| 1.3 | Misión, visión y políticas de calidad | `nosotros.html` | ✅ |
| 1.4 | Productos, características y precios | `tienda.html`, `producto.html?id=…` | ✅ (⚠️ notas de cata, variedad y finca) |
| 1.5 | Descripción de la ubicación y mapa de Google Maps visible | `ubicacion.html` | ⚠️ falta la dirección exacta; el mapa muestra Popayán |
| 1.6 | Video publicitario | `index.html`, `origen.html`, `preparar.html` | ⚠️ falta el ID de YouTube (se ve un recuadro) |
| 1.7 | Redes sociales | Pie de página (todas las páginas), `ayuda.html#contacto` | ⚠️ faltan las URL |
| 1.8 | Demás información importante | `logistica.html`, `legal.html`, `novedades.html`, portafolio PDF | ✅ |
| 2.1a | Visualización del servicio: descripción, promociones, paquetes, membresías y video | `tienda.html`, `producto.html`, `club.html`, `kits.html`, `preparar.html` | ⚠️ kits sin composición ni precio; faltan los videos |
| 2.1b | Atención al cliente: canales, chat, respuestas automáticas y preguntas frecuentes | Chat y WhatsApp flotantes (todas las páginas), `ayuda.html` | ⚠️ falta el número de WhatsApp, el correo y el horario |
| 2.1c | Carrito de compras y medios de pago | `carrito.html` (5 pasos), `ayuda.html#pagos` | ⚠️ faltan la tarifa de envío, el IVA y la pasarela |
| 2.1d | Logística: almacenamiento, alistamiento, despacho, entrega, devolución y logística verde | `logistica.html` | ✅ (⚠️ transportadora y tiempos) |
| 2.1e | Estrategias de fidelización | `club.html`, `cuenta.html`, `novedades.html`, BIENVENIDA10 en el carrito | ✅ |
| 2.1f | Reseñas, comentarios y calificación | `producto.html` (formulario), `index.html` (resumen) | ✅ demostración en localStorage |
| 2.2 | Email marketing (infografía o póster) | `novedades.html` | ⚠️ falta la infografía del equipo |
| 2.3 | Portafolio de servicios | `docs/Portafolio_Cafe_Raices_de_Colombia.pdf` (enlazado en el pie, `nosotros.html` y `kits.html`) | ✅ |
| 2.4 | Video de 40 a 50 s en YouTube | Constante `YOUTUBE_VIDEO_ID` en `js/main.js` | ⚠️ falta el enlace (ver la contradicción a) |
| — | URL del sitio implementado (entrega 3) | GitHub Pages (ver README) | ⚠️ pendiente publicar |

---

## 2. Lista de [POR CONFIRMAR]

**Quién responde por cada dato:** los roles del equipo son: Angie Pamela Marroquín Angulo, coordinación general y modelo de negocio; Victor Daniel Zambrano Cuasapud, arquitectura web y pasarelas de pago; Brillyth Shirley Castro Obregón, estrategia de contenido y comunidad; Marvin Esneyder Sinisterra Montenegro, automatización y fidelización de clientes. «Grupo» quiere decir que lo coordina Angie Pamela.

| # | Dato pendiente | Archivo(s) | Rol responsable (por asignar a un integrante) |
|---|---|---|---|
| 1 | Número de WhatsApp | `js/main.js` (`WHATSAPP_NUMERO`), `ayuda.html` | Marvin (automatización y fidelización) |
| 2 | Razón social, NIT, dirección, teléfono y correo (art. 50, Ley 1480) | `js/main.js` (`VENDEDOR`), `legal.html` | Victor Daniel (arquitectura web y pagos), con el grupo |
| 3 | Horario de atención | `js/main.js`, `nosotros.html`, `ubicacion.html`, `ayuda.html` | Marvin (automatización y fidelización) |
| 4 | Dirección exacta de la planta para el mapa | `ubicacion.html` (iframe) | Victor Daniel (arquitectura web y pagos) |
| 5 | ¿La planta recibe visitas o permite recoger pedidos? | `ubicacion.html` | Angie Pamela (grupo) |
| 6 | URL de Facebook, Instagram, YouTube y TikTok | `js/main.js` (`REDES`), `ayuda.html` | Brillyth (contenido) |
| 7 | ID del video publicitario de YouTube (40–50 s) | `js/main.js` (`YOUTUBE_VIDEO_ID`) | Brillyth (contenido) |
| 8 | Video corto de receta y otros videos | `js/main.js` (`YOUTUBE_VIDEO_RECETA_ID`), `preparar.html` | Brillyth (contenido) |
| 9 | Historia completa de la empresa | `nosotros.html` | Angie Pamela (grupo) |
| 10 | Fotos del equipo (los roles ya están en `nosotros.html`) | `nosotros.html` | Angie Pamela (grupo) |
| 11 | Finca, familia, variedad, proceso, notas de cata, fecha de tostado y lote | `js/productos.js` (`CATALOGO.origen`) | Brillyth (contenido), con el tostador |
| 12 | Tabla de lotes para la trazabilidad por QR | `js/main.js` (`PAGINAS.origen`), `origen.html` | Victor Daniel (arquitectura web y pagos) |
| 13 | Nombres e historias de las familias, con su autorización | `origen.html` | Brillyth (contenido) |
| 14 | Vida útil del café sin abrir | `js/main.js` (FAQ de la ficha), `ayuda.html` | Angie Pamela (grupo), con el tostador |
| 15 | Proporciones de greca, goteo y prensa francesa | `preparar.html` | Brillyth (contenido) |
| 16 | Kits: nombre, composición y precio | `js/productos.js` (`CATALOGO.kits`), `kits.html` | Angie Pamela (grupo) |
| 17 | Tarifa de envío, tiempos de entrega y transportadora | `js/productos.js` (`CATALOGO.envio`), `logistica.html`, `legal.html`, `ayuda.html`, `club.html` | Victor Daniel (arquitectura web y pagos) |
| 18 | Ciudades con contra entrega | `js/productos.js`, `ayuda.html`, `legal.html` | Victor Daniel (arquitectura web y pagos) |
| 19 | Régimen de IVA del café tostado | `js/productos.js` (`CATALOGO.impuestos`), `tienda.html`, `ayuda.html`, `legal.html` | Angie Pamela (grupo), con un contador |
| 20 | Pasarela de pagos y logos oficiales de los medios de pago | `index.html`, `ayuda.html`, `js/main.js` (paso 4) | Victor Daniel (arquitectura web y pagos) |
| 21 | Aplicación de suscripciones y condiciones de cobro recurrente | `club.html`, `legal.html` | Marvin (automatización y fidelización) |
| 22 | ¿Se acumulan BIENVENIDA10 y el 10 % del Club? Vigencia del cupón | `club.html`, `legal.html` | Marvin (automatización y fidelización) |
| 23 | Plataforma de cuentas (inicio de sesión real) | `cuenta.html` | Victor Daniel (arquitectura web y pagos) |
| 24 | Infografía o póster de email marketing | `novedades.html` | Marvin (automatización y fidelización) |
| 25 | Plazo para reportar productos dañados | `legal.html#devoluciones` | Angie Pamela (grupo) |
| 26 | Condiciones del retracto para alimentos (revisión legal) | `legal.html#retracto` | Angie Pamela (grupo) |
| 27 | Fecha de última actualización de las políticas | `legal.html` | Angie Pamela (grupo) |
| 28 | Fotos reales: familia, finca, bolsa abierta, preparación, kits e inicios | `index.html`, `origen.html`, `preparar.html`, `kits.html`, `nosotros.html`, ficha de producto (`js/main.js`) | Brillyth (contenido) |
| 29 | Logotipo definitivo | `img/logo.svg`, `img/favicon.svg` | Angie Pamela (grupo), diseño |
| 30 | URL de GitHub Pages para `og:url` y `og:image` absolutas | `<head>` de cada página | Victor Daniel (arquitectura web y pagos) |

---

## 3. Contradicciones encontradas (sin resolver; las decide el equipo)

- **a. Duración del video. RESUELTA (4 nov.):** la Entrega 2 v2 ya describe un video de 45 s publicado en YouTube, con el guion reajustado.
- **b. Plataforma. RESUELTA (4 nov.):** la Entrega 2 v2 aclara en el capítulo 8 que Shopify es el presupuesto del lanzamiento comercial y que la versión del curso usa una plataforma gratuita. El capítulo 9 (entrega final) debe justificar GitHub Pages.
- **c. Precios de la hoja de cálculo.** La propia Entrega 2 advierte que la hoja de cálculo usa 500 g a $23.214 y 250 g a $10.400. El sitio usa los precios de la tabla 7.3 y del portafolio: $18.000, $33.000 y $60.000.
- **d. Una versión anterior del prompt** (dentro de `cafe-raices-web.zip`) pedía Canva, Figma, Drive, imágenes WebP y aprobar el logotipo antes de usarlo. Se siguió la versión del chat: empaque en PNG y logotipo de texto provisional.

---

## 4. Decisiones tomadas

- **Respuesta en 15 minutos.** Se agregó «en horario de atención», como dicen la Entrega 2 y el portafolio, para no prometer atención las 24 horas.
- **Video.** El mismo video publicitario aparece en el inicio (como pide el prompt), en «Nuestro origen» (como dice la Entrega 2) y en «Aprende a preparar». El ID está en una sola constante.
- **Envío e IVA.** No hay tarifa ni régimen de IVA. El checkout muestra «Envío: [POR CONFIRMAR]» y «Total (sin envío)». Cuando exista la tarifa, basta poner el número en `CATALOGO.envio.costo` y se sumará sola.
- **Kits.** Quedaron como tarjetas [POR CONFIRMAR] con botón de WhatsApp, porque la Entrega 2 no define su composición.
- **BIENVENIDA10.** Funciona en el carrito y aplica 10 % sobre el subtotal. El precio del Club se calcula solo: $16.200, $29.700 y $54.000.
- **Reseñas.** No se usa la etiqueta «Cliente verificado» del wireframe, porque las reseñas de demostración no se verifican. Arrancan vacías con el mensaje «Sé el primero en opinar».
- **Medios de pago.** Se muestran como etiquetas de texto, no con logos de marcas, hasta tener los logos oficiales de la pasarela.
- **Menú.** Tiene 7 enlaces: las 6 secciones del mapa 7.9 más Nosotros. «Mi cuenta» y el carrito van como íconos. Se muestra horizontal desde 1140 px y como menú desplegable en pantallas más pequeñas. Se omitió la lupa de búsqueda del wireframe porque solo hay 3 productos.
- **Quiz.** Tiene 4 preguntas, como el mapa 7.9: método, tazas al día, para quién y qué busca. No pregunta por sabor porque no hay notas de cata.
- **Recetas.** Las de olla y de una taza vienen del prototipo y del correo de bienvenida. Las de greca, goteo y prensa son guías generales, marcadas para que el equipo las valide.
- **Logotipo.** Es un SVG de texto. Al usarse como `<img>`, el navegador no carga Lora dentro del SVG y muestra Georgia. Se arregla al reemplazarlo por el logotipo real.
- **Cookies.** El sitio no usa cookies no esenciales. El banner guarda la elección y `cargarNoEsenciales()` en `js/main.js` es el lugar para agregar analítica en el futuro.
- **Retracto.** El texto sigue el art. 47 de la Ley 1480 de 2011 (5 días hábiles, devolución del dinero en máximo 30 días). Queda marcado para revisión legal en el caso de alimentos.

---

## 5. Pendiente o simplificado

- **Pagos reales:** conectar Wompi o Mercado Pago. Está comentado en `js/main.js`, en el paso 4 del checkout. Mercado Pago necesita un backend o una función serverless.
- **Formularios:** conectar Formspree, o el formulario de Brevo o Mailchimp para el boletín. Está comentado en `activarFormularios()`.
- **Reseñas reales:** hoy viven en el `localStorage` de cada navegador. Para producción hace falta una app de reseñas o un backend.
- **Cuenta y suscripción reales:** hoy son simuladas en `localStorage`.
- **Mapa de Google Maps:** el iframe está en `ubicacion.html`. En la prueba local se hizo la petición, pero el navegador interno usado para probar no dibujó el mapa. **Hay que comprobarlo en Chrome o Edge** una vez publicado. Se agregó un enlace «Abrir en Google Maps» como respaldo.
- **Imágenes:** solo existe `img/empaque.png` (514 × 415 px). El 4 de noviembre se recortó una bolsa por presentación (`img/bolsa-kilo.png`, `bolsa-libra.png` y `bolsa-media-libra.png`, 300 × 411 px, a la misma escala) para que cada ficha muestre su propio tamaño. Cuando haya fotos reales, conviene comprimirlas, por ejemplo en WebP, e indicar `width` y `height`.
- **Recordatorio de recompra a 25 días:** en el sitio solo hay una casilla de preferencia. El envío real lo haría la herramienta de correo.
- **Revisión de accesibilidad con lector de pantalla:** solo se revisaron el teclado, las etiquetas y el contraste de forma manual.

---

## 6. Pruebas hechas (4 de noviembre de 2026, servidor local)

- **Las 16 páginas** cargan sin errores en la consola, con encabezado, pie, chat y WhatsApp, y sin scroll horizontal a 360 px.
- **Ficha de producto:**
  - Cambia de presentación sin recargar y conserva la molienda.
  - El mensaje de WhatsApp se arma con la presentación, la molienda y la cantidad.
  - «Agregar al carrito» actualiza el contador.
- **Reseñas:** valida los campos, guarda la reseña, calcula el promedio y arranca en «Sé el primero en opinar».
- **Checkout:**
  - Cambia cantidades y rechaza un cupón inválido.
  - Aplica BIENVENIDA10.
  - Valida los datos y el celular.
  - Las casillas de términos y de datos empiezan sin marcar y son obligatorias.
  - El resumen muestra los datos del vendedor.
  - El mensaje de WhatsApp lleva productos, molienda, cantidades, total, nombre, ciudad y medio de pago.
  - Al confirmar, guarda el pedido en Mi cuenta y vacía el carrito.
- **Quiz:** recomienda la presentación y la molienda, y su botón agrega al carrito.
- **Chat:** responde con botones y, cuando no sabe, pasa a WhatsApp. No tapa el botón de WhatsApp.
- **Mi cuenta:** muestra los pedidos y permite repetirlos. El Club Raíces se puede crear, pausar, cambiar de frecuencia y cancelar con confirmación en la página.
- **Formulario de contacto:** muestra los mensajes de error y la confirmación en pantalla.
