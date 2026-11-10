/* ENTRE OVNIS Y FANTASMAS — módulo ⬇️ DESCARGAR del panel.
   Elige una gráfica, cambia sus textos (en una copia: el programa no cambia), la duración, si lleva animación de entrada,
   de salida, ambas o ninguna, y el fondo (verde o azul). Exporta un MP4 1920×1080 para ponerlo arriba de cualquier video.
   El video se arma en salida.html?exportar=1 (mismo motor de la salida, cuadro a cuadro). */
(function () {
  'use strict';
  var $ = function (s, p) { return (p || document).querySelector(s); };
  var $$ = function (s, p) { return [].slice.call((p || document).querySelectorAll(s)); };
  function clon(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function leer(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function toast(t) { if (window.toast) window.toast(t); }
  function nombreArchivo(s) { return String(s || 'grafica').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_').slice(0, 60) || 'grafica'; }

  /* ---------- catálogo de gráficas del programa nuevo ---------- */
  function catalogo(p) {
    var L = [];
    function add(g, n, item, ruta, extra) { L.push({ g: g, n: n, item: item, ruta: ruta, extra: extra || [] }); }
    (p.gcs || []).forEach(function (x, i) { add('GC (nombres)', x.nombre + ' · ' + x.cargo, { k: 'inferior', v: 'gc:' + i }, ['gcs', i]); });
    (p.titulos || []).forEach(function (x, i) { add('Títulos', x.titulo + (x.etiqueta ? ' · ' + x.etiqueta : ''), { k: 'inferior', v: 'tit:' + i }, ['titulos', i]); });
    add('Tercio inferior', 'En terreno · ' + p.terreno.lugar, { k: 'inferior', v: 'terreno' }, ['terreno']);
    add('Tercio inferior', '¿Sabías qué?', { k: 'inferior', v: 'sabias' }, ['sabias']);
    add('Tercio inferior', 'Promo · ' + p.promo.titulo, { k: 'inferior', v: 'promo' }, ['promo'], ['numero']);
    add('Tercio inferior', 'Llámenos', { k: 'inferior', v: 'llamenos' }, ['llamenos'], ['numero']);
    if (p.redes) add('Tercio inferior', 'Redes · ' + p.redes.usuario, { k: 'inferior', v: 'redes' }, ['redes']);
    (p.menciones || []).forEach(function (x, i) { add('Menciones', x.marca, { k: 'inferior', v: 'men:' + i }, ['menciones', i]); });
    (p.datos || []).forEach(function (x, i) { add('Tarjeta lateral', 'Dato · ' + x.titulo, { k: 'lateral', v: 'dato:' + i }, ['datos', i]); });
    add('Tarjeta lateral', 'Medidor EMF', { k: 'lateral', v: 'emf' }, ['emf']);
    add('Pantalla', 'Triplex alien', { k: 'multiplex', v: 'triplex' }, ['multiplex', 'triplex']);
    add('Pantalla', 'Duplex fantasmas', { k: 'multiplex', v: 'duplex' }, ['multiplex', 'duplex']);
    add('Pantalla', 'Ubicación', { k: 'ubicacion', v: true }, ['ubicacion']);
    add('Pantalla', 'Visor nocturno', { k: 'visor', v: true }, ['visor']);
    add('Pantalla', 'Logo / marca del programa', { k: 'marca', v: true }, null);
    add('Pantalla', 'EN VIVO', { k: 'vivo', v: true }, null, ['vivoTexto']);
    add('Pantalla', 'Ticker', { k: 'ticker', v: true }, null, ['ticker']);
    add('Pantalla', 'Créditos finales', { k: 'creditos', v: true }, ['creditos']);
    (window.EOYF_DATOS ? EOYF_DATOS.EFECTOS : []).forEach(function (e) { add(e[1] === 'cortina' ? 'Cortinas' : 'Transiciones', e[2], { k: 'cortina', v: e[0] }, ['efectos', e[0]]); });
    return L;
  }
  var ETQ = { nombre: 'Nombre', cargo: 'Cargo', titulo: 'Título', sub: 'Bajada', etiqueta: 'Etiqueta', tema: 'Tema', lugar: 'Lugar', texto: 'Texto', usuario: 'Usuario',
    marca: 'Marca', color: 'Color', badge: 'Descuento', nivel: 'Nivel (1 a 5)', modo: 'Texto del visor', dur: 'Duración (s)', cierre: 'Frase final', tituloLogos: 'Título de los logos',
    logos: 'Mostrar logos de auspiciadores', etiquetas: 'Etiquetas (una por línea)', numero: 'Número de teléfono', vivoTexto: 'Texto EN VIVO', ticker: 'Texto del ticker (separa las noticias con ·)',
    entrada: 'Efecto de entrada', salida: 'Efecto de salida' };
  var SALTAR = { logo: 1, id: 1 };

  /* ---------- estilos del módulo ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '#mDescargar .caja{width:min(1120px,100%)}',
    '.dx-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:18px;margin-top:10px}',
    '.dx-lab{display:block;font-size:12px;color:var(--tenue);font-weight:700;margin:10px 0 6px;text-transform:uppercase;letter-spacing:.06em}',
    '.dx-vista{position:relative;aspect-ratio:16/9;background:#00FF00;border-radius:12px;overflow:hidden;border:1px solid var(--borde);margin-top:10px}',
    '.dx-vista iframe{position:absolute;left:0;top:0;width:1920px;height:1080px;border:0;transform-origin:0 0;pointer-events:none}',
    '.dx-vista .dx-carga{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.35);color:#fff;font-weight:700}',
    '.dx-barra{position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(0,0,0,.3)}.dx-barra i{display:block;height:100%;width:0;background:var(--violeta)}',
    '.dx-fila{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px}.dx-info{font-size:13px;color:var(--tenue)}',
    '.dx-dos{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.dx-dur{display:flex;gap:8px;align-items:center}.dx-dur input[type=range]{flex:1;accent-color:var(--violeta)}.dx-dur input[type=number]{width:90px}',
    '.dx-der{max-height:min(66vh,680px);overflow:auto;padding-right:4px}',
    '.dx-der textarea{min-height:90px;resize:vertical}',
    '.dx-prog{display:flex;align-items:center;gap:12px;margin-top:14px}.dx-pbar{flex:1;height:10px;border-radius:6px;background:var(--panel2);overflow:hidden}.dx-pbar i{display:block;height:100%;width:0;background:var(--violeta);transition:width .15s}',
    '.dx-ptxt{font-size:13px;color:var(--tenue)}',
    '.dx-listo{display:flex;gap:14px;align-items:center;margin-top:14px;padding:10px;border-radius:12px;background:var(--panel2);border:1px solid var(--borde)}.dx-listo video{width:240px;aspect-ratio:16/9;border-radius:8px;background:#000}.dx-listo p{margin:0;font-size:14px;line-height:1.5}.dx-listo a{color:var(--violeta);font-weight:700}',
    '.dx-pie{display:flex;gap:8px;align-items:center;margin-top:16px}.dx-nota{color:#ffcf4d;font-size:13px;flex:1}',
    '.dx-seg button{padding:10px 6px;font-size:13px}',
    '@media(max-width:820px){.dx-grid{grid-template-columns:1fr}.dx-der{max-height:none}.dx-listo{flex-direction:column;align-items:stretch}.dx-listo video{width:100%}}'
  ].join('\n');
  document.head.appendChild(css);

  var EF_ANIM = [['ambas', 'Entrada y salida'], ['entrada', 'Solo entrada'], ['salida', 'Solo salida'], ['nada', 'Sin animación']];
  var modal = null;
  function crearModal() {
    if (modal) return modal;
    modal = document.createElement('div'); modal.className = 'modal'; modal.id = 'mDescargar';
    modal.innerHTML = '<div class="caja">' +
      '<h3>⬇️ DESCARGAR GRÁFICA EN MP4</h3>' +
      '<p class="nota">Video 1920×1080 con fondo de chroma para ponerlo arriba de cualquier video (DaVinci, Premiere, CapCut, ATEM…). Lo que cambies aquí <b>no</b> cambia la gráfica del programa.</p>' +
      '<div class="dx-grid"><div>' +
        '<label class="dx-lab" for="dxSel">Gráfica</label><select id="dxSel"></select>' +
        '<div class="dx-vista" id="dxVista"><iframe id="dxIf" title="Vista de la gráfica" tabindex="-1"></iframe><div class="dx-carga" id="dxCarga">Cargando…</div><div class="dx-barra"><i id="dxBarra"></i></div></div>' +
        '<div class="dx-fila"><button class="mini" type="button" id="dxVer">▶ Ver animación</button><span class="dx-info" id="dxInfo"></span></div>' +
        '<div id="dxOpAnim"><span class="dx-lab">Animación</span><div class="seg dx-seg" id="dxAnim">' + EF_ANIM.map(function (a) { return '<button type="button" data-v="' + a[0] + '">' + a[1] + '</button>'; }).join('') + '</div></div>' +
        '<div class="dx-dos"><div><span class="dx-lab">Duración del video</span><div class="dx-dur"><input type="range" id="dxDurR" min="1" max="60" step="0.5"><input type="number" id="dxDur" min="1" max="600" step="0.5"><span>s</span></div></div>' +
        '<div><span class="dx-lab">Cuadros por segundo</span><div class="seg dx-seg" id="dxFps"><button type="button" data-v="30">30</button><button type="button" data-v="60">60</button></div></div></div>' +
        '<span class="dx-lab">Fondo</span><div class="seg dx-seg" id="dxFondo"><button type="button" data-v="verde">🟩 Verde</button><button type="button" data-v="azul">🟦 Azul</button></div>' +
        '<label class="dx-lab" for="dxNom">Nombre del archivo</label><input type="text" id="dxNom" autocomplete="off">' +
      '</div><div class="dx-der"><span class="dx-lab">Textos y opciones</span><div id="dxCampos"></div></div></div>' +
      '<div class="dx-prog" id="dxProg" hidden><div class="dx-pbar"><i id="dxPbar"></i></div><span class="dx-ptxt" id="dxPtxt">Preparando…</span></div>' +
      '<div class="dx-listo" id="dxListo" hidden><video id="dxVid" controls playsinline muted></video><p id="dxLtxt"></p></div>' +
      '<div class="dx-pie"><span class="dx-nota" id="dxNota"></span><button class="mini" type="button" id="dxNo">Cerrar</button><button class="mini prim" type="button" id="dxOk">⬇️ Exportar MP4</button></div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target === modal && !cur.trabajando) cerrar(); });
    return modal;
  }

  var cur = { trabajando: false };
  function cerrar() {
    if (!modal) return;
    try { var x = X(); if (x) { x.cancelar(); x.detener(); } } catch (e) {}
    modal.classList.remove('on'); $('#dxIf').src = 'about:blank';
    if (cur.url) { URL.revokeObjectURL(cur.url); cur.url = null; }
  }
  function X() { try { return $('#dxIf').contentWindow.TE_EXPORT; } catch (e) { return null; } }
  /* cada vista previa o exportación parte con la salida recién cargada (estado limpio) */
  function recargar() {
    var ifr = $('#dxIf');
    return new Promise(function (ok) {
      ifr.onload = function () { (function mira() { if (X()) ok(X()); else setTimeout(mira, 40); })(); };
      ifr.src = 'salida.html?exportar=1&v=344&r=' + Date.now();
    });
  }
  function escala() { var v = $('#dxVista'); $('#dxIf').style.transform = 'scale(' + (v.clientWidth / 1920) + ')'; }

  function objDe(W, ruta) { if (!ruta) return null; var o = W.eoyf; ruta.forEach(function (k) { o = o && o[k]; }); return o; }
  function campos(W, it) {
    var cont = $('#dxCampos'); cont.innerHTML = '';
    var o = objDe(W, it.ruta), cfg = W.eoyf.config;
    function campo(obj, k, cambio) {
      var v = obj[k], w = document.createElement('div'); w.className = 'campo';
      var lab = '<label>' + esc(ETQ[k] || k) + '</label>';
      if (k === 'tema') { w.innerHTML = lab + '<select><option value="ovni">👽 OVNI (verde)</option><option value="fantasma">👻 Fantasma (naranjo)</option><option value="neutro">🎬 Neutro (rojo)</option></select>'; }
      else if (k === 'entrada' || k === 'salida') { w.innerHTML = lab + '<select><option value="">Según el tema</option><option value="ovni">🛸 Ovni</option><option value="fantasma">👻 Fantasma</option></select>'; }
      else if (k === 'dur' && it.item.k === 'cortina') { w.innerHTML = lab + '<select><option>2</option><option>3</option><option>4</option><option>5</option></select>'; }
      else if (k === 'color') { w.innerHTML = lab + '<input type="color" style="height:44px;width:100%;background:none;border:0">'; }
      else if (typeof v === 'boolean') { w.innerHTML = '<label class="switch"><span>' + esc(ETQ[k] || k) + '</span><input type="checkbox"></label>'; }
      else if (typeof v === 'number') { w.innerHTML = lab + '<input type="number" step="any">'; }
      else if (Array.isArray(v) || k === 'texto' || k === 'ticker' || String(v || '').length > 70) { w.innerHTML = lab + '<textarea spellcheck="true"></textarea>'; }
      else { w.innerHTML = lab + '<input type="text" spellcheck="true" autocomplete="off">'; }
      var inp = $('input,select,textarea', w);
      if (inp.type === 'checkbox') inp.checked = !!v;
      else inp.value = Array.isArray(v) ? v.join('\n') : (v == null ? '' : v);
      inp.addEventListener(inp.tagName === 'SELECT' || inp.type === 'checkbox' || inp.type === 'color' ? 'change' : 'input', function () {
        var nv = inp.type === 'checkbox' ? inp.checked : Array.isArray(v) ? inp.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : typeof v === 'number' || (k === 'dur') ? +inp.value || 0 : inp.value;
        obj[k] = nv; cambio();
      });
      cont.appendChild(w);
    }
    var cambio = function () { vistaDiferida(); };
    if (o) Object.keys(o).forEach(function (k) { if (!SALTAR[k] && o[k] !== null && typeof o[k] !== 'object' || Array.isArray(o[k])) campo(o, k, cambio); });
    it.extra.forEach(function (k) { campo(cfg, k, cambio); });
    if (!cont.children.length) cont.innerHTML = '<p class="nota">Esta gráfica no tiene textos para cambiar.</p>';
  }

  var tVista = 0;
  function vistaDiferida() { clearTimeout(tVista); tVista = setTimeout(vista, 650); }
  function opExp(extra) {
    return Object.assign({ estado: cur.W, item: cur.it.item, fps: cur.fps, duracion: cur.dur, fondo: cur.fondo, medida: cur.med,
      entrada: cur.anim === 'ambas' || cur.anim === 'entrada', salida: cur.anim === 'ambas' || cur.anim === 'salida' }, extra || {});
  }
  var nVista = 0;
  function vista() {
    if (cur.trabajando) return Promise.resolve();
    var n = ++nVista; $('#dxCarga').hidden = false;
    return recargar().then(function (x) { return x.medir(opExp()); }).then(function (m) {
      if (n !== nVista) return;
      cur.med = m; $('#dxCarga').hidden = true;
      if (m.evento && !cur.durTocada) { cur.dur = Math.max(1, Math.ceil((m.entrada + 400) / 500) / 2); pintarDur(); }
      if (cur.it.item.k === 'creditos' && !cur.durTocada) { var d = +((cur.W.eoyf.creditos || {}).dur) || 20; cur.dur = Math.max(cur.dur, d + 3); pintarDur(); }
      info();
    }, function (e) { $('#dxCarga').textContent = 'No se pudo dibujar: ' + (e && e.message || e); });
  }
  function info() {
    var m = cur.med; if (!m) return;
    $('#dxInfo').textContent = m.evento ? 'Animación completa: ' + (m.entrada / 1000).toFixed(1) + ' s' : 'Entrada ' + (m.entrada / 1000).toFixed(1) + ' s · Salida ' + (m.salida / 1000).toFixed(1) + ' s';
    var nota = '';
    if (!m.evento && cur.anim !== 'nada') {
      var need = (cur.anim !== 'salida' ? m.entrada : 0) + (cur.anim !== 'entrada' ? m.salida + 250 : 0);
      if (cur.dur * 1000 < need + 300) nota = '⚠ La duración es muy corta para la animación elegida.';
    }
    if (!nota && cur.fondo === 'verde' && /ovni/.test(JSON.stringify(objDe(cur.W, cur.it.ruta) || '')) ) nota = 'Ojo: las gráficas OVNI llevan verde; si el chroma se come partes, exporta con fondo azul.';
    $('#dxNota').textContent = nota;
  }
  function pintarSeg(id, v) { $$('#' + id + ' button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === String(v)); }); }
  function pintarDur() { $('#dxDur').value = cur.dur; $('#dxDurR').value = Math.min(60, cur.dur); info(); }
  function guardarPref() { guardar('eoyf_exportar', { anim: cur.anim, dur: cur.dur, fps: cur.fps, fondo: cur.fondo }); }

  function abrir() {
    var E0 = typeof E !== 'undefined' ? E : null; if (!E0 || !E0.eoyf) { toast('El panel todavía no carga el programa.'); return; }
    crearModal();
    var pref = leer('eoyf_exportar', {});
    cur = { trabajando: false, W: clon(E0), anim: pref.anim || 'ambas', dur: +pref.dur || 6, fps: +pref.fps || 30, fondo: pref.fondo || 'verde', med: null, url: null };
    var lista = catalogo(cur.W.eoyf), grupos = [];
    lista.forEach(function (x) { if (grupos.indexOf(x.g) < 0) grupos.push(x.g); });
    $('#dxSel').innerHTML = grupos.map(function (g) { return '<optgroup label="' + esc(g) + '">' + lista.map(function (x, i) { return x.g === g ? '<option value="' + i + '">' + esc(x.n) + '</option>' : ''; }).join('') + '</optgroup>'; }).join('');
    function elegir(i) {
      cur.it = lista[+i]; cur.med = null; cur.durTocada = false; $('#dxSel').value = String(i);
      $('#dxNom').value = nombreArchivo(cur.it.n) + '_' + cur.fondo;
      $('#dxOpAnim').hidden = cur.it.item.k === 'cortina';
      $('#dxListo').hidden = true; $('#dxInfo').textContent = '';
      campos(cur.W, cur.it); vista();
    }
    $('#dxSel').onchange = function () { elegir(this.value); };
    $$('#dxAnim button').forEach(function (b) { b.onclick = function () { cur.anim = b.dataset.v; pintarSeg('dxAnim', cur.anim); guardarPref(); info(); }; });
    $$('#dxFps button').forEach(function (b) { b.onclick = function () { cur.fps = +b.dataset.v; pintarSeg('dxFps', cur.fps); guardarPref(); }; });
    $$('#dxFondo button').forEach(function (b) { b.onclick = function () {
      var ant = cur.fondo; cur.fondo = b.dataset.v; pintarSeg('dxFondo', cur.fondo); guardarPref();
      $('#dxVista').style.background = cur.fondo === 'azul' ? '#0000FF' : '#00FF00';
      $('#dxNom').value = $('#dxNom').value.replace(new RegExp('_' + ant + '$'), '_' + cur.fondo); vista();
    }; });
    $('#dxDurR').oninput = function () { cur.dur = +this.value; cur.durTocada = true; $('#dxDur').value = cur.dur; guardarPref(); info(); };
    $('#dxDur').onchange = function () { cur.dur = Math.min(600, Math.max(1, +String(this.value).replace(',', '.') || 1)); cur.durTocada = true; pintarDur(); guardarPref(); };
    pintarSeg('dxAnim', cur.anim); pintarSeg('dxFps', cur.fps); pintarSeg('dxFondo', cur.fondo); pintarDur();
    $('#dxVista').style.background = cur.fondo === 'azul' ? '#0000FF' : '#00FF00';
    $('#dxVer').onclick = function () {
      if (cur.trabajando) return;
      var bt = this; bt.disabled = true; bt.textContent = '▶ Reproduciendo…'; $('#dxCarga').hidden = false;
      recargar().then(function (x) {
        $('#dxCarga').hidden = true;
        return x.previsualizar(opExp({
          alAvanzar: function (a) { $('#dxBarra').style.width = (a * 100) + '%'; },
          alTerminar: function () { bt.disabled = false; bt.textContent = '▶ Ver animación'; vista(); }
        }));
      }).catch(function () { bt.disabled = false; bt.textContent = '▶ Ver animación'; });
    };
    $('#dxNo').onclick = function () { if (cur.trabajando) { var x = X(); if (x) x.cancelar(); return; } cerrar(); };
    $('#dxOk').onclick = exportar;
    modal.classList.add('on'); escala();
    if (!cur.ro && window.ResizeObserver) { cur.ro = new ResizeObserver(escala); cur.ro.observe($('#dxVista')); }
    elegir(0);
  }

  function exportar() {
    if (cur.trabajando) return;
    var nom = nombreArchivo($('#dxNom').value) || 'grafica', t0 = Date.now();
    cur.trabajando = true; $('#dxOk').disabled = true; $('#dxNo').textContent = 'Cancelar'; $('#dxListo').hidden = true; $('#dxProg').hidden = false;
    $('#dxPbar').style.width = '0%'; $('#dxPtxt').textContent = 'Preparando…';
    (cur.med ? Promise.resolve() : vista()).then(recargar).then(function (x) {
      return x.exportar(opExp(), function (pr) {
        $('#dxPbar').style.width = (pr.avance * 100).toFixed(1) + '%';
        $('#dxPtxt').textContent = 'Creando video… ' + Math.round(pr.avance * 100) + '% · cuadro ' + pr.cuadro + ' de ' + pr.total + (pr.quedan != null ? ' · faltan ~' + Math.max(1, Math.round(pr.quedan)) + ' s' : '');
      });
    }).then(function (r) {
      if (cur.url) URL.revokeObjectURL(cur.url);
      cur.url = URL.createObjectURL(r.blob);
      var a = document.createElement('a'); a.href = cur.url; a.download = nom + '.mp4'; document.body.appendChild(a); a.click(); a.remove();
      $('#dxVid').src = cur.url; $('#dxListo').hidden = false;
      $('#dxLtxt').innerHTML = '✅ <b>' + esc(nom) + '.mp4</b> descargado · ' + (r.cuadros / r.fps).toFixed(1) + ' s · ' + r.fps + ' cuadros/s · ' + (r.blob.size / 1048576).toFixed(1) + ' MB · listo en ' + Math.round((Date.now() - t0) / 1000) + ' s' +
        (r.h264 ? '' : '<br>⚠ Tu navegador no tiene H.264: el MP4 va en VP9 (algunos editores no lo abren). Para H.264 usa Chrome o Edge.') +
        ' · <a href="' + cur.url + '" download="' + esc(nom) + '.mp4">Descargar de nuevo</a>';
      toast('Video listo: ' + nom + '.mp4');
    }).catch(function (e) {
      var msg = e && e.message === 'cancelado' ? 'Exportación cancelada.' : 'No se pudo crear el video: ' + ((e && e.message) || e);
      $('#dxPtxt').textContent = msg; toast(msg);
    }).then(function () {
      cur.trabajando = false; $('#dxOk').disabled = false; $('#dxNo').textContent = 'Cerrar';
      setTimeout(function () { if (!cur.trabajando) $('#dxProg').hidden = true; }, 2500);
      vista();
    });
  }

  window.EOYF_DESCARGAR = { abrir: abrir, cerrar: cerrar, catalogo: catalogo };
})();
