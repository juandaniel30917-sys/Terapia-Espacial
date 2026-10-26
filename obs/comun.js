/* TERAPIA ESPACIAL — estado compartido y conexión panel ⇄ salida
   - Con servidor (http://…): Server-Sent Events + POST /cmd  → funciona desde el celular.
   - Sin servidor (abriendo el archivo): BroadcastChannel + localStorage (mismo navegador). */
(function () {
  const CLAVE = 'te_estado_v2';

  const ESTADO_BASE = {
    config: {
      programa: 'TERAPIA ESPACIAL',
      fondo: 'verde',                       // 'verde' | 'transparente'
      colores: {
        espacio: '#0B0B1A', violeta: '#7B2FF7', magenta: '#FF3DCB',
        rayo: '#FFF4C2', blanco: '#FFFFFF', menta: '#D6EFC7'
      },
      fuenteTitulo: 'Orbitron',
      fuenteTexto: 'Inter',
      logo: null,                           // dataURL
      bordeIzq: 140,
      gcY: 880,
      tamGC: 54,
      ovniPausa: true,
      bamboleo: 1,
      velocidad: 1,
      autoSalidaGC: 0,                      // segundos (0 = manual)
      segTitular: 6,                        // segundos que queda cada titular en el avance automático
      transicion: 'aleatoria',              // aleatoria | rayo | hipnosis | rorschach | onda
      etiquetaSesion: 'SESIÓN EN CURSO',
      ticker: 'Terapia Espacial: la consulta que atiende a pacientes de todo el universo · Avistamientos en El Enladrillado, San Clemente, lago Colbún y laguna del Maule · Salud mental estudiantil: pedir ayuda también es valentía · Escríbenos tus dudas en nuestras redes'
    },
    gcs: [
      { titulo: 'Luis Monasterios', sub: 'Presentador' },
      { titulo: 'Benjamín Castillo', sub: 'Parapsicólogo' },
      { titulo: 'Sophia Jaque', sub: 'Psicóloga' },
      { titulo: 'Paciente X-27', sub: 'Visitante de otro planeta', paciente: true }
    ],
    titulares: [
      { seccion: 'TALCA', texto: 'Avistamientos en El Enladrillado y San Clemente vuelven a repetirse' },
      { seccion: 'TALCA', texto: 'Lago Colbún y laguna del Maule, en la mira de los FANI' },
      { seccion: 'CHILE', texto: 'Aumenta el consumo de antidepresivos en jóvenes' },
      { seccion: 'CHILE', texto: 'Cae el consumo de alcohol entre los jóvenes' },
      { seccion: 'CHILE', texto: 'Salud mental estudiantil: el desafío de volver a la presencialidad' },
      { seccion: 'INTERNACIONAL', texto: 'Casa Blanca y Pentágono desclasifican registros OVNI' },
      { seccion: 'INTERNACIONAL', texto: 'Desde 2019 se disparan los registros de ovnis en el mundo' },
      { seccion: 'INTERNACIONAL', texto: 'Bélgica y Asturias: los videos que reabren el debate' }
    ],
    textos: {
      cortinaTitulo: { titulo: 'OVNIS CAPTADOS EN CÁMARA', sub: '¿ESTAMOS SOLOS EN EL UNIVERSO?' },
      aviso: { titulo: '¡NUEVO AVISTAMIENTO!', sub: 'El Enladrillado · Región del Maule' },
      volvemos: { titulo: 'VOLVEMOS ENSEGUIDA', sub: 'LA SESIÓN CONTINÚA' },
      avance: { titulo: 'AVANCE INFORMATIVO', sub: 'ÚLTIMAS NOTICIAS · TALCA · CHILE · INTERNACIONAL' },
      triplex: { titulo: 'OVNI · OSNI · FANI', etiquetas: ['LUIS MONASTERIOS', 'AVISTAMIENTOS', 'BENJAMÍN CASTILLO'] },
      duplex: { titulo: 'SALUD MENTAL', etiquetas: ['LUIS MONASTERIOS', 'SOPHIA JAQUE'] },
      apertura: { titulo: 'TERAPIA ESPACIAL', sub: 'CON LUIS A. MONASTERIOS' },
      cierre: { titulo: 'TERAPIA ESPACIAL', sub: 'FIN DE LA SESIÓN · NOS VEMOS EN UN NUEVO PROGRAMA' }
    },
    aire: {
      gc: null, titular: null, cortinaTitulo: false, aviso: false, volvemos: false,
      triplex: false, duplex: false, bug: false, ticker: false
    }
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

  const conServidor = location.protocol.startsWith('http');
  const canal = ('BroadcastChannel' in window) ? new BroadcastChannel('terapia-espacial') : null;
  const oyentes = [];

  function entregar(msg) { oyentes.forEach(fn => { try { fn(msg); } catch (e) { console.error(e); } }); }

  if (canal) canal.onmessage = e => entregar(e.data);
  window.addEventListener('storage', e => {
    if (e.key === CLAVE + '_msg' && e.newValue) { try { entregar(JSON.parse(e.newValue)); } catch (_) {} }
  });

  let fuente = null, conectado = false;
  function conectarSSE() {
    if (!conServidor) return;
    fuente = new EventSource('/eventos');
    fuente.onopen = () => { conectado = true; entregar({ tipo: '_conexion', ok: true }); };
    fuente.onmessage = e => { try { entregar(JSON.parse(e.data)); } catch (_) {} };
    fuente.onerror = () => { conectado = false; entregar({ tipo: '_conexion', ok: false }); };
  }

  function guardarLocal(estado) {
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { console.warn('No se pudo guardar (¿logo muy pesado?)', e); }
  }
  function leerLocal() {
    try { const s = localStorage.getItem(CLAVE); return s ? mezclar(copia(ESTADO_BASE), JSON.parse(s)) : copia(ESTADO_BASE); }
    catch (e) { return copia(ESTADO_BASE); }
  }

  async function enviar(msg) {
    msg.id = msg.id || (Date.now() + '-' + Math.random().toString(36).slice(2, 7));
    if (msg.tipo === 'estado') guardarLocal(msg.estado);
    if (conServidor) {
      try {
        await fetch('/cmd', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg) });
        return;
      } catch (e) { /* sin servidor: sigue con canal local */ }
    }
    if (canal) canal.postMessage(msg);
    try { localStorage.setItem(CLAVE + '_msg', JSON.stringify(msg)); } catch (_) {}
  }

  async function estadoInicial() {
    if (conServidor) {
      try { const r = await fetch('/estado'); if (r.ok) { const j = await r.json(); if (j && j.config) return mezclar(copia(ESTADO_BASE), j); } } catch (_) {}
    }
    return leerLocal();
  }

  window.TE = {
    ESTADO_BASE, copia, mezclar, enviar, estadoInicial, conServidor,
    escuchar(fn) { oyentes.push(fn); },
    conectar: conectarSSE,
    get conectado() { return conectado; }
  };
})();
