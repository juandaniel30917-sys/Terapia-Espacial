/* ENTRE OVNIS Y FANTASMAS — botonera, pauta (libreto del capítulo piloto) y textos del programa nuevo.
   Lo usa panel.html cuando E.programa === 'eoyf'. Las acciones llevan el prefijo «e:» para no chocar con las del programa anterior. */
(function () {
  'use strict';
  var H = null;                 // ayudas del panel: { E(), publicar(inm), redibujar(), toast(t) }
  function P() { return H.E().eoyf; }
  function A() { return P().aire; }
  var VERDE = '#7CC242', NARANJO = '#FF7A1A', ROJO = '#C8102E', GRIS = '#9B98B8', AMARILLO = '#FFC83D';
  function colorTema(t) { return t === 'ovni' ? VERDE : t === 'fantasma' ? NARANJO : ROJO; }
  function emoji(t) { return t === 'ovni' ? '👽 ' : t === 'fantasma' ? '👻 ' : '🎬 '; }

  /* ---------------- operaciones ---------------- */
  function inferior(k, valor) {
    var a = A(), nuevo = valor === undefined ? (a.inferior === k ? null : k) : (valor ? k : null);
    if (nuevo) a.multiplex = null;               // el triplex/duplex lleva su propio título abajo
    a.inferior = nuevo; H.publicar(true);
  }
  function lateral(k, valor) { var a = A(); a.lateral = valor === undefined ? (a.lateral === k ? null : k) : (valor ? k : null); H.publicar(true); }
  function fijo(k, valor) { var a = A(); a[k] = valor === undefined ? !a[k] : !!valor; H.publicar(true); }
  function multiplex(k, valor) {
    var a = A(), nuevo = valor === undefined ? (a.multiplex === k ? null : k) : (valor ? k : null);
    if (nuevo) a.inferior = null;
    a.multiplex = nuevo; H.publicar(true);
  }
  var timerCort = null;
  function durDe(v) { var e = P().efectos[v]; return e ? +e.dur || 2 : 2; }
  function cortina(v, soloEntrar) {
    var a = A(), act = a.cortina;
    clearTimeout(timerCort);
    if (act && !soloEntrar && act.variante === v) { a.cortina = null; H.publicar(true); H.redibujar(); return; }
    var id = TE.id(), dur = durDe(v); a.cortina = { id: id, variante: v, dur: dur };
    timerCort = setTimeout(function () { if (A().cortina && A().cortina.id === id) { A().cortina = null; H.publicar(true); H.redibujar(); } }, dur * 1000 + 500);
    H.publicar(true);
  }
  var ultimaAzar = '';
  function transAzar() {
    var ops = EOYF_DATOS.EFECTOS.filter(function (e) { return e[1] === 'transicion' && e[0] !== ultimaAzar; });
    var e = ops[Math.floor(Math.random() * ops.length)]; ultimaAzar = e[0];
    cortina(e[0], true); H.toast('🎲 ' + e[2] + ' · ' + durDe(e[0]) + ' s');
  }
  function creditos() {
    var a = A(); a.creditos = a.creditos ? null : { id: TE.id() };
    if (a.creditos) { a.inferior = null; a.lateral = null; a.multiplex = null; a.visor = false; }
    H.publicar(true);
  }
  function ciclarFondo() {
    var c = P().config, orden = ['azul', 'verde', 'transparente'];
    c.fondo = orden[(orden.indexOf(c.fondo) + 1) % orden.length];
    H.publicar(true); H.redibujar();
    H.toast(c.fondo === 'azul' ? '🟦 Fondo azul (chroma)' : c.fondo === 'verde' ? '🟩 Fondo verde: ojo, el acento verde alien se borra con el chroma' : '◻️ Fondo transparente (OBS)');
  }
  var EF_TXT = { tema: '🎭 según el estilo', ovni: '🛸 todo OVNI', fantasma: '👻 todo FANTASMA' };
  function ciclarEfecto() {
    var c = P().config, orden = ['tema', 'ovni', 'fantasma'];
    c.efecto = orden[(orden.indexOf(c.efecto) + 1) % orden.length];
    H.publicar(true); H.redibujar(); H.toast('Efecto general (gráficas en «Auto»): ' + EF_TXT[c.efecto]);
  }
  // limpiar: el fondo azul, la marca, el EN VIVO y el ticker no se limpian
  function limpiar() {
    var a = A(); clearTimeout(timerCort);
    a.inferior = null; a.lateral = null; a.multiplex = null; a.cortina = null; a.creditos = null; a.visor = false; a.ubicacion = false;
    H.publicar(true); H.toast('Salida limpia (el fondo azul, la marca, EN VIVO y el ticker se mantienen)');
  }

  /* ---------------- catálogo de acciones ---------------- */
  // datos de cada acción de gráfica (para el selector rápido de efecto 🛸/👻 en el botón)
  function datoDe(accion) {
    var p = P(), m;
    if ((m = /^e:gc:(\d+)$/.exec(accion))) return p.gcs[+m[1]];
    if ((m = /^e:tit:(\d+)$/.exec(accion))) return p.titulos[+m[1]];
    if ((m = /^e:dato:(\d+)$/.exec(accion))) return p.datos[+m[1]];
    if ((m = /^e:men:(\d+)$/.exec(accion))) return p.menciones[+m[1]];
    if ((m = /^e:mx:(triplex|duplex)$/.exec(accion))) return p.multiplex[m[1]];
    var k = { 'e:terreno': 'terreno', 'e:sabias': 'sabias', 'e:promo': 'promo', 'e:llamenos': 'llamenos', 'e:redes': 'redes', 'e:emf': 'emf' }[accion];
    return k ? p[k] : null;
  }
  function catalogo() {
    var c = {}, p = P();
    function add(id, titulo, sub, color, tipo, hacer, aire) { c[id] = { id: id, titulo: titulo, sub: sub, color: color, tipo: tipo, hacer: hacer, aire: aire || function () { return false; } }; }
    p.gcs.forEach(function (g, i) { add('e:gc:' + i, emoji(g.tema) + (g.nombre || 'GC ' + (i + 1)), g.cargo, colorTema(g.tema), 'GC', function () { inferior('gc:' + i); }, function () { return A().inferior === 'gc:' + i; }); });
    p.titulos.forEach(function (h, i) { add('e:tit:' + i, h.titulo || 'Título ' + (i + 1), h.sub, colorTema(h.tema), 'TÍTULO', function () { inferior('tit:' + i); }, function () { return A().inferior === 'tit:' + i; }); });
    add('e:terreno', '📹 En terreno', p.terreno.lugar, colorTema(p.terreno.tema), 'TÍTULO', function () { inferior('terreno'); }, function () { return A().inferior === 'terreno'; });
    p.datos.forEach(function (d, i) { add('e:dato:' + i, '📜 ' + (d.titulo || 'Dato ' + (i + 1)), 'tarjeta lateral', colorTema(d.tema), 'DATO', function () { lateral('dato:' + i); }, function () { return A().lateral === 'dato:' + i; }); });
    add('e:emf', '📡 ' + p.emf.titulo, 'nivel ' + p.emf.nivel + ' de 5 · tarjeta lateral', colorTema(p.emf.tema), 'DATO', function () { lateral('emf'); }, function () { return A().lateral === 'emf'; });
    add('e:sabias', '🧠 ' + p.sabias.titulo, p.sabias.texto, NARANJO, 'DATO', function () { inferior('sabias'); }, function () { return A().inferior === 'sabias'; });
    add('e:promo', '📲 Código ALIEN', p.promo.titulo + ' · hasta ' + p.promo.badge, VERDE, 'MENCIÓN', function () { inferior('promo'); }, function () { return A().inferior === 'promo'; });
    add('e:llamenos', '☎️ Llámenos ' + p.config.numero, p.llamenos.texto, NARANJO, 'MENCIÓN', function () { inferior('llamenos'); }, function () { return A().inferior === 'llamenos'; });
    add('e:redes', '📱 Redes ' + p.redes.usuario, p.redes.texto, colorTema(p.redes.tema), 'MENCIÓN', function () { inferior('redes'); }, function () { return A().inferior === 'redes'; });
    p.menciones.forEach(function (m, i) { add('e:men:' + i, '💰 ' + (m.marca || 'Mención ' + (i + 1)), m.texto, m.color || AMARILLO, 'MENCIÓN', function () { inferior('men:' + i); }, function () { return A().inferior === 'men:' + i; }); });
    add('e:mx:triplex', '🛸 ' + p.multiplex.triplex.titulo, p.multiplex.triplex.etiquetas.join(' · '), VERDE, 'PANTALLA', function () { multiplex('triplex'); }, function () { return A().multiplex === 'triplex'; });
    add('e:mx:duplex', '🦇 ' + p.multiplex.duplex.titulo, p.multiplex.duplex.etiquetas.join(' · '), NARANJO, 'PANTALLA', function () { multiplex('duplex'); }, function () { return A().multiplex === 'duplex'; });
    add('e:creditos', '🎞️ Créditos', 'rollo final · ' + p.creditos.dur + ' s', ROJO, 'PANTALLA', creditos, function () { return !!A().creditos; });
    EOYF_DATOS.EFECTOS.forEach(function (e) {
      var v = e[0];
      add('e:cort:' + v, e[2], e[3] + ' · ' + durDe(v) + ' s', colorTema(e[4]), e[1] === 'cortina' ? 'CORTINA' : 'TRANSICIÓN',
        function () { cortina(v); }, function () { return !!(A().cortina && A().cortina.variante === v); });
    });
    add('e:trans:azar', '🎲 Transición al azar', 'rayo · hipnosis · ectoplasma · psicofonía', AMARILLO, 'TRANSICIÓN', transAzar);
    add('e:marca', 'Marca de agua', 'logo del programa', GRIS, 'FIJO', function () { fijo('marca'); }, function () { return A().marca; });
    add('e:vivo', '🔴 ' + (p.config.vivoTexto || 'EN VIVO'), 'bajo la marca de agua', ROJO, 'FIJO', function () { fijo('vivo'); }, function () { return A().vivo; });
    add('e:ticker', 'Ticker noticias', 'ovnis y fantasmas del Maule', GRIS, 'FIJO', function () { fijo('ticker'); }, function () { return A().ticker; });
    add('e:visor', '⏺ Visor REC', p.visor.modo || 'cámara en terreno', '#FF1A1A', 'FIJO', function () { fijo('visor'); }, function () { return A().visor; });
    add('e:ubicacion', '📍 Ubicación', p.ubicacion.texto, colorTema(p.ubicacion.tema), 'FIJO', function () { fijo('ubicacion'); }, function () { return A().ubicacion; });
    add('e:efecto', 'Efecto: ' + EF_TXT[p.config.efecto || 'tema'], 'para las gráficas en «Auto» · toca para cambiar', '#4A1A9E', 'FIJO', ciclarEfecto, function () { return P().config.efecto !== 'tema'; });
    add('e:fondo', 'Fondo: ' + p.config.fondo, 'azul fijo por defecto (toca para cambiar)', '#1A3BFF', 'FIJO', ciclarFondo, function () { return P().config.fondo === 'azul'; });
    add('e:paso:sig', 'Paso siguiente ▶', 'pauta del libreto', AMARILLO, 'PAUTA', function () { irPaso(P().paso + 1); });
    add('e:paso:ant', '◀ Paso anterior', 'pauta del libreto', AMARILLO, 'PAUTA', function () { irPaso(Math.max(-1, P().paso - 1), true); });
    add('e:limpiar', 'Limpiar salida', 'el fondo azul, la marca y el ticker se quedan', '#FF2E63', 'ACCIÓN', limpiar);
    return c;
  }
  var TECLAS = ['F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24'];
  function botonesIniciales() {
    var p = P();
    var ids = ['e:cort:ovni', 'e:cort:fantasma', 'e:marca', 'e:ticker']
      .concat(p.gcs.map(function (_, i) { return 'e:gc:' + i; }))
      .concat(p.titulos.map(function (_, i) { return 'e:tit:' + i; }))
      .concat(['e:terreno', 'e:ubicacion', 'e:visor'], p.datos.map(function (_, i) { return 'e:dato:' + i; }), ['e:emf', 'e:sabias', 'e:promo', 'e:llamenos', 'e:redes'])
      .concat(p.menciones.map(function (_, i) { return 'e:men:' + i; }))
      .concat(['e:mx:triplex', 'e:mx:duplex', 'e:creditos'])
      .concat(EOYF_DATOS.EFECTOS.slice(2).map(function (e) { return 'e:cort:' + e[0]; }), ['e:trans:azar'])
      .concat(['e:vivo', 'e:efecto', 'e:paso:sig', 'e:limpiar']);
    return ids.map(function (a, i) { return { id: TE.id() + i, accion: a, texto: '', color: '', tecla: TECLAS[i] || '' }; });
  }
  var FILTROS = [['todo', 'Todo'], ['gc', '👤 GC'], ['titulos', '🏷️ Títulos'], ['datos', '📜 Datos'], ['menciones', '💰 Menciones'], ['pantallas', '🖥️ Pantallas'], ['cortinas', '✨ Cortinas'], ['trans', '🌀 Transiciones'], ['otros', '⚙️ Fijos y más']];
  var GRUPOS = { gc: ['GC'], titulos: ['TÍTULO'], datos: ['DATO'], menciones: ['MENCIÓN'], pantallas: ['PANTALLA'], cortinas: ['CORTINA'], trans: ['TRANSICIÓN'], otros: ['FIJO', 'PAUTA', 'ACCIÓN'] };

  // chips en el propio botón: duración (cortinas y transiciones) o efecto 🛸/👻 (gráficas)
  function decorar(btn, accion) {
    var m = /^e:cort:(\w+)$/.exec(accion), d, fila;
    if (m && P().efectos[m[1]]) {
      fila = document.createElement('span'); fila.className = 'chips';
      [2, 3, 4, 5].forEach(function (n) {
        var c = document.createElement('i'); c.textContent = n + 's'; c.classList.toggle('on', durDe(m[1]) === n);
        c.onclick = function (ev) { ev.stopPropagation(); P().efectos[m[1]].dur = n; H.publicar(true); H.redibujar(); };
        fila.appendChild(c);
      });
      btn.appendChild(fila); btn.classList.add('conChips');
    } else if ((d = datoDe(accion))) {
      fila = document.createElement('span'); fila.className = 'chips';
      var actual = d.entrada === d.salida ? (d.entrada || 'auto') : 'mixto';
      [['auto', 'Auto'], ['ovni', '🛸'], ['fantasma', '👻']].forEach(function (op) {
        var c = document.createElement('i'); c.textContent = op[1]; c.title = op[0] === 'auto' ? 'Efecto automático' : 'Entra y sale con efecto ' + op[0];
        c.classList.toggle('on', actual === op[0]);
        c.onclick = function (ev) { ev.stopPropagation(); d.entrada = op[0]; d.salida = op[0]; H.publicar(true); H.redibujar(); };
        fila.appendChild(c);
      });
      btn.appendChild(fila); btn.classList.add('conChips');
    }
  }

  /* ---------------- pauta: libreto «Entre Ovnis y Fantasmas» · capítulo piloto ---------------- */
  function pasos() {
    var p = P(), g = function (i) { return (p.gcs[i] || {}).nombre || 'GC ' + (i + 1); }, t = function (i) { return (p.titulos[i] || {}).titulo || ''; };
    return [
      ['B1 · Lead', 'Intro: cortina OVNI + marca + EN VIVO + «' + t(4) + '»', [['cort', 'ovni'], ['marca', 1], ['vivo', 1], ['inf', 'tit:4']]],
      ['B1 · Lead', 'Bienvenida: GC ' + g(0) + ' + ticker', [['inf', 'gc:0'], ['ticker', 1]]],
      ['B1 · Lead', 'Mensaje de voz al ' + p.config.numero, [['inf', 'llamenos']]],
      ['B1 · VTR ovnis', 'Rayo tractor + visor REC + «' + t(0) + '»', [['cort', 'rayo'], ['visor', 1], ['inf', 'tit:0']]],
      ['B1 · Estudio', 'Barrido OVNI + GC ' + g(1), [['visor', 0], ['cort', 'barrido'], ['inf', 'gc:1']]],
      ['B1 · Pase a nota', 'Expediente + «' + t(1) + '»', [['cort', 'expediente'], ['inf', 'tit:1']]],
      ['B1 · Nota Colbún', 'Señal perdida + GC ' + g(4) + ' + ubicación', [['cort', 'estatica'], ['inf', 'gc:4'], ['ubic', 1]]],
      ['B1 · Nota Colbún', 'Testigo: GC ' + g(2), [['inf', 'gc:2']]],
      ['B1 · Nota Colbún', 'Dato «' + (p.datos[1] || {}).titulo + '» (Ruta Ufológica)', [['inf', null], ['lat', 'dato:1']]],
      ['B1 · Mención', 'Cortina OVNI + ' + (p.menciones[0] || {}).marca, [['lat', null], ['ubic', 0], ['cort', 'ovni'], ['inf', 'men:0']]],
      ['B1 · Estudio', 'Hipnosis + ' + p.multiplex.triplex.titulo, [['inf', null], ['cort', 'hipnosis'], ['mx', 'triplex']]],
      ['B1 · Pre-corte', '«¿Sabías qué?»', [['mx', null], ['inf', 'sabias']]],
      ['B1 · Pre-corte', 'Volvemos: «' + t(5) + '»', [['inf', 'tit:5']]],
      ['Comerciales', 'Cortina OVNI y salida limpia', [['cort', 'ovni'], ['limpiar']]],
      ['B2 · Regreso', 'Cortina FANTASMA + GC ' + g(0), [['cort', 'fantasma'], ['inf', 'gc:0']]],
      ['B2 · Pase a nota', 'Apagón + «' + t(2) + '»', [['cort', 'apagon'], ['inf', 'tit:2']]],
      ['B2 · Nota Maitenes', 'Murciélagos + En terreno + ubicación + visor REC', [['cort', 'murcielagos'], ['inf', 'terreno'], ['ubic', 1], ['visor', 1]]],
      ['B2 · Nota Maitenes', 'Reportera: GC ' + g(5), [['inf', 'gc:5']]],
      ['B2 · Nota Maitenes', 'Medidor EMF (actividad paranormal)', [['inf', null], ['lat', 'emf']]],
      ['B2 · Nota Maitenes', 'Testigo: GC ' + g(3), [['lat', null], ['inf', 'gc:3']]],
      ['B2 · Nota Maitenes', 'Dato «' + (p.datos[0] || {}).titulo + '»', [['inf', null], ['lat', 'dato:0']]],
      ['B2 · Estudio', 'Ectoplasma + GC ' + g(1), [['lat', null], ['ubic', 0], ['visor', 0], ['cort', 'rorschach'], ['inf', 'gc:1']]],
      ['B2 · Estudio', p.multiplex.duplex.titulo, [['inf', null], ['mx', 'duplex']]],
      ['B2 · Promo', 'Código ALIEN hasta ' + p.promo.badge, [['mx', null], ['inf', 'promo']]],
      ['B2 · Mención', 'Cortina FANTASMA + ' + (p.menciones[1] || {}).marca, [['cort', 'fantasma'], ['inf', 'men:1']]],
      ['B2 · Sección', 'Psicofonía + «' + t(3) + '»', [['cort', 'psicofonia'], ['inf', 'tit:3']]],
      ['B2 · Cierre', 'Despedida: «' + t(6) + '»', [['inf', 'tit:6']]],
      ['B2 · Cierre', 'Redes: ' + p.redes.usuario, [['inf', 'redes']]],
      ['Corte · Mención', (p.menciones[2] || {}).marca + ' (con el VTR pregrabado)', [['cort', 'fantasma'], ['inf', 'men:2']]],
      ['Teaser', '«' + t(7) + '»', [['inf', 'tit:7']]],
      ['Fin', 'Créditos (sin ticker ni EN VIVO)', [['limpiar'], ['ticker', 0], ['vivo', 0], ['cred', 1]]]
    ];
  }
  var NOMBRES = { cort: 'cortina', inf: 'abajo', lat: 'lateral', mx: 'pantalla', marca: 'marca', ticker: 'ticker', limpiar: 'limpiar', vivo: 'EN VIVO', visor: 'visor REC', ubic: 'ubicación', cred: 'créditos' };
  function describir(acc) {
    return acc.map(function (x) {
      if (x[0] === 'limpiar') return 'limpiar';
      if (x[1] === null || x[1] === 0) return 'quitar ' + NOMBRES[x[0]];
      return NOMBRES[x[0]] + (typeof x[1] === 'string' ? ' ' + x[1] : '');
    }).join(' · ');
  }
  function irPaso(i, soloMarcar) {
    var lista = pasos(); if (i < -1 || i >= lista.length) return;
    P().paso = i;
    if (!soloMarcar && i >= 0) lista[i][2].forEach(function (x) {
      var k = x[0], v = x[1];
      if (k === 'cort') cortina(v, true);
      if (k === 'inf') { if (v) inferior(v, true); else A().inferior = null; }
      if (k === 'lat') { if (v) lateral(v, true); else A().lateral = null; }
      if (k === 'mx') { if (v) multiplex(v, true); else A().multiplex = null; }
      if (k === 'marca' || k === 'ticker' || k === 'vivo' || k === 'visor') A()[k] = !!v;
      if (k === 'ubic') A().ubicacion = !!v;
      if (k === 'cred') { A().creditos = v ? { id: TE.id() } : null; }
      if (k === 'limpiar') { A().inferior = null; A().lateral = null; A().multiplex = null; A().creditos = null; A().visor = false; A().ubicacion = false; }
    });
    H.publicar(true); H.redibujar();
  }

  /* ---------------- qué textos edita cada botón (✎) ---------------- */
  var EF_OPS = [['auto', 'Auto'], ['ovni', '🛸 Ovni'], ['fantasma', '👻 Fantasma']];
  var ENT = ['entrada', 'Efecto al aparecer', EF_OPS], SAL = ['salida', 'Efecto al desaparecer', EF_OPS];
  var DURS = [[2, '2 s'], [3, '3 s'], [4, '4 s'], [5, '5 s']];
  function objetivo(accion) {
    var p = P(), m, T = function (o, campos) { return { tipo: 'campos', o: o, campos: campos }; };
    var TEMA = ['tema', 'Estilo', [['ovni', '👽 Ovni'], ['fantasma', '👻 Fantasma'], ['neutro', '🎬 Neutro']]];
    if ((m = /^e:gc:(\d+)$/.exec(accion))) return T(p.gcs[+m[1]], [['nombre', 'Nombre'], ['cargo', 'Cargo'], TEMA, ENT, SAL]);
    if ((m = /^e:tit:(\d+)$/.exec(accion))) return T(p.titulos[+m[1]], [['titulo', 'Título'], ['sub', 'Bajada'], ['etiqueta', 'Etiqueta superior'], TEMA, ENT, SAL]);
    if (accion === 'e:terreno') return T(p.terreno, [['etiqueta', 'Etiqueta'], ['lugar', 'Lugar'], ['sub', 'Bajada'], TEMA, ENT, SAL]);
    if ((m = /^e:dato:(\d+)$/.exec(accion))) return T(p.datos[+m[1]], [['titulo', 'Título'], ['texto', 'Texto', 'largo'], ['etiqueta', 'Etiqueta'], TEMA, ENT, SAL]);
    if (accion === 'e:emf') return T(p.emf, [['titulo', 'Título'], ['lugar', 'Lugar'], ['nivel', 'Nivel de actividad', [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']]], ['etiqueta', 'Etiqueta'], TEMA, ENT, SAL]);
    if (accion === 'e:sabias') return T(p.sabias, [['titulo', 'Etiqueta'], ['texto', 'Dato curioso', 'largo'], ENT, SAL]);
    if (accion === 'e:promo') return T(p.promo, [['titulo', 'Título (se agrega «AL número»)'], ['texto', 'Bajada'], ['badge', 'Descuento'], ENT, SAL]);
    if (accion === 'e:llamenos') return T(p.llamenos, [['titulo', 'Título (se agrega «AL número»)'], ['texto', 'Bajada'], ENT, SAL]);
    if (accion === 'e:redes') return T(p.redes, [['titulo', 'Etiqueta'], ['usuario', 'Usuario (@)'], ['texto', 'Redes'], TEMA, ENT, SAL]);
    if ((m = /^e:men:(\d+)$/.exec(accion))) return T(p.menciones[+m[1]], [['marca', 'Marca'], ['texto', 'Texto de la mención'], ['etiqueta', 'Etiqueta (AUSPICIA, MENCIÓN…)'], ['color', 'Color (#RRGGBB)'], ['logo', 'Logo (ruta o link)'], ENT, SAL]);
    if ((m = /^e:mx:(triplex|duplex)$/.exec(accion))) return T(p.multiplex[m[1]], [['titulo', 'Título'], ['etiquetas', 'Etiquetas de las ventanas (separadas por | )'], ENT, SAL]);
    if ((m = /^e:cort:(\w+)$/.exec(accion)) && p.efectos[m[1]]) return T(p.efectos[m[1]], [['dur', 'Duración', DURS]]);
    if (accion === 'e:creditos') return T(p.creditos, [['texto', 'Créditos (una línea por cargo: «Cargo: nombre · nombre»)', 'largo'], ['cierre', 'Frase final'], ['tituloLogos', 'Título de los logos'], ['dur', 'Duración del rollo (segundos)', [[15, '15 s'], [20, '20 s'], [25, '25 s'], [30, '30 s'], [45, '45 s']]]]);
    if (accion === 'e:ticker') return T(p.config, [['ticker', 'Noticias (separadas por · )', 'largo'], ['fecha', 'Fecha']]);
    if (accion === 'e:marca') return T(p.config, [['marcaOpacidad', 'Opacidad de la marca (0 a 1)', 'num']]);
    if (accion === 'e:vivo') return T(p.config, [['vivoTexto', 'Texto (EN VIVO, GRABADO, ESTRENO…)']]);
    if (accion === 'e:visor') return T(p.visor, [['modo', 'Texto del visor (abajo a la izquierda)']]);
    if (accion === 'e:ubicacion') return T(p.ubicacion, [['texto', 'Lugar (antes de la coma, en grande)'], ['tema', 'Estilo', [['ovni', '👽 Ovni'], ['fantasma', '👻 Fantasma']]]]);
    if (accion === 'e:efecto') return T(p.config, [['efecto', 'Efecto de las gráficas en «Auto»', [['tema', '🎭 Según el estilo'], ['ovni', '🛸 Todo ovni'], ['fantasma', '👻 Todo fantasma']]]]);
    if (accion === 'e:fondo') return T(p.config, [['fondo', 'Fondo', [['azul', '🟦 Azul (fijo)'], ['verde', '🟩 Verde'], ['transparente', '◻️ Transparente']]]]);
    return null;
  }
  // dibuja los campos (texto, área, número o selector de opciones) en un contenedor
  function campos(cont, ob, alCambiar) {
    ob.campos.forEach(function (c) {
      var d = document.createElement('div'); d.className = 'campo';
      var lab = document.createElement('label'); lab.textContent = c[1]; d.appendChild(lab);
      if (Array.isArray(c[2])) {
        var seg = document.createElement('div'); seg.className = 'seg';
        c[2].forEach(function (op) {
          var b = document.createElement('button'); b.type = 'button'; b.textContent = op[1]; b.classList.toggle('on', ob.o[c[0]] === op[0]);
          b.onclick = function () { ob.o[c[0]] = op[0]; seg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); alCambiar(true); };
          seg.appendChild(b);
        });
        d.appendChild(seg);
      } else {
        var i = document.createElement(c[2] === 'largo' ? 'textarea' : 'input');
        if (i.tagName === 'INPUT') i.type = c[2] === 'num' ? 'number' : 'text';
        if (c[2] === 'num') i.step = '0.05';
        var v = ob.o[c[0]]; i.value = Array.isArray(v) ? v.join(' | ') : (v === undefined || v === null ? '' : v);
        i.oninput = function () {
          ob.o[c[0]] = Array.isArray(ob.o[c[0]]) ? i.value.split('|').map(function (x) { return x.trim(); }) : (c[2] === 'num' ? (parseFloat(i.value) || 0) : i.value);
          alCambiar(false);
        };
        d.appendChild(i);
      }
      cont.appendChild(d);
    });
  }
  // pestaña Textos completa del programa nuevo
  function editorTextos(cont, alCambiar) {
    cont.innerHTML = '';
    var p = P();
    function seccion(t) { var h = document.createElement('h2'); h.textContent = t; cont.appendChild(h); }
    seccion('Programa');
    campos(cont, { o: p.config, campos: [['programa', 'Nombre del programa'], ['numero', 'Número (mensajes de voz y código ALIEN)'], ['fondo', 'Fondo de la salida', [['azul', '🟦 Azul (fijo)'], ['verde', '🟩 Verde'], ['transparente', '◻️ Transparente']]]] }, alCambiar);
    var n = document.createElement('p'); n.className = 'nota';
    n.textContent = 'Azul: queda fijo por defecto y LIMPIAR no lo saca (chroma como el logo permanente; el acento verde alien no se borra). Verde: chroma clásico. Transparente: OBS recibe las gráficas sin fondo.';
    cont.appendChild(n);
    seccion('GC de personas');
    p.gcs.forEach(function (g) { campos(cont, { o: g, campos: [['nombre', 'Nombre'], ['cargo', 'Cargo'], ['tema', 'Estilo', [['ovni', '👽 Ovni'], ['fantasma', '👻 Fantasma'], ['neutro', '🎬 Neutro']]]] }, alCambiar); });
    seccion('Títulos');
    p.titulos.forEach(function (h) { campos(cont, { o: h, campos: [['titulo', 'Título'], ['sub', 'Bajada'], ['etiqueta', 'Etiqueta']] }, alCambiar); });
    seccion('En terreno'); campos(cont, objetivo('e:terreno'), alCambiar);
    seccion('Datos (tarjeta lateral)'); p.datos.forEach(function (_, i) { campos(cont, objetivo('e:dato:' + i), alCambiar); });
    seccion('¿Sabías qué?'); campos(cont, objetivo('e:sabias'), alCambiar);
    seccion('Código ALIEN y Llámenos'); campos(cont, objetivo('e:promo'), alCambiar); campos(cont, objetivo('e:llamenos'), alCambiar);
    seccion('Menciones'); p.menciones.forEach(function (_, i) { campos(cont, objetivo('e:men:' + i), alCambiar); });
    seccion('Triplex y duplex'); campos(cont, objetivo('e:mx:triplex'), alCambiar); campos(cont, objetivo('e:mx:duplex'), alCambiar);
    seccion('Ticker'); campos(cont, objetivo('e:ticker'), alCambiar);
    seccion('Efectos de entrada y salida'); campos(cont, objetivo('e:efecto'), alCambiar);
    var n2 = document.createElement('p'); n2.className = 'nota';
    n2.textContent = '🛸 Ovni: cae el platillo, enciende el rayo y deja la gráfica (al salir se la lleva). 👻 Fantasma: el espectro cruza y la gráfica se materializa detrás de él (al salir, se desvanece). Cada gráfica se puede fijar en Ovni o Fantasma con los chips del botón o con su ✎.';
    cont.appendChild(n2);
    seccion('Cortinas y transiciones (duración)');
    EOYF_DATOS.EFECTOS.forEach(function (e) { campos(cont, { o: p.efectos[e[0]], campos: [['dur', e[2], DURS]] }, alCambiar); });
    seccion('Ubicación, visor REC y EN VIVO'); campos(cont, objetivo('e:ubicacion'), alCambiar); campos(cont, objetivo('e:visor'), alCambiar); campos(cont, objetivo('e:vivo'), alCambiar);
    seccion('Medidor EMF'); campos(cont, objetivo('e:emf'), alCambiar);
    seccion('Redes sociales'); campos(cont, objetivo('e:redes'), alCambiar);
    seccion('Créditos'); campos(cont, objetivo('e:creditos'), alCambiar);
  }

  window.EOYF_PANEL = {
    iniciar: function (ayudas) { H = ayudas; },
    catalogo: catalogo, botonesIniciales: botonesIniciales, decorar: decorar, FILTROS: FILTROS, GRUPOS: GRUPOS,
    pasos: pasos, describir: describir, irPaso: irPaso, limpiar: limpiar, objetivo: objetivo, campos: campos, editorTextos: editorTextos
  };
})();
