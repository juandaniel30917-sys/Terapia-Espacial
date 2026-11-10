/* ENTRE OVNIS Y FANTASMAS — EXPORTADOR de gráficas a MP4 con fondo verde (o azul).
   Solo funciona con salida.html?exportar=1 (lo abre el panel, módulo ⬇️ Descargar, dentro de un iframe de 1920×1080).
   Usa el mismo motor de la salida con el reloj virtual (exportar-reloj.js): cada cuadro queda exacto aunque el computador
   sea lento. Fotografía cada cuadro con html-to-image y lo codifica a H.264 con WebCodecs + mp4-muxer (carpeta vendor/). */
(function () {
  'use strict';
  if (!/[?&]exportar=1(&|$)/.test(location.search)) return;
  var R = window.RELOJ, COLOR = { verde: '#00FF00', azul: '#0000FF' };
  var libs = null, fontCSS = null, nEv = 0;

  function cargar(src) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { no(new Error('No se pudo cargar ' + src)); }; document.head.appendChild(s); }); }
  function librerias() { return libs || (libs = Promise.all([cargar('vendor/html-to-image.js?v=1.11.13'), cargar('vendor/mp4-muxer.js?v=5.2.2')])); }
  function tick() { return new Promise(function (r) { Promise.resolve().then(r); }); }
  function clon(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- estado con UNA sola gráfica (o ninguna) ---------- */
  function encender(a, item, p) {
    var k = item.k, v = item.v;
    if (k === 'inferior' || k === 'lateral' || k === 'multiplex') a[k] = v;
    else if (k === 'cortina') a.cortina = { id: 'exp' + (++nEv), variante: v, dur: (p.efectos[v] && +p.efectos[v].dur) || 2 };
    else if (k === 'creditos') a.creditos = { id: 'cred' + (++nEv) };
    else a[k] = true;
  }
  function estado(op, on) {
    var e = TE.normalizar(clon(op.estado));
    e.programa = 'eoyf';
    e.aire = clon(TE.ESTADO_BASE.aire);                 // nada del programa anterior
    var p = e.eoyf = EOYF_DATOS.normalizar(e.eoyf);
    p.config.fondo = op.fondo === 'azul' ? 'azul' : 'verde';
    p.aire = clon(EOYF_DATOS.BASE.aire);
    if (on) encender(p.aire, op.item, p);
    return e;
  }
  /* ¿hay algo entrando, saliendo o animándose (con fin)? */
  function ocupado() {
    var si = false;
    try {
      document.getAnimations().forEach(function (a) {
        var t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
        if (t && isFinite(t.endTime) && t.endTime > 0 && t.localTime !== null && t.localTime < t.endTime) si = true;
      });
    } catch (e) {}
    Abduccion.vivos.forEach(function (p) { if (p.fase === 'entrada' || p.fase === 'salida') si = true; });
    return si;
  }
  async function avanzarHasta(cond, minMs, maxMs, dt) {
    var t = 0;
    while (t < maxMs) { R.avanzar(dt); t += dt; await tick(); if (t >= minMs && cond()) break; }
    return t;
  }
  function cortinaVacia() { return !document.querySelector('#cCortina').children.length; }
  async function base(op) {
    await librerias();
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    aplicar(estado(op, false)); primeraVez = false; R.avanzar(0); await tick();
    aplicar(estado(op, false)); R.avanzar(0); await tick();
  }
  function esEvento(op) { return op.item.k === 'cortina'; }

  /* mide la entrada y la salida, y deja la gráfica quieta en pantalla (vista previa) */
  async function medir(op) {
    await base(op);
    var dt = 1000 / 30, r = { evento: esEvento(op) };
    aplicar(estado(op, true)); R.avanzar(0); await tick();
    if (r.evento) {
      r.entrada = await avanzarHasta(function () { return cortinaVacia(); }, 300, 12000, dt); r.salida = 0;
      aplicar(estado(op, false)); await tick();
      aplicar(estado(op, true)); R.avanzar(0); await tick();
      await avanzarHasta(function () { return false; }, 0, r.entrada * 0.45, dt);
      return r;
    }
    r.entrada = await avanzarHasta(function () { return !ocupado(); }, 200, op.item.k === 'creditos' ? 1500 : 4000, dt);
    await avanzarHasta(function () { return false; }, 0, 300, dt);
    aplicar(estado(op, false)); R.avanzar(0); await tick();
    r.salida = await avanzarHasta(function () { return !ocupado(); }, 200, 5000, dt);
    aplicar(estado(op, true)); R.avanzar(0); await tick();
    await avanzarHasta(function () { return !ocupado(); }, 200, op.item.k === 'creditos' ? 3000 : 4000, dt);
    return r;
  }

  function capturar(canvas, fondo) {
    var col = COLOR[fondo] || COLOR.verde;
    var o = { width: 1920, height: 1080, canvasWidth: 1920, canvasHeight: 1080, pixelRatio: 1, skipAutoScale: true, backgroundColor: col,
      /* en la copia fotografiada nada se anima: cada nodo lleva el estilo exacto de este cuadro */
      fontEmbedCSS: (fontCSS || '') + '\n*,*::before,*::after{animation:none!important;transition:none!important}' };
    return R.conRelojReal(function () { return htmlToImage.toCanvas(document.getElementById('escena'), o); }).then(function (c) {
      var g = canvas.getContext('2d'); g.fillStyle = col; g.fillRect(0, 0, 1920, 1080); g.drawImage(c, 0, 0, 1920, 1080); return canvas;
    });
  }
  function elegirCodec(fps) {
    if (!window.VideoEncoder) return Promise.resolve(null);
    var lista = [['avc', 'avc1.640028'], ['avc', 'avc1.4d0028'], ['avc', 'avc1.42e028'], ['vp9', 'vp09.00.40.08']], i = 0;
    function prueba() {
      if (i >= lista.length) return null;
      var c = lista[i++], conf = { codec: c[1], width: 1920, height: 1080, bitrate: 16e6, framerate: fps };
      if (c[0] === 'avc') conf.avc = { format: 'avc' };
      return VideoEncoder.isConfigSupported(conf).then(function (s) { return s && s.supported ? { tipo: c[0], conf: conf } : prueba(); }, prueba);
    }
    return prueba();
  }

  var cancelado = false;
  /* op: { estado, item:{k,v}, fps, duracion, entrada, salida, fondo, medida:{entrada,salida} } */
  async function exportar(op, progreso) {
    cancelado = false; progreso = progreso || function () {};
    var fps = op.fps || 30, dt = 1000 / fps, n = Math.round((op.duracion || 5) * fps), canvas = document.createElement('canvas');
    canvas.width = 1920; canvas.height = 1080;
    await librerias();
    var codec = await elegirCodec(fps);
    if (!codec) throw new Error('Este navegador no puede crear MP4. Usa Google Chrome o Microsoft Edge actualizados.');
    var mux = new Mp4Muxer.Muxer({ target: new Mp4Muxer.ArrayBufferTarget(), video: { codec: codec.tipo, width: 1920, height: 1080, frameRate: fps }, fastStart: 'in-memory' });
    var err = null, enc = new VideoEncoder({ output: function (ch, meta) { mux.addVideoChunk(ch, meta); }, error: function (e) { err = e; } });
    enc.configure(codec.conf);
    try {
      await base(op);
      fontCSS = await R.conRelojReal(function () { return htmlToImage.getFontEmbedCSS(document.getElementById('escena')); }).catch(function () { return ''; });
      var ev = esEvento(op), med = op.medida || {}, saleEn = -1;
      if (!ev && !op.entrada) {
        aplicar(estado(op, true)); R.avanzar(0); await tick();
        await avanzarHasta(function () { return !ocupado(); }, 200, op.item.k === 'creditos' ? 3000 : 4000, dt);
      }
      if (!ev && op.salida) saleEn = Math.max(1, n - Math.ceil(((med.salida || 2200) + 250) / dt));
      var t0 = R.real.now();
      for (var i = 0; i < n; i++) {
        if (err) throw err;
        if (cancelado) throw new Error('cancelado');
        if (i === 0 && (ev || op.entrada)) aplicar(estado(op, true));
        if (i === saleEn) aplicar(estado(op, false));
        R.avanzar(i ? dt : 0); await tick(); await R.esperarVideos();
        await capturar(canvas, op.fondo);
        var vf = new VideoFrame(canvas, { timestamp: Math.round(i * 1e6 / fps), duration: Math.round(1e6 / fps) });
        enc.encode(vf, { keyFrame: i % (fps * 2) === 0 }); vf.close();
        if (enc.encodeQueueSize > 6) await new Promise(function (r) { enc.addEventListener('dequeue', r, { once: true }); });
        var hecho = (i + 1) / n, seg = (R.real.now() - t0) / 1000;
        progreso({ cuadro: i + 1, total: n, avance: hecho, quedan: hecho > 0.02 ? seg / hecho - seg : null });
      }
      await enc.flush(); mux.finalize(); enc.close();
      return { blob: new Blob([mux.target.buffer], { type: 'video/mp4' }), codec: codec.conf.codec, h264: codec.tipo === 'avc', cuadros: n, fps: fps };
    } catch (e) { try { enc.close(); } catch (x) {} throw e; }
  }

  /* vista previa en tiempo real (el reloj virtual avanza con el reloj del panel) */
  var prev = null;
  async function previsualizar(op) {
    await base(op);
    var dt = 1000 / 30, n = Math.round((op.duracion || 5) * 30), ev = esEvento(op), med = op.medida || {}, saleEn = -1, i = 0, ult = R.real.now();
    if (!ev && !op.entrada) { aplicar(estado(op, true)); R.avanzar(0); await tick(); await avanzarHasta(function () { return !ocupado(); }, 200, 4000, dt); }
    if (!ev && op.salida) saleEn = Math.max(1, n - Math.ceil(((med.salida || 2200) + 250) / dt));
    var yo = prev = { vivo: true };
    (function paso() {
      if (!yo.vivo) return;
      var k = Math.min(4, Math.floor((R.real.now() - ult) / dt));
      for (var j = 0; j < k && i < n; j++, i++) {
        if (i === 0 && (ev || op.entrada)) aplicar(estado(op, true));
        if (i === saleEn) aplicar(estado(op, false));
        R.avanzar(i ? dt : 0); ult += dt;
      }
      if (op.alAvanzar) op.alAvanzar(i / n);
      if (i >= n) { yo.vivo = false; if (op.alTerminar) op.alTerminar(); return; }
      parent.requestAnimationFrame(paso);
    })();
  }

  window.TE_EXPORT = {
    medir: medir, exportar: exportar, previsualizar: previsualizar,
    detener: function () { if (prev) prev.vivo = false; },
    cancelar: function () { cancelado = true; }
  };
})();
