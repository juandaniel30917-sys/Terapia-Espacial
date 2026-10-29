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
  function cortina(v, soloEntrar) {
    var a = A(), act = a.cortina;
    clearTimeout(timerCort);
    if (act && !soloEntrar && act.variante === v) { a.cortina = null; H.publicar(true); H.redibujar(); return; }
    var id = TE.id(); a.cortina = { id: id, variante: v };
    timerCort = setTimeout(function () { if (A().cortina && A().cortina.id === id) { A().cortina = null; H.publicar(true); H.redibujar(); } }, 1700);
    H.publicar(true);
  }
  function ciclarFondo() {
    var c = P().config, orden = ['transparente', 'azul', 'verde'];
    c.fondo = orden[(orden.indexOf(c.fondo) + 1) % orden.length];
    H.publicar(true); H.redibujar();
    H.toast(c.fondo === 'azul' ? '🟦 Fondo azul (chroma)' : c.fondo === 'verde' ? '🟩 Fondo verde: ojo, el acento verde alien se borra con el chroma' : '◻️ Fondo transparente (OBS)');
  }
  function limpiar() {
    var a = A(); clearTimeout(timerCort);
    a.inferior = null; a.lateral = null; a.multiplex = null; a.cortina = null;
    H.publicar(true); H.toast('Salida limpia (marca de agua y ticker se mantienen)');
  }

  /* ---------------- catálogo de acciones ---------------- */
  function catalogo() {
    var c = {}, p = P(), a = A();
    function add(id, titulo, sub, color, tipo, hacer, aire) { c[id] = { id: id, titulo: titulo, sub: sub, color: color, tipo: tipo, hacer: hacer, aire: aire || function () { return false; } }; }
    p.gcs.forEach(function (g, i) { add('e:gc:' + i, emoji(g.tema) + (g.nombre || 'GC ' + (i + 1)), g.cargo, colorTema(g.tema), 'GC', function () { inferior('gc:' + i); }, function () { return A().inferior === 'gc:' + i; }); });
    p.titulos.forEach(function (h, i) { add('e:tit:' + i, h.titulo || 'Título ' + (i + 1), h.sub, colorTema(h.tema), 'TÍTULO', function () { inferior('tit:' + i); }, function () { return A().inferior === 'tit:' + i; }); });
    add('e:terreno', '📹 En terreno', p.terreno.lugar, colorTema(p.terreno.tema), 'TÍTULO', function () { inferior('terreno'); }, function () { return A().inferior === 'terreno'; });
    p.datos.forEach(function (d, i) { add('e:dato:' + i, '📜 ' + (d.titulo || 'Dato ' + (i + 1)), 'tarjeta lateral', colorTema(d.tema), 'DATO', function () { lateral('dato:' + i); }, function () { return A().lateral === 'dato:' + i; }); });
    add('e:sabias', '🧠 ' + p.sabias.titulo, p.sabias.texto, NARANJO, 'DATO', function () { inferior('sabias'); }, function () { return A().inferior === 'sabias'; });
    add('e:promo', '📲 Código ALIEN', p.promo.titulo + ' · hasta ' + p.promo.badge, VERDE, 'MENCIÓN', function () { inferior('promo'); }, function () { return A().inferior === 'promo'; });
    add('e:llamenos', '☎️ Llámenos ' + p.config.numero, p.llamenos.texto, NARANJO, 'MENCIÓN', function () { inferior('llamenos'); }, function () { return A().inferior === 'llamenos'; });
    p.menciones.forEach(function (m, i) { add('e:men:' + i, '💰 ' + (m.marca || 'Mención ' + (i + 1)), m.texto, m.color || AMARILLO, 'MENCIÓN', function () { inferior('men:' + i); }, function () { return A().inferior === 'men:' + i; }); });
    add('e:mx:triplex', '🛸 ' + p.multiplex.triplex.titulo, p.multiplex.triplex.etiquetas.join(' · '), VERDE, 'PANTALLA', function () { multiplex('triplex'); }, function () { return A().multiplex === 'triplex'; });
    add('e:mx:duplex', '🦇 ' + p.multiplex.duplex.titulo, p.multiplex.duplex.etiquetas.join(' · '), NARANJO, 'PANTALLA', function () { multiplex('duplex'); }, function () { return A().multiplex === 'duplex'; });
    add('e:cort:ovni', '🛸 Cortina OVNI', 'corta · corte 0,6 s', VERDE, 'CORTINA', function () { cortina('ovni'); }, function () { return !!(A().cortina && A().cortina.variante === 'ovni'); });
    add('e:cort:fantasma', '👻 Cortina FANTASMA', 'corta · corte 0,6 s', NARANJO, 'CORTINA', function () { cortina('fantasma'); }, function () { return !!(A().cortina && A().cortina.variante === 'fantasma'); });
    add('e:marca', 'Marca de agua', 'logo del programa', GRIS, 'FIJO', function () { fijo('marca'); }, function () { return A().marca; });
    add('e:ticker', 'Ticker noticias', 'ovnis y fantasmas del Maule', GRIS, 'FIJO', function () { fijo('ticker'); }, function () { return A().ticker; });
    add('e:fondo', 'Fondo: ' + p.config.fondo, 'toca para cambiar (transparente · azul · verde)', '#4A1A9E', 'FIJO', ciclarFondo, function () { return P().config.fondo !== 'transparente'; });
    add('e:paso:sig', 'Paso siguiente ▶', 'pauta del libreto', AMARILLO, 'PAUTA', function () { irPaso(P().paso + 1); });
    add('e:paso:ant', '◀ Paso anterior', 'pauta del libreto', AMARILLO, 'PAUTA', function () { irPaso(Math.max(-1, P().paso - 1), true); });
    add('e:limpiar', 'Limpiar salida', 'todo menos marca y ticker', '#FF2E63', 'ACCIÓN', limpiar);
    return c;
  }
  var TECLAS = ['F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24'];
  function botonesIniciales() {
    var p = P();
    var ids = ['e:cort:ovni', 'e:cort:fantasma', 'e:marca', 'e:ticker']
      .concat(p.gcs.map(function (_, i) { return 'e:gc:' + i; }))
      .concat(p.titulos.map(function (_, i) { return 'e:tit:' + i; }))
      .concat(['e:terreno'], p.datos.map(function (_, i) { return 'e:dato:' + i; }), ['e:sabias', 'e:promo', 'e:llamenos'])
      .concat(p.menciones.map(function (_, i) { return 'e:men:' + i; }))
      .concat(['e:mx:triplex', 'e:mx:duplex', 'e:fondo', 'e:paso:sig', 'e:limpiar']);
    return ids.map(function (a, i) { return { id: TE.id() + i, accion: a, texto: '', color: '', tecla: TECLAS[i] || '' }; });
  }
  var FILTROS = [['todo', 'Todo'], ['gc', '👤 GC'], ['titulos', '🏷️ Títulos'], ['datos', '📜 Datos'], ['menciones', '💰 Menciones'], ['pantallas', '🖥️ Triplex / Duplex'], ['cortinas', '✨ Cortinas'], ['otros', '⚙️ Fijos y más']];
  var GRUPOS = { gc: ['GC'], titulos: ['TÍTULO'], datos: ['DATO'], menciones: ['MENCIÓN'], pantallas: ['PANTALLA'], cortinas: ['CORTINA'], otros: ['FIJO', 'PAUTA', 'ACCIÓN'] };

  /* ---------------- pauta: libreto «Entre Ovnis y Fantasmas» · capítulo piloto ---------------- */
  function pasos() {
    var p = P(), g = function (i) { return (p.gcs[i] || {}).nombre || 'GC ' + (i + 1); }, t = function (i) { return (p.titulos[i] || {}).titulo || ''; };
    return [
      ['B1 · Lead', 'Intro: cortina OVNI + marca de agua + «' + t(4) + '»', [['cort', 'ovni'], ['marca', 1], ['inf', 'tit:4']]],
      ['B1 · Lead', 'Bienvenida: GC ' + g(0) + ' + ticker', [['inf', 'gc:0'], ['ticker', 1]]],
      ['B1 · Lead', 'Mensaje de voz al ' + p.config.numero, [['inf', 'llamenos']]],
      ['B1 · VTR ovnis', 'Título «' + t(0) + '»', [['inf', 'tit:0']]],
      ['B1 · Estudio', 'Cortina OVNI + GC ' + g(1), [['cort', 'ovni'], ['inf', 'gc:1']]],
      ['B1 · Pase a nota', 'Título «' + t(1) + '»', [['inf', 'tit:1']]],
      ['B1 · Nota Colbún', 'Cortina OVNI + GC ' + g(4) + ' (en terreno)', [['cort', 'ovni'], ['inf', 'gc:4']]],
      ['B1 · Nota Colbún', 'Testigo: GC ' + g(2), [['inf', 'gc:2']]],
      ['B1 · Nota Colbún', 'Dato «' + (p.datos[1] || {}).titulo + '» (Ruta Ufológica)', [['inf', null], ['lat', 'dato:1']]],
      ['B1 · Mención', 'Cortina OVNI + ' + (p.menciones[0] || {}).marca, [['lat', null], ['cort', 'ovni'], ['inf', 'men:0']]],
      ['B1 · Estudio', p.multiplex.triplex.titulo, [['inf', null], ['mx', 'triplex']]],
      ['B1 · Pre-corte', '«¿Sabías qué?»', [['mx', null], ['inf', 'sabias']]],
      ['B1 · Pre-corte', 'Volvemos: «' + t(5) + '»', [['inf', 'tit:5']]],
      ['Comerciales', 'Cortina OVNI y salida limpia', [['cort', 'ovni'], ['limpiar']]],
      ['B2 · Regreso', 'Cortina FANTASMA + GC ' + g(0), [['cort', 'fantasma'], ['inf', 'gc:0']]],
      ['B2 · Pase a nota', 'Título «' + t(2) + '»', [['inf', 'tit:2']]],
      ['B2 · Nota Maitenes', 'Cortina FANTASMA + En terreno «' + p.terreno.lugar + '»', [['cort', 'fantasma'], ['inf', 'terreno']]],
      ['B2 · Nota Maitenes', 'Reportera: GC ' + g(5), [['inf', 'gc:5']]],
      ['B2 · Nota Maitenes', 'Testigo: GC ' + g(3), [['inf', 'gc:3']]],
      ['B2 · Nota Maitenes', 'Dato «' + (p.datos[0] || {}).titulo + '»', [['inf', null], ['lat', 'dato:0']]],
      ['B2 · Estudio', 'Cortina FANTASMA + GC ' + g(1), [['lat', null], ['cort', 'fantasma'], ['inf', 'gc:1']]],
      ['B2 · Estudio', p.multiplex.duplex.titulo, [['inf', null], ['mx', 'duplex']]],
      ['B2 · Promo', 'Código ALIEN hasta ' + p.promo.badge, [['mx', null], ['inf', 'promo']]],
      ['B2 · Mención', 'Cortina FANTASMA + ' + (p.menciones[1] || {}).marca, [['cort', 'fantasma'], ['inf', 'men:1']]],
      ['B2 · Sección', 'Cortina FANTASMA + «' + t(3) + '»', [['cort', 'fantasma'], ['inf', 'tit:3']]],
      ['B2 · Cierre', 'Despedida: «' + t(6) + '»', [['inf', 'tit:6']]],
      ['Corte · Mención', (p.menciones[2] || {}).marca + ' (con el VTR pregrabado)', [['cort', 'fantasma'], ['inf', 'men:2']]],
      ['Teaser', '«' + t(7) + '»', [['inf', 'tit:7']]],
      ['Fin', 'Créditos: limpiar todo (sin marca ni ticker)', [['limpiar'], ['marca', 0], ['ticker', 0]]]
    ];
  }
  var NOMBRES = { cort: 'cortina', inf: 'abajo', lat: 'dato', mx: 'pantalla', marca: 'marca', ticker: 'ticker', limpiar: 'limpiar' };
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
      if (k === 'marca' || k === 'ticker') A()[k] = !!v;
      if (k === 'limpiar') { A().inferior = null; A().lateral = null; A().multiplex = null; }
    });
    H.publicar(true); H.redibujar();
  }

  /* ---------------- qué textos edita cada botón (✎) ---------------- */
  function objetivo(accion) {
    var p = P(), m, T = function (o, campos) { return { tipo: 'campos', o: o, campos: campos }; };
    var TEMA = ['tema', 'Estilo', [['ovni', '👽 Ovni'], ['fantasma', '👻 Fantasma'], ['neutro', '🎬 Neutro']]];
    if ((m = /^e:gc:(\d+)$/.exec(accion))) return T(p.gcs[+m[1]], [['nombre', 'Nombre'], ['cargo', 'Cargo'], TEMA]);
    if ((m = /^e:tit:(\d+)$/.exec(accion))) return T(p.titulos[+m[1]], [['titulo', 'Título'], ['sub', 'Bajada'], ['etiqueta', 'Etiqueta superior'], TEMA]);
    if (accion === 'e:terreno') return T(p.terreno, [['etiqueta', 'Etiqueta'], ['lugar', 'Lugar'], ['sub', 'Bajada'], TEMA]);
    if ((m = /^e:dato:(\d+)$/.exec(accion))) return T(p.datos[+m[1]], [['titulo', 'Título'], ['texto', 'Texto', 'largo'], ['etiqueta', 'Etiqueta'], TEMA]);
    if (accion === 'e:sabias') return T(p.sabias, [['titulo', 'Etiqueta'], ['texto', 'Dato curioso', 'largo']]);
    if (accion === 'e:promo') return T(p.promo, [['titulo', 'Título (se agrega «AL número»)'], ['texto', 'Bajada'], ['badge', 'Descuento']]);
    if (accion === 'e:llamenos') return T(p.llamenos, [['titulo', 'Título (se agrega «AL número»)'], ['texto', 'Bajada']]);
    if ((m = /^e:men:(\d+)$/.exec(accion))) return T(p.menciones[+m[1]], [['marca', 'Marca'], ['texto', 'Texto de la mención'], ['etiqueta', 'Etiqueta (AUSPICIA, MENCIÓN…)'], ['color', 'Color (#RRGGBB)'], ['logo', 'Logo (ruta o link)']]);
    if ((m = /^e:mx:(triplex|duplex)$/.exec(accion))) return T(p.multiplex[m[1]], [['titulo', 'Título'], ['etiquetas', 'Etiquetas de las ventanas (separadas por | )']]);
    if (accion === 'e:ticker') return T(p.config, [['ticker', 'Noticias (separadas por · )', 'largo'], ['fecha', 'Fecha']]);
    if (accion === 'e:marca') return T(p.config, [['marcaOpacidad', 'Opacidad de la marca (0 a 1)', 'num']]);
    if (accion === 'e:fondo') return T(p.config, [['fondo', 'Fondo', [['transparente', '◻️ Transparente'], ['azul', '🟦 Azul'], ['verde', '🟩 Verde']]]]);
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
    campos(cont, { o: p.config, campos: [['programa', 'Nombre del programa'], ['numero', 'Número (mensajes de voz y código ALIEN)'], ['fondo', 'Fondo de la salida', [['transparente', '◻️ Transparente'], ['azul', '🟦 Azul'], ['verde', '🟩 Verde']]]] }, alCambiar);
    var n = document.createElement('p'); n.className = 'nota';
    n.textContent = 'Transparente: OBS recibe las gráficas sin fondo. Azul: chroma como el logo permanente (recomendado si usas el ATEM, porque el acento verde alien no se borra). Verde: chroma clásico.';
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
  }

  window.EOYF_PANEL = {
    iniciar: function (ayudas) { H = ayudas; },
    catalogo: catalogo, botonesIniciales: botonesIniciales, FILTROS: FILTROS, GRUPOS: GRUPOS,
    pasos: pasos, describir: describir, irPaso: irPaso, limpiar: limpiar, objetivo: objetivo, campos: campos, editorTextos: editorTextos
  };
})();
