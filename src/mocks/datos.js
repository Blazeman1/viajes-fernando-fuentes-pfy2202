// "BASE DE DATOS" DEL BACKEND SIMULADO.
// El frontend nunca importa este archivo: lo conoce solo a través de la
// API REST (destinos) y de la API GraphQL (vuelos y hoteles).

// Todos los vuelos salen desde Santiago de Chile.
export const ORIGEN = { ciudad: 'Santiago', aeropuerto: 'SCL' };

export const DESTINOS = [
  {
    id: 'cusco',
    nombre: 'Cusco',
    pais: 'Perú',
    continente: 'América del Sur',
    aeropuerto: 'CUZ',
    resumen: 'La antigua capital inca, puerta de entrada a Machu Picchu y al Valle Sagrado.',
    descripcion:
      'Calles de piedra levantadas sobre muros incas, iglesias coloniales y mercados llenos de color. Desde Cusco se recorren el Valle Sagrado y la ciudadela de Machu Picchu, una de las maravillas del mundo moderno.',
    idioma: 'Español y quechua',
    moneda: 'Sol peruano (PEN)',
    clima: 'Templado de altura: días soleados y noches frías (3.400 m s. n. m.).',
    mejorEpoca: 'Mayo a septiembre, temporada seca.',
    actividades: [
      { nombre: 'Machu Picchu', tipo: 'Cultura', detalle: 'Excursión de día completo en tren hasta la ciudadela inca.' },
      { nombre: 'Valle Sagrado', tipo: 'Naturaleza', detalle: 'Pisac, Ollantaytambo y las salineras de Maras.' },
      { nombre: 'Montaña de Siete Colores', tipo: 'Aventura', detalle: 'Caminata exigente hasta los 5.000 metros.' },
      { nombre: 'Cocina andina', tipo: 'Gastronomía', detalle: 'Clase de cocina con productos del mercado de San Pedro.' },
    ],
    vuelos: { aerolineas: ['LATAM', 'Sky Airline', 'JetSMART'], duracionMin: 285, escalas: 1, precioBase: 289000 },
    hoteles: [
      { nombre: 'Casa Andina San Blas', barrio: 'San Blas', estrellas: 3, precioNoche: 58000, servicios: ['Desayuno', 'Wifi', 'Oxígeno para la altura'] },
      { nombre: 'Palacio del Inka', barrio: 'Centro histórico', estrellas: 5, precioNoche: 245000, servicios: ['Desayuno', 'Spa', 'Restaurante', 'Wifi'] },
      { nombre: 'Hostal Qorikancha', barrio: 'Qorikancha', estrellas: 2, precioNoche: 32000, servicios: ['Wifi', 'Cocina compartida'] },
      { nombre: 'Tambo del Arriero', barrio: 'San Cristóbal', estrellas: 4, precioNoche: 112000, servicios: ['Desayuno', 'Wifi', 'Traslado aeropuerto'] },
    ],
  },
  {
    id: 'buenos-aires',
    nombre: 'Buenos Aires',
    pais: 'Argentina',
    continente: 'América del Sur',
    aeropuerto: 'EZE',
    resumen: 'Tango, cafés notables y la mejor parrilla del continente a dos horas de Santiago.',
    descripcion:
      'Una ciudad de avenidas anchas, barrios con identidad propia y una vida cultural que no se detiene. Teatros, librerías abiertas hasta tarde, ferias de fin de semana y cenas que empiezan pasadas las diez.',
    idioma: 'Español',
    moneda: 'Peso argentino (ARS)',
    clima: 'Templado y húmedo; veranos calurosos.',
    mejorEpoca: 'Marzo a mayo y septiembre a noviembre.',
    actividades: [
      { nombre: 'Show de tango en San Telmo', tipo: 'Cultura', detalle: 'Cena y espectáculo en una milonga tradicional.' },
      { nombre: 'Parrilla en Palermo', tipo: 'Gastronomía', detalle: 'Recorrido por las parrillas y bares del barrio.' },
      { nombre: 'Teatro Colón', tipo: 'Cultura', detalle: 'Visita guiada a uno de los teatros de ópera más importantes del mundo.' },
      { nombre: 'Delta del Tigre', tipo: 'Naturaleza', detalle: 'Paseo en lancha por los canales del delta.' },
    ],
    vuelos: { aerolineas: ['Aerolíneas Argentinas', 'LATAM', 'JetSMART'], duracionMin: 130, escalas: 0, precioBase: 159000 },
    hoteles: [
      { nombre: 'Hotel Recoleta Plaza', barrio: 'Recoleta', estrellas: 4, precioNoche: 98000, servicios: ['Desayuno', 'Wifi', 'Gimnasio'] },
      { nombre: 'Palermo Soho Suites', barrio: 'Palermo', estrellas: 3, precioNoche: 64000, servicios: ['Wifi', 'Cocina', 'Terraza'] },
      { nombre: 'Gran Hotel del Río', barrio: 'Puerto Madero', estrellas: 5, precioNoche: 210000, servicios: ['Desayuno', 'Piscina', 'Spa', 'Wifi'] },
      { nombre: 'Casa San Telmo', barrio: 'San Telmo', estrellas: 2, precioNoche: 36000, servicios: ['Wifi', 'Desayuno'] },
    ],
  },
  {
    id: 'rapa-nui',
    nombre: 'Rapa Nui',
    pais: 'Chile',
    continente: 'Oceanía',
    aeropuerto: 'IPC',
    resumen: 'Los moái, volcanes y playas de arena rosada en medio del Pacífico.',
    descripcion:
      'La isla habitada más remota del planeta guarda cerca de mil moái tallados por el pueblo rapanui. Se recorre en bicicleta, a caballo o a pie, entre cráteres, cuevas y playas de agua turquesa.',
    idioma: 'Español y rapanui',
    moneda: 'Peso chileno (CLP)',
    clima: 'Subtropical; templado todo el año.',
    mejorEpoca: 'Enero y febrero, durante la fiesta Tapati.',
    actividades: [
      { nombre: 'Amanecer en Tongariki', tipo: 'Cultura', detalle: 'Los quince moái del ahu más grande de la isla.' },
      { nombre: 'Playa Anakena', tipo: 'Playa', detalle: 'Arena blanca, palmeras y dos ahu frente al mar.' },
      { nombre: 'Volcán Rano Kau', tipo: 'Naturaleza', detalle: 'Cráter con una laguna y la aldea ceremonial de Orongo.' },
      { nombre: 'Buceo en Motu Nui', tipo: 'Aventura', detalle: 'Inmersiones con visibilidad de hasta 60 metros.' },
    ],
    vuelos: { aerolineas: ['LATAM'], duracionMin: 335, escalas: 0, precioBase: 398000 },
    hoteles: [
      { nombre: 'Cabañas Hare Nui', barrio: 'Hanga Roa', estrellas: 3, precioNoche: 85000, servicios: ['Desayuno', 'Wifi', 'Arriendo de bicicletas'] },
      { nombre: 'Ecolodge Te Moana', barrio: 'Costa sur', estrellas: 4, precioNoche: 168000, servicios: ['Desayuno', 'Traslado aeropuerto', 'Excursiones'] },
      { nombre: 'Hostal Vaikava', barrio: 'Hanga Roa', estrellas: 2, precioNoche: 42000, servicios: ['Cocina compartida', 'Camping'] },
      { nombre: 'Hotel Tahai', barrio: 'Tahai', estrellas: 5, precioNoche: 320000, servicios: ['Todo incluido', 'Piscina', 'Spa'] },
    ],
  },
  {
    id: 'ciudad-de-mexico',
    nombre: 'Ciudad de México',
    pais: 'México',
    continente: 'América del Norte',
    aeropuerto: 'MEX',
    resumen: 'Pirámides, murales, museos de primer nivel y una cocina que es patrimonio de la humanidad.',
    descripcion:
      'Una de las ciudades más grandes del mundo, con más museos que casi cualquier otra. El Zócalo, Coyoacán y Xochimilco conviven con mercados, cantinas y una escena gastronómica inagotable.',
    idioma: 'Español',
    moneda: 'Peso mexicano (MXN)',
    clima: 'Templado de altura; lluvias por las tardes en verano.',
    mejorEpoca: 'Octubre a abril.',
    actividades: [
      { nombre: 'Teotihuacán', tipo: 'Cultura', detalle: 'Las pirámides del Sol y de la Luna, con opción de globo al amanecer.' },
      { nombre: 'Tacos en el centro', tipo: 'Gastronomía', detalle: 'Recorrido por taquerías y mercados tradicionales.' },
      { nombre: 'Museo Frida Kahlo', tipo: 'Cultura', detalle: 'La Casa Azul en el barrio de Coyoacán.' },
      { nombre: 'Trajineras de Xochimilco', tipo: 'Ciudad', detalle: 'Paseo por los canales con mariachis.' },
    ],
    vuelos: { aerolineas: ['Aeroméxico', 'LATAM', 'Copa Airlines'], duracionMin: 520, escalas: 0, precioBase: 489000 },
    hoteles: [
      { nombre: 'Hotel Roma Norte', barrio: 'Roma Norte', estrellas: 4, precioNoche: 104000, servicios: ['Desayuno', 'Wifi', 'Terraza'] },
      { nombre: 'Gran Hotel Zócalo', barrio: 'Centro histórico', estrellas: 5, precioNoche: 188000, servicios: ['Desayuno', 'Restaurante', 'Spa'] },
      { nombre: 'Casa Coyoacán', barrio: 'Coyoacán', estrellas: 3, precioNoche: 69000, servicios: ['Desayuno', 'Wifi', 'Jardín'] },
      { nombre: 'Hostal Condesa', barrio: 'Condesa', estrellas: 2, precioNoche: 31000, servicios: ['Wifi', 'Cocina compartida'] },
    ],
  },
  {
    id: 'cartagena',
    nombre: 'Cartagena de Indias',
    pais: 'Colombia',
    continente: 'América del Sur',
    aeropuerto: 'CTG',
    resumen: 'Ciudad amurallada, casas coloniales de colores y las islas del Caribe a minutos.',
    descripcion:
      'El casco histórico amurallado es patrimonio de la humanidad: balcones con flores, plazas y atardeceres sobre la muralla. A una hora en lancha esperan las playas de las Islas del Rosario.',
    idioma: 'Español',
    moneda: 'Peso colombiano (COP)',
    clima: 'Tropical cálido, todo el año sobre 28 °C.',
    mejorEpoca: 'Diciembre a abril, temporada seca.',
    actividades: [
      { nombre: 'Islas del Rosario', tipo: 'Playa', detalle: 'Día de playa y snorkel en el Caribe.' },
      { nombre: 'Ciudad amurallada', tipo: 'Cultura', detalle: 'Recorrido a pie por el centro histórico y Getsemaní.' },
      { nombre: 'Castillo de San Felipe', tipo: 'Cultura', detalle: 'La mayor fortaleza española en América.' },
      { nombre: 'Cocina caribeña', tipo: 'Gastronomía', detalle: 'Pescado frito, arepas de huevo y jugos tropicales.' },
    ],
    vuelos: { aerolineas: ['Avianca', 'LATAM', 'Copa Airlines'], duracionMin: 395, escalas: 1, precioBase: 412000 },
    hoteles: [
      { nombre: 'Casa Getsemaní', barrio: 'Getsemaní', estrellas: 3, precioNoche: 72000, servicios: ['Desayuno', 'Piscina', 'Wifi'] },
      { nombre: 'Hotel Bocagrande Mar', barrio: 'Bocagrande', estrellas: 4, precioNoche: 118000, servicios: ['Desayuno', 'Playa', 'Piscina'] },
      { nombre: 'Claustro de Santa Clara', barrio: 'Ciudad amurallada', estrellas: 5, precioNoche: 265000, servicios: ['Desayuno', 'Spa', 'Restaurante'] },
      { nombre: 'Hostal La Muralla', barrio: 'San Diego', estrellas: 2, precioNoche: 38000, servicios: ['Wifi', 'Terraza'] },
    ],
  },
  {
    id: 'nueva-york',
    nombre: 'Nueva York',
    pais: 'Estados Unidos',
    continente: 'América del Norte',
    aeropuerto: 'JFK',
    resumen: 'Rascacielos, Broadway, Central Park y museos que se recorren en semanas.',
    descripcion:
      'Cinco distritos con barrios que parecen ciudades distintas. Del skyline de Manhattan a los murales de Brooklyn, pasando por el MET, el MoMA y los musicales de Broadway.',
    idioma: 'Inglés',
    moneda: 'Dólar estadounidense (USD)',
    clima: 'Continental: inviernos fríos con nieve y veranos calurosos.',
    mejorEpoca: 'Abril a junio y septiembre a noviembre.',
    actividades: [
      { nombre: 'Musical en Broadway', tipo: 'Cultura', detalle: 'Funciones todos los días en Times Square.' },
      { nombre: 'Central Park en bicicleta', tipo: 'Naturaleza', detalle: 'Diez kilómetros de circuito entre lagos y puentes.' },
      { nombre: 'Museo Metropolitano', tipo: 'Cultura', detalle: 'Más de cinco mil años de arte en un solo edificio.' },
      { nombre: 'Puente de Brooklyn', tipo: 'Ciudad', detalle: 'Caminata al atardecer con vista a Manhattan.' },
    ],
    vuelos: { aerolineas: ['LATAM', 'American Airlines', 'Delta'], duracionMin: 650, escalas: 0, precioBase: 689000 },
    hoteles: [
      { nombre: 'Midtown Lofts', barrio: 'Midtown', estrellas: 4, precioNoche: 238000, servicios: ['Wifi', 'Gimnasio', 'Bar'] },
      { nombre: 'Brooklyn Bridge Inn', barrio: 'Brooklyn', estrellas: 3, precioNoche: 156000, servicios: ['Desayuno', 'Wifi'] },
      { nombre: 'The Park Avenue', barrio: 'Upper East Side', estrellas: 5, precioNoche: 465000, servicios: ['Desayuno', 'Spa', 'Restaurante', 'Gimnasio'] },
      { nombre: 'Harlem Hostel', barrio: 'Harlem', estrellas: 2, precioNoche: 74000, servicios: ['Wifi', 'Cocina compartida'] },
    ],
  },
  {
    id: 'madrid',
    nombre: 'Madrid',
    pais: 'España',
    continente: 'Europa',
    aeropuerto: 'MAD',
    resumen: 'El Prado, tapas en La Latina y noches que terminan al amanecer.',
    descripcion:
      'La capital española combina tres museos de categoría mundial en una sola avenida, parques enormes como El Retiro y una cultura de bares y terrazas que llena las calles a toda hora.',
    idioma: 'Español',
    moneda: 'Euro (EUR)',
    clima: 'Continental: veranos secos y calurosos, inviernos fríos y soleados.',
    mejorEpoca: 'Abril a junio y septiembre a octubre.',
    actividades: [
      { nombre: 'Museo del Prado', tipo: 'Cultura', detalle: 'Velázquez, Goya y El Bosco en una visita guiada.' },
      { nombre: 'Tapas en La Latina', tipo: 'Gastronomía', detalle: 'Ruta por los bares de la Cava Baja.' },
      { nombre: 'Parque de El Retiro', tipo: 'Naturaleza', detalle: 'Paseo en bote por el estanque y el Palacio de Cristal.' },
      { nombre: 'Excursión a Toledo', tipo: 'Cultura', detalle: 'La ciudad de las tres culturas, a 30 minutos en tren.' },
    ],
    vuelos: { aerolineas: ['Iberia', 'LATAM', 'Air Europa'], duracionMin: 780, escalas: 0, precioBase: 829000 },
    hoteles: [
      { nombre: 'Hotel Gran Vía', barrio: 'Centro', estrellas: 4, precioNoche: 142000, servicios: ['Desayuno', 'Wifi', 'Terraza'] },
      { nombre: 'Hostal Lavapiés', barrio: 'Lavapiés', estrellas: 2, precioNoche: 52000, servicios: ['Wifi'] },
      { nombre: 'Palacio de Salamanca', barrio: 'Salamanca', estrellas: 5, precioNoche: 330000, servicios: ['Desayuno', 'Spa', 'Piscina', 'Restaurante'] },
      { nombre: 'Apartamentos Malasaña', barrio: 'Malasaña', estrellas: 3, precioNoche: 89000, servicios: ['Cocina', 'Wifi'] },
    ],
  },
  {
    id: 'roma',
    nombre: 'Roma',
    pais: 'Italia',
    continente: 'Europa',
    aeropuerto: 'FCO',
    resumen: 'Dos mil años de historia al aire libre, pasta fresca y el mejor gelato.',
    descripcion:
      'El Coliseo, el Foro y el Panteón están a minutos a pie unos de otros. Entre ruinas, plazas barrocas y trattorias de barrio, Roma se disfruta sin apuro y con mucho apetito.',
    idioma: 'Italiano',
    moneda: 'Euro (EUR)',
    clima: 'Mediterráneo: veranos calurosos e inviernos suaves.',
    mejorEpoca: 'Abril a junio y septiembre a octubre.',
    actividades: [
      { nombre: 'Coliseo y Foro Romano', tipo: 'Cultura', detalle: 'Entrada sin filas con guía en español.' },
      { nombre: 'Museos Vaticanos', tipo: 'Cultura', detalle: 'La Capilla Sixtina y la Basílica de San Pedro.' },
      { nombre: 'Trastevere de noche', tipo: 'Gastronomía', detalle: 'Pasta, pizza al taglio y gelato en el barrio más bohemio.' },
      { nombre: 'Vespa por la ciudad', tipo: 'Aventura', detalle: 'Recorrido en scooter por las siete colinas.' },
    ],
    vuelos: { aerolineas: ['ITA Airways', 'Iberia', 'Air France'], duracionMin: 905, escalas: 1, precioBase: 915000 },
    hoteles: [
      { nombre: 'Albergo del Senato', barrio: 'Panteón', estrellas: 4, precioNoche: 198000, servicios: ['Desayuno', 'Terraza', 'Wifi'] },
      { nombre: 'Casa Trastevere', barrio: 'Trastevere', estrellas: 3, precioNoche: 108000, servicios: ['Desayuno', 'Wifi'] },
      { nombre: 'Hotel Villa Borghese', barrio: 'Parioli', estrellas: 5, precioNoche: 385000, servicios: ['Desayuno', 'Spa', 'Restaurante'] },
      { nombre: 'Ostello Termini', barrio: 'Termini', estrellas: 2, precioNoche: 46000, servicios: ['Wifi', 'Cocina compartida'] },
    ],
  },
  {
    id: 'tokio',
    nombre: 'Tokio',
    pais: 'Japón',
    continente: 'Asia',
    aeropuerto: 'NRT',
    resumen: 'Templos, neón, trenes puntuales y la ciudad con más estrellas Michelin del mundo.',
    descripcion:
      'Tokio pasa de la calma de un santuario sintoísta al cruce peatonal más concurrido del planeta en una sola estación de metro. Barrios como Asakusa, Shibuya o Akihabara muestran caras muy distintas de Japón.',
    idioma: 'Japonés',
    moneda: 'Yen (JPY)',
    clima: 'Templado húmedo: veranos calurosos y otoños suaves.',
    mejorEpoca: 'Marzo a mayo (cerezos en flor) y octubre a noviembre.',
    actividades: [
      { nombre: 'Templo Senso-ji', tipo: 'Cultura', detalle: 'El templo más antiguo de Tokio, en Asakusa.' },
      { nombre: 'Cruce de Shibuya', tipo: 'Ciudad', detalle: 'Miles de personas cruzando a la vez bajo pantallas gigantes.' },
      { nombre: 'Mercado de Tsukiji', tipo: 'Gastronomía', detalle: 'Sushi para el desayuno y puestos de comida callejera.' },
      { nombre: 'Monte Fuji', tipo: 'Naturaleza', detalle: 'Excursión de un día a los cinco lagos.' },
    ],
    vuelos: { aerolineas: ['LATAM', 'Japan Airlines', 'Qatar Airways'], duracionMin: 1590, escalas: 1, precioBase: 1490000 },
    hoteles: [
      { nombre: 'Shinjuku Sky Hotel', barrio: 'Shinjuku', estrellas: 4, precioNoche: 176000, servicios: ['Wifi', 'Restaurante', 'Onsen'] },
      { nombre: 'Ryokan Asakusa', barrio: 'Asakusa', estrellas: 3, precioNoche: 124000, servicios: ['Desayuno japonés', 'Onsen'] },
      { nombre: 'Capsule Akihabara', barrio: 'Akihabara', estrellas: 2, precioNoche: 39000, servicios: ['Wifi', 'Baños compartidos'] },
      { nombre: 'Imperial Garden Tokyo', barrio: 'Chiyoda', estrellas: 5, precioNoche: 410000, servicios: ['Desayuno', 'Spa', 'Piscina', 'Restaurante'] },
    ],
  },
  {
    id: 'rio-de-janeiro',
    nombre: 'Río de Janeiro',
    pais: 'Brasil',
    continente: 'América del Sur',
    aeropuerto: 'GIG',
    resumen: 'Playas famosas, el Cristo Redentor y la energía de la samba.',
    descripcion:
      'Entre el mar y los cerros cubiertos de selva, Río ofrece playas como Copacabana e Ipanema, miradores espectaculares y una vida nocturna que gira en torno a la samba y la bossa nova.',
    idioma: 'Portugués',
    moneda: 'Real brasileño (BRL)',
    clima: 'Tropical: caluroso y húmedo en verano.',
    mejorEpoca: 'Diciembre a marzo (verano y Carnaval).',
    actividades: [
      { nombre: 'Cristo Redentor', tipo: 'Cultura', detalle: 'Subida en tren al cerro del Corcovado.' },
      { nombre: 'Playa de Ipanema', tipo: 'Playa', detalle: 'Atardecer aplaudido desde la Piedra del Arpoador.' },
      { nombre: 'Pan de Azúcar', tipo: 'Naturaleza', detalle: 'Teleférico con vista a toda la bahía de Guanabara.' },
      { nombre: 'Samba en Lapa', tipo: 'Ciudad', detalle: 'Música en vivo bajo los arcos del antiguo acueducto.' },
    ],
    vuelos: { aerolineas: ['LATAM', 'GOL', 'Azul'], duracionMin: 245, escalas: 0, precioBase: 329000 },
    hoteles: [
      { nombre: 'Copacabana Palace View', barrio: 'Copacabana', estrellas: 5, precioNoche: 295000, servicios: ['Desayuno', 'Piscina', 'Playa', 'Spa'] },
      { nombre: 'Ipanema Beach Hotel', barrio: 'Ipanema', estrellas: 4, precioNoche: 148000, servicios: ['Desayuno', 'Wifi', 'Terraza'] },
      { nombre: 'Pousada Santa Teresa', barrio: 'Santa Teresa', estrellas: 3, precioNoche: 76000, servicios: ['Desayuno', 'Jardín'] },
      { nombre: 'Hostel Botafogo', barrio: 'Botafogo', estrellas: 2, precioNoche: 34000, servicios: ['Wifi', 'Bar'] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Vuelos y hoteles: se generan de forma DETERMINISTA a partir de los datos de
// cada destino (siempre las mismas fechas, precios y cupos), para que la
// interfaz y las pruebas vean exactamente los mismos resultados.
// ---------------------------------------------------------------------------

// Cinco salidas por destino durante el verano 2026-2027.
const SALIDAS = [
  { fecha: '2026-12-12', hora: '07:40', noches: 7 },
  { fecha: '2026-12-26', hora: '13:15', noches: 10 },
  { fecha: '2027-01-09', hora: '22:30', noches: 7 },
  { fecha: '2027-01-23', hora: '09:05', noches: 14 },
  { fecha: '2027-02-13', hora: '18:50', noches: 7 },
];
const FACTOR_PRECIO = [1, 1.18, 0.92, 1.06, 0.85];
// Variedad de cupos: hay salidas agotadas y salidas con pocos asientos.
const CUPOS = [[14, 3, 0, 22, 6], [9, 0, 17, 2, 11], [0, 12, 5, 19, 1]];
const CUPOS_HOTEL = [[8, 2, 0, 15], [0, 6, 11, 3], [5, 0, 7, 12]];
// Ventanas de disponibilidad de cada hotel (desde / hasta).
const VENTANAS = [
  ['2026-12-01', '2027-03-15'],
  ['2026-12-15', '2027-01-31'],
  ['2027-01-05', '2027-03-31'],
  ['2026-12-01', '2027-01-10'],
];

// Suma días a una fecha "AAAA-MM-DD" sin pasar por zonas horarias.
export function sumarDias(fechaISO, dias) {
  const [a, m, d] = fechaISO.split('-').map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d + dias));
  return fecha.toISOString().slice(0, 10);
}

function sumarMinutos(fechaISO, hora, minutos) {
  const [a, m, d] = fechaISO.split('-').map(Number);
  const [h, min] = hora.split(':').map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d, h, min + minutos));
  return fecha.toISOString().slice(0, 16); // "AAAA-MM-DDTHH:MM"
}

