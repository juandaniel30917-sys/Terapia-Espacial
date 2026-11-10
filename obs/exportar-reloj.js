/* ENTRE OVNIS Y FANTASMAS — RELOJ VIRTUAL para exportar gráficas a MP4 (solo con salida.html?exportar=1).
   setTimeout / setInterval / requestAnimationFrame / performance.now / Date.now avanzan solo cuando el exportador
   lo pide, y las animaciones CSS / WAAPI se colocan en el tiempo exacto de cada cuadro. En OBS no hace nada. */
(function () {
  "use strict";
  if (!/[?&]exportar=1(&|$)/.test(location.search)) { return; }
  var T = 0, cola = [], nid = 1, rafs = [], base0 = Date.now(), pNow = performance.now.bind(performance), dNow = Date.now;
  var reales = {setTimeout: window.setTimeout, clearTimeout: window.clearTimeout, setInterval: window.setInterval, clearInterval: window.clearInterval, requestAnimationFrame: window.requestAnimationFrame, cancelAnimationFrame: window.cancelAnimationFrame};
  var virtuales = null;
  function agenda(fn, ms, args, cada) { var id = nid++; cola.push({id: id, t: T + Math.max(0, +ms || 0), fn: fn, args: args, cada: cada}); return id; }
  window.setTimeout = function (fn, ms) { return typeof fn === "function" ? agenda(fn, ms, [].slice.call(arguments, 2), 0) : 0; };
  window.setInterval = function (fn, ms) { return typeof fn === "function" ? agenda(fn, ms, [].slice.call(arguments, 2), Math.max(1, +ms || 1)) : 0; };
  window.clearTimeout = window.clearInterval = function (id) { cola = cola.filter(function (x) { return x.id !== id; }); };
  window.requestAnimationFrame = function (fn) { var id = nid++; rafs.push({id: id, fn: fn}); return id; };
  window.cancelAnimationFrame = function (id) { rafs = rafs.filter(function (x) { return x.id !== id; }); };
  performance.now = function () { return T; };
  Date.now = function () { return base0 + T; };
  var nacidas = new WeakMap();
  function fijarAnimaciones() {
    var as = []; try { as = document.getAnimations(); } catch (e) {}
    as.forEach(function (a) {
      if (!nacidas.has(a)) { nacidas.set(a, T); try { a.pause(); } catch (e) {} }
      try { a.currentTime = (T - nacidas.get(a)) * (a.playbackRate || 1); } catch (e) {}
    });
    /* videos (destellos de las cortinas): se pausan y se colocan en el cuadro exacto */
    [].forEach.call(document.getElementsByTagName("video"), function (v) {
      var r = vids.get(v);
      if (!r || r.padre !== v.parentNode) { r = {t0: T, padre: v.parentNode}; vids.set(v, r); }
      try { if (!v.paused) { v.pause(); } var q = (T - r.t0) / 1000; if (v.duration && q > v.duration) { q = v.duration; } if (Math.abs(v.currentTime - q) > 0.004) { v.currentTime = q; } } catch (e) {}
    });
  }
  var vids = new WeakMap();
  window.RELOJ = {
    ahora: function () { return T; },
    /* avanza dt milisegundos: corre los temporizadores en orden, un cuadro de rAF y fija las animaciones */
    avanzar: function (dt) {
      var meta = T + dt, guard = 0;
      fijarAnimaciones();
      while (guard++ < 5000) {
        var prox = null; cola.forEach(function (x) { if (x.t <= meta && (!prox || x.t < prox.t)) { prox = x; } });
        if (!prox) { break; }
        T = Math.max(T, prox.t);
        if (prox.cada) { prox.t = T + prox.cada; } else { cola = cola.filter(function (x) { return x !== prox; }); }
        try { prox.fn.apply(window, prox.args || []); } catch (e) { console.warn(e); }
        fijarAnimaciones();
      }
      T = meta;
      var r = rafs; rafs = []; r.forEach(function (x) { try { x.fn(T); } catch (e) { console.warn(e); } });
      fijarAnimaciones();
    },
    /* espera (con reloj real) a que los videos terminen de moverse al cuadro pedido */
    esperarVideos: function () {
      var pend = [].filter.call(document.getElementsByTagName("video"), function (v) { return v.seeking && v.isConnected; });
      if (!pend.length) { return Promise.resolve(); }
      return Promise.race([Promise.all(pend.map(function (v) { return new Promise(function (r) { v.addEventListener("seeked", r, {once: true}); }); })),
        new Promise(function (r) { reales.setTimeout.call(window, r, 400); })]);
    },
    reiniciar: function () { cola = []; rafs = []; T = 0; nacidas = new WeakMap(); },
    real: {now: pNow, date: dNow},
    /* la librería que fotografía los cuadros usa temporizadores: mientras trabaja, corren con el reloj real */
    conRelojReal: function (fn) {
      if (!virtuales) { virtuales = {}; Object.keys(reales).forEach(function (k) { virtuales[k] = window[k]; }); }
      Object.keys(reales).forEach(function (k) { window[k] = reales[k]; });
      var vuelve = function () { Object.keys(virtuales).forEach(function (k) { window[k] = virtuales[k]; }); };
      var pr; try { pr = Promise.resolve(fn()); } catch (e) { vuelve(); return Promise.reject(e); }
      return pr.then(function (x) { vuelve(); return x; }, function (e) { vuelve(); throw e; });
    }
  };
})();
