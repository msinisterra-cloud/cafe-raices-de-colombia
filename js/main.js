/* =====================================================================
   main.js — Café Raíces de Colombia
   Inserta en TODAS las páginas: encabezado, pie, chat automático,
   botón de WhatsApp y banner de cookies. Además maneja el carrito,
   el checkout, las reseñas, el quiz, Mi cuenta y los formularios.
   Requiere js/productos.js (cargarlo antes que este archivo).

   Índice
     1. Configuración (WhatsApp, video, vendedor, redes)
     2. Utilidades
     3. Encabezado
     4. Pie de página
     5. Botón de WhatsApp y chat con respuestas automáticas
     6. Banner de cookies
     7. Carrito (localStorage)
     8. Formularios (validación y mensajes)
     9. Videos de YouTube
    10. Reseñas y calificación
    11. Páginas: inicio, tienda, producto, quiz, carrito, cuenta, club, origen
    12. Arranque
   ===================================================================== */

/* ---------- 1. Configuración ---------- */

// Número de WhatsApp de la tienda: ÚNICO lugar donde se escribe.
// Formato: código de país + número, sin espacios ni signos. Ejemplo: "573001234567".
const WHATSAPP_NUMERO = "[POR CONFIRMAR]";

// ID del video publicitario de YouTube (40-50 s). Es lo que va después de "watch?v=".
// Ejemplo: para https://www.youtube.com/watch?v=abcdefghijk el ID es "abcdefghijk".
const YOUTUBE_VIDEO_ID = "[POR CONFIRMAR]";
// Video corto de preparación ("café colado en 3 pasos"), opcional.
const YOUTUBE_VIDEO_RECETA_ID = "[POR CONFIRMAR]";

// Información del vendedor exigida por el art. 50 de la Ley 1480 de 2011.
const VENDEDOR = {
  razonSocial: "[POR CONFIRMAR razón social]",
  nit: "[POR CONFIRMAR NIT]",
  direccion: "[POR CONFIRMAR dirección]",
  ciudad: "Popayán, Cauca, Colombia",
  telefono: "[POR CONFIRMAR teléfono]",
  correo: "[POR CONFIRMAR correo]",
  horario: "[POR CONFIRMAR horario de atención]"
};

// Redes sociales (Entrega 2, tabla 10.3). Reemplazar "#" por la URL real.
const REDES = [
  { nombre: "Facebook", url: "#", pendiente: true },
  { nombre: "Instagram", url: "#", pendiente: true },
  { nombre: "YouTube", url: "#", pendiente: true },
  { nombre: "TikTok", url: "#", pendiente: true }
];

const ESLOGAN = "De nuestras raíces a tu taza";

