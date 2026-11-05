/* =====================================================================
   productos.js — Catálogo, precios y promociones en UN SOLO LUGAR.
   Si cambia un precio, se cambia aquí y se actualiza todo el sitio
   (tienda, fichas, carrito, quiz, Club Raíces y chat).
   Fuente: Entrega 2, tabla 7.3, y portafolio de servicios 2026.
   Todos los precios en pesos colombianos (COP).
   ===================================================================== */

var CATALOGO = {

  /* --- Presentaciones --- */
  productos: [
    {
      id: "media-libra",
      nombre: "Café Raíces ½ libra",
      presentacion: "½ libra",
      peso: "226 g",
      precio: 18000,
      imagen: "img/bolsa-media-libra.png",
      resumen: "Presentación de entrada para probar la marca.",
      descripcion: "Café 100 % arábica tostado en Popayán. Compramos directamente a familias caficultoras aliadas de la región, sin intermediarios. Lo molemos o lo dejamos en grano, según prefieras. Viene en bolsa kraft con válvula unidireccional y sellado al vacío para que conserve su frescura.",
      paraQuien: "Ideal si es tu primera vez con nosotros o tomas café solo de vez en cuando."
    },
    {
      id: "libra",
      nombre: "Café Raíces 1 libra",
      presentacion: "1 libra",
      peso: "453 g",
      precio: 33000,
      imagen: "img/bolsa-libra.png",
      resumen: "Presentación principal para el consumo de un hogar durante unas semanas.",
      descripcion: "Café 100 % arábica tostado en Popayán. Compramos directamente a familias caficultoras aliadas de la región, sin intermediarios. Lo molemos o lo dejamos en grano, según prefieras. Viene en bolsa kraft con válvula unidireccional y sellado al vacío para que conserve su frescura.",
      paraQuien: "Para el café de todos los días en casa."
    },
    {
      id: "kilo",
      nombre: "Café Raíces 1 kilo",
      presentacion: "1 kilo",
      peso: "1.000 g",
      precio: 60000,
      imagen: "img/bolsa-kilo.png",
      resumen: "Presentación para familias grandes, oficinas o pequeños negocios.",
      descripcion: "Café 100 % arábica tostado en Popayán. Compramos directamente a familias caficultoras aliadas de la región, sin intermediarios. Lo molemos o lo dejamos en grano, según prefieras. Viene en bolsa kraft con válvula unidireccional y sellado al vacío para que conserve su frescura.",
      paraQuien: "Para familias grandes, oficinas o pequeños negocios."
    }
  ],

  /* --- Moliendas disponibles --- */
  moliendas: [
    { id: "molido", nombre: "Molido", ayuda: "Si no tienes molino. Listo para olla, colador o cafetera." },
    { id: "grano", nombre: "En grano", ayuda: "Si tienes molino y prefieres moler en casa." }
  ],

  /* --- Datos de origen de cada lote (fichas de producto y página de origen) ---
     Todos pendientes: los entrega el tostador con cada lote. */
  origen: {
    region: "Popayán, Cauca",
    tipo: "100 % arábica colombiano",
    finca: "[POR CONFIRMAR]",
    familia: "[POR CONFIRMAR]",
    variedad: "[POR CONFIRMAR]",
    proceso: "[POR CONFIRMAR]",
    notasCata: "[POR CONFIRMAR]",
    fechaTostado: "[POR CONFIRMAR] (se imprime en cada bolsa; ningún lote sale con más de 15 días de tostado)",
    lote: "[POR CONFIRMAR]"
  },

  /* --- Promociones y fidelización --- */
  promociones: {
    // Club Raíces: 10 % menos que el precio de lista (tabla 7.3)
    descuentoClub: 0.10,
    frecuenciasClub: [15, 30], // días
    // Código de bienvenida del boletín (tabla 10.1): 10 % en la primera compra
    cupones: {
      "BIENVENIDA10": { descuento: 0.10, descripcion: "10 % de bienvenida en tu primera compra" }
    }
  },

  /* --- Kits y regalos ---
     La Entrega 2 los define como "combinaciones de presentaciones con tarjeta de la
     familia productora, para fechas especiales" con precio "según la combinación".
     La composición y el precio de cada kit están POR CONFIRMAR: no se inventan. */
  kits: [
    { id: "kit-1", nombre: "Kit [POR CONFIRMAR nombre]", contenido: "[POR CONFIRMAR composición]", precio: null },
    { id: "kit-2", nombre: "Kit [POR CONFIRMAR nombre]", contenido: "[POR CONFIRMAR composición]", precio: null }
  ],

  /* --- Envío e impuestos ---
     costo: null mientras no haya tarifa de la transportadora. Cuando exista,
     poner el número (ej. 12000) y el checkout lo sumará al total. */
  envio: {
    costo: null,
    texto: "[POR CONFIRMAR tarifa de envío]",
    tiempos: "[POR CONFIRMAR tiempos de entrega]",
    ciudadesContraEntrega: "[POR CONFIRMAR ciudades con contra entrega]"
  },
  impuestos: {
    // Régimen de IVA del café tostado: confirmar con el contador del equipo.
    texto: "[POR CONFIRMAR régimen de IVA]"
  },

  /* --- Medios de pago (Entrega 2, 7.1) --- */
  mediosPago: [
    { id: "nequi", nombre: "Nequi", detalle: "Pagas desde la app de Nequi." },
    { id: "daviplata", nombre: "Daviplata", detalle: "Pagas desde la app de Daviplata." },
    { id: "pse", nombre: "PSE", detalle: "Débito desde tu cuenta de ahorros o corriente." },
    { id: "tarjeta", nombre: "Tarjeta", detalle: "Crédito o débito." },
    { id: "contraentrega", nombre: "Contra entrega", detalle: "Pagas al recibir, donde la transportadora lo permita." }
  ]
};

/* Utilidades del catálogo (las usa main.js) */
CATALOGO.buscar = function (id) {
  for (var i = 0; i < CATALOGO.productos.length; i++) {
    if (CATALOGO.productos[i].id === id) return CATALOGO.productos[i];
  }
  return null;
};
CATALOGO.precioClub = function (precio) {
  return Math.round(precio * (1 - CATALOGO.promociones.descuentoClub));
};
CATALOGO.formatear = function (valor) {
  return "$" + Number(valor).toLocaleString("es-CO", { maximumFractionDigits: 0 });
};
CATALOGO.molienda = function (id) {
  for (var i = 0; i < CATALOGO.moliendas.length; i++) {
    if (CATALOGO.moliendas[i].id === id) return CATALOGO.moliendas[i];
  }
  return CATALOGO.moliendas[0];
};
