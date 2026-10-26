/* TERAPIA ESPACIAL — estado del programa (lo comparten el panel, la botonera y la salida). */
(function () {
  const ESTADO_BASE = {
    config: {
      programa: 'TERAPIA ESPACIAL',
      fondo: 'verde',                      // verde | espacio | transparente
      colores: {
        espacio: '#0B0B1A', violeta: '#7B2FF7', magenta: '#FF3DCB', rayo: '#FFF4C2', blanco: '#FFFFFF', menta: '#D6EFC7',
        violetaOsc: '#4A1A9E', violetaClaro: '#A77BFF', pantalon: '#26244F', piel: '#E8A987', pelo: '#3A1B4F'
      },
      fuenteTitulo: 'Orbitron',
      fuenteTexto: 'Inter',
      logo: null,
      bordeIzq: 140, gcY: 880, tamGC: 54,
      ovniPausa: true, bamboleo: 1, velocidad: 1,
      autoSalidaGC: 0, segTitular: 6,
      transicion: 'aleatoria',             // aleatoria | rayo | hipnosis | rorschach | onda
      etiquetaSesion: 'SESIÓN EN CURSO',
      ticker: 'Terapia Espacial: la consulta que atiende a pacientes de todo el universo · Avistamientos en El Enladrillado, San Clemente, lago Colbún y laguna del Maule · Salud mental estudiantil: pedir ayuda también es valentía · Escríbenos tus dudas en nuestras redes'
    },
    // icono: '' | 'alien' (paciente) | 'terapeuta'
    gcs: [
      { titulo: 'Luis Monasterios', sub: 'Presentador', icono: '' },
      { titulo: 'Benjamín Castillo', sub: 'Parapsicólogo', icono: '' },
      { titulo: 'Sophia Jaque', sub: 'Psicóloga', icono: 'terapeuta' },
      { titulo: 'Paciente X-27', sub: 'Visitante de otro planeta', icono: 'alien' }
    ],
    // Titulares «Últimas Noticias»: GC centrado + lugar en la esquina superior derecha. fondo: '' (el general) | 'verde' | 'espacio'
    titulares: [
      { titulo: 'Últimas Noticias', sub: 'Los últimos acontecimientos en materia meteorológica, deportiva y cultural', lugar: 'Talca, Región del Maule', fondo: 'verde' },
      { titulo: 'Últimas Noticias', sub: 'Los últimos sucesos de política y economía que afectan a nuestro país.', lugar: 'Santiago, Región Metropolitana', fondo: 'verde' },
      { titulo: 'Últimas Noticias', sub: 'Noticia Internacional', lugar: 'Barquisimeto, Venezuela', fondo: 'verde' },
      { titulo: 'Últimas Noticias', sub: 'Noticia Internacional', lugar: 'Buenos Aires, Argentina', fondo: 'verde' },
      { titulo: 'Últimas Noticias', sub: 'Noticia Internacional', lugar: 'Hollywood, Estados Unidos', fondo: 'verde' }
    ],
    textos: {
      cortinaTitulo: { titulo: 'OVNIS CAPTADOS EN CÁMARA', sub: '¿ESTAMOS SOLOS EN EL UNIVERSO?' },
      aviso: { titulo: '¡NUEVO AVISTAMIENTO!', sub: 'El Enladrillado · Región del Maule' },
      volvemos: { titulo: 'VOLVEMOS ENSEGUIDA', sub: 'LA SESIÓN CONTINÚA' },
      avance: { titulo: 'AVANCE INFORMATIVO', sub: 'ÚLTIMAS NOTICIAS · TALCA · CHILE · INTERNACIONAL' },
      triplex: { titulo: 'OVNI · OSNI · FANI', etiquetas: ['LUIS MONASTERIOS', 'AVISTAMIENTOS', 'BENJAMÍN CASTILLO'] },
      duplex: { titulo: 'SALUD MENTAL', etiquetas: ['SOPHIA JAQUE', 'NOTA · SALUD MENTAL'] },
      apertura: { titulo: 'TERAPIA ESPACIAL', sub: 'CON LUIS A. MONASTERIOS' },
      cierre: { titulo: 'TERAPIA ESPACIAL', sub: 'FIN DE LA SESIÓN · NOS VEMOS EN UN NUEVO PROGRAMA' }
    },
    aire: {
      gc: null, titular: null, cortinaTitulo: false, aviso: false, volvemos: false,
      triplex: false, duplex: false, bug: false, ticker: false,
      // gráficas con duración (se pueden sacar antes con otro toque): { id, variante } o null
      apertura: null, cierre: null, cortina: null, transicion: null
    },
    paso: -1,               // paso actual de la pauta (compartido entre equipos)
    botonera: null          // { botones: [...] } — se siembra en el panel
  };

  function copia(o) { return JSON.parse(JSON.stringify(o)); }
  function mezclar(base, extra) {
    if (!extra || typeof extra !== 'object' || Array.isArray(extra)) return extra === undefined ? base : extra;
    const out = Array.isArray(base) ? [] : Object.assign({}, base);
    for (const k of Object.keys(extra)) {
      out[k] = (base && typeof base[k] === 'object' && !Array.isArray(base[k]) && base[k] !== null)
        ? mezclar(base[k], extra[k]) : extra[k];
    }
    return out;
  }
  // compatibilidad con la v2 (paciente: true)
  function normalizar(e) {
    const est = mezclar(copia(ESTADO_BASE), e || {});
    (est.gcs || []).forEach(g => { if (g.paciente && !g.icono) g.icono = 'alien'; delete g.paciente; if (g.icono === undefined) g.icono = ''; if (g.fondo === undefined) g.fondo = ''; });
    // titulares de la v2 ({seccion, texto}) → formato nuevo
    est.titulares = (est.titulares || []).map(h => h.texto !== undefined && h.titulo === undefined
      ? { titulo: h.texto, sub: '', lugar: '', fondo: '' } : Object.assign({ titulo: '', sub: '', lugar: '', fondo: '' }, h));
    Object.keys(est.textos).forEach(k => { if (est.textos[k].fondo === undefined) est.textos[k].fondo = ''; });
    delete est.disparo;
    if (['verde', 'espacio', 'transparente'].indexOf(est.config.fondo) < 0) est.config.fondo = 'verde';
    return est;
  }
  function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  window.TE = { ESTADO_BASE, copia, mezclar, normalizar, id };
})();