(function () {
  "use strict";

  /* ---------- 2. Utilidades ---------- */

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const precio = (v) => CATALOGO.formatear(v);

  // Escapa texto antes de insertarlo como HTML (evita inyección desde formularios o localStorage)
  function esc(texto) {
    return String(texto == null ? "" : texto)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // Escapa y resalta en amarillo cualquier "[POR CONFIRMAR ...]"
  function marcar(texto) {
    return esc(texto).replace(/\[POR CONFIRMAR[^\]]*\]/g, (m) => `<span class="pendiente">${m}</span>`);
  }
  const esPendiente = (v) => /POR CONFIRMAR/.test(String(v));

  // localStorage siempre dentro de try/catch (modo privado o almacenamiento bloqueado)
  const almacen = {
    leer(clave, porDefecto) {
      try {
        const v = localStorage.getItem(clave);
        return v === null ? porDefecto : JSON.parse(v);
      } catch (e) { return porDefecto; }
    },
    guardar(clave, valor) {
      try { localStorage.setItem(clave, JSON.stringify(valor)); return true; } catch (e) { return false; }
    },
    borrar(clave) {
      try { localStorage.removeItem(clave); } catch (e) { /* sin almacenamiento */ }
    }
  };

  // Enlace de WhatsApp. Mientras el número no esté confirmado, wa.me abre WhatsApp
  // para que la persona elija el contacto (el mensaje igual queda escrito).
  function enlaceWhatsApp(texto) {
    const numero = String(WHATSAPP_NUMERO).replace(/\D/g, "");
    const base = numero.length >= 10 ? `https://wa.me/${numero}` : "https://wa.me/";
    return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
  }

  // Aviso flotante dentro de la página (reemplaza alert()).
  let temporizadorAviso;
  function avisar(mensaje, enlace) {
    let caja = $("#aviso-flotante");
    if (!caja) {
      caja = document.createElement("div");
      caja.id = "aviso-flotante";
      caja.className = "aviso-flotante";
      caja.setAttribute("role", "status");
      caja.setAttribute("aria-live", "polite");
      document.body.appendChild(caja);
    }
    caja.innerHTML = esc(mensaje) + (enlace ? ` <a href="${enlace.href}">${esc(enlace.texto)}</a>` : "");
    caja.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => caja.classList.remove("visible"), 4000);
  }

  const parametro = (nombre) => new URLSearchParams(location.search).get(nombre);
  const fechaCorta = (iso) => new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

  // Íconos SVG en línea (sin librerías externas)
  const ICONOS = {
    carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    cuenta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9h8M8 12h5" stroke-linecap="round"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3z"/></svg>'
  };

  /* ---------- 3. Encabezado ---------- */

  const MENU = [
    { href: "tienda.html", texto: "Tienda", pagina: "tienda" },
    { href: "club.html", texto: "Club Raíces", pagina: "club" },
    { href: "quiz.html", texto: "Encuentra tu café", pagina: "quiz" },
    { href: "origen.html", texto: "Nuestro origen", pagina: "origen" },
    { href: "preparar.html", texto: "Aprende a preparar", pagina: "preparar" },
    { href: "nosotros.html", texto: "Nosotros", pagina: "nosotros" },
    { href: "ayuda.html", texto: "Ayuda", pagina: "ayuda" }
  ];

  function insertarEncabezado() {
    const pagina = document.body.dataset.pagina || "";
    const enlaces = MENU.map((m) =>
      `<li><a href="${m.href}"${m.pagina === pagina ? ' aria-current="page"' : ""}>${m.texto}</a></li>`).join("");

    const saltar = document.createElement("a");
    saltar.className = "saltar";
    saltar.href = "#contenido";
    saltar.textContent = "Saltar al contenido";

    const header = document.createElement("header");
    header.className = "encabezado";
    header.innerHTML = `
      <div class="contenedor">
        <a class="logo" href="index.html" aria-label="Café Raíces de Colombia, ir al inicio">
          <img src="img/logo.svg" alt="Café Raíces de Colombia" width="168" height="34">
        </a>
        <nav class="nav-principal" id="nav-principal" aria-label="Menú principal"><ul>${enlaces}</ul></nav>
        <div class="acciones-encabezado">
          <a class="boton-icono" href="cuenta.html" aria-label="Mi cuenta">${ICONOS.cuenta}</a>
          <a class="boton-icono" href="carrito.html" aria-label="Carrito de compras">
            ${ICONOS.carrito}<span class="contador-carrito" id="contador-carrito" hidden>0</span>
          </a>
          <button class="boton-icono boton-menu" type="button" aria-expanded="false" aria-controls="nav-principal" aria-label="Abrir menú">${ICONOS.menu}</button>
        </div>
      </div>`;
    document.body.prepend(header);
    document.body.prepend(saltar);

    const botonMenu = $(".boton-menu", header);
    const nav = $("#nav-principal", header);
    botonMenu.addEventListener("click", () => {
      const abierto = nav.classList.toggle("abierto");
      botonMenu.setAttribute("aria-expanded", String(abierto));
      botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("abierto")) {
        nav.classList.remove("abierto");
        botonMenu.setAttribute("aria-expanded", "false");
        botonMenu.focus();
      }
    });
    actualizarContador();
  }

  /* ---------- 4. Pie de página ---------- */

  function htmlRedes() {
    return REDES.map((r) => r.pendiente
      ? `<a href="${r.url}" aria-label="${r.nombre} (enlace por confirmar)">${r.nombre} <span class="pendiente">[POR CONFIRMAR]</span></a>`
      : `<a href="${r.url}" target="_blank" rel="noopener">${r.nombre}</a>`).join("");
  }

  function htmlVendedor() {
    return `
      <p><strong>${marcar(VENDEDOR.razonSocial)}</strong> · NIT ${marcar(VENDEDOR.nit)}</p>
      <p>${marcar(VENDEDOR.direccion)} · ${esc(VENDEDOR.ciudad)}</p>
      <p>Teléfono: ${marcar(VENDEDOR.telefono)} · WhatsApp: ${marcar(WHATSAPP_NUMERO)} · Correo: ${marcar(VENDEDOR.correo)}</p>`;
  }

  function insertarPie() {
    const pie = document.createElement("footer");
    pie.className = "pie";
    pie.innerHTML = `
      <div class="contenedor">
        <div class="pie-grid">
          <div class="pie-marca">
            <p class="nombre">Café Raíces de Colombia</p>
            <p><em>${ESLOGAN}</em></p>
            <p>Café 100 % arábica tostado en origen por familias caficultoras de Popayán, Cauca.</p>
            <h2>Síguenos</h2>
            <div class="redes">${htmlRedes()}</div>
          </div>
          <nav aria-label="Tienda"><h2>Tienda</h2><ul>
            <li><a href="tienda.html">Productos</a></li>
            <li><a href="club.html">Club Raíces</a></li>
            <li><a href="kits.html">Kits y regalos</a></li>
            <li><a href="kits.html#volumen">Ventas por volumen</a></li>
            <li><a href="quiz.html">Encuentra tu café</a></li>
          </ul></nav>
          <nav aria-label="Empresa"><h2>Empresa</h2><ul>
            <li><a href="nosotros.html">Nosotros</a></li>
            <li><a href="origen.html">Nuestro origen</a></li>
            <li><a href="ubicacion.html">Ubicación</a></li>
            <li><a href="logistica.html">Logística y envíos</a></li>
            <li><a href="novedades.html">Novedades y boletín</a></li>
            <li><a href="docs/Portafolio_Cafe_Raices_de_Colombia.pdf" download>Portafolio (PDF)</a></li>
          </ul></nav>
          <nav aria-label="Ayuda"><h2>Ayuda</h2><ul>
            <li><a href="ayuda.html#preguntas">Preguntas frecuentes</a></li>
            <li><a href="ayuda.html#contacto">Contacto</a></li>
            <li><a href="logistica.html#devoluciones">Envíos y devoluciones</a></li>
            <li><a href="cuenta.html">Mi cuenta</a></li>
            <li><a href="preparar.html">Aprende a preparar</a></li>
          </ul></nav>
          <nav aria-label="Legal"><h2>Legal</h2><ul>
            <li><a href="legal.html#terminos">Términos y condiciones</a></li>
            <li><a href="legal.html#envios">Envíos</a></li>
            <li><a href="legal.html#devoluciones">Cambios y devoluciones</a></li>
            <li><a href="legal.html#retracto">Derecho de retracto</a></li>
            <li><a href="legal.html#datos">Datos personales (Ley 1581)</a></li>
            <li><a href="legal.html#cookies">Cookies</a></li>
            <li><button type="button" class="enlace-boton" id="abrir-cookies" style="color:#F5E9D6;padding:0">Configurar cookies</button></li>
          </ul></nav>
        </div>
        <div class="pie-legal">
          <div><strong>Información del vendedor</strong> (Ley 1480 de 2011, art. 50)${htmlVendedor()}</div>
          <p>Protección al consumidor: <a href="https://www.sic.gov.co" target="_blank" rel="noopener">Superintendencia de Industria y Comercio (SIC)</a>.
             Precios en pesos colombianos (COP). Facturación electrónica DIAN.</p>
          <p>Proyecto académico del curso Comercio Electrónico · Universidad Nacional de Colombia, sede Palmira · 2026.</p>
        </div>
      </div>`;
    document.body.appendChild(pie);
    $("#abrir-cookies").addEventListener("click", () => mostrarBannerCookies(true));
  }

  /* ---------- 5. Botón de WhatsApp y chat con respuestas automáticas ---------- */

  // Respuestas del chat. Cada una puede llevar un enlace a la página con más detalle.
  const RESPUESTAS = {
    envios: {
      pregunta: "Envíos",
      texto: `Despachamos desde nuestra planta en Popayán con una transportadora nacional. Recibes el número de guía por correo y WhatsApp para seguir tu pedido. Tarifas: ${CATALOGO.envio.texto}. Tiempos: ${CATALOGO.envio.tiempos}.`,
      enlace: { href: "logistica.html", texto: "Ver cómo enviamos" }
    },
    pagos: {
      pregunta: "Pagos",
      texto: "Puedes pagar con Nequi, Daviplata, PSE, tarjeta o contra entrega (donde la transportadora lo permita).",
      enlace: { href: "ayuda.html#pagos", texto: "Ver medios de pago" }
    },
    club: {
      pregunta: "Club Raíces",
      texto: "Con el Club Raíces recibes tu café cada 15 o 30 días con 10 % de descuento. Lo pausas o lo cancelas desde tu cuenta cuando quieras.",
      enlace: { href: "club.html", texto: "Conocer el Club" }
    },
    preparar: {
      pregunta: "Cómo preparar",
      texto: "No necesitas cafetera: calienta una taza de agua, agrega 2 cucharadas de café molido, deja reposar 4 minutos y cuela. Así de fácil.",
      enlace: { href: "preparar.html", texto: "Ver recetas" }
    },
    precios: {
      pregunta: "Precios",
      texto: CATALOGO.productos.map((p) => `${p.presentacion} (${p.peso}): ${precio(p.precio)}`).join(" · ") + ". En grano o molido. El envío se suma aparte.",
      enlace: { href: "tienda.html", texto: "Ir a la tienda" }
    },
    devoluciones: {
      pregunta: "Devoluciones",
      texto: "Si tu pedido llega dañado, te lo reponemos o te devolvemos el dinero. También tienes derecho de retracto dentro de los 5 días hábiles siguientes a la entrega.",
      enlace: { href: "legal.html#devoluciones", texto: "Ver la política" }
    },
    persona: {
      pregunta: "Hablar con una persona",
      texto: `Te atendemos por WhatsApp. Respondemos en menos de 15 minutos en horario de atención (${VENDEDOR.horario}).`,
      whatsapp: "Hola, Café Raíces. Quiero hablar con una persona."
    }
  };
  // Palabras clave para lo que la persona escribe en el chat
  const PALABRAS = [
    { clave: "envios", re: /env[ií]o|domicil|gu[ií]a|transport|lleg|demora|tiempo/i },
    { clave: "pagos", re: /pag|nequi|daviplata|pse|tarjeta|contra ?entrega|efectivo/i },
    { clave: "club", re: /club|suscrip|membres|cada 15|cada 30/i },
    { clave: "preparar", re: /prepar|cafetera|receta|olla|colad|greca|molid|grano/i },
    { clave: "precios", re: /precio|cu[aá]nto|valor|cuesta|libra|kilo/i },
    { clave: "devoluciones", re: /devol|retract|cambio|reembols|da[ñn]ad/i },
    { clave: "persona", re: /persona|asesor|humano|whatsapp|hablar/i }
  ];

  function insertarFlotantes() {
    // Botón flotante de WhatsApp (abajo a la derecha)
    const wa = document.createElement("a");
    wa.className = "flotante-whatsapp";
    wa.href = enlaceWhatsApp("Hola, Café Raíces. Quiero hacer una pregunta.");
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.setAttribute("aria-label", "Escribir por WhatsApp (se abre en otra pestaña)");
    wa.innerHTML = ICONOS.whatsapp;

    // Botón del chat (encima del de WhatsApp, para no taparse)
    const botonChat = document.createElement("button");
    botonChat.type = "button";
    botonChat.className = "flotante-chat";
    botonChat.setAttribute("aria-label", "Abrir chat de ayuda");
    botonChat.setAttribute("aria-expanded", "false");
    botonChat.setAttribute("aria-controls", "panel-chat");
    botonChat.innerHTML = ICONOS.chat;

    const panel = document.createElement("section");
    panel.className = "panel-chat";
    panel.id = "panel-chat";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Chat de ayuda de Café Raíces");
    panel.innerHTML = `
      <header><strong>Café Raíces · Ayuda</strong><button type="button" aria-label="Cerrar chat">×</button></header>
      <div class="chat-mensajes" aria-live="polite"></div>
      <div class="chat-opciones"></div>
      <form class="chat-entrada" autocomplete="off">
        <label class="visualmente-oculto" for="chat-texto">Escribe tu pregunta</label>
        <input id="chat-texto" type="text" placeholder="Escribe tu pregunta…" maxlength="200">
        <button class="boton boton-primario boton-pequeno" type="submit">Enviar</button>
      </form>`;

    document.body.append(panel, botonChat, wa);

    const mensajes = $(".chat-mensajes", panel);
    const opciones = $(".chat-opciones", panel);
    let iniciado = false;

    function burbuja(html, deUsuario) {
      const b = document.createElement("div");
      b.className = "burbuja " + (deUsuario ? "burbuja-usuario" : "burbuja-bot");
      b.innerHTML = html;
      mensajes.appendChild(b);
      mensajes.scrollTop = mensajes.scrollHeight;
    }
    function responder(clave) {
      const r = RESPUESTAS[clave];
      let html = marcar(r.texto);
      if (r.enlace) html += `<br><a href="${r.enlace.href}">${esc(r.enlace.texto)} →</a>`;
      if (r.whatsapp) html += `<br><a href="${enlaceWhatsApp(r.whatsapp)}" target="_blank" rel="noopener">Abrir WhatsApp →</a>`;
      burbuja(html);
    }
    function pintarOpciones() {
      opciones.innerHTML = ["envios", "pagos", "club", "preparar", "persona"]
        .map((c) => `<button type="button" data-clave="${c}">${RESPUESTAS[c].pregunta}</button>`).join("");
    }
    function abrir() {
      panel.hidden = false;
      botonChat.setAttribute("aria-expanded", "true");
      botonChat.setAttribute("aria-label", "Cerrar chat de ayuda");
      if (!iniciado) {
        burbuja("¡Hola! 👋 Soy el asistente de Café Raíces. Elige un tema o escribe tu pregunta. Si no sé la respuesta, te paso con una persona por WhatsApp.");
        pintarOpciones();
        iniciado = true;
      }
      $("#chat-texto").focus();
    }
    function cerrar() {
      panel.hidden = true;
      botonChat.setAttribute("aria-expanded", "false");
      botonChat.setAttribute("aria-label", "Abrir chat de ayuda");
      botonChat.focus();
    }

    botonChat.addEventListener("click", () => (panel.hidden ? abrir() : cerrar()));
    $("header button", panel).addEventListener("click", cerrar);
    panel.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
    opciones.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-clave]");
      if (!b) return;
      burbuja(esc(b.textContent), true);
      responder(b.dataset.clave);
    });
    $(".chat-entrada", panel).addEventListener("submit", (e) => {
      e.preventDefault();
      const campo = $("#chat-texto");
      const texto = campo.value.trim();
      if (!texto) return;
      burbuja(esc(texto), true);
      campo.value = "";
      const encontrada = PALABRAS.find((p) => p.re.test(texto));
      if (encontrada) {
        responder(encontrada.clave);
      } else {
        // No sabe la respuesta: pasa a WhatsApp con la pregunta ya escrita
        burbuja(`No tengo esa respuesta todavía. Te paso con una persona del equipo: <br><a href="${enlaceWhatsApp("Hola, Café Raíces. Tengo esta pregunta: " + texto)}" target="_blank" rel="noopener">Continuar por WhatsApp →</a>`);
      }
    });
  }

  /* ---------- 6. Banner de cookies ---------- */
  // El sitio hoy solo usa almacenamiento esencial (carrito, preferencias).
  // Si más adelante se agrega analítica (p. ej. Google Analytics) o píxel de Meta,
  // cargarla SOLO cuando el consentimiento sea "todas" (ver función cargarNoEsenciales).

  function cargarNoEsenciales() {
    // AQUÍ se cargarían los scripts de analítica o publicidad, si se agregan.
  }

  function mostrarBannerCookies(forzar) {
    const elegido = almacen.leer("cookies-consentimiento", null);
    if (elegido && !forzar) {
      if (elegido === "todas") cargarNoEsenciales();
      return;
    }
    let banner = $("#banner-cookies");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "banner-cookies";
      banner.className = "banner-cookies";
      banner.setAttribute("role", "region");
      banner.setAttribute("aria-label", "Aviso de cookies");
      banner.innerHTML = `
        <p>Usamos almacenamiento esencial para que funcionen el carrito y tus preferencias. Con tu permiso, también usaríamos cookies de medición para mejorar el sitio. <a href="legal.html#cookies">Más información</a></p>
        <div class="grupo-botones">
          <button type="button" class="boton boton-secundario boton-pequeno" data-cookies="esenciales">Rechazar no esenciales</button>
          <button type="button" class="boton boton-primario boton-pequeno" data-cookies="todas">Aceptar todas</button>
        </div>`;
      document.body.appendChild(banner);
      banner.addEventListener("click", (e) => {
        const b = e.target.closest("[data-cookies]");
        if (!b) return;
        almacen.guardar("cookies-consentimiento", b.dataset.cookies);
        banner.hidden = true;
        if (b.dataset.cookies === "todas") cargarNoEsenciales();
        avisar("Guardamos tu preferencia de cookies.");
      });
    }
    banner.hidden = false;
  }

  /* ---------- 7. Carrito (localStorage) ---------- */
  // Cada línea: { id, molienda, cantidad }. La clave de línea es id|molienda.

  const Carrito = {
    leer() { return almacen.leer("carrito", []).filter((l) => CATALOGO.buscar(l.id)); },
    guardar(lineas) { almacen.guardar("carrito", lineas); actualizarContador(); },
    agregar(id, molienda, cantidad) {
      const lineas = Carrito.leer();
      const linea = lineas.find((l) => l.id === id && l.molienda === molienda);
      if (linea) linea.cantidad = Math.min(99, linea.cantidad + cantidad);
      else lineas.push({ id, molienda, cantidad: Math.min(99, cantidad) });
      Carrito.guardar(lineas);
      const p = CATALOGO.buscar(id);
      avisar(`Agregaste ${cantidad} × ${p.presentacion} ${CATALOGO.molienda(molienda).nombre.toLowerCase()} al carrito.`, { href: "carrito.html", texto: "Ver carrito" });
    },
    cambiar(id, molienda, cantidad) {
      const lineas = Carrito.leer();
      const linea = lineas.find((l) => l.id === id && l.molienda === molienda);
      if (linea) linea.cantidad = Math.max(1, Math.min(99, cantidad || 1));
      Carrito.guardar(lineas);
    },
    quitar(id, molienda) { Carrito.guardar(Carrito.leer().filter((l) => !(l.id === id && l.molienda === molienda))); },
    vaciar() { Carrito.guardar([]); },
    unidades() { return Carrito.leer().reduce((s, l) => s + l.cantidad, 0); },
    subtotal() { return Carrito.leer().reduce((s, l) => s + CATALOGO.buscar(l.id).precio * l.cantidad, 0); },
    // Totales con cupón y envío. El envío queda null mientras no haya tarifa confirmada.
    totales() {
      const subtotal = Carrito.subtotal();
      const codigo = almacen.leer("cupon", null);
      const cupon = codigo ? CATALOGO.promociones.cupones[codigo] : null;
      const descuento = cupon ? Math.round(subtotal * cupon.descuento) : 0;
      const envio = typeof CATALOGO.envio.costo === "number" ? CATALOGO.envio.costo : null;
      return { subtotal, codigo: cupon ? codigo : null, descuento, envio, total: subtotal - descuento + (envio || 0) };
    }
  };

  function actualizarContador() {
    const c = $("#contador-carrito");
    if (!c) return;
    const n = Carrito.unidades();
    c.textContent = n;
    c.hidden = n === 0;
    c.parentElement.setAttribute("aria-label", n ? `Carrito de compras, ${n} productos` : "Carrito de compras, vacío");
  }

  /* ---------- 8. Formularios (validación y mensajes) ---------- */
  // Todos los formularios usan novalidate + esta validación, para mostrar
  // mensajes claros en español dentro de la página (sin alert()).

  function mensajeError(campo) {
    const v = campo.validity;
    if (v.valueMissing) return campo.type === "checkbox" ? "Debes marcar esta casilla para continuar." :
      (campo.type === "radio" ? "Elige una opción." : "Este campo es obligatorio.");
    if (v.typeMismatch && campo.type === "email") return "Escribe un correo válido, por ejemplo nombre@correo.com.";
    if (v.patternMismatch) return campo.dataset.error || "Revisa el formato de este campo.";
    if (v.tooShort) return `Escribe al menos ${campo.minLength} caracteres.`;
    if (v.rangeUnderflow || v.rangeOverflow) return `El valor debe estar entre ${campo.min} y ${campo.max}.`;
    return "Revisa este campo.";
  }

  function limpiarError(campo) {
    campo.removeAttribute("aria-invalid");
    const err = document.getElementById("error-" + (campo.id || campo.name));
    if (err) err.remove();
  }

  function validarFormulario(form) {
    let primero = null;
    const vistos = new Set();
    $$("input, select, textarea", form).forEach((campo) => {
      if (!campo.willValidate) return;
      if (campo.type === "radio") {
        if (vistos.has(campo.name)) return;
        vistos.add(campo.name);
      }
      limpiarError(campo);
      if (!campo.checkValidity()) {
        campo.setAttribute("aria-invalid", "true");
        const err = document.createElement("p");
        err.className = "error-campo";
        err.id = "error-" + (campo.id || campo.name);
        err.textContent = mensajeError(campo);
        const ancla = campo.closest(".casilla, fieldset, .campo") || campo;
        ancla.appendChild(err);
        campo.setAttribute("aria-describedby", err.id);
        if (!primero) primero = campo;
      }
    });
    if (primero) primero.focus();
    return !primero;
  }

  function mostrarMensaje(form, html, tipo) {
    let caja = $(".mensaje-formulario", form);
    if (!caja) {
      caja = document.createElement("div");
      caja.className = "mensaje-formulario";
      caja.setAttribute("role", "status");
      caja.setAttribute("aria-live", "polite");
      form.appendChild(caja);
    }
    caja.className = "mensaje-formulario " + (tipo === "error" ? "mensaje-error" : "mensaje-ok");
    caja.innerHTML = html;
    caja.setAttribute("tabindex", "-1");
    caja.focus();
  }

  // Manejadores por tipo de formulario (atributo data-formulario en el <form>)
  const MANEJADORES = {
    boletin(form) {
      mostrarMensaje(form, "¡Listo! Te damos la bienvenida a Café Raíces. Tu código <strong>BIENVENIDA10</strong> te da 10 % de descuento en tu primera compra: escríbelo en el carrito.");
    },
    contacto(form, datos) {
      const texto = `Hola, Café Raíces. Soy ${datos.get("nombre")}. ${datos.get("mensaje")}`;
      mostrarMensaje(form, `Recibimos tu mensaje, ${esc(datos.get("nombre"))}. Te responderemos pronto. Si es urgente, <a href="${enlaceWhatsApp(texto)}" target="_blank" rel="noopener">escríbenos por WhatsApp</a>.`);
    },
    cotizacion(form, datos) {
      const texto = `Hola, Café Raíces. Quiero una cotización por volumen.\nEmpresa: ${datos.get("empresa")}\nTipo de negocio: ${datos.get("tipo")}\nCiudad: ${datos.get("ciudad")}\nPresentación: ${datos.get("presentacion")}\nCantidad aproximada al mes: ${datos.get("cantidad")}\nContacto: ${datos.get("nombre")} · ${datos.get("telefono")}`;
      mostrarMensaje(form, `Recibimos tu solicitud de cotización. Te contactaremos por correo o WhatsApp. Si quieres agilizarla, <a href="${enlaceWhatsApp(texto)}" target="_blank" rel="noopener">envíala también por WhatsApp</a>.`);
    }
  };

  function activarFormularios() {
    $$("form[data-formulario]").forEach((form) => {
      form.setAttribute("novalidate", "");
      form.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid")) limpiarError(e.target); });
      form.addEventListener("change", (e) => { if (e.target.getAttribute("aria-invalid")) limpiarError(e.target); });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validarFormulario(form)) {
          mostrarMensaje(form, "Revisa los campos marcados.", "error");
          return;
        }
        const datos = new FormData(form);
        /* FORMSPREE: para recibir estos formularios por correo:
           1) Crear un formulario gratis en https://formspree.io y copiar su URL.
           2) En el <form> poner action="https://formspree.io/f/XXXXXXXX" method="POST".
           3) Descomentar este envío:
           fetch(form.action, { method: "POST", body: datos, headers: { Accept: "application/json" } })
             .then((r) => r.ok ? MANEJADORES[tipo](form, datos) : mostrarMensaje(form, "No pudimos enviar el formulario. Intenta de nuevo.", "error"));
        */
        const tipo = form.dataset.formulario;
        if (MANEJADORES[tipo]) MANEJADORES[tipo](form, datos);
        $$("input:not([type=radio]):not([type=checkbox]), textarea", form).forEach((c) => { if (c.type !== "hidden") c.value = ""; });
        $$("input[type=checkbox]", form).forEach((c) => { c.checked = false; });
      });
    });
  }

  /* ---------- 9. Videos de YouTube ---------- */
  // <div class="marco-16x9" data-video="publicitario"></div> o data-video="receta"

  function insertarVideos() {
    const VIDEOS = {
      publicitario: { id: YOUTUBE_VIDEO_ID, titulo: "Video publicitario de Café Raíces de Colombia", pendiente: "Video publicitario (40-50 s) — enlace por confirmar" },
      receta: { id: YOUTUBE_VIDEO_RECETA_ID, titulo: "Cómo preparar café colado sin cafetera", pendiente: "Video corto «café colado en 3 pasos» — enlace por confirmar" }
    };
    $$("[data-video]").forEach((caja) => {
      const v = VIDEOS[caja.dataset.video];
      if (!v) return;
      if (/^[\w-]{11}$/.test(v.id)) {
        caja.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}" title="${esc(v.titulo)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
      } else {
        caja.innerHTML = `<div class="video-pendiente"><div><div class="icono-play" aria-hidden="true">▶</div><p><strong>${esc(v.pendiente)}</strong></p><p><span class="pendiente">[POR CONFIRMAR ID de YouTube]</span></p></div></div>`;
      }
    });
  }

  /* ---------- 10. Reseñas y calificación ---------- */
  // Se guardan en localStorage SOLO como demostración (cada navegador ve las suyas).
  // Arrancan vacías: no se precargan reseñas. Para producción, usar una app de
  // reseñas o un backend (ver NOTAS.md).

  const leerResenas = (id) => almacen.leer("resenas-" + id, []);
  const estrellasTexto = (n) => "★★★★★".slice(0, Math.round(n)) + "☆☆☆☆☆".slice(0, 5 - Math.round(n));

  function htmlResena(r, conProducto) {
    const p = conProducto ? CATALOGO.buscar(r.producto) : null;
    return `<article class="resena">
      <span class="estrellas" aria-label="${r.estrellas} de 5 estrellas">${estrellasTexto(r.estrellas)}</span>
      <p>${esc(r.comentario)}</p>
      <p class="meta">${esc(r.nombre)} · ${fechaCorta(r.fecha)}${p ? " · " + esc(p.presentacion) : ""}</p>
    </article>`;
  }

  function renderResenas(contenedor, id) {
    const lista = leerResenas(id);
    const promedio = lista.length ? lista.reduce((s, r) => s + r.estrellas, 0) / lista.length : 0;
    const uid = "res-" + id;
    contenedor.innerHTML = `
      <div class="resumen-resenas">
        ${lista.length
          ? `<span class="estrellas" aria-hidden="true">${estrellasTexto(promedio)}</span><strong>${promedio.toFixed(1).replace(".", ",")} de 5</strong><span class="suave">(${lista.length} ${lista.length === 1 ? "opinión" : "opiniones"})</span>`
          : ""}
      </div>
      <div class="lista-resenas">
        ${lista.length ? lista.slice().reverse().map((r) => htmlResena(r)).join("")
          : `<div class="sin-resenas"><p><strong>Sé el primero en opinar</strong></p><p class="suave" style="margin:0">Todavía no hay reseñas de este producto.</p></div>`}
      </div>
      <form class="tarjeta formulario" id="form-${uid}" novalidate>
        <h3>Deja tu opinión</h3>
        <fieldset class="campo">
          <legend>Tu calificación</legend>
          <div class="selector-estrellas">
            ${[5, 4, 3, 2, 1].map((n) => `<input type="radio" id="${uid}-e${n}" name="estrellas" value="${n}" required><label for="${uid}-e${n}" title="${n} de 5"><span aria-hidden="true">★</span><span class="visualmente-oculto">${n} ${n === 1 ? "estrella" : "estrellas"}</span></label>`).join("")}
          </div>
        </fieldset>
        <div class="campo"><label for="${uid}-nombre">Tu nombre</label><input id="${uid}-nombre" name="nombre" type="text" required maxlength="40" autocomplete="given-name"></div>
        <div class="campo"><label for="${uid}-comentario">Tu comentario</label><textarea id="${uid}-comentario" name="comentario" required minlength="10" maxlength="500"></textarea></div>
        <p class="aviso-demo">Versión de demostración: tu reseña se guarda solo en este navegador. Al publicarla aceptas que se muestre tu nombre y comentario.</p>
        <div><button class="boton boton-primario" type="submit">Publicar reseña</button></div>
      </form>`;

    const form = $("#form-" + uid, contenedor);
    form.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid")) limpiarError(e.target); });
    form.addEventListener("change", (e) => { if (e.target.name === "estrellas") $$("[name=estrellas]", form).forEach(limpiarError); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validarFormulario(form)) { mostrarMensaje(form, "Revisa los campos marcados.", "error"); return; }
      const d = new FormData(form);
      const nuevas = leerResenas(id);
      nuevas.push({ producto: id, estrellas: Number(d.get("estrellas")), nombre: d.get("nombre").trim(), comentario: d.get("comentario").trim(), fecha: new Date().toISOString() });
      almacen.guardar("resenas-" + id, nuevas);
      renderResenas(contenedor, id);
      avisar("¡Gracias por tu opinión!");
    });
  }

  /* ---------- 11. Páginas ---------- */

  // Tarjeta de producto reutilizable (inicio y tienda)
  function htmlTarjetaProducto(p, molienda) {
    const m = CATALOGO.molienda(molienda || "molido");
    return `<article class="tarjeta tarjeta-producto">
      <a class="imagen" href="producto.html?id=${p.id}"><img src="${p.imagen}" alt="Bolsa kraft con etiqueta verde de Café Raíces de Colombia de ${esc(p.peso)}" width="300" height="411" loading="lazy"></a>
      <h3><a href="producto.html?id=${p.id}">${esc(p.presentacion)} · ${esc(p.peso)}</a></h3>
      <p class="suave pequeno" style="margin:0">${esc(p.resumen)}</p>
      <p class="precio" style="margin:0">${precio(p.precio)}</p>
      <p class="precio-club" style="margin:0">Con Club Raíces: ${precio(CATALOGO.precioClub(p.precio))}</p>
      <p class="pequeno" style="margin:0">Molienda: <strong>${esc(m.nombre)}</strong></p>
      <div class="acciones">
        <button class="boton boton-primario boton-pequeno" type="button" data-agregar="${p.id}" data-molienda="${m.id}">Agregar al carrito</button>
        <a class="boton boton-secundario boton-pequeno" href="producto.html?id=${p.id}">Ver detalle</a>
      </div>
    </article>`;
  }
  // Delegación: cualquier botón [data-agregar] agrega 1 unidad al carrito
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-agregar]");
    if (!b) return;
    Carrito.agregar(b.dataset.agregar, b.dataset.molienda || "molido", Number(b.dataset.cantidad) || 1);
  });

  const PAGINAS = {};

  /* Inicio: productos destacados y resumen de reseñas */
  PAGINAS.inicio = function () {
    const destacados = $("#productos-destacados");
    if (destacados) destacados.innerHTML = CATALOGO.productos.map((p) => htmlTarjetaProducto(p)).join("");

    const caja = $("#resenas-inicio");
    if (caja) {
      const todas = CATALOGO.productos.flatMap((p) => leerResenas(p.id));
      if (!todas.length) {
        caja.innerHTML = `<div class="sin-resenas"><p><strong>Sé el primero en opinar</strong></p><p class="suave">Cuando pruebes nuestro café, cuéntanos cómo te fue desde la ficha del producto.</p><a class="boton boton-secundario boton-pequeno" href="tienda.html">Elegir mi café</a></div>`;
      } else {
        const prom = todas.reduce((s, r) => s + r.estrellas, 0) / todas.length;
        const recientes = todas.sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3);
        caja.innerHTML = `<div class="resumen-resenas"><span class="estrellas" aria-hidden="true">${estrellasTexto(prom)}</span><strong>${prom.toFixed(1).replace(".", ",")} de 5</strong><span class="suave">(${todas.length} opiniones)</span></div>
          <div class="grilla grilla-3">${recientes.map((r) => htmlResena(r, true)).join("")}</div>`;
      }
    }
  };

  /* Tienda: filtros por presentación y molienda */
  PAGINAS.tienda = function () {
    const lista = $("#lista-productos");
    const form = $("#filtros");
    if (!lista || !form) return;
    function pintar() {
      const pres = (form.querySelector("[name=presentacion]:checked") || {}).value || "todas";
      const mol = (form.querySelector("[name=molienda]:checked") || {}).value || "molido";
      const productos = CATALOGO.productos.filter((p) => pres === "todas" || p.id === pres);
      lista.innerHTML = productos.map((p) => htmlTarjetaProducto(p, mol)).join("");
      $("#conteo-productos").textContent = `${productos.length} ${productos.length === 1 ? "producto" : "productos"} · ${CATALOGO.molienda(mol).nombre.toLowerCase()}`;
    }
    form.addEventListener("change", pintar);
    pintar();
  };

  /* Ficha de producto: producto.html?id=media-libra | libra | kilo */
  PAGINAS.producto = function () {
    const ficha = $("#ficha");
    let p = CATALOGO.buscar(parametro("id") || "");
    if (!p) {
      ficha.innerHTML = `<div class="tarjeta"><h1>No encontramos ese producto</h1><p>Revisa el enlace o vuelve a la tienda para elegir tu presentación.</p><a class="boton boton-primario" href="tienda.html">Ir a la tienda</a></div>`;
      return;
    }
    const o = CATALOGO.origen;

    function pintar(molInicial) {
      molInicial = molInicial || "molido";
      document.title = `${p.nombre} (${p.peso}) | Café Raíces de Colombia`;
      const meta = $('meta[name="description"]');
      if (meta) meta.setAttribute("content", `${p.nombre} (${p.peso}): café 100 % arábica tostado en Popayán, en grano o molido, a ${precio(p.precio)}. Pide en línea o por WhatsApp.`);

      ficha.innerHTML = `
        <nav class="migas" aria-label="Ruta"><a href="index.html">Inicio</a> › <a href="tienda.html">Tienda</a> › ${esc(p.presentacion)}</nav>
        <div class="ficha">
          <div class="ficha-galeria">
            <figure class="principal" style="margin:0">
              <img src="${p.imagen}" alt="Bolsa kraft con etiqueta verde de Café Raíces de Colombia de ${esc(p.peso)}" width="300" height="411">
              <figcaption class="suave pequeno" style="margin-top:8px">Bolsa de ${esc(p.peso)}: kraft, con válvula unidireccional y sellado al vacío. Imagen del empaque del proyecto.</figcaption>
            </figure>
            <div class="foto-pendiente"><div><strong>[FOTO REAL POR CONFIRMAR]</strong>Foto de la bolsa de ${esc(p.peso)} abierta, con el café molido y en grano.</div></div>
          </div>

          <div class="ficha-compra">
            <p class="eyebrow" style="margin:0">Popayán, Cauca · 100 % arábica</p>
            <h1 style="margin:0">${esc(p.nombre)}, tostado en origen</h1>
            <p class="lead" style="margin:0">Molido o en grano. De familias caficultoras del Cauca directo a tu taza.</p>
            <div>
              <span class="precio" id="precio-ficha">${precio(p.precio)}</span>
              <span class="suave pequeno"> · ${esc(p.peso)} · el envío se suma aparte</span>
              <p class="precio-club" style="margin:4px 0 0">En el Club Raíces: ${precio(CATALOGO.precioClub(p.precio))} (10 % menos)</p>
            </div>
            <form id="form-compra" class="formulario" novalidate>
              <fieldset class="campo">
                <legend>Presentación</legend>
                <div class="opciones">
                  ${CATALOGO.productos.map((x) => `<label class="opcion"><input type="radio" name="pres" value="${x.id}" ${x.id === p.id ? "checked" : ""}><span>${esc(x.presentacion)}</span></label>`).join("")}
                </div>
              </fieldset>
              <fieldset class="campo">
                <legend>¿Cómo lo quieres?</legend>
                <div class="opciones">
                  ${CATALOGO.moliendas.map((m) => `<label class="opcion"><input type="radio" name="molienda" value="${m.id}" ${m.id === molInicial ? "checked" : ""}><span>${m.id === "molido" ? "Molido (si no tienes molino)" : "En grano"}</span></label>`).join("")}
                </div>
              </fieldset>
              <div class="campo">
                <label for="cantidad-ficha">Cantidad</label>
                <div class="cantidad">
                  <button type="button" data-paso="-1" aria-label="Quitar una">−</button>
                  <input id="cantidad-ficha" type="number" min="1" max="99" value="1" inputmode="numeric">
                  <button type="button" data-paso="1" aria-label="Agregar una">+</button>
                </div>
              </div>
              <div class="grupo-botones">
                <button class="boton boton-primario" type="submit">Agregar al carrito</button>
                <a class="boton boton-whatsapp" id="pedir-whatsapp" href="#" target="_blank" rel="noopener">${ICONOS.whatsapp.replace('aria-hidden="true"', 'aria-hidden="true" width="20" height="20"')} Pedir por WhatsApp</a>
              </div>
              <p class="pequeno suave" style="margin:0">Se abre WhatsApp con este mensaje: <em id="texto-whatsapp"></em><br>Número de la tienda: <span class="pendiente">${esc(WHATSAPP_NUMERO)}</span></p>
            </form>
            <ul class="chips medios-pago" aria-label="Medios de pago">${CATALOGO.mediosPago.map((m) => `<li class="chip">${esc(m.nombre)}</li>`).join("")}</ul>
            <div>
              <p>${esc(p.descripcion)}</p>
              <p>${esc(p.paraQuien)}</p>
            </div>
          </div>
        </div>

        <section class="seccion" aria-labelledby="t-origen">
          <div class="dos-columnas">
            <div>
              <h2 id="t-origen">Origen de este lote</h2>
              <p class="suave">Cada lote indica finca, familia, proceso y fecha de tueste. Ningún pedido sale con más de 15 días de tostado.</p>
              <dl class="datos-origen">
                <div><dt>Región</dt><dd>${esc(o.region)}</dd></div>
                <div><dt>Tipo</dt><dd>${esc(o.tipo)}</dd></div>
                <div><dt>Finca</dt><dd>${marcar(o.finca)}</dd></div>
                <div><dt>Familia</dt><dd>${marcar(o.familia)}</dd></div>
                <div><dt>Variedad</dt><dd>${marcar(o.variedad)}</dd></div>
                <div><dt>Proceso</dt><dd>${marcar(o.proceso)}</dd></div>
                <div><dt>Notas de cata</dt><dd>${marcar(o.notasCata)}</dd></div>
                <div><dt>Fecha de tostado</dt><dd>${marcar(o.fechaTostado)}</dd></div>
              </dl>
              <p style="margin-top:16px"><a href="origen.html">Conoce a las familias y el recorrido del café →</a></p>
            </div>
            <div>
              <h2>Cómo prepararlo sin cafetera</h2>
              <ol class="pasos">
                <li><div><b>Calienta el agua</b>En una olla pequeña, vierte 2 tazas de agua. Cuando hierva, baja un poco la llama.</div></li>
                <li><div><b>Mide el café</b>Usa entre 3 y 4 cucharadas de café molido.</div></li>
                <li><div><b>Mezcla y deja reposar</b>Revuelve 30 segundos y espera 4 minutos.</div></li>
                <li><div><b>Cuela y sirve</b>Pasa el café por un colador de tela a la taza.</div></li>
              </ol>
              <p class="pequeno suave" style="margin-top:12px">La proporción es una sugerencia. Ajústala a tu gusto. <a href="preparar.html">Ver más recetas</a></p>
            </div>
          </div>
        </section>

        <section class="seccion" aria-labelledby="t-faq-producto">
          <h2 id="t-faq-producto">Preguntas sobre este producto</h2>
          <div class="acordeon">
            <details><summary>¿Cuánto cuesta el envío?</summary><div class="respuesta"><p>Depende de tu ciudad y dirección. ${marcar(CATALOGO.envio.texto)}. Mientras tanto, escríbenos por WhatsApp con tu ciudad y te confirmamos el total.</p></div></details>
            <details><summary>¿Qué medios de pago aceptan?</summary><div class="respuesta"><p>Nequi, Daviplata, PSE, tarjeta y contra entrega donde la transportadora lo permita.</p></div></details>
            <details><summary>¿Cuánto tiempo se conserva fresco el café?</summary><div class="respuesta"><p>Sin abrir, se conserva fresco <span class="pendiente">[POR CONFIRMAR tiempo]</span> en su bolsa. Cuando la abras, guárdalo en un frasco oscuro y hermético, lejos del sol.</p></div></details>
            <details><summary>¿Molido o en grano?</summary><div class="respuesta"><p>Si no tienes molino, pídelo molido. Si tienes molino en casa, en grano: lo mueles justo antes de prepararlo.</p></div></details>
            <details><summary>¿Cómo hago mi primer pedido?</summary><div class="respuesta"><p>Agrégalo al carrito y sigue los pasos, o escribe al WhatsApp de Café Raíces con tu nombre, la presentación y si lo quieres molido o en grano. Te confirmamos disponibilidad, el total con envío y el medio de pago.</p></div></details>
          </div>
        </section>

        <section class="seccion" aria-labelledby="t-resenas">
          <h2 id="t-resenas">Reseñas y calificación</h2>
          <div id="resenas-producto"></div>
        </section>`;

      const form = $("#form-compra");
      const cantidad = $("#cantidad-ficha");
      function mensajeWhatsApp() {
        const mol = form.querySelector("[name=molienda]:checked").value === "molido" ? "molido" : "en grano";
        const n = Math.max(1, Number(cantidad.value) || 1);
        // Mensaje del prototipo del Laboratorio 4
        const pedido = n > 1 ? `${n} bolsas de café ${p.presentacion} (${p.peso}) ${mol}` : `café ${p.presentacion} (${p.peso}) ${mol}`;
        const t = `Hola, Café Raíces. Quiero pedir ${pedido}. ¿Cuánto cuesta el envío a mi ciudad?`;
        $("#texto-whatsapp").textContent = t;
        $("#pedir-whatsapp").href = enlaceWhatsApp(t);
      }
      form.addEventListener("change", (e) => {
        if (e.target.name === "pres") {
          // Cambia de presentación sin recargar: se vuelve a pintar la ficha conservando la molienda
          p = CATALOGO.buscar(e.target.value);
          history.replaceState(null, "", "producto.html?id=" + p.id);
          pintar(form.querySelector("[name=molienda]:checked").value);
          $(`#form-compra [name=pres][value=${p.id}]`).focus();
          return;
        }
        mensajeWhatsApp();
      });
      cantidad.addEventListener("input", mensajeWhatsApp);
      $$(".cantidad button", form).forEach((b) => b.addEventListener("click", () => {
        cantidad.value = Math.max(1, Math.min(99, (Number(cantidad.value) || 1) + Number(b.dataset.paso)));
        mensajeWhatsApp();
      }));
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const n = Math.max(1, Math.min(99, Number(cantidad.value) || 1));
        Carrito.agregar(p.id, form.querySelector("[name=molienda]:checked").value, n);
      });
      mensajeWhatsApp();
      renderResenas($("#resenas-producto"), p.id);
    }
    pintar();
  };

  /* Quiz «Encuentra tu café»: 4 preguntas */
  PAGINAS.quiz = function () {
    const form = $("#form-quiz");
    if (!form) return;
    const pasos = $$(".pregunta-quiz", form);
    const progreso = $("#progreso-quiz");
    const resultado = $("#resultado-quiz");
    let actual = 0;

    function mostrar(i) {
      pasos.forEach((p, j) => { p.hidden = j !== i; });
      progreso.textContent = `Pregunta ${i + 1} de ${pasos.length}`;
      $("#quiz-anterior").hidden = i === 0;
      $("#quiz-siguiente").textContent = i === pasos.length - 1 ? "Ver mi recomendación" : "Siguiente";
      const primero = pasos[i].querySelector("input");
      if (primero && i > 0) pasos[i].querySelector("legend").focus();
    }
    function respuesta(nombre) { const r = form.querySelector(`[name=${nombre}]:checked`); return r ? r.value : null; }

    $("#quiz-anterior").addEventListener("click", () => { actual = Math.max(0, actual - 1); mostrar(actual); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = pasos[actual].querySelector("input").name;
      if (!respuesta(nombre)) {
        mostrarMensaje(form, "Elige una opción para continuar.", "error");
        return;
      }
      const msg = $(".mensaje-formulario", form);
      if (msg) msg.innerHTML = "";
      if (actual < pasos.length - 1) { actual++; mostrar(actual); return; }
      recomendar();
    });

    function recomendar() {
      const metodo = respuesta("metodo");
      const tazas = Number(respuesta("tazas"));
      const para = respuesta("para");
      const busca = respuesta("busca");
      const molienda = metodo === "molino" ? "grano" : "molido";
      // Puntaje simple: más tazas al día y uso en oficina → presentación más grande
      let puntos = tazas + (para === "negocio" ? 1 : 0) + (busca === "rendimiento" ? 1 : 0);
      let id = puntos <= 1 ? "media-libra" : puntos === 2 ? "libra" : "kilo";
      if (busca === "probar" || para === "regalo") id = "media-libra";
      const p = CATALOGO.buscar(id);
      const razones = [];
      razones.push(molienda === "molido"
        ? "Te recomendamos el café <strong>molido</strong>, listo para preparar en olla, colador o cafetera, sin necesidad de molino."
        : "Como tienes molino, te recomendamos el café <strong>en grano</strong>: lo mueles justo antes de prepararlo.");
      if (busca === "probar") razones.push("La media libra es la mejor forma de conocer nuestro café sin gastar mucho.");
      else if (para === "regalo") razones.push("Para regalar, la media libra es un buen detalle. También puedes ver nuestros <a href=\"kits.html\">kits y regalos</a>.");
      else razones.push(`Por la cantidad de café que se toma en tu casa, la presentación de <strong>${esc(p.presentacion)} (${esc(p.peso)})</strong> es la que mejor se ajusta.`);
      if (para === "negocio") razones.push("Si compras para una cafetería, tienda u oficina, pide una <a href=\"kits.html#volumen\">cotización por volumen</a>.");
      if (busca === "siempre") razones.push(`Como no quieres quedarte sin café, el <a href="club.html">Club Raíces</a> te lo envía cada 15 o 30 días con 10 % de descuento: ${precio(CATALOGO.precioClub(p.precio))} en vez de ${precio(p.precio)}.`);

      form.hidden = true;
      resultado.hidden = false;
      resultado.innerHTML = `
        <p class="eyebrow">Tu café recomendado</p>
        <h2>${esc(p.nombre)} · ${molienda === "molido" ? "molido" : "en grano"}</h2>
        <div class="dos-columnas">
          <img src="${p.imagen}" alt="Bolsa de Café Raíces de Colombia de ${esc(p.peso)}" width="300" height="411" loading="lazy">
          <div>
            <p class="precio">${precio(p.precio)}</p>
            <ul class="lista-check">${razones.map((r) => `<li>${r}</li>`).join("")}</ul>
            <div class="grupo-botones">
              <button class="boton boton-primario" type="button" data-agregar="${p.id}" data-molienda="${molienda}">Agregar al carrito</button>
              <a class="boton boton-secundario" href="producto.html?id=${p.id}">Ver el producto</a>
            </div>
            <p style="margin-top:16px"><button type="button" class="enlace-boton" id="quiz-repetir">Volver a hacer el cuestionario</button></p>
          </div>
        </div>`;
      resultado.setAttribute("tabindex", "-1");
      resultado.focus();
      $("#quiz-repetir").addEventListener("click", () => {
        form.reset(); actual = 0; mostrar(0);
        resultado.hidden = true; form.hidden = false;
        pasos[0].querySelector("input").focus();
      });
    }
    mostrar(0);
  };

  /* Carrito y checkout en 5 pasos */
  PAGINAS.carrito = function () {
    const raiz = $("#checkout");
    if (!raiz) return;
    const NOMBRES_PASOS = ["Carrito", "Tus datos", "Envío", "Pago", "Confirmación"];
    const datos = almacen.leer("checkout-datos", {}); // se recuerdan para no volver a escribirlos
    let paso = 0;

    function resumenHTML() {
      const t = Carrito.totales();
      return `
        <aside class="tarjeta resumen" aria-label="Resumen del pedido">
          <h2 style="font-size:1.3rem">Resumen del pedido</h2>
          <dl>
            <dt>Subtotal (${Carrito.unidades()} ${Carrito.unidades() === 1 ? "producto" : "productos"})</dt><dd>${precio(t.subtotal)}</dd>
            ${t.codigo ? `<dt>Descuento ${esc(t.codigo)}</dt><dd>−${precio(t.descuento)}</dd>` : ""}
            <dt>Envío</dt><dd>${t.envio === null ? marcar(CATALOGO.envio.texto) : precio(t.envio)}</dd>
            <dt>Impuestos</dt><dd>${marcar(CATALOGO.impuestos.texto)}</dd>
            <dt class="total">Total${t.envio === null ? " (sin envío)" : ""}</dt><dd class="total">${precio(t.total)}</dd>
          </dl>
          <p class="pequeno suave" style="margin:0">Precios en pesos colombianos (COP). Verás el total final antes de confirmar.</p>
        </aside>`;
    }

    function pintar() {
      const lineas = Carrito.leer();
      const indicador = `<ol class="pasos-checkout">${NOMBRES_PASOS.map((n, i) => `<li class="${i === paso ? "activo" : i < paso ? "hecho" : ""}"${i === paso ? ' aria-current="step"' : ""}>${n}</li>`).join("")}</ol>`;

      if (!lineas.length && paso < 4) {
        raiz.innerHTML = indicador + `<div class="tarjeta centro"><h2>Tu carrito está vacío</h2><p class="suave">Elige tu presentación o deja que te recomendemos una.</p><div class="grupo-botones" style="justify-content:center"><a class="boton boton-primario" href="tienda.html">Ir a la tienda</a><a class="boton boton-secundario" href="quiz.html">Encuentra tu café</a></div></div>`;
        return;
      }
      let cuerpo = "";
      if (paso === 0) cuerpo = pasoCarrito(lineas);
      if (paso === 1) cuerpo = pasoDatos();
      if (paso === 2) cuerpo = pasoEnvio();
      if (paso === 3) cuerpo = pasoPago();
      if (paso === 4) cuerpo = pasoConfirmacion(lineas);
      raiz.innerHTML = indicador + `<div class="checkout-grid"><div>${cuerpo}</div>${resumenHTML()}</div>`;
      conectar();
      const titulo = $("h2", raiz);
      if (titulo) { titulo.setAttribute("tabindex", "-1"); }
    }

    function pasoCarrito(lineas) {
      const cup = almacen.leer("cupon", null);
      return `<section class="tarjeta"><h2>1. Tu carrito</h2>
        ${lineas.map((l) => {
          const p = CATALOGO.buscar(l.id);
          return `<div class="item-carrito">
            <img src="${p.imagen}" alt="" width="72" height="72">
            <div>
              <strong><a href="producto.html?id=${p.id}">${esc(p.nombre)}</a></strong>
              <div class="pequeno suave">${esc(p.peso)} · ${esc(CATALOGO.molienda(l.molienda).nombre)} · ${precio(p.precio)} c/u</div>
              <div class="controles">
                <div class="cantidad">
                  <button type="button" data-cambiar="-1" data-id="${l.id}" data-molienda="${l.molienda}" aria-label="Quitar una unidad de ${esc(p.presentacion)}">−</button>
                  <input type="number" min="1" max="99" value="${l.cantidad}" data-cantidad data-id="${l.id}" data-molienda="${l.molienda}" aria-label="Cantidad de ${esc(p.presentacion)} ${esc(CATALOGO.molienda(l.molienda).nombre)}">
                  <button type="button" data-cambiar="1" data-id="${l.id}" data-molienda="${l.molienda}" aria-label="Agregar una unidad de ${esc(p.presentacion)}">+</button>
                </div>
                <strong>${precio(p.precio * l.cantidad)}</strong>
                <button type="button" class="enlace-boton" data-quitar data-id="${l.id}" data-molienda="${l.molienda}">Quitar</button>
              </div>
            </div>
          </div>`;
        }).join("")}
        <form id="form-cupon" class="formulario" style="margin-top:18px" novalidate>
          <div class="campo">
            <label for="cupon">Código de descuento</label>
            <div style="display:flex;gap:8px">
              <input id="cupon" name="cupon" type="text" autocomplete="off" value="${cup ? esc(cup) : ""}" placeholder="Ej.: BIENVENIDA10" style="text-transform:uppercase">
              <button class="boton boton-secundario boton-pequeno" type="submit">Aplicar</button>
            </div>
            <span class="ayuda">Suscríbete al boletín y recibe BIENVENIDA10: 10 % en tu primera compra.</span>
          </div>
        </form>
        <div class="grupo-botones" style="margin-top:20px">
          <button class="boton boton-primario" type="button" data-ir="1">Continuar con mis datos</button>
          <a class="boton boton-secundario" href="tienda.html">Seguir comprando</a>
        </div></section>`;
    }

    function campo(id, etiqueta, tipo, extra, ayuda) {
      return `<div class="campo"><label for="${id}">${etiqueta}</label><input id="${id}" name="${id}" type="${tipo}" value="${esc(datos[id] || "")}" ${extra || ""}>${ayuda ? `<span class="ayuda">${ayuda}</span>` : ""}</div>`;
    }

    function pasoDatos() {
      return `<section class="tarjeta"><h2>2. Tus datos</h2>
        <form id="form-paso" class="formulario" novalidate>
          ${campo("nombre", "Nombre completo", "text", 'required autocomplete="name" minlength="3"')}
          <div class="fila-campos">
            ${campo("celular", "Celular (WhatsApp)", "tel", 'required autocomplete="tel" inputmode="numeric" pattern="3[0-9]{9}" data-error="Escribe un celular colombiano de 10 dígitos que empiece por 3."', "10 dígitos, sin espacios.")}
            ${campo("correo", "Correo electrónico", "email", 'required autocomplete="email"', "Aquí te llega la guía de envío.")}
          </div>
          <div class="grupo-botones"><button class="boton boton-primario" type="submit">Continuar con el envío</button><button class="boton boton-secundario" type="button" data-ir="0">Volver</button></div>
        </form></section>`;
    }

    function pasoEnvio() {
      return `<section class="tarjeta"><h2>3. Envío</h2>
        <p class="suave">Despachamos desde Popayán con una transportadora nacional. Recibes el número de guía por correo y WhatsApp.</p>
        <form id="form-paso" class="formulario" novalidate>
          <div class="fila-campos">
            ${campo("ciudad", "Ciudad o municipio", "text", 'required autocomplete="address-level2"')}
            ${campo("barrio", "Barrio", "text", 'required')}
          </div>
          ${campo("direccion", "Dirección", "text", 'required autocomplete="street-address"', "Ej.: Calle 10 # 5-20, apto 301.")}
          <div class="campo"><label for="indicaciones">Indicaciones para la entrega (opcional)</label><textarea id="indicaciones" name="indicaciones" maxlength="200">${esc(datos.indicaciones || "")}</textarea></div>
          <div class="info-vendedor"><p><strong>Costo de envío:</strong> ${marcar(CATALOGO.envio.texto)}</p><p><strong>Tiempo de entrega:</strong> ${marcar(CATALOGO.envio.tiempos)}</p></div>
          <div class="grupo-botones"><button class="boton boton-primario" type="submit">Continuar con el pago</button><button class="boton boton-secundario" type="button" data-ir="1">Volver</button></div>
        </form></section>`;
    }

    function pasoPago() {
      return `<section class="tarjeta"><h2>4. Medio de pago</h2>
        <form id="form-paso" class="formulario" novalidate>
          <fieldset class="campo">
            <legend>¿Cómo quieres pagar?</legend>
            <div style="display:grid;gap:10px">
            ${CATALOGO.mediosPago.map((m) => `<label class="medio-pago"><input type="radio" name="pago" value="${m.id}" required ${datos.pago === m.id ? "checked" : ""}><span><strong>${esc(m.nombre)}</strong><br><span class="pequeno suave">${esc(m.detalle)}${m.id === "contraentrega" ? " " + marcar(CATALOGO.envio.ciudadesContraEntrega) : ""}</span></span></label>`).join("")}
            </div>
          </fieldset>
          <!-- PASARELA DE PAGOS: en esta versión el pago se coordina por WhatsApp.
               Para cobrar en línea, conectar aquí Wompi o Mercado Pago:
               - Wompi: Widget Checkout (https://docs.wompi.co) con la llave pública de la cuenta,
                 el total en centavos (total * 100), moneda "COP" y una referencia única del pedido.
               - Mercado Pago: Checkout Pro (https://www.mercadopago.com.co/developers) creando una
                 "preferencia" desde un backend o función serverless (GitHub Pages no ejecuta servidor).
               Al recibir la confirmación de pago, pasar al paso 5. -->
          <label class="casilla"><input type="checkbox" name="terminos" id="terminos" required><span>Leí y acepto los <a href="legal.html#terminos" target="_blank">términos y condiciones</a>, la política de <a href="legal.html#devoluciones" target="_blank">cambios y devoluciones</a> y el <a href="legal.html#retracto" target="_blank">derecho de retracto</a>.</span></label>
          <label class="casilla"><input type="checkbox" name="datos" id="datos" required><span>Autorizo el tratamiento de mis datos personales para gestionar este pedido, según la <a href="legal.html#datos" target="_blank">política de datos (Ley 1581 de 2012)</a>.</span></label>
          <div class="grupo-botones"><button class="boton boton-primario" type="submit">Revisar mi pedido</button><button class="boton boton-secundario" type="button" data-ir="2">Volver</button></div>
        </form></section>`;
    }

    function mensajePedido(lineas) {
      const t = Carrito.totales();
      const medio = CATALOGO.mediosPago.find((m) => m.id === datos.pago);
      const renglones = lineas.map((l) => {
        const p = CATALOGO.buscar(l.id);
        return `• ${l.cantidad} × ${p.nombre} (${p.peso}) – ${CATALOGO.molienda(l.molienda).nombre} – ${precio(p.precio * l.cantidad)}`;
      });
      return [
        "Hola, Café Raíces. Quiero confirmar este pedido:",
        ...renglones,
        `Subtotal: ${precio(t.subtotal)}`,
        t.codigo ? `Descuento ${t.codigo}: −${precio(t.descuento)}` : null,
        `Envío: ${t.envio === null ? "por confirmar" : precio(t.envio)}`,
        `Total: ${precio(t.total)}${t.envio === null ? " + envío" : ""}`,
        "",
        `Nombre: ${datos.nombre}`,
        `Celular: ${datos.celular}`,
        `Correo: ${datos.correo}`,
        `Ciudad: ${datos.ciudad}`,
        `Dirección: ${datos.direccion}, barrio ${datos.barrio}`,
        datos.indicaciones ? `Indicaciones: ${datos.indicaciones}` : null,
        `Medio de pago: ${medio ? medio.nombre : ""}`
      ].filter((x) => x !== null).join("\n");
    }

    function pasoConfirmacion(lineas) {
      if (datos.confirmado) {
        return `<section class="tarjeta"><h2>¡Pedido enviado!</h2>
          <p>Abrimos WhatsApp con tu pedido. Cuando lo envíes, te confirmamos el total con envío y los datos de pago.</p>
          <p>Puedes ver tu pedido en <a href="cuenta.html">Mi cuenta</a>.</p>
          <div class="grupo-botones"><a class="boton boton-primario" href="index.html">Volver al inicio</a><a class="boton boton-secundario" href="club.html">Conocer el Club Raíces</a></div></section>`;
      }
      const medio = CATALOGO.mediosPago.find((m) => m.id === datos.pago);
      return `<section class="tarjeta"><h2>5. Revisa y confirma</h2>
        <h3>Productos</h3>
        <ul>${lineas.map((l) => { const p = CATALOGO.buscar(l.id); return `<li>${l.cantidad} × ${esc(p.nombre)} (${esc(p.peso)}) · ${esc(CATALOGO.molienda(l.molienda).nombre)} · ${precio(p.precio * l.cantidad)}</li>`; }).join("")}</ul>
        <h3>Entrega</h3>
        <p>${esc(datos.nombre)} · ${esc(datos.celular)} · ${esc(datos.correo)}<br>${esc(datos.direccion)}, barrio ${esc(datos.barrio)}, ${esc(datos.ciudad)}${datos.indicaciones ? "<br>" + esc(datos.indicaciones) : ""}</p>
        <h3>Pago</h3>
        <p>${esc(medio ? medio.nombre : "")}</p>
        <div class="info-vendedor" style="margin-bottom:16px"><p><strong>Vendedor</strong> (Ley 1480 de 2011, art. 50)</p>${htmlVendedor()}</div>
        <p class="pequeno suave">Al confirmar se abre WhatsApp con tu pedido ya escrito. Tienes derecho de retracto dentro de los 5 días hábiles siguientes a la entrega.</p>
        <div class="grupo-botones">
          <a class="boton boton-whatsapp" id="confirmar-pedido" href="${enlaceWhatsApp(mensajePedido(lineas))}" target="_blank" rel="noopener">Confirmar pedido por WhatsApp</a>
          <button class="boton boton-secundario" type="button" data-ir="3">Volver</button>
        </div></section>`;
    }

    function irA(n) {
      paso = n;
      pintar();
      const t = $("h2", raiz);
      if (t) t.focus();
      window.scrollTo({ top: 0 });
    }

    function conectar() {
      // Botones de navegación entre pasos
      $$("[data-ir]", raiz).forEach((b) => b.addEventListener("click", () => irA(Number(b.dataset.ir))));
      // Paso 1: cantidades, quitar y cupón
      $$("[data-cambiar]", raiz).forEach((b) => b.addEventListener("click", () => {
        const l = Carrito.leer().find((x) => x.id === b.dataset.id && x.molienda === b.dataset.molienda);
        if (l) { Carrito.cambiar(l.id, l.molienda, l.cantidad + Number(b.dataset.cambiar)); pintar(); }
      }));
      $$("[data-cantidad]", raiz).forEach((i) => i.addEventListener("change", () => { Carrito.cambiar(i.dataset.id, i.dataset.molienda, Number(i.value)); pintar(); }));
      $$("[data-quitar]", raiz).forEach((b) => b.addEventListener("click", () => { Carrito.quitar(b.dataset.id, b.dataset.molienda); avisar("Quitamos el producto del carrito."); pintar(); }));
      const fc = $("#form-cupon", raiz);
      if (fc) fc.addEventListener("submit", (e) => {
        e.preventDefault();
        const codigo = $("#cupon").value.trim().toUpperCase();
        if (!codigo) { almacen.borrar("cupon"); pintar(); return; }
        if (CATALOGO.promociones.cupones[codigo]) {
          almacen.guardar("cupon", codigo);
          pintar();
          mostrarMensaje($("#form-cupon"), `Aplicamos ${esc(codigo)}: ${esc(CATALOGO.promociones.cupones[codigo].descripcion)}.`);
        } else {
          mostrarMensaje(fc, "Ese código no es válido. Revisa que esté bien escrito.", "error");
        }
      });
      // Pasos 2, 3 y 4: formularios con validación
      const fp = $("#form-paso", raiz);
      if (fp) {
        fp.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid")) limpiarError(e.target); });
        fp.addEventListener("submit", (e) => {
          e.preventDefault();
          if (!validarFormulario(fp)) return;
          new FormData(fp).forEach((v, k) => { if (k !== "terminos" && k !== "datos") datos[k] = String(v).trim(); });
          datos.confirmado = false;
          almacen.guardar("checkout-datos", { nombre: datos.nombre, celular: datos.celular, correo: datos.correo, ciudad: datos.ciudad, barrio: datos.barrio, direccion: datos.direccion });
          irA(paso + 1);
        });
      }
      // Paso 5: al confirmar se guarda el pedido (para Mi cuenta) y se vacía el carrito
      const conf = $("#confirmar-pedido", raiz);
      if (conf) conf.addEventListener("click", () => {
        const t = Carrito.totales();
        const pedidos = almacen.leer("pedidos", []);
        pedidos.push({
          numero: "CR-" + Date.now().toString().slice(-6),
          fecha: new Date().toISOString(),
          lineas: Carrito.leer(),
          total: t.total,
          envioPendiente: t.envio === null,
          ciudad: datos.ciudad,
          pago: datos.pago
        });
        almacen.guardar("pedidos", pedidos);
        if (t.codigo) almacen.borrar("cupon");
        Carrito.vaciar();
        datos.confirmado = true;
        setTimeout(pintar, 300); // deja que se abra WhatsApp primero
      });
    }
    pintar();
  };

  /* Club Raíces: formulario de suscripción (compartido con Mi cuenta) */
  function htmlFormSuscripcion(prefijo) {
    return `<form class="formulario" id="${prefijo}-form-club" novalidate>
      <fieldset class="campo"><legend>Presentación</legend><div class="opciones">
        ${CATALOGO.productos.map((p, i) => `<label class="opcion"><input type="radio" name="producto" value="${p.id}" ${i === 1 ? "checked" : ""} required><span>${esc(p.presentacion)} · ${precio(CATALOGO.precioClub(p.precio))}</span></label>`).join("")}
      </div></fieldset>
      <fieldset class="campo"><legend>Molienda</legend><div class="opciones">
        ${CATALOGO.moliendas.map((m, i) => `<label class="opcion"><input type="radio" name="molienda" value="${m.id}" ${i === 0 ? "checked" : ""} required><span>${esc(m.nombre)}</span></label>`).join("")}
      </div></fieldset>
      <fieldset class="campo"><legend>¿Cada cuánto?</legend><div class="opciones">
        ${CATALOGO.promociones.frecuenciasClub.map((f, i) => `<label class="opcion"><input type="radio" name="frecuencia" value="${f}" ${i === 1 ? "checked" : ""} required><span>Cada ${f} días</span></label>`).join("")}
      </div></fieldset>
      <label class="casilla"><input type="checkbox" name="terminos" id="${prefijo}-terminos" required><span>Acepto las <a href="legal.html#terminos" target="_blank">condiciones del Club Raíces</a> y autorizo el tratamiento de mis datos según la <a href="legal.html#datos" target="_blank">Ley 1581 de 2012</a>.</span></label>
      <div><button class="boton boton-primario" type="submit">Unirme al Club Raíces</button></div>
    </form>`;
  }
  function conectarFormSuscripcion(form, alTerminar) {
    form.addEventListener("change", (e) => { if (e.target.getAttribute("aria-invalid")) limpiarError(e.target); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validarFormulario(form)) return;
      const d = new FormData(form);
      const hoy = new Date();
      const sus = {
        producto: d.get("producto"), molienda: d.get("molienda"), frecuencia: Number(d.get("frecuencia")),
        estado: "activa", inicio: hoy.toISOString(),
        proxima: new Date(hoy.getTime() + Number(d.get("frecuencia")) * 864e5).toISOString()
      };
      almacen.guardar("suscripcion", sus);
      alTerminar(sus);
    });
  }
  function mensajeClubWhatsApp(sus) {
    const p = CATALOGO.buscar(sus.producto);
    return `Hola, Café Raíces. Quiero unirme al Club Raíces: ${p.presentacion} (${p.peso}) ${CATALOGO.molienda(sus.molienda).nombre.toLowerCase()}, cada ${sus.frecuencia} días.`;
  }

  PAGINAS.club = function () {
    const tabla = $("#precios-club");
    if (tabla) tabla.innerHTML = CATALOGO.productos.map((p) =>
      `<tr><th scope="row">${esc(p.presentacion)} (${esc(p.peso)})</th><td>${precio(p.precio)}</td><td><strong>${precio(CATALOGO.precioClub(p.precio))}</strong></td></tr>`).join("");
    const caja = $("#suscribirse");
    if (!caja) return;
    caja.innerHTML = htmlFormSuscripcion("club");
    conectarFormSuscripcion($("#club-form-club"), (sus) => {
      caja.innerHTML = `<div class="mensaje-formulario mensaje-ok" role="status" tabindex="-1">
        <p><strong>¡Bienvenido al Club Raíces!</strong> Registramos tu plan en esta demostración. Para activarlo y coordinar el primer pago, confírmalo por WhatsApp.</p>
        <div class="grupo-botones"><a class="boton boton-whatsapp" href="${enlaceWhatsApp(mensajeClubWhatsApp(sus))}" target="_blank" rel="noopener">Confirmar por WhatsApp</a><a class="boton boton-secundario" href="cuenta.html#club">Ver en Mi cuenta</a></div></div>`;
      $(".mensaje-formulario", caja).focus();
    });
  };

  /* Mi cuenta (simulada): pedidos, Club Raíces y datos */
  PAGINAS.cuenta = function () {
    // Pedidos
    const cajaPedidos = $("#mis-pedidos");
    function pintarPedidos() {
      const pedidos = almacen.leer("pedidos", []).slice().reverse();
      cajaPedidos.innerHTML = pedidos.length ? pedidos.map((p, i) => `
        <article class="tarjeta" style="margin-bottom:12px">
          <h3>Pedido ${esc(p.numero)}</h3>
          <p class="pequeno suave">${fechaCorta(p.fecha)} · ${esc(p.ciudad || "")} · Estado: enviado por WhatsApp, pendiente de confirmación</p>
          <ul>${p.lineas.map((l) => { const x = CATALOGO.buscar(l.id); return x ? `<li>${l.cantidad} × ${esc(x.presentacion)} · ${esc(CATALOGO.molienda(l.molienda).nombre)}</li>` : ""; }).join("")}</ul>
          <p><strong>Total: ${precio(p.total)}${p.envioPendiente ? " + envío" : ""}</strong></p>
          <button class="boton boton-secundario boton-pequeno" type="button" data-repetir="${i}">Repetir este pedido</button>
        </article>`).join("")
        : `<div class="sin-resenas"><p><strong>Aún no tienes pedidos</strong></p><a class="boton boton-primario boton-pequeno" href="tienda.html">Ir a la tienda</a></div>`;
      $$("[data-repetir]", cajaPedidos).forEach((b) => b.addEventListener("click", () => {
        const p = pedidos[Number(b.dataset.repetir)];
        p.lineas.forEach((l) => { if (CATALOGO.buscar(l.id)) Carrito.agregar(l.id, l.molienda, l.cantidad); });
        avisar("Agregamos de nuevo los productos de tu pedido.", { href: "carrito.html", texto: "Ver carrito" });
      }));
    }
    if (cajaPedidos) pintarPedidos();

    // Club Raíces
    const cajaClub = $("#mi-club");
    function pintarClub() {
      const sus = almacen.leer("suscripcion", null);
      if (!sus || sus.estado === "cancelada") {
        cajaClub.innerHTML = `${sus ? '<p class="mensaje-formulario mensaje-ok" role="status">Tu suscripción quedó cancelada. Puedes volver cuando quieras.</p>' : ""}
          <p>Aún no tienes una suscripción. Recibe tu café cada 15 o 30 días con 10 % de descuento.</p>${htmlFormSuscripcion("cuenta")}`;
        conectarFormSuscripcion($("#cuenta-form-club"), () => { pintarClub(); avisar("Tu suscripción quedó registrada."); });
        return;
      }
      const p = CATALOGO.buscar(sus.producto);
      cajaClub.innerHTML = `
        <div class="tarjeta">
          <h3>${esc(p.nombre)} · ${esc(CATALOGO.molienda(sus.molienda).nombre)}</h3>
          <p>Cada <strong>${sus.frecuencia} días</strong> · ${precio(CATALOGO.precioClub(p.precio))} por envío (10 % menos)</p>
          <p>Estado: <strong>${sus.estado === "pausada" ? "En pausa" : "Activa"}</strong>${sus.estado === "activa" ? ` · Próximo envío: ${fechaCorta(sus.proxima)}` : ""}</p>
          <fieldset class="campo" style="margin-bottom:16px"><legend>Cambiar frecuencia</legend><div class="opciones">
            ${CATALOGO.promociones.frecuenciasClub.map((f) => `<label class="opcion"><input type="radio" name="frecuencia-club" value="${f}" ${sus.frecuencia === f ? "checked" : ""}><span>Cada ${f} días</span></label>`).join("")}
          </div></fieldset>
          <div class="grupo-botones">
            <button class="boton boton-secundario boton-pequeno" type="button" id="club-pausa">${sus.estado === "pausada" ? "Reanudar suscripción" : "Pausar suscripción"}</button>
            <button class="boton boton-secundario boton-pequeno" type="button" id="club-cancelar">Cancelar suscripción</button>
          </div>
          <div id="club-confirmar" hidden style="margin-top:16px" class="info-vendedor">
            <p><strong>¿Seguro que quieres cancelar tu suscripción?</strong> Puedes pausarla si solo necesitas un descanso.</p>
            <div class="grupo-botones" style="margin-top:8px">
              <button class="boton boton-acento boton-pequeno" type="button" id="club-cancelar-si">Sí, cancelar</button>
              <button class="boton boton-secundario boton-pequeno" type="button" id="club-cancelar-no">No, mantenerla</button>
            </div>
          </div>
        </div>`;
      $$("[name=frecuencia-club]", cajaClub).forEach((r) => r.addEventListener("change", () => {
        sus.frecuencia = Number(r.value);
        sus.proxima = new Date(Date.now() + sus.frecuencia * 864e5).toISOString();
        almacen.guardar("suscripcion", sus); pintarClub(); avisar(`Ahora recibirás tu café cada ${sus.frecuencia} días.`);
      }));
      $("#club-pausa").addEventListener("click", () => {
        sus.estado = sus.estado === "pausada" ? "activa" : "pausada";
        if (sus.estado === "activa") sus.proxima = new Date(Date.now() + sus.frecuencia * 864e5).toISOString();
        almacen.guardar("suscripcion", sus); pintarClub();
        avisar(sus.estado === "pausada" ? "Tu suscripción quedó en pausa." : "Reanudamos tu suscripción.");
      });
      $("#club-cancelar").addEventListener("click", () => { $("#club-confirmar").hidden = false; $("#club-cancelar-si").focus(); });
      $("#club-cancelar-no").addEventListener("click", () => { $("#club-confirmar").hidden = true; $("#club-cancelar").focus(); });
      $("#club-cancelar-si").addEventListener("click", () => { sus.estado = "cancelada"; almacen.guardar("suscripcion", sus); pintarClub(); });
    }
    if (cajaClub) pintarClub();

    // Mis datos y recordatorio de recompra
    const fd = $("#form-mis-datos");
    if (fd) {
      const guardados = almacen.leer("mis-datos", {});
      ["nombre", "correo", "celular"].forEach((k) => { if (guardados[k]) fd.elements[k].value = guardados[k]; });
      fd.elements.recordatorio.checked = !!guardados.recordatorio;
      fd.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid")) limpiarError(e.target); });
      fd.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validarFormulario(fd)) return;
        almacen.guardar("mis-datos", { nombre: fd.elements.nombre.value.trim(), correo: fd.elements.correo.value.trim(), celular: fd.elements.celular.value.trim(), recordatorio: fd.elements.recordatorio.checked });
        mostrarMensaje(fd, "Guardamos tus datos en este navegador.");
      });
    }
  };

  /* Nuestro origen: origen.html?lote=XXXX (a esta página lleva el QR del empaque) */
  PAGINAS.origen = function () {
    const caja = $("#resultado-lote");
    const lote = parametro("lote");
    if (!caja || !lote) return;
    const o = CATALOGO.origen;
    caja.hidden = false;
    caja.innerHTML = `<h3>Lote ${esc(lote)}</h3>
      <dl class="datos-origen">
        <div><dt>Finca</dt><dd>${marcar(o.finca)}</dd></div>
        <div><dt>Familia</dt><dd>${marcar(o.familia)}</dd></div>
        <div><dt>Variedad</dt><dd>${marcar(o.variedad)}</dd></div>
        <div><dt>Proceso</dt><dd>${marcar(o.proceso)}</dd></div>
        <div><dt>Fecha de tostado</dt><dd>${marcar(o.fechaTostado)}</dd></div>
      </dl>
      <p class="pequeno suave" style="margin-top:12px">Los datos de cada lote se publicarán cuando el tostador los registre. <span class="pendiente">[POR CONFIRMAR tabla de lotes]</span></p>`;
    $("#lote").value = lote;
  };

  /* ---------- 12. Arranque ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    insertarEncabezado();
    insertarPie();
    insertarFlotantes();
    mostrarBannerCookies(false);
    activarFormularios();
    insertarVideos();
    $$("[data-whatsapp]").forEach((a) => {           // enlaces de WhatsApp escritos en el HTML
      a.href = enlaceWhatsApp(a.dataset.whatsapp);
      a.target = "_blank"; a.rel = "noopener";
    });
    const pagina = document.body.dataset.pagina;
    if (PAGINAS[pagina]) PAGINAS[pagina]();
  });
})();
