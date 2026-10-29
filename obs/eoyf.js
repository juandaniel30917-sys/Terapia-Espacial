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

  /* ---------------- efecto de entrada / salida: ovni o fantasma ---------------- */
  // valor de la gráfica: 'ovni' | 'fantasma' | 'auto' → auto usa el efecto general (config.efecto) y si es 'tema', el estilo de la gráfica
  function efDe(obj, campo, t) {
    var v = obj && obj[campo];
    if (v === 'ovni' || v === 'fantasma') return v;
    var g = C().efecto;
    if (g === 'ovni' || g === 'fantasma') return g;
    return t === 'fantasma' ? 'fantasma' : 'ovni';
  }
  function efectos(obj, t) { return { efEnt: efDe(obj, 'entrada', t), efSal: efDe(obj, 'salida', t) }; }

  /* ---------------- opciones de cada gráfica del tercio inferior ---------------- */
  function bajo() { return P().aire.ticker ? 860 : 905; }
  function base(t, extra, obj) {
    var m = tema(t);
    return Object.assign({ skin: 'eoyf', tema: t, S: 100, rayoLargo: 230, barY: bajo(), minW: 420, maxW: 1640,
      colorBarra: 'var(--e-carbon)', colorAcento: m.acento, colorSub: m.acento, colorSubTxt: m.texto, colorRayo: m.rayo,
      icono: m.icono, espectro: false, etqColor: [m.acento, m.texto] }, efectos(obj, t), extra || {});
  }
  function opciones(clave) {
    var p = P(), mt;
    if ((mt = /^gc:(\d+)$/.exec(clave))) { var g = p.gcs[+mt[1]] || {}; return base(g.tema, { tamT: 48, tamS: 24, titulo: g.nombre, sub: g.cargo }, g); }
    if ((mt = /^tit:(\d+)$/.exec(clave))) { var h = p.titulos[+mt[1]] || {}; return base(h.tema, { tamT: 58, tamS: 26, titulo: h.titulo, sub: h.sub, etiqueta: h.etiqueta, S: 120, rayoLargo: 280, minW: 760 }, h); }
    if (clave === 'terreno') { var tr = p.terreno; return base(tr.tema, { tamT: 46, tamS: 24, titulo: tr.lugar, sub: tr.sub, etiqueta: '● ' + tr.etiqueta, icono: 'rec' }, tr); }
    if (clave === 'sabias') {
      // el dato va en dos líneas: la primera mitad en la barra y el resto en la bajada
      var tx = (p.sabias.texto || '').trim(), cut = tx.search(/\s(y|pero|mientras)\s/i);
      if (cut < 20) { var mitad = Math.floor(tx.length / 2); cut = tx.indexOf(' ', mitad); }
      var l1 = cut > 0 ? tx.slice(0, cut) : tx, l2 = cut > 0 ? tx.slice(cut + 1) : '';
      return base('fantasma', { tamT: 38, tamS: 24, titulo: l1, sub: l2, etiqueta: p.sabias.titulo, icono: 'ojo' }, p.sabias);
    }
    if (clave === 'promo') return base('ovni', { tamT: 50, tamS: 24, titulo: p.promo.titulo + ' AL ' + C().numero, sub: p.promo.texto, etiqueta: 'CÓDIGO DE DESCUENTO · HASTA ' + p.promo.badge, icono: 'telefono' }, p.promo);
    if (clave === 'llamenos') return base('fantasma', { tamT: 50, tamS: 24, titulo: p.llamenos.titulo + ' AL ' + C().numero, sub: p.llamenos.texto, icono: 'telefono', logo: R + 'mano.png' }, p.llamenos);
    if (clave === 'redes') { var rd = p.redes; return base(rd.tema, { tamT: 50, tamS: 24, titulo: rd.usuario, sub: rd.texto, etiqueta: rd.titulo, icono: rd.tema === 'fantasma' ? 'fantasma' : 'alien' }, rd); }
    if ((mt = /^men:(\d+)$/.exec(clave))) {
      var n = p.menciones[+mt[1]] || {};
      return base('neutro', { tamT: 50, tamS: 24, titulo: n.marca, sub: n.texto, etiqueta: n.etiqueta, logo: n.logo, colorAcento: n.color, colorSub: n.color, colorSubTxt: '#fff', icono: '', etqColor: [n.color, '#fff'], S: 115, rayoLargo: 300 }, n);
    }
    return null;
  }

  /* ---------------- tarjeta lateral: dato (Maitenes / Colbún) o medidor EMF ---------------- */
  var COLOR_EMF = ['#7CC242', '#B5D334', '#FFC20E', '#FF7A1A', '#C8102E'];
  function Tarjeta(d, emf) {
    var m = tema(d.tema), ef = efectos(d, d.tema);
    this.ef = ef;
    var raiz = el('div', 'eTarjeta ' + (d.tema || 'neutro') + (ef.efEnt === 'fantasma' ? ' efF' : ' efO') + (emf ? ' eEmf' : ''), $('#cEOYF'));
    raiz.innerHTML = '<div class="eHaz"></div><div class="eCaja"><div class="eCab"><span class="eIco"></span><span class="eEtq"></span><b></b></div>' +
      (emf ? '<div class="eEmfBarras"><span></span><span></span><span></span><span></span><span></span></div><div class="eEmfNivel"></div>' : '<p></p>') +
      '<i class="eSello">' + (emf ? 'EN VIVO' : 'EXPEDIENTE') + '</i></div>';
    raiz.querySelector('.eIco').appendChild((d.tema === 'fantasma' ? ICONOS.fantasma : d.tema === 'ovni' ? ICONOS.alien : ICONOS.ojo)(58));
    this.raiz = raiz; this.emf = emf; this.textos(d);
    this.ser = el('div', 'eSer', raiz); this.ponerSer(ef.efEnt);
    if (emf) { var self = this; this.timer = setInterval(function () { self.medir(); }, 140); }
    requestAnimationFrame(function () { requestAnimationFrame(function () { raiz.classList.add('on'); }); });
  }
  Tarjeta.prototype.ponerSer = function (ef) {
    this.ser.innerHTML = ''; this.ser.appendChild(ef === 'fantasma' ? EOYF_ESPECTRO() : svgOvni());
    this.raiz.querySelector('.eHaz').style.display = ef === 'fantasma' ? 'none' : '';
  };
  Tarjeta.prototype.textos = function (d) {
    this.d = d;
    this.raiz.querySelector('.eEtq').textContent = d.etiqueta || 'DATO';
    this.raiz.querySelector('b').textContent = d.titulo || '';
    if (this.emf) this.raiz.querySelector('.eEmfNivel').innerHTML = '';
    else this.raiz.querySelector('p').textContent = d.texto || '';
    if (this.emf) this.medir();
  };
  Tarjeta.prototype.medir = function () {
    var n = Math.max(1, Math.min(5, Math.round(+this.d.nivel || 1)));
    var vivo = Math.max(1, Math.min(5, n + (Math.random() < .25 ? (Math.random() < .5 ? -1 : 1) : 0)));
    this.raiz.querySelectorAll('.eEmfBarras span').forEach(function (b, i) {
      var on = i < vivo; b.classList.toggle('on', on);
      b.style.height = (40 + i * 27) + 'px';
      b.style.background = on ? COLOR_EMF[i] : ''; b.style.boxShadow = on ? '0 0 18px ' + COLOR_EMF[i] : '';
    });
    var NOMBRES = ['MÍNIMA', 'BAJA', 'MEDIA', 'ALTA', 'EXTREMA'];
    this.raiz.querySelector('.eEmfNivel').innerHTML = (this.d.lugar ? this.d.lugar.toUpperCase() + ' · ' : '') + 'NIVEL <em>' + NOMBRES[vivo - 1] + '</em>';
  };
  Tarjeta.prototype.salir = function () {
    var r = this.raiz, sal = efectos(this.d, this.d.tema).efSal;
    clearInterval(this.timer);
    if (sal !== this.ef.efEnt) this.ponerSer(sal);
    r.classList.remove('on'); r.classList.add('sale'); if (sal === 'fantasma') r.classList.add('salF');
    return new Promise(function (ok) { setTimeout(function () { r.remove(); ok(); }, 950); });
  };

  /* ---------------- marca de agua + EN VIVO ---------------- */
  var marcaEl = null, vivoEl = null;
  function marca(on) {
    if (on && !marcaEl) {
      marcaEl = el('div', 'eMarca', $('#cEOYF'));
      var i = el('img', '', marcaEl); i.src = R + 'logo.png'; i.alt = '';
      requestAnimationFrame(function () { requestAnimationFrame(function () { marcaEl && marcaEl.classList.add('on'); }); });
    } else if (!on && marcaEl) { var m = marcaEl; marcaEl = null; m.classList.remove('on'); setTimeout(function () { m.remove(); }, 700); }
    if (marcaEl) marcaEl.style.setProperty('--op', C().marcaOpacidad);
  }
  function vivo(on) {
    if (!vivoEl) { vivoEl = el('div', 'eVivo', $('#cEOYF')); vivoEl.innerHTML = '<i></i><span>EN VIVO</span>'; }
    vivoEl.querySelector('span').textContent = C().vivoTexto || 'EN VIVO';
    vivoEl.style.top = P().aire.marca ? '300px' : '50px';
    vivoEl.classList.toggle('on', !!on);
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

  /* ---------------- visor de cámara (REC) ---------------- */
  var visorEl = null, visorT0 = 0, visorTimer = null;
  function visor(on) {
    if (on && !visorEl) {
      visorEl = el('div', 'eVisor', $('#cEOYF'));
      visorEl.innerHTML = '<i class="esq a"></i><i class="esq b"></i><i class="esq c"></i><i class="esq d"></i><div class="rec"><i></i>REC</div><div class="tc"></div><div class="modo"></div><div class="bat"></div><div class="mira"></div>';
      visorT0 = performance.now();
      visorTimer = setInterval(function () {
        if (!visorEl) return;
        var t = (performance.now() - visorT0) / 1000, f = Math.floor((t % 1) * 30), z = function (n) { return String(n).padStart(2, '0'); };
        visorEl.querySelector('.tc').textContent = z(Math.floor(t / 3600)) + ':' + z(Math.floor(t / 60) % 60) + ':' + z(Math.floor(t) % 60) + ':' + z(f);
      }, 33);
      requestAnimationFrame(function () { requestAnimationFrame(function () { visorEl && visorEl.classList.add('on'); }); });
    } else if (!on && visorEl) { var v = visorEl; visorEl = null; clearInterval(visorTimer); v.classList.remove('on'); setTimeout(function () { v.remove(); }, 500); }
    if (visorEl) visorEl.querySelector('.modo').textContent = P().visor.modo || '';
  }

  /* ---------------- créditos (rollo) ---------------- */
  var credEl = null, credId = null;
  function creditos(cr) {
    var id = cr && cr.id;
    if (id && id !== credId) {
      if (credEl) { credEl.remove(); credEl = null; }
      credId = id;
      var p = P(), c = p.creditos;
      credEl = el('div', 'eCred', $('#cCreditos'));
      var lg = el('img', 'logo', credEl); lg.src = R + 'logo.png';
      var rollo = el('div', 'rollo', credEl);
      (c.texto || '').split('\n').forEach(function (l) {
        l = l.trim(); if (!l) return;
        var i = l.indexOf(':');
        if (i > 0) {
          el('h3', '', rollo).textContent = l.slice(0, i).trim();
          l.slice(i + 1).split('·').forEach(function (n) { if (n.trim()) el('p', '', rollo).textContent = n.trim(); });
        } else el('p', '', rollo).textContent = l;
      });
      if (c.logos !== false) {
        el('h3', '', rollo).textContent = c.tituloLogos || 'AUSPICIAN';
        var lw = el('div', 'logos', rollo);
        p.menciones.forEach(function (m) { if (m.logo) { var im = el('img', '', lw); im.src = m.logo; } });
      }
      var fin = el('div', 'fin', rollo); fin.textContent = c.cierre || '';
      document.body.classList.add('e-cred');
      requestAnimationFrame(function () {
        credEl.classList.add('on');
        var dist = 1080 - 540 + fin.offsetTop + fin.offsetHeight / 2;
        rollo.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-' + dist + 'px)' }], { duration: (+c.dur || 20) * 1000, delay: 600, easing: 'linear', fill: 'forwards' });
      });
    } else if (!id && credEl) {
      var e = credEl; credEl = null; credId = null; e.classList.remove('on'); document.body.classList.remove('e-cred');
      setTimeout(function () { e.remove(); }, 900);
    }
  }

  /* ---------------- ubicación (pin del programa anterior, esquina superior izquierda) ---------------- */
  function lugarTexto(est) { var p = est.eoyf; return p && p.aire.ubicacion ? (p.ubicacion.texto || '') : ''; }

  /* =========================================================================
     CORTINAS Y TRANSICIONES — duración elegible 2 · 3 · 4 · 5 s
     Cada una tiene su duración de diseño (d) y el tramo en que la pantalla queda tapada (p);
     al cambiar la duración, la entrada y la salida se mantienen y el tiempo extra se va a ese tramo.
     ========================================================================= */
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
  function capa(cls) { return el('div', 'abd eCort' + (cls ? ' ' + cls : ''), $('#cCortina')); }
  function logoCort(raiz) { var l = el('img', 'eCortLogo', raiz); l.src = R + 'logo_texto.png'; return l; }

  // 1) OVNI: cielo verde, el platillo cruza y abre el rayo
  function cortinaOvni() {
    var raiz = capa();
    var cielo = el('div', 'eCielo', raiz); cielo.appendChild(estrellas(2400, 1080, 220));
    var s = sv('svg', { 'class': 'full', viewBox: '0 0 1920 1080' }, raiz);
    var haz = sv('polygon', { fill: 'var(--e-verde)', 'fill-opacity': .55, stroke: '#D9FFB0', 'stroke-width': 6 }, s);
    var u = el('div', 'ufo', raiz); u.appendChild(svgOvni());
    var logo = logoCort(raiz);
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
  // 2) FANTASMA: niebla, el espectro se abalanza y sube la mano zombie
  function cortinaFantasma() {
    var raiz = capa();
    var niebla = el('div', 'eNiebla', raiz);
    var g = el('div', 'eFant', raiz); g.appendChild(ICONOS.fantasma(520));
    var mano = el('img', 'eMano', raiz); mano.src = R + 'mano.png';
    var logo = logoCort(raiz);
    return animar(1.3, raiz, function (t) {
      niebla.style.opacity = pista([[0, 0], [.35, 1], [.95, 1], [1.3, 0]], t);
      niebla.style.transform = 'scale(' + pista([[0, 1.6], [.6, 1], [1.3, 1.3]], t) + ')';
      var e = pista([[0, .2], [.55, 2.8], [1.3, 6]], t);
      g.style.transform = 'translate(-50%,-50%) scale(' + e + ') rotate(' + Math.sin(t * 7) * 6 + 'deg)';
      g.style.opacity = pista([[0, 0], [.2, .9], [.6, .9], [.8, 0]], t);
      mano.style.transform = 'translate(-50%,' + pista([[0, 420], [.45, 40], [.9, 40], [1.3, 520]], t) + 'px) rotate(-8deg)';
      logo.style.opacity = pista([[.55, 0], [.65, 1], [.9, 1], [1.05, 0]], t);
      logo.style.transform = 'translate(-50%,-50%) scale(' + pista([[.55, 1.08], [1.05, 1]], t) + ')';
      destello(raiz, 'glitch7', t, .5, .62); destello(raiz, 'glitch6', t, .62, .74);
    });
  }
  // 3) BARRIDO OVNI: la cortina del programa anterior (paneles detrás del platillo) con la paleta nueva y el logo
  function cortinaBarrido() {
    var raiz = capa();
    var pB = el('div', 'panelC', raiz); pB.style.background = 'var(--e-verde)';
    var pA = el('div', 'panelC', raiz); pA.style.background = 'var(--e-carbon) url(' + R + 'textura.jpg) center/cover'; pA.style.backgroundBlendMode = 'multiply'; pA.style.overflow = 'hidden';
    pA.appendChild(estrellas(1920, 1080, 160));
    var s = sv('svg', { 'class': 'full', viewBox: '0 0 1920 1080' }, raiz);
    var colm = sv('polygon', { fill: '#D9FFB0', 'fill-opacity': .8, stroke: '#fff', 'stroke-width': 4 }, s);
    var u = el('div', 'ufo', raiz); u.appendChild(svgOvni());
    var logo = logoCort(raiz); logo.style.top = '54%';
    var kx = [[0, -200], [1.1, 2150], [1.3, 2150], [2.3, -200]], kr = [[0, 12], [1.1, 12], [1.3, -12], [2.3, -12]];
    return animar(2.5, raiz, function (t) {
      var x = pista(kx, t), y = 200 + Math.sin(t * 6) * 8, r = pista(kr, t), xB = pista(kx, t - .12);
      pA.style.width = Math.max(0, x + 60) + 'px'; pB.style.width = Math.max(0, xB + 60) + 'px';
      u.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg) scale(1.5)';
      var ty = y + 30;
      colm.setAttribute('points', (x - 40) + ',' + ty + ' ' + (x + 40) + ',' + ty + ' ' + (x + 110) + ',' + (ty + 900) + ' ' + (x - 110) + ',' + (ty + 900));
      logo.style.opacity = pista([[.85, 0], [1.05, 1], [1.35, 1], [1.55, 0]], t);
      logo.style.transform = 'translate(-50%,-50%) scale(' + pista([[.85, .92], [1.55, 1.04]], t) + ')';
    });
  }
  // 4) EXPEDIENTE: la hoja del caso sube, la máquina de escribir y el timbre CLASIFICADO
  function cortinaExpediente() {
    var raiz = capa(), fondo = el('div', 'eExp', raiz);
    var pest = el('div', 'pest', fondo), hoja = el('div', 'hoja', fondo), maq = el('div', 'maq', fondo), sello = el('div', 'sello', fondo);
    sello.textContent = P().cortinas && P().cortinas.sello || 'CLASIFICADO';
    var txt = 'EXPEDIENTE N.º 0666\nREGIÓN DEL MAULE\n' + (C().programa || '') + '\n> ' + (C().fecha || '');
    return animar(2.2, raiz, function (t) {
      fondo.style.opacity = pista([[0, 0], [.25, 1], [1.8, 1], [2.2, 0]], t);
      var y = pista([[0, 1100], [.45, 0], [1.4, 0], [2.0, -1200]], t);
      [pest, hoja, maq, sello].forEach(function (n) { n.style.translate = '0 ' + y + 'px'; });
      maq.textContent = txt.slice(0, Math.floor(txt.length * pista([[.35, 0], [.9, 1]], t, true)));
      var k = pista([[.9, 0], [1.0, 1]], t, true);
      sello.style.opacity = k * .85;
      sello.style.transform = 'rotate(-12deg) scale(' + pista([[.9, 3], [1.0, 1]], t) + ')';
      fondo.style.transform = t > .98 && t < 1.08 ? 'translate(' + Math.sin(t * 200) * 8 + 'px,' + Math.cos(t * 170) * 6 + 'px)' : '';
    });
  }
  // 5) ESTÁTICA: se pierde la señal (nieve de TV, REC y destello)
  function cortinaEstatica() {
    var raiz = capa(), f = el('div', 'eEst', raiz);
    var cv = el('canvas', '', f); cv.width = 320; cv.height = 180; var g = cv.getContext('2d'), img = g.createImageData(320, 180);
    var barra = el('div', 'barra', f), rec = el('div', 'rec', f), tx = el('div', 'txt', f);
    rec.innerHTML = '<b>●</b> REC'; tx.textContent = 'SEÑAL PERDIDA';
    return animar(1.6, raiz, function (t) {
      for (var i = 0; i < img.data.length; i += 4) { var v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      g.putImageData(img, 0, 0);
      f.style.opacity = pista([[0, 0], [.12, 1], [1.35, 1], [1.6, 0]], t, true) * (t < .25 ? (Math.floor(t * 40) % 2 ? 1 : .4) : 1);
      barra.style.top = ((t * 900) % 1300 - 160) + 'px';
      tx.style.opacity = pista([[.25, 0], [.3, 1], [.62, 1], [.68, 0]], t, true) * (Math.floor(t * 18) % 4 ? 1 : .2);
      tx.style.transform = 'translateX(' + Math.sin(t * 120) * 10 + 'px)';
      rec.style.opacity = Math.floor(t * 2) % 2 ? .4 : 1;
      destello(raiz, 'glitch4', t, .7, .9);
    });
  }
  // 6) MURCIÉLAGOS: la noche roja del duplex y una bandada que tapa la pantalla
  function cortinaMurcielagos() {
    var raiz = capa(), f = el('div', 'eMurcC', raiz), cielo = el('div', 'cielo', f);
    var s = sv('svg', { viewBox: '0 0 1920 1080' }, f), bats = [];
    var ALA = 'M0,0 C-14,-14 -34,-12 -46,2 C-36,-2 -28,4 -26,12 C-18,4 -8,6 0,12 C8,6 18,4 26,12 C28,4 36,-2 46,2 C34,-12 14,-14 0,0 Z';
    for (var i = 0; i < 90; i++) {
      var gg = sv('g', {}, s); sv('path', { d: ALA, fill: '#0E0002' }, gg);
      bats.push({ g: gg, x0: 2000 + Math.random() * 900, x1: -300 - Math.random() * 900, y: Math.random() * 1080, e: 1.6 + Math.random() * 3.6, f: Math.random() * 7, w: 20 + Math.random() * 14 });
    }
    var tapa = el('div', '', f); Object.assign(tapa.style, { position: 'absolute', inset: '0', background: '#0E0002' });
    return animar(2.2, raiz, function (t) {
      cielo.style.opacity = pista([[0, 0], [.4, 1], [1.7, 1], [2.1, 0]], t);
      tapa.style.opacity = pista([[.6, 0], [.9, .9], [1.25, .9], [1.55, 0]], t);
      bats.forEach(function (b) {
        var x = b.x0 + (b.x1 - b.x0) * Math.min(1, t / 2.2), y = b.y + Math.sin(t * 3 + b.f) * 40;
        b.g.setAttribute('transform', 'translate(' + x + ',' + y + ') scale(' + b.e + ',' + (b.e * (.55 + .45 * Math.abs(Math.sin(t * b.w + b.f)))) + ')');
      });
    });
  }
  // 7) APAGÓN: las luces parpadean, se corta la luz y una linterna encuentra al fantasma
  function cortinaApagon() {
    var raiz = capa(), f = el('div', 'eApag', raiz), luz = el('div', 'luz', f), fa = el('div', 'fant', f);
    fa.appendChild(ICONOS.fantasma(360));
    return animar(2.2, raiz, function (t) {
      var op = t < .55 ? (Math.random() < t / .55 ? 1 : 0) : 1;
      var R0 = pista([[1.4, 0], [2.1, 1400]], t);
      f.style.opacity = t > 2.1 ? 0 : op;
      var m = R0 > 1 ? 'radial-gradient(circle at 50% 50%, transparent ' + R0 + 'px, #000 ' + (R0 + 60) + 'px)' : 'none';
      f.style.webkitMaskImage = f.style.maskImage = m;
      var lx = pista([[.55, 300], [1.0, 1100], [1.35, 960]], t), ly = 540 + Math.sin(t * 5) * 60;
      luz.style.background = t > .55 && t < 1.5 ? 'radial-gradient(circle at ' + lx + 'px ' + ly + 'px, rgba(255,240,200,.55) 0, rgba(255,240,200,.25) 150px, transparent 260px)' : 'none';
      var vis = Math.max(0, 1 - Math.hypot(lx - 960, ly - 540) / 260);
      fa.style.opacity = (t > .55 && t < 1.5 ? vis : 0) * (Math.floor(t * 20) % 5 ? 1 : .4);
      fa.style.transform = 'translate(-50%,-50%) scale(' + pista([[.8, .8], [1.4, 1.25]], t) + ')';
    });
  }

  // catálogo: d = duración de diseño, p = tramo tapado, logo = trae logo propio (si no, se agrega en el tramo tapado al alargarla)
  var CORT = {
    ovni: { pal: 'ovni', d: 1.3, p: [.72, .84], logo: true, f: cortinaOvni },
    fantasma: { pal: 'fantasma', d: 1.3, p: [.76, .88], logo: true, f: cortinaFantasma },
    barrido: { pal: 'ovni', d: 2.5, p: [1.12, 1.28], logo: true, f: cortinaBarrido },
    expediente: { pal: 'neutro', d: 2.2, p: [1.0, 1.4], logo: true, f: cortinaExpediente },
    estatica: { pal: 'neutro', d: 1.6, p: [.7, 1.2], logo: false, f: cortinaEstatica },
    murcielagos: { pal: 'fantasma', d: 2.2, p: [.92, 1.2], logo: false, f: cortinaMurcielagos },
    apagon: { pal: 'fantasma', d: 2.2, p: [1.0, 1.3], logo: false, f: cortinaApagon },
    // transiciones del programa anterior, con la paleta nueva
    rayo: { pal: 'ovni', d: 2.05, p: [.95, 1.1], logo: false, f: function () { return TRANSICIONES.rayo(); } },
    hipnosis: { pal: 'ovni', d: 2.0, p: [.9, 1.1], logo: false, f: function () { return TRANSICIONES.hipnosis(); } },
    rorschach: { pal: 'fantasma', d: 2.0, p: [.95, 1.05], logo: false, f: function () { return TRANSICIONES.rorschach(); } },
    psicofonia: { pal: 'fantasma', d: 2.0, p: [.95, 1.1], logo: true, f: function () { return TRANSICIONES.onda(); } }
  };
  function paleta(pal) {
    var c = C().colores, base = { blanco: '#FFFFFF', programa: C().programa, fuente: "'Cinzel', Georgia, serif" };
    if (pal === 'fantasma') return Object.assign(base, { espacio: '#140602', violeta: c.naranjo, magenta: '#8A1C00', rayo: '#FFE2C2', menta: '#FFC48A' });
    if (pal === 'neutro') return Object.assign(base, { espacio: '#0D0204', violeta: c.rojo, magenta: '#5A0010', rayo: '#FFD6DC', menta: '#FF8A9A' });
    return Object.assign(base, { espacio: '#0A1205', violeta: c.verde, magenta: '#2E6B12', rayo: '#D9FFB0', menta: '#B8F07A' });
  }
  function remap(d, p, D) {
    var ex = D - d;
    if (Math.abs(ex) < .01) return null;
    if (ex < 0) return { total: D, f: function (r) { return r * d / D; } };
    var a = p[1] - p[0];
    return { total: D, f: function (r) { return r < p[0] ? r : r < p[0] + a + ex ? p[0] + (r - p[0]) * a / (a + ex) : r - ex; } };
  }
  function lanzarCortina(id, D) {
    var def = CORT[id] || CORT.ovni, cont = $('#cCortina');
    D = Math.max(2, Math.min(5, +D || 2));
    cont.dataset.pal = def.pal;
    PALETA_T = paleta(def.pal);
    animar.remap = remap(def.d, def.p, D);
    var pr;
    try { pr = def.f(); } finally { PALETA_T = null; animar.remap = null; }
    var ex = D - def.d, hold = null;
    if (!def.logo && ex > .5) {
      // al alargarla, el logo del programa aparece mientras la pantalla está tapada
      var raiz = el('div', 'abd', cont), lg = el('img', 'eLogoHold', raiz); lg.src = R + 'logo_texto.png';
      var a0 = def.p[0], a1 = def.p[1] + ex;
      hold = animar(D, raiz, function (r) {
        lg.style.opacity = pista([[a0 + .05, 0], [a0 + .3, 1], [a1 - .3, 1], [a1 - .05, 0]], r);
        lg.style.transform = 'translate(-50%,-50%) scale(' + pista([[a0, .94], [a1, 1.04]], r) + ')';
      });
    }
    var todo = hold ? Promise.all([pr, hold]) : pr;
    todo.abortar = function () { pr.abortar(); if (hold) hold.abortar(); };
    return todo;
  }

  /* ---------------- aplicar el estado ---------------- */
  var cortActual = null, primera = true;
  var ACTIVO = false;
  function aplicar(est) {
    var activo = !!(est && est.programa === 'eoyf');
    document.body.classList.toggle('eoyf', activo);
    if (!activo) {
      if (ACTIVO) { cambiarSlot('e_inf', null); cambiarSlot('e_lat', null); cambiarSlot('e_mx', null); marca(false); vivo(false); visor(false); creditos(null); if (tkEl) tkEl.classList.remove('on'); }
      ACTIVO = false; return;
    }
    ACTIVO = true;
    var p = est.eoyf, a = p.aire, c = p.config, r = document.documentElement.style;
    for (var k in c.colores) r.setProperty('--e-' + k, c.colores[k]);
    var fe = fondoEoyf();
    document.body.classList.toggle('e-azul', fe === 'azul');
    document.body.classList.toggle('e-verde', fe === 'verde');
    // tercio inferior (uno a la vez; motor ovni/rayo del programa anterior o efecto fantasma)
    var o = a.inferior ? opciones(a.inferior) : null;
    var clave = o ? a.inferior + '|' + o.icono + '|' + o.tema + '|' + (o.logo || '') + '|' + o.barY : null;
    if (slots.e_inf && slots.e_inf.pieza && slots.e_inf.clave === clave) { slots.e_inf.pieza.textos(o.titulo, o.sub); slots.e_inf.pieza.o.efSal = o.efSal; }
    else cambiarSlot('e_inf', clave, function () { return new Abduccion(o, $('#cGraficas')); });
    // tarjeta lateral (dato o medidor EMF)
    var mt = a.lateral && /^dato:(\d+)$/.exec(a.lateral), d = mt ? p.datos[+mt[1]] : (a.lateral === 'emf' ? p.emf : null);
    var claveL = d ? a.lateral + '|' + d.tema : null;
    if (slots.e_lat && slots.e_lat.pieza && slots.e_lat.clave === claveL) slots.e_lat.pieza.textos(d);
    else cambiarSlot('e_lat', claveL, function () { return new Tarjeta(d, a.lateral === 'emf'); });
    // triplex alien / duplex fantasmas
    var mk = a.multiplex, t = mk ? p.multiplex[mk] : null;
    var claveM = t ? mk + '|' + t.titulo + '|' + t.etiquetas.join(',') + '|' + fe : null;
    cambiarSlot('e_mx', claveM, function () {
      var tm = mk === 'triplex' ? 'ovni' : 'fantasma', ef = efectos(t, tm);
      return new Multiplex(VENTANAS[mk], t.etiquetas, t.titulo, { skin: mk === 'triplex' ? 'eTriplex' : 'eDuplex', tema: tm, ef: ef });
    });
    document.body.classList.toggle('e-mx', !!a.multiplex);
    document.body.classList.toggle('e-visor', !!a.visor);
    marca(!!a.marca); vivo(!!a.vivo); ticker(!!a.ticker); visor(!!a.visor); creditos(a.creditos);
    var lg = document.querySelector('#cBug .lugar'); if (lg) lg.classList.toggle('ovni', p.ubicacion.tema === 'ovni');
    // cortinas y transiciones: se lanzan con un id; tocar otra vez las saca
    var ct = a.cortina, id = ct && ct.id;
    if (primera) { if (id) cortActual = { id: id, pr: null }; }
    else if (id && (!cortActual || cortActual.id !== id)) {
      if (cortActual && cortActual.pr) cortActual.pr.abortar();
      var pr = lanzarCortina(ct.variante, ct.dur);
      cortActual = { id: id, pr: pr };
      pr.then(function () { if (cortActual && cortActual.pr === pr) cortActual = null; });
    } else if (!id && cortActual) { if (cortActual.pr) cortActual.pr.abortar(); cortActual = null; }
    primera = false;
  }
  // precarga de los destellos para que la primera cortina no tarde
  ['glitch4', 'glitch5', 'glitch6', 'glitch7'].forEach(video);
  function mx(t, ef) {
    var b = base(t);
    return { skin: b.skin, tema: t, colorBarra: b.colorBarra, colorAcento: b.colorAcento, colorSub: b.colorSub, colorSubTxt: b.colorSubTxt,
      colorRayo: b.colorRayo, etqColor: b.etqColor, efEnt: (ef || b).efEnt, efSal: (ef || b).efSal };
  }
  window.EOYF_SAL = { aplicar: aplicar, opciones: opciones, mx: mx, ICONOS: ICONOS, lugar: lugarTexto, lanzarCortina: lanzarCortina, CORT: CORT };
})();