const redondear = (n) => Math.round(n / 1000) * 1000;

function generarVuelos(destino, indice) {
  const { aerolineas, duracionMin, escalas, precioBase } = destino.vuelos;
  const cupos = CUPOS[indice % CUPOS.length];

  return SALIDAS.map((salida, i) => {
    const aerolinea = aerolineas[i % aerolineas.length];
    // La salida más barata (i = 4) hace una escala extra y tarda más.
    const conEscalaExtra = i === 4;
    const premium = i === 1;
    const duracion = duracionMin + (conEscalaExtra ? 150 : 0);
    const codigo = aerolinea.replace(/[^A-Z]/g, '').slice(0, 2).padEnd(2, 'X');
    return {
      id: `${destino.id}-v${i + 1}`,
      destinoId: destino.id,
      aerolinea,
      numero: `${codigo}${100 + indice * 37 + i * 11}`,
      origen: ORIGEN.aeropuerto,
      destino: destino.aeropuerto,
      salida: `${salida.fecha}T${salida.hora}`,
      llegada: sumarMinutos(salida.fecha, salida.hora, duracion),
      regreso: sumarDias(salida.fecha, salida.noches + 1),
      duracionMin: duracion,
      escalas: escalas + (conEscalaExtra ? 1 : 0),
      clase: premium ? 'Premium Economy' : 'Económica',
      equipaje: i === 4 ? 'Solo mochila' : 'Maleta de 23 kg',
      precio: redondear(precioBase * FACTOR_PRECIO[i] * (premium ? 1.7 : 1)),
      asientosDisponibles: cupos[i],
    };
  });
}

function generarHoteles(destino, indice) {
  const cupos = CUPOS_HOTEL[indice % CUPOS_HOTEL.length];
  return destino.hoteles.map((hotel, j) => ({
    id: `${destino.id}-h${j + 1}`,
    destinoId: destino.id,
    ...hotel,
    calificacion: Math.round(Math.min(9.8, 6.9 + hotel.estrellas * 0.5 + ((indice + j) % 3) * 0.2) * 10) / 10,
    disponibleDesde: VENTANAS[j][0],
    disponibleHasta: VENTANAS[j][1],
    habitacionesDisponibles: cupos[j],
  }));
}

export const VUELOS = DESTINOS.flatMap(generarVuelos);
export const HOTELES = DESTINOS.flatMap(generarHoteles);
