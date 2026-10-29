/* ENTRE OVNIS Y FANTASMAS — datos del programa nuevo (los comparten el panel, la botonera y la salida).
   Se guarda dentro del estado de la sala como E.eoyf. El programa activo está en E.programa ('eoyf' | 'te'). */
(function () {
  var hoy = new Date();
  var MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  var BASE = {
    config: {
      programa: 'ENTRE OVNIS Y FANTASMAS',
      fondo: 'azul',                    // azul (fijo por defecto, no se limpia) | verde | transparente
      efecto: 'tema',                   // efecto general de entrada/salida: tema (ovni o fantasma según la gráfica) | ovni | fantasma
      vivoTexto: 'EN VIVO',
      numero: '666-9999',
      fecha: hoy.getDate() + ' ' + MESES[hoy.getMonth()] + ' ' + hoy.getFullYear(),
      marcaOpacidad: 0.85,
      velocidad: 1,
      colores: { carbon: '#17171C', carbon2: '#2A2A31', verde: '#7CC242', naranjo: '#FF7A1A', rojo: '#C8102E', blanco: '#FFFFFF', hueso: '#E9E2D0' },
      ticker: 'El enigma de Colbún: vecinos describen luces que se sumergen en el lago sin hacer ruido · ' +
        'Ruta Ufológica del Maule: San Clemente, El Enladrillado y Vilches Alto · ' +
        'Sanatorio Los Maitenes: nuestro equipo cruzó el umbral en una incursión nocturna · ' +
        'El Enladrillado, la meseta de piedra que atrae a investigadores de todo el mundo · ' +
        'La Nota Espectral: talquinos cuentan sus experiencias paranormales · ' +
        'Cuéntanos tu experiencia: deja un mensaje de voz al 666-9999 · ' +
        'Envía ALIEN a nuestro número y obtén hasta un 50% de descuento'
    },
    // tema: ovni (verde · alien) | fantasma (naranjo · calabaza) | neutro (rojo · ojo)
    gcs: [
      { nombre: 'Luis Monasterios', cargo: 'Conductor', tema: 'ovni' },
      { nombre: 'Benjamín Castillo', cargo: 'Parapsicólogo', tema: 'fantasma' },
      { nombre: 'Noris Ystúriz', cargo: 'Testigo', tema: 'ovni' },
      { nombre: 'Andrea Monasterios', cargo: 'Testigo', tema: 'fantasma' },
      { nombre: 'Lucía Osorio', cargo: 'Reportera', tema: 'ovni' },
      { nombre: 'Canela Arroyo', cargo: 'Reportera', tema: 'fantasma' }
    ],
    titulos: [
      { titulo: 'OVNIS CAPTADOS EN CÁMARA', sub: '¿Estamos solos en el universo?', etiqueta: 'EXPEDIENTE OVNI', tema: 'ovni' },
      { titulo: 'EL ENIGMA DE COLBÚN', sub: 'Luces que se sumergen en el lago', etiqueta: 'EXPEDIENTE OVNI', tema: 'ovni' },
      { titulo: 'VISITA AL SANATORIO', sub: 'Los Maitenes: cruzamos el umbral', etiqueta: 'EXPEDIENTE FANTASMA', tema: 'fantasma' },
      { titulo: 'LA NOTA ESPECTRAL', sub: 'Talca nos cuenta sus experiencias paranormales', etiqueta: 'NUEVA SECCIÓN', tema: 'fantasma' },
      { titulo: 'ENTRE OVNIS Y FANTASMAS', sub: 'Capítulo piloto · con Luis Monasterios', etiqueta: 'ESTRENO', tema: 'neutro' },
      { titulo: 'ENTRE OVNIS Y FANTASMAS', sub: 'No se despegue: volvemos enseguida', etiqueta: 'VOLVEMOS', tema: 'neutro' },
      { titulo: 'HASTA PRONTO, AMIGOS INVISIBLES', sub: 'Nos vemos en una próxima entrega', etiqueta: 'ENTRE OVNIS Y FANTASMAS', tema: 'neutro' },
      { titulo: 'PRÓXIMO CAPÍTULO', sub: 'Muy pronto en Entre Ovnis y Fantasmas', etiqueta: 'NO TE LO PIERDAS', tema: 'neutro' }
    ],
    // cortinas y transiciones: duración elegible 2 · 3 · 4 · 5 s
    efectos: {
      ovni: { dur: 2 }, fantasma: { dur: 2 }, barrido: { dur: 3 }, expediente: { dur: 3 }, estatica: { dur: 2 }, murcielagos: { dur: 3 }, apagon: { dur: 3 },
      rayo: { dur: 2 }, hipnosis: { dur: 2 }, rorschach: { dur: 2 }, psicofonia: { dur: 2 }
    },
    ubicacion: { texto: 'Sanatorio Los Maitenes, Talca · Región del Maule', tema: 'fantasma' },
    visor: { modo: 'VISIÓN NOCTURNA · CANAL 1' },
    emf: { titulo: 'Medidor EMF', lugar: 'Los Maitenes', nivel: 4, etiqueta: 'ACTIVIDAD PARANORMAL', tema: 'fantasma' },
    redes: { titulo: 'SÍGUENOS', usuario: '@entreovnisyfantasmas', texto: 'Instagram · TikTok · Facebook', tema: 'ovni' },
    creditos: {
      dur: 25, cierre: 'Hasta pronto, amigos invisibles', tituloLogos: 'AUSPICIAN', logos: true,
      texto: 'Conducción: Luis Monasterios\nInvestigación paranormal: Benjamín Castillo\nReporteras: Lucía Osorio · Canela Arroyo\nTestimonios: Noris Ystúriz · Andrea Monasterios\nDirección: \nProducción: \nCámaras: \nGráficas y switch: \nUna producción de: Entre Ovnis y Fantasmas'
    },
    terreno: { etiqueta: 'EN TERRENO', lugar: 'Sanatorio Los Maitenes', sub: 'Recorrido nocturno · Región del Maule', tema: 'fantasma' },
    datos: [
      { titulo: 'Sanatorio Los Maitenes', texto: 'Se estima que a lo largo de los años, entre 500 y 1000 fallecidos han perdido la vida en este recinto. Siendo la era de tuberculosis la más fuerte.', etiqueta: 'DATO', tema: 'fantasma' },
      { titulo: 'Lago Colbún', texto: 'San Clemente, El Enladrillado y Vilches Alto componen la denominada Ruta Ufológica.', etiqueta: 'DATO', tema: 'ovni' }
    ],
    sabias: { titulo: '¿SABÍAS QUÉ?', texto: 'Los hombres suelen estar más interesados en las historias de ovnis y las mujeres en las de fantasmas.' },
    promo: { titulo: 'ENVÍA «ALIEN»', texto: 'a nuestro número y obtén un código de dscto de hasta un 50%', badge: '50%' },
    llamenos: { titulo: 'LLÁMENOS', texto: 'Cuéntanos tu experiencia: déjanos un mensaje de voz' },
    menciones: [
      { marca: "Papas Lay's", texto: 'Un sabor irresistible que te abduce desde el primer bocado', logo: 'eoyf/lays.png', color: '#FFC20E', etiqueta: 'AUSPICIA' },
      { marca: 'One Wish Willow', texto: 'Con el código de DSCTO ALIEN hasta un 50% en todas nuestras sucursales', logo: 'eoyf/onewishwillow.png', color: '#B5122F', etiqueta: 'AUSPICIA' },
      { marca: 'Santo Tomás', texto: 'Lux et veritas · Matricúlate y descubre tu futuro', logo: 'eoyf/santotomas.svg', color: '#00843D', etiqueta: 'MENCIÓN' }
    ],
    multiplex: {
      triplex: { titulo: 'TRIPLEX ALIEN', etiquetas: ['LUIS MONASTERIOS', 'AVISTAMIENTOS', 'BENJAMÍN CASTILLO'] },
      duplex: { titulo: 'DUPLEX FANTASMAS', etiquetas: ['BENJAMÍN CASTILLO', 'SANATORIO LOS MAITENES'] }
    },
    // inferior: 'gc:N' | 'tit:N' | 'terreno' | 'sabias' | 'promo' | 'llamenos' | 'men:N' · lateral: 'dato:N'
    aire: { inferior: null, lateral: null, marca: false, ticker: false, multiplex: null, cortina: null, creditos: null, visor: false, ubicacion: false, vivo: false },
    v: 2,
    paso: -1,
    botonera: null
  };

  function normalizar(p) {
    var viejo = !(p && p.v >= 2);
    var est = TE.mezclar(TE.copia(BASE), p || {});
    ['gcs', 'titulos', 'datos', 'menciones'].forEach(function (k) { if (!Array.isArray(est[k])) est[k] = TE.copia(BASE[k]); });
    // v2: la pantalla azul queda fija por defecto
    if (viejo) { est.config.fondo = 'azul'; est.v = 2; }
    if (['transparente', 'azul', 'verde'].indexOf(est.config.fondo) < 0) est.config.fondo = 'azul';
    for (var e in BASE.efectos) { if (!est.efectos[e] || [2, 3, 4, 5].indexOf(+est.efectos[e].dur) < 0) est.efectos[e] = { dur: BASE.efectos[e].dur }; }
    if (!est.aire || typeof est.aire !== 'object') est.aire = TE.copia(BASE.aire);
    return est;
  }
  // lista de cortinas y transiciones para la botonera
  var EFECTOS = [
    ['ovni', 'cortina', '🛸 Cortina OVNI', 'platillo + rayo + logo', 'ovni'],
    ['fantasma', 'cortina', '👻 Cortina FANTASMA', 'niebla + espectro + mano', 'fantasma'],
    ['barrido', 'cortina', '🛸 Barrido OVNI', 'paneles tras el platillo', 'ovni'],
    ['expediente', 'cortina', '🗂️ Expediente', 'máquina de escribir + CLASIFICADO', 'neutro'],
    ['estatica', 'cortina', '📺 Señal perdida', 'estática de TV + REC', 'neutro'],
    ['murcielagos', 'cortina', '🦇 Murciélagos', 'bandada en la noche roja', 'fantasma'],
    ['apagon', 'cortina', '🔦 Apagón', 'se corta la luz + linterna', 'fantasma'],
    ['rayo', 'transicion', '🛸 Rayo tractor', 'el rayo tapa la pantalla', 'ovni'],
    ['hipnosis', 'transicion', '🌀 Hipnosis alien', 'espiral + cabeza alien', 'ovni'],
    ['rorschach', 'transicion', '🩸 Ectoplasma', 'mancha que crece', 'fantasma'],
    ['psicofonia', 'transicion', '〰️ Psicofonía', 'onda de voz + nombre', 'fantasma']
  ];
  window.EOYF_DATOS = { BASE: BASE, normalizar: normalizar, EFECTOS: EFECTOS };
})();
