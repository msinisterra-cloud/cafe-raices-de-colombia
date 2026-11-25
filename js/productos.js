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

  /* --- Ficha técnica y lotes (contenido complementario del equipo, 25-11-2026) ---
     PROPUESTA ACADÉMICA: perfil sensorial y lotes son de referencia y deben validarse
     con una degustación y el registro real del tostador. */
  origen: {
    region: "Popayán, Cauca, Colombia",
    tipo: "Café tostado 100 % arábica",
    altitud: "1.700–1.900 m s. n. m. (referencia)",
    tostion: "Media",
    variedad: "Castillo, Caturra y Colombia, según el lote",
    proceso: "Lavado",
    notasCata: "Chocolate, panela y frutos secos",
    perfil: { aroma: "Dulce y achocolatado", sabor: "Chocolate, panela y frutos secos", acidez: "Media", cuerpo: "Medio", final: "Dulce y equilibrado" },
    empaque: "Bolsa con válvula desgasificadora y cierre hermético",
    conservacion: "En un lugar fresco, seco y protegido de la luz",
    vidaUtil: "6 meses cerrado (referencia); una vez abierto, mejor dentro de 4 a 6 semanas",
    fechaTostado: "Se imprime en cada bolsa; ningún lote sale con más de 15 días de tostado"
  },
  // Lotes de ejemplo (ficticios) para demostrar la trazabilidad del código QR
  lotes: {
    "LRC-POP-001": { variedad: "Castillo", proceso: "Lavado", perfil: "Chocolate y panela" },
    "LRC-POP-002": { variedad: "Caturra", proceso: "Lavado", perfil: "Caramelo y frutos rojos" },
    "LRC-POP-003": { variedad: "Colombia", proceso: "Lavado", perfil: "Chocolate y cítricos" }
  },

  /* --- Promociones y fidelización --- */
  promociones: {
    // Club Raíces: 10 % menos que el precio de lista (tabla 7.3)
    descuentoClub: 0.10,
    frecuenciasClub: [15, 30], // días
    // Código de bienvenida del boletín (tabla 10.1): 10 % en la primera compra
    cupones: {
      "BIENVENIDA10": { descuento: 0.10, descripcion: "10 % de bienvenida en tu primera compra", condiciones: "Válido para una compra por cliente, durante 30 días desde que se emite. No se acumula con el descuento del Club Raíces ni con otras promociones." }
    }
  },

  /* --- Kits y regalos ---
     La Entrega 2 los define como "combinaciones de presentaciones con tarjeta de la
     familia productora, para fechas especiales" con precio "según la combinación".
     Composición definida por el equipo (25-11-2026); precio = suma del precio vigente de cada presentación. */
  kits: [
    { id: "kit-1", nombre: "Kit Detalle", contenido: "1 bolsa de 226 g (molienda a elección) + tarjeta de regalo con mensaje personalizado", precio: 18000 },
    { id: "kit-2", nombre: "Kit Hogar", contenido: "2 bolsas de 226 g (una en grano y otra molida) + tarjeta con recomendaciones de preparación", precio: 36000 },
    { id: "kit-3", nombre: "Kit Gran Familia", contenido: "1 bolsa de 1 kg + 1 bolsa de 453 g + tarjeta con la historia del origen y recomendaciones", precio: 93000 }
  ],

  /* --- Envío e impuestos ---
     costo: null mientras no haya tarifa de la transportadora. Cuando exista,
     poner el número (ej. 12000) y el checkout lo sumará al total. */
  envio: {
    // Tarifas y tiempos simulados para el proyecto académico (25-11-2026)
    costo: null, // se calcula según el departamento de destino (ver tarifas)
    tarifas: { cauca: 8000, valle: 10000, otro: 14000 },
    destinos: [
      { id: "cauca", nombre: "Cauca", tarifa: 8000, tiempo: "2 a 4 días hábiles" },
      { id: "valle", nombre: "Valle del Cauca", tarifa: 10000, tiempo: "2 a 5 días hábiles" },
      { id: "otro", nombre: "Otro departamento", tarifa: 14000, tiempo: "3 a 7 días hábiles" }
    ],
    gratisDesde: 150000,
    texto: "Cauca $8.000 · Valle del Cauca $10.000 · resto de Colombia $14.000. Gratis en compras desde $150.000",
    tiempos: "Cauca 2 a 4 días hábiles · Valle del Cauca 2 a 5 · otras ciudades 3 a 7, contados desde que se confirman el pedido y el pago",
    transportadora: "Transportadora nacional con guía y seguimiento del envío",
    ciudadesContraEntrega: "Popayán, Cali, Bogotá y Medellín, sujeto a la transportadora"
  },
  impuestos: {
    // Régimen de IVA del café tostado: confirmar con el contador del equipo.
    texto: "Precio final con los impuestos que correspondan incluidos (tratamiento del IVA por validar con asesoría contable)"
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
