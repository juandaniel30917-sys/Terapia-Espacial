/* ENTRE OVNIS Y FANTASMAS — gráficas de la salida (se carga en salida.html).
   FUSIÓN: el motor del programa anterior (ovni que cae, rayo y GC que baja por el rayo; espacio con estrellas)
   vestido con la gráfica nueva de After Effects (barras carbón en diagonal, acento verde alien / naranjo calabaza,
   Cinzel + Special Elite). En los fantasmas, en vez del ovni llega un fantasma con luz espectral.
   Usa las funciones del motor de salida.html: Abduccion, Multiplex, cambiarSlot, animar, pista, el, sv, estrellas, svgOvni. */
(function () {
  'use strict';
  var R = 'eoyf/';
  var TEMAS = {
    ovni: { acento: 'var(--e-verde)', texto: '#0E1A06', icono: 'alien', rayo: '#D9FFB0', espectro: false },
    fantasma: { acento: 'var(--e-naranjo)', texto: '#1C0B00', icono: 'calabaza', rayo: '#FFE2C2', espectro: true },
    neutro: { acento: 'var(--e-rojo)', texto: '#FFFFFF', icono: 'ojo', rayo: '#FFD6DC', espectro: false }
  };
  function tema(t) { return TEMAS[t] || TEMAS.neutro; }
  function P() { return E.eoyf || EOYF_DATOS.BASE; }
  function C() { return P().config; }

  /* ---------------- íconos (dibujos originales) ---------------- */
  var NS = 'http://www.w3.org/2000/svg';
  function svgDe(html, vb, tam) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', vb); s.setAttribute('width', tam); s.setAttribute('height', tam);
    s.innerHTML = html; return s;
  }
  var ICONOS = {
    alien: function (t) {
      return svgDe('<path d="M50 6C76 6 92 26 90 48C88 72 68 90 50 96C32 90 12 72 10 48C8 26 24 6 50 6Z" fill="var(--e-verde)" stroke="#0E1A06" stroke-width="4"/>' +
        '<path d="M22 44C30 40 42 46 44 58C34 62 24 56 22 44Z" fill="#0E1A06"/><path d="M78 44C70 40 58 46 56 58C66 62 76 56 78 44Z" fill="#0E1A06"/>' +
        '<circle cx="33" cy="50" r="3" fill="#fff"/><circle cx="67" cy="50" r="3" fill="#fff"/><path d="M45 80Q50 83 55 80" stroke="#0E1A06" stroke-width="3" fill="none" stroke-linecap="round"/>', '0 0 100 100', t);
    },
    calabaza: function (t) {
      return svgDe('<path d="M48 8C52 2 60 4 58 14" stroke="#3B5E1A" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="50" cy="58" rx="44" ry="36" fill="var(--e-naranjo)" stroke="#1C0B00" stroke-width="4"/>' +
        '<path d="M50 22C38 34 38 82 50 94M50 22C62 34 62 82 50 94" stroke="#1C0B00" stroke-width="3" fill="none" opacity=".45"/>' +
        '<path d="M24 48L36 42L38 54Z M76 48L64 42L62 54Z" fill="#1C0B00"/><path d="M26 66Q50 86 74 66L66 70L60 64L54 72L46 64L40 72L34 64Z" fill="#1C0B00"/>', '0 0 100 100', t);
    },
    fantasma: function (t) {
      return svgDe('<path d="M50 6C72 6 86 24 86 46V92L76 84L66 94L56 84L46 94L36 84L26 94L14 84V46C14 24 28 6 50 6Z" fill="#F4F1FF" stroke="#2A2340" stroke-width="4"/>' +
        '<g class="luces"><ellipse cx="38" cy="44" rx="7" ry="10" fill="#2A2340"/><ellipse cx="62" cy="44" rx="7" ry="10" fill="#2A2340"/></g><ellipse cx="50" cy="68" rx="8" ry="11" fill="#2A2340"/>', '0 0 100 100', t);
    },
    ojo: function (t) {
      return svgDe('<path d="M6 50C22 22 78 22 94 50C78 78 22 78 6 50Z" fill="#F4F1FF" stroke="#1A0006" stroke-width="4"/><circle cx="50" cy="50" r="18" fill="var(--e-rojo)"/><circle cx="50" cy="50" r="8" fill="#1A0006"/><circle cx="56" cy="44" r="4" fill="#fff"/>', '0 0 100 100', t);
    },
    telefono: function (t) {
      return svgDe('<path d="M50 6C76 6 94 24 94 48C94 72 74 90 50 90C42 90 36 88 30 86L10 94L16 74C10 66 6 58 6 48C6 24 24 6 50 6Z" fill="var(--e-verde)" stroke="#0E2A4A" stroke-width="5"/>' +
        '<path d="M36 28L44 26L50 40L44 44C48 54 54 60 62 64L66 58L80 64L78 72C74 78 62 78 50 70C38 62 30 50 30 40C30 34 32 30 36 28Z" fill="#fff"/>', '0 0 100 100', t);
    },
    rec: function (t) {
      return svgDe('<rect x="8" y="26" width="62" height="48" rx="8" fill="#F4F1FF" stroke="#1A0006" stroke-width="4"/><path d="M70 42L92 30V70L70 58Z" fill="#F4F1FF" stroke="#1A0006" stroke-width="4"/>' +
        '<circle class="recDot" cx="30" cy="50" r="10" fill="var(--e-rojo)"/>', '0 0 100 100', t);
    }
  };
  window.EOYF_ICONOS = ICONOS;
  // fantasma grande que reemplaza al ovni en las gráficas del bloque de fantasmas (mismo tamaño y anclaje que svgOvni)
  window.EOYF_ESPECTRO = function () {
    var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '-140 -100 280 150');
    s.innerHTML = '<g transform="translate(0,-34) scale(1.35)"><path d="M0,-58C28,-58 46,-36 46,-10V40L33,30L20,42L7,30L-7,42L-20,30L-33,42L-46,30V-10C-46,-36 -28,-58 0,-58Z" fill="#F4F1FF" stroke="#2A2340" stroke-width="5"/>' +
      '<g class="luces"><ellipse cx="-16" cy="-16" rx="8" ry="12" fill="#2A2340"/><ellipse cx="16" cy="-16" rx="8" ry="12" fill="#2A2340"/></g><ellipse cx="0" cy="12" rx="9" ry="13" fill="#2A2340"/></g>';
    return s;
  };

  /* ---------------- opciones de cada gráfica del tercio inferior ---------------- */
  function bajo() { return P().aire.ticker ? 860 : 905; }
  function base(t, extra) {
    var m = tema(t);
    return Object.assign({ skin: 'eoyf', tema: t, S: 100, rayoLargo: 230, barY: bajo(), minW: 420, maxW: 1640,
      colorBarra: 'var(--e-carbon)', colorAcento: m.acento, colorSub: m.acento, colorSubTxt: m.texto, colorRayo: m.rayo,
      icono: m.icono, espectro: m.espectro, etqColor: [m.acento, m.texto] }, extra || {});
  }
  function opciones(clave) {
    var p = P(), mt;
    if ((mt = /^gc:(\d+)$/.exec(clave))) { var g = p.gcs[+mt[1]] || {}; return base(g.tema, { tamT: 48, tamS: 24, titulo: g.nombre, sub: g.cargo }); }
    if ((mt = /^tit:(\d+)$/.exec(clave))) { var h = p.titulos[+mt[1]] || {}; return base(h.tema, { tamT: 58, tamS: 26, titulo: h.titulo, sub: h.sub, etiqueta: h.etiqueta, S: 120, rayoLargo: 280, minW: 760 }); }
    if (clave === 'terreno') { var tr = p.terreno; return base(tr.tema, { tamT: 46, tamS: 24, titulo: tr.lugar, sub: tr.sub, etiqueta: '● ' + tr.etiqueta, icono: 'rec' }); }
    if (clave === 'sabias') {
      // el dato va en dos líneas: la primera mitad en la barra y el resto en la bajada
      var tx = (p.sabias.texto || '').trim(), cut = tx.search(/\s(y|pero|mientras)\s/i);
      if (cut < 20) { var mitad = Math.floor(tx.length / 2); cut = tx.indexOf(' ', mitad); }
      var l1 = cut > 0 ? tx.slice(0, cut) : tx, l2 = cut > 0 ? tx.slice(cut + 1) : '';
      return base('fantasma', { tamT: 38, tamS: 24, titulo: l1, sub: l2, etiqueta: p.sabias.titulo, icono: 'ojo', espectro: false, colorRayo: '#FFE2C2' });
    }
    if (clave === 'promo') return base('ovni', { tamT: 50, tamS: 24, titulo: p.promo.titulo + ' AL ' + C().numero, sub: p.promo.texto, etiqueta: 'CÓDIGO DE DESCUENTO · HASTA ' + p.promo.badge, icono: 'telefono' });
    if (clave === 'llamenos') return base('fantasma', { tamT: 50, tamS: 24, titulo: p.llamenos.titulo + ' AL ' + C().numero, sub: p.llamenos.texto, icono: 'telefono', logo: R + 'mano.png', espectro: false, colorRayo: '#FFE2C2' });
    if ((mt = /^men:(\d+)$/.exec(clave))) {
      var n = p.menciones[+mt[1]] || {};
      return base('neutro', { tamT: 50, tamS: 24, titulo: n.marca, sub: n.texto, etiqueta: n.etiqueta, logo: n.logo, colorAcento: n.color, colorSub: n.color, colorSubTxt: '#fff', icono: '', etqColor: [n.color, '#fff'], S: 115, rayoLargo: 300 });
    }
    return null;
  }

  /* ---------------- tarjeta lateral de dato (fantasma flotando o haz del ovni) ---------------- */
  function Tarjeta(d) {
    var m = tema(d.tema);
    var raiz = el('div', 'eTarjeta ' + (d.tema || 'neutro'), $('#cEOYF'));
    raiz.innerHTML = '<div class="eHaz"></div><div class="eCaja"><div class="eCab"><span class="eIco"></span><span class="eEtq"></span><b></b></div><p></p><i class="eSello">EXPEDIENTE</i></div>';
    raiz.querySelector('.eIco').appendChild((m.espectro ? ICONOS.fantasma : ICONOS.alien)(58));
    this.raiz = raiz; this.textos(d);
    var flot = m.espectro ? EOYF_ESPECTRO() : svgOvni();
    this.ser = el('div', 'eSer', raiz); this.ser.appendChild(flot);
    requestAnimationFrame(function () { requestAnimationFrame(function () { raiz.classList.add('on'); }); });
  }
  Tarjeta.prototype.textos = function (d) {
    this.raiz.querySelector('.eEtq').textContent = d.etiqueta || 'DATO';
    this.raiz.querySelector('b').textContent = d.titulo || '';
    this.raiz.querySelector('p').textContent = d.texto || '';
  };
  Tarjeta.prototype.salir = function () {
    var r = this.raiz; r.classList.remove('on'); r.classList.add('sale');
    return new Promise(function (ok) { setTimeout(function () { r.remove(); ok(); }, 700); });
  };

  /* ---------------- marca de agua ---------------- */
  var marcaEl = null;
  function marca(on) {
    if (on && !marcaEl) {
      marcaEl = el('div', 'eMarca', $('#cEOYF'));
      var i = el('img', '', marcaEl); i.src = R + 'logo.png'; i.alt = '';
      requestAnimationFrame(function () { requestAnimationFrame(function () { marcaEl && marcaEl.classList.add('on'); }); });
    } else if (!on && marcaEl) { var m = marcaEl; marcaEl = null; m.classList.remove('on'); setTimeout(function () { m.remove(); }, 700); }
    if (marcaEl) marcaEl.style.setProperty('--op', C().marcaOpacidad);
  }

  /* ---------------- ticker ---------------- */
  var tkEl = null, tkAnim = null;
  function ticker(on) {
    if (!tkEl) {
      tkEl = el('div', 'eTicker', $('#cEOYF'));
      tkEl.innerHTML = '<div class="eTkEtq"><span class="eTkIco"></span><b>¡ÚLTIMAS NOTICIAS!</b></div><div class="eTkFecha"></div><div class="eTkVia"><div class="eTkCinta"></div></div><div class="eTkFin"></div>';
      tkEl.querySelector('.eTkIco').appendChild(ICONOS.alien(40));
    }
    tkEl.querySelector('.eTkFecha').textContent = C().fecha;
    var cinta = tkEl.querySelector('.eTkCinta');
    var partes = (C().ticker || '').split('·').map(function (s) { return s.trim(); }).filter(Boolean);
    var clave = partes.join('|');
    if (cinta.dataset.v !== clave) {
      cinta.dataset.v = clave; cinta.innerHTML = '';
      for (var vuelta = 0; vuelta < 2; vuelta++) partes.forEach(function (t, i) {
        var s = el('span', 'eTkIt', cinta);
        s.appendChild((i % 2 ? ICONOS.fantasma : ICONOS.alien)(30));
        s.appendChild(document.createTextNode(t));
      });
      if (tkAnim) tkAnim.cancel();
      requestAnimationFrame(function () {
        var ancho = cinta.scrollWidth / 2;
        tkAnim = cinta.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-' + ancho + 'px)' }], { duration: ancho / 120 * 1000, iterations: Infinity });
      });
    }
    tkEl.classList.toggle('on', !!on);
  }

  /* ---------------- cortinas cortas (1,3 s · corte a 0,6 s) ---------------- */
  var VIDEOS = {};
  function video(n) {
    if (!VIDEOS[n]) { var v = document.createElement('video'); v.src = R + n + '.mp4'; v.muted = true; v.playsInline = true; v.preload = 'auto'; v.className = 'eGlitch'; VIDEOS[n] = v; }
    return VIDEOS[n];
  }
  function destello(raiz, n, t, t0, t1) {
    var v = video(n);
    if (t >= t0 && t <= t1) {
      if (v.parentNode !== raiz) { raiz.appendChild(v); try { v.currentTime = 0; v.play(); } catch (e) {} }
      v.style.opacity = pista([[t0, 0], [t0 + .05, 1], [t1 - .06, 1], [t1, 0]], t, true);
      v.style.transform = 'scale(' + (1.04 + Math.sin(t * 90) * .02) + ') translateX(' + (Math.sin(t * 140) * 14) + 'px)';
    } else if (v.parentNode === raiz) { v.remove(); }
  }
  function cortinaOvni() {
    var raiz = el('div', 'abd eCort', $('#cCortina'));
    var cielo = el('div', 'eCielo', raiz); cielo.appendChild(estrellas(2400, 1080, 220));
    var s = sv('svg', { 'class': 'full', viewBox: '0 0 1920 1080' }, raiz);
    var haz = sv('polygon', { fill: 'var(--e-verde)', 'fill-opacity': .55, stroke: '#D9FFB0', 'stroke-width': 6 }, s);
    var u = el('div', 'ufo', raiz); u.appendChild(svgOvni());
    var logo = el('img', 'eCortLogo', raiz); logo.src = R + 'logo_texto.png';
    return animar(1.3, raiz, function (t) {
      cielo.style.clipPath = 'circle(' + pista([[0, 0], [.45, 120], [.95, 120], [1.3, 0]], t) + '% at 50% 20%)';
      var x = pista([[0, -200], [.5, 960], [.8, 960], [1.3, 2200]], t), y = 210 + Math.sin(t * 9) * 10;
      u.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + pista([[0, 18], [.5, 0], [.8, 0], [1.3, -18]], t) + 'deg) scale(1.6)';
      var a = pista([[.35, 0], [.55, 1], [.75, 1], [.95, 0]], t), tw = 120 + a * 1500, bw = 240 + a * 2600;
      haz.setAttribute('points', (x - tw / 2) + ',' + (y + 30) + ' ' + (x + tw / 2) + ',' + (y + 30) + ' ' + (x + bw / 2) + ',1100 ' + (x - bw / 2) + ',1100');
      s.style.opacity = a > .01 ? 1 : 0;
      logo.style.opacity = pista([[.5, 0], [.6, 1], [.85, 1], [1.0, 0]], t);
      logo.style.transform = 'translate(-50%,-50%) scale(' + pista([[.5, .9], [1, 1.05]], t) + ')';
      destello(raiz, 'glitch5', t, .52, .7);
    });
  }
  function cortinaFantasma() {
    var raiz = el('div', 'abd eCort', $('#cCortina'));
    var niebla = el('div', 'eNiebla', raiz);
    var g = el('div', 'eFant', raiz); g.appendChild(ICONOS.fantasma(520));
    var mano = el('img', 'eMano', raiz); mano.src = R + 'mano.png';
    var logo = el('img', 'eCortLogo', raiz); logo.src = R + 'logo_texto.png';
    return animar(1.3, raiz, function (t) {
      niebla.style.opacity = pista([[0, 0], [.35, 1], [.95, 1], [1.3, 0]], t);
      niebla.style.transform = 'scale(' + pista([[0, 1.6], [.6, 1], [1.3, 1.3]], t) + ')';
      var e = pista([[0, .2], [.55, 2.8], [1.3, 6]], t);
      g.style.transform = 'translate(-50%,-50%) scale(' + e + ') rotate(' + Math.sin(t * 7) * 6 + 'deg)';
      g.style.opacity = pista([[0, 0], [.2, .9], [.6, .9], [.8, 0]], t);
      mano.style.transform = 'translate(-50%,' + pista([[0, 420], [.45, 40], [.9, 40], [1.3, 520]], t) + 'px) rotate(-8deg)';
      logo.style.opacity = pista([[.55, 0], [.65, 1], [.9, 1], [1.05, 0]], t);
      logo.style.transform = 'translate(-50%,-50%) scale(' + pista([[.55, 1.08], [1.05, 1]], t) + ')';
      destello(raiz, t < .62 ? 'glitch7' : 'glitch6', t, .5, .74);
    });
  }

  /* ---------------- aplicar el estado ---------------- */
  var cortActual = null, primera = true;
  var ACTIVO = false;
  function aplicar(est) {
    var activo = !!(est && est.programa === 'eoyf');
    document.body.classList.toggle('eoyf', activo);
    if (!activo) {
      if (ACTIVO) { cambiarSlot('e_inf', null); cambiarSlot('e_lat', null); cambiarSlot('e_mx', null); marca(false); if (tkEl) tkEl.classList.remove('on'); }
      ACTIVO = false; return;
    }
    ACTIVO = true;
    var p = est.eoyf, a = p.aire, c = p.config, r = document.documentElement.style;
    for (var k in c.colores) r.setProperty('--e-' + k, c.colores[k]);
    var fe = fondoEoyf();
    document.body.classList.toggle('e-azul', fe === 'azul');
    document.body.classList.toggle('e-verde', fe === 'verde');
    // tercio inferior (uno a la vez; mismo motor ovni/rayo del programa anterior)
    var o = a.inferior ? opciones(a.inferior) : null;
    var clave = o ? a.inferior + '|' + o.icono + '|' + o.tema + '|' + (o.logo || '') + '|' + o.barY : null;
    if (slots.e_inf && slots.e_inf.pieza && slots.e_inf.clave === clave) slots.e_inf.pieza.textos(o.titulo, o.sub);
    else cambiarSlot('e_inf', clave, function () { return new Abduccion(o, $('#cGraficas')); });
    // tarjeta lateral
    var mt = a.lateral && /^dato:(\d+)$/.exec(a.lateral), d = mt ? p.datos[+mt[1]] : null;
    var claveL = d ? a.lateral + '|' + d.tema : null;
    if (slots.e_lat && slots.e_lat.pieza && slots.e_lat.clave === claveL) slots.e_lat.pieza.textos(d);
    else cambiarSlot('e_lat', claveL, function () { return new Tarjeta(d); });
    // triplex alien / duplex fantasmas (ventanas del programa anterior con el nuevo fondo)
    var mk = a.multiplex, t = mk ? p.multiplex[mk] : null;
    var claveM = t ? mk + '|' + t.titulo + '|' + t.etiquetas.join(',') + '|' + fe : null;
    cambiarSlot('e_mx', claveM, function () { return new Multiplex(VENTANAS[mk], t.etiquetas, t.titulo, { skin: mk === 'triplex' ? 'eTriplex' : 'eDuplex', tema: mk === 'triplex' ? 'ovni' : 'fantasma' }); });
    marca(!!a.marca);
    ticker(!!a.ticker);
    // cortinas: se lanzan con un id; tocar otra vez las saca
    var ct = a.cortina, id = ct && ct.id;
    if (primera) { if (id) cortActual = { id: id, pr: null }; }
    else if (id && (!cortActual || cortActual.id !== id)) {
      if (cortActual && cortActual.pr) cortActual.pr.abortar();
      var pr = ct.variante === 'fantasma' ? cortinaFantasma() : cortinaOvni();
      cortActual = { id: id, pr: pr };
      pr.then(function () { if (cortActual && cortActual.pr === pr) cortActual = null; });
    } else if (!id && cortActual) { if (cortActual.pr) cortActual.pr.abortar(); cortActual = null; }
    primera = false;
  }
  // precarga de los destellos para que la primera cortina no tarde
  ['glitch5', 'glitch6', 'glitch7'].forEach(video);
  function mx(t) {
    var b = base(t);
    return { skin: b.skin, tema: t, colorBarra: b.colorBarra, colorAcento: b.colorAcento, colorSub: b.colorSub, colorSubTxt: b.colorSubTxt,
      colorRayo: b.colorRayo, espectro: b.espectro, etqColor: b.etqColor };
  }
  window.EOYF_SAL = { aplicar: aplicar, opciones: opciones, mx: mx, ICONOS: ICONOS };
})();
