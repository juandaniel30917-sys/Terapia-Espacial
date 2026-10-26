/* TERAPIA ESPACIAL — conexión panel ⇄ salida.
   Sistema tomado de Completos Mojados CG (mismo esquema de salas, permisos y Realtime):
   · SALA (remoto, por internet): Supabase. El link de control lleva el token (después del #); la salida
     recibe una clave derivada que solo permite LEER. Por Realtime solo viaja «hay versión nueva N»;
     la salida siempre lee el estado desde la base de datos. Si Realtime cae, consulta de respaldo.
   · SERVIDOR (red local): servidor.js en el computador de OBS (celular por WiFi, sin internet).
   · LOCAL (mismo navegador / dock de OBS): BroadcastChannel + localStorage. */
(function () {
  "use strict";
  var RT = window.TE_RT = {};
  var CFG = window.TE_CONFIG || {};
  var URL_SB = (CFG.SUPABASE_URL || "").replace(/\/$/, ""), KEY = CFG.SUPABASE_ANON_KEY || "";
  var yo = "t" + Math.random().toString(36).slice(2, 10);
  /* ---------------- utilidades ---------------- */
  function emisor() {
    var h = {};
    return {on: function (n, f) { (h[n] = h[n] || []).push(f); }, emit: function (n, a, b) { (h[n] || []).forEach(function (f) { try { f(a, b); } catch (e) { console.error(e); } }); }};
  }
  /* SHA-256 en hexadecimal (usa el del navegador; si no existe, uno propio) */
  RT.sha256 = function (txt) {
    var bytes = new TextEncoder().encode(txt);
    if (window.crypto && crypto.subtle) {
      return crypto.subtle.digest("SHA-256", bytes).then(function (b) { return hex(new Uint8Array(b)); });
    }
    return Promise.resolve(hex(sha256js(bytes)));
  };
  function hex(a) { var s = ""; for (var i = 0; i < a.length; i++) { s += (a[i] < 16 ? "0" : "") + a[i].toString(16); } return s; }
  function sha256js(m) {
    var K = [], H = [1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225], i, j, n = 2, c = 0;
    while (c < 64) { var p = true; for (j = 2; j * j <= n; j++) { if (n % j === 0) { p = false; break; } } if (p) { K[c++] = (Math.pow(n, 1 / 3) % 1) * 4294967296 | 0; } n++; }
    var l = m.length, w = new Uint8Array(((l + 9 + 63) >> 6) << 6); w.set(m); w[l] = 128; var bits = l * 8, dv = new DataView(w.buffer);
    dv.setUint32(w.length - 4, bits >>> 0); dv.setUint32(w.length - 8, Math.floor(bits / 4294967296));
    var W = new Int32Array(64);
    for (i = 0; i < w.length; i += 64) {
      for (j = 0; j < 16; j++) { W[j] = dv.getInt32(i + j * 4); }
      for (j = 16; j < 64; j++) {
        var a = W[j - 15], b = W[j - 2];
        W[j] = (((a >>> 7 | a << 25) ^ (a >>> 18 | a << 14) ^ (a >>> 3)) + W[j - 7] + ((b >>> 17 | b << 15) ^ (b >>> 19 | b << 13) ^ (b >>> 10)) + W[j - 16]) | 0;
      }
      var A = H[0], B = H[1], C = H[2], D = H[3], E = H[4], F = H[5], G = H[6], Hh = H[7];
      for (j = 0; j < 64; j++) {
        var t1 = (Hh + ((E >>> 6 | E << 26) ^ (E >>> 11 | E << 21) ^ (E >>> 25 | E << 7)) + ((E & F) ^ (~E & G)) + K[j] + W[j]) | 0;
        var t2 = (((A >>> 2 | A << 30) ^ (A >>> 13 | A << 19) ^ (A >>> 22 | A << 10)) + ((A & B) ^ (A & C) ^ (B & C))) | 0;
        Hh = G; G = F; F = E; E = (D + t1) | 0; D = C; C = B; B = A; A = (t1 + t2) | 0;
      }
      H[0] = (H[0] + A) | 0; H[1] = (H[1] + B) | 0; H[2] = (H[2] + C) | 0; H[3] = (H[3] + D) | 0; H[4] = (H[4] + E) | 0; H[5] = (H[5] + F) | 0; H[6] = (H[6] + G) | 0; H[7] = (H[7] + Hh) | 0;
    }
    var out = new Uint8Array(32), o = new DataView(out.buffer); for (i = 0; i < 8; i++) { o.setInt32(i * 4, H[i]); } return out;
  }
  RT.claveSalida = function (token) { return RT.sha256("out:" + token); };
  function nombreCanal(outKey) { return RT.sha256("ch:" + outKey).then(function (h) { return "cg-" + h.slice(0, 32); }); }

  /* errores en español, entendibles */
  function traducir(e, status) {
    var m = String((e && (e.message || e.msg || e.error || e.hint)) || e || "");
    if (/acceso_denegado|28000/.test(m)) { return "El link no es válido o fue cambiado. Pide un link nuevo al encargado de la sala."; }
    if (/estado_muy_grande/.test(m)) { return "La sala tiene demasiado contenido (imágenes muy pesadas). Usa imágenes más livianas."; }
    if (/Failed to fetch|NetworkError|Load failed|network/i.test(m) || status === 0) { return "Sin conexión a internet o el servidor no responde."; }
    if (status === 429) { return "Demasiadas solicitudes seguidas. Espera unos segundos."; }
    return m || "Error desconocido";
  }
  RT.traducirError = traducir;

  /* ---------------- llamadas a la base de datos ---------------- */
  RT.rpc = function (fn, args) {
    if (!URL_SB || !KEY) { return Promise.reject(new Error("Falta configurar SUPABASE_URL y SUPABASE_ANON_KEY en js/config.js")); }
    var ctl = window.AbortController ? new AbortController() : null, t = ctl ? setTimeout(function () { ctl.abort(); }, 12000) : 0;
    return fetch(URL_SB + "/rest/v1/rpc/" + fn, {method: "POST", headers: {"apikey": KEY, "Authorization": "Bearer " + KEY, "Content-Type": "application/json"}, body: JSON.stringify(args || {}), signal: ctl && ctl.signal, cache: "no-store"})
      .then(function (r) {
        clearTimeout(t);
        return r.text().then(function (txt) {
          var j = null; try { j = txt ? JSON.parse(txt) : null; } catch (e) { j = txt; }
          if (!r.ok) { var er = new Error(traducir(j, r.status)); er.status = r.status; er.codigo = j && j.code; throw er; }
          return j;
        });
      }, function (e) { clearTimeout(t); var er = new Error(traducir(e, 0)); er.status = 0; throw er; });
  };

  /* ---------------- cliente Realtime (protocolo Phoenix, sin librerías) ---------------- */
  function Realtime(canal, opciones) {
    var ev = emisor(), ws = null, ref = 0, joinRef = null, unido = false, hb = 0, hbPend = null, intento = 0, reintento = 0, cerrado = false, presencia = opciones.presencia || {};
    var topic = "realtime:" + canal, estados = {};
    function enviar(o) { if (ws && ws.readyState === 1) { ws.send(JSON.stringify(o)); return true; } return false; }
    function abrir() {
      if (cerrado) { return; }
      clearTimeout(reintento);
      ev.emit("estado", intento ? "reconectando" : "conectando");
      try { ws = new WebSocket(URL_SB.replace(/^http/, "ws") + "/realtime/v1/websocket?apikey=" + encodeURIComponent(KEY) + "&vsn=1.0.0"); }
      catch (e) { programar(); return; }
      ws.onopen = function () {
        ref++; joinRef = String(ref);
        enviar({topic: topic, event: "phx_join", ref: joinRef, join_ref: joinRef, payload: {config: {broadcast: {self: false, ack: false}, presence: {key: yo, enabled: true}, postgres_changes: [], private: false}, access_token: KEY}});
        clearInterval(hb);
        hb = setInterval(function () {
          if (hbPend) { try { ws.close(); } catch (e) {} return; } /* sin respuesta al latido anterior: conexión muerta */
          ref++; hbPend = String(ref); enviar({topic: "phoenix", event: "heartbeat", payload: {}, ref: hbPend});
        }, 20000);
      };
      ws.onmessage = function (m) {
        var d; try { d = JSON.parse(m.data); } catch (e) { return; }
        if (d.topic === "phoenix" && d.event === "phx_reply") { if (d.ref === hbPend) { hbPend = null; } return; }
        if (d.topic !== topic) { return; }
        if (d.event === "phx_reply" && d.ref === joinRef) {
          if (d.payload && d.payload.status === "ok") {
            unido = true; intento = 0; ev.emit("estado", "conectado");
            ref++; enviar({topic: topic, event: "presence", ref: String(ref), join_ref: joinRef, payload: {type: "presence", event: "track", payload: presencia}});
          } else { console.warn("[realtime] no se pudo unir", d.payload); try { ws.close(); } catch (e) {} }
          return;
        }
        if (d.event === "broadcast" && d.payload) { ev.emit("mensaje", d.payload.event, d.payload.payload || {}); return; }
        if (d.event === "presence_state") { estados = {}; Object.keys(d.payload || {}).forEach(function (k) { estados[k] = d.payload[k].metas || []; }); ev.emit("presencia", lista()); return; }
        if (d.event === "presence_diff") {
          var p = d.payload || {};
          Object.keys(p.leaves || {}).forEach(function (k) { delete estados[k]; });
          Object.keys(p.joins || {}).forEach(function (k) { estados[k] = p.joins[k].metas || []; });
          ev.emit("presencia", lista()); return;
        }
        if (d.event === "phx_error" || d.event === "phx_close") { try { ws.close(); } catch (e) {} }
      };
      ws.onclose = function () { unido = false; clearInterval(hb); hbPend = null; if (!cerrado) { ev.emit("estado", "reconectando"); programar(); } };
      ws.onerror = function () {};
    }
    function programar() { intento++; var ms = Math.min(15000, 500 * Math.pow(2, Math.min(intento, 5))) + Math.random() * 400; clearTimeout(reintento); reintento = setTimeout(abrir, ms); }
    function lista() { var r = []; Object.keys(estados).forEach(function (k) { (estados[k] || []).forEach(function (m) { r.push(Object.assign({key: k}, m)); }); }); return r; }
    /* si el equipo vuelve a tener red o la pestaña vuelve a estar visible, reconecta al tiro */
    function despertar() { if (!cerrado && (!ws || ws.readyState > 1)) { intento = 0; abrir(); } }
    addEventListener("online", despertar);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) { despertar(); } });
    abrir();
    return {
      on: ev.on,
      enviar: function (evento, datos) { if (!unido) { return false; } ref++; return enviar({topic: topic, event: "broadcast", ref: String(ref), join_ref: joinRef, payload: {type: "broadcast", event: evento, payload: datos}}); },
      conectado: function () { return unido; },
      cerrar: function () { cerrado = true; clearInterval(hb); clearTimeout(reintento); try { ws.close(); } catch (e) {} },
      forzarReconexion: function () { try { ws.close(); } catch (e) {} }
    };
  }
  RT.Realtime = Realtime;

  function nombreCanal(outKey) { return RT.sha256("ch:" + outKey).then(function (h) { return "cg-" + h.slice(0, 32); }); }
  RT.claveSalida = function (token) { return RT.sha256("out:" + token); };

  /* ---------------- llamadas a la base de datos ---------------- */
  RT.rpc = function (fn, args) {
    if (!URL_SB || !KEY) { return Promise.reject(new Error("Falta configurar Supabase en config.js")); }
    var ctl = window.AbortController ? new AbortController() : null, t = ctl ? setTimeout(function () { ctl.abort(); }, 12000) : 0;
    return fetch(URL_SB + "/rest/v1/rpc/" + fn, {method: "POST", headers: {"apikey": KEY, "Authorization": "Bearer " + KEY, "Content-Type": "application/json"}, body: JSON.stringify(args || {}), signal: ctl && ctl.signal, cache: "no-store"})
      .then(function (r) {
        clearTimeout(t);
        return r.text().then(function (txt) {
          var j = null; try { j = txt ? JSON.parse(txt) : null; } catch (e) { j = txt; }
          if (!r.ok) { var er = new Error(traducir(j, r.status)); er.status = r.status; throw er; }
          return j;
        });
      }, function (e) { clearTimeout(t); var er = new Error(traducir(e, 0)); er.status = 0; throw er; });
  };
  function traducir(e, status) {
    var m = String((e && (e.message || e.msg || e.error || e.hint)) || e || "");
    if (/acceso_denegado|28000/.test(m)) { return "El link no es válido o fue cambiado. Pide el link nuevo."; }
    if (/estado_muy_grande/.test(m)) { return "La sala tiene demasiado contenido (¿logo muy pesado?)."; }
    if (/Failed to fetch|NetworkError|Load failed|network|abort/i.test(m) || status === 0) { return "Sin conexión a internet o el servidor no responde."; }
    return m || "Error desconocido";
  }
  RT.traducir = traducir;

  /* parámetros: ?sala=abc&k=clave  o  ?sala=abc#t=token */
  RT.params = function () {
    var o = {}, q = new URLSearchParams(location.search), h = new URLSearchParams(location.hash.replace(/^#/, ""));
    q.forEach(function (v, k) { o[k] = v; }); h.forEach(function (v, k) { o[k] = v; }); return o;
  };
  RT.yo = yo;

  /* ======================= CONTROL (panel / botonera) ======================= */
  function SalaControl(sala, token) {
    var ev = emisor(), rt = null, rev = 0, outKey = null, guardando = false, pendiente = null, falla = 0, tReint = 0;
    function guardar() {
      if (guardando || !pendiente) { return; }
      guardando = true; var est = pendiente; pendiente = null; ev.emit("guardado", "guardando");
      RT.rpc("cg_guardar", {p_sala: sala, p_token: token, p_estado: est}).then(function (r) {
        guardando = false; falla = 0; rev = +r || rev + 1;
        if (rt) { rt.enviar("rev", {rev: rev, de: yo}); }
        ev.emit("guardado", pendiente ? "guardando" : "ok"); guardar();
      }, function (e) {
        guardando = false; if (!pendiente) { pendiente = est; }
        falla++; ev.emit("guardado", "error", e.message);
        if (e.status === 401 || e.status === 403) { ev.emit("acceso", e.message); return; }
        clearTimeout(tReint); tReint = setTimeout(guardar, Math.min(10000, 800 * falla));
      });
    }
    function releer() {
      return RT.rpc("cg_leer", {p_sala: sala, p_clave: token}).then(function (r) {
        if (r.rev > rev && !pendiente && !guardando) { rev = r.rev; ev.emit("remoto", r.estado || {}); }
      });
    }
    return {
      on: ev.on, modo: "sala", sala: sala,
      conectar: function () {
        return RT.rpc("cg_leer", {p_sala: sala, p_clave: token}).then(function (r) {
          if (r.rol !== "control") { throw new Error("Este es el link de OBS (solo lectura). Para controlar usa el link de control."); }
          rev = r.rev;
          return RT.claveSalida(token).then(function (k) { outKey = k; return nombreCanal(k); }).then(function (canal) {
            rt = RT.Realtime(canal, {presencia: {rol: "control", id: yo, desde: Date.now()}});
            rt.on("estado", function (s) { ev.emit("red", s === "conectado" ? "conectado" : "reconectando"); if (s === "conectado") { releer().catch(function () {}); if (pendiente) { guardar(); } } });
            rt.on("presencia", function (l) { ev.emit("presencia", {salidas: l.filter(function (p) { return p.rol === "salida"; }).length, controles: l.filter(function (p) { return p.rol === "control"; }).length}); });
            rt.on("mensaje", function (evento, d) {
              if (evento === "rev" && d.de !== yo && d.rev > rev) { releer().catch(function () {}); }
              if (evento === "hola") { rt.enviar("rev", {rev: rev, de: yo}); }
            });
            setInterval(function () {
              if (!rt.conectado() && !guardando && !pendiente) {
                RT.rpc("cg_rev", {p_sala: sala, p_clave: token}).then(function (v) { if (+v > rev) { releer(); } ev.emit("red", "respaldo"); }, function () { ev.emit("red", "sin-conexion"); });
              }
            }, 4000);
            return {nombre: r.nombre, estado: r.estado, rev: r.rev};
          });
        });
      },
      publicar: function (estado) { pendiente = JSON.parse(JSON.stringify(estado)); guardar(); },
      links: function () {
        var base = location.href.replace(/[?#].*$/, "").replace(/[^/]*$/, "");
        return {control: base + "panel.html?sala=" + sala + "#t=" + token, salida: base + "salida.html?sala=" + sala + "&k=" + outKey};
      },
      regenerar: function () { return RT.rpc("cg_regenerar", {p_sala: sala, p_token: token}); }
    };
  }

  function SalaSalida(sala, clave) {
    var ev = emisor(), rt = null, rev = -1, leyendo = false, otraVez = false;
    function leer() {
      if (leyendo) { otraVez = true; return; }
      leyendo = true;
      RT.rpc("cg_leer", {p_sala: sala, p_clave: clave}).then(function (r) {
        leyendo = false;
        if (r.rev !== rev) { rev = r.rev; ev.emit("estado", r.estado || {}); }
        ev.emit("red", rt && rt.conectado() ? "conectado" : "respaldo");
        if (otraVez) { otraVez = false; leer(); }
      }, function (e) { leyendo = false; ev.emit("red", "sin-conexion", e.message); if (otraVez) { otraVez = false; setTimeout(leer, 1500); } });
    }
    return {
      on: ev.on, modo: "sala",
      conectar: function () {
        return RT.rpc("cg_leer", {p_sala: sala, p_clave: clave}).then(function (r) {
          rev = r.rev; ev.emit("estado", r.estado || {});
          return (r.rol === "control" ? RT.claveSalida(clave) : Promise.resolve(clave)).then(nombreCanal).then(function (canal) {
            rt = RT.Realtime(canal, {presencia: {rol: RT.params().vista ? "vista" : "salida", id: yo, desde: Date.now()}});
            rt.on("estado", function (s) { if (s === "conectado") { ev.emit("red", "conectado"); leer(); rt.enviar("hola", {}); } else { ev.emit("red", "reconectando"); } });
            rt.on("mensaje", function (evento, d) { if (evento === "rev" && +d.rev !== rev) { leer(); } });
            var ult = 0;
            setInterval(function () {
              var ahora = Date.now(), cada = rt.conectado() ? 15000 : 2000;
              if (ahora - ult < cada) { return; } ult = ahora;
              RT.rpc("cg_rev", {p_sala: sala, p_clave: clave}).then(function (v) { if (+v !== rev) { leer(); } }, function () { ev.emit("red", "sin-conexion"); });
            }, 1000);
            return r;
          });
        });
      }
    };
  }

  /* ======================= SERVIDOR LOCAL (servidor.js) ======================= */
  function Servidor(rol) {
    var ev = emisor(), es = null;
    return {
      on: ev.on, modo: "servidor",
      conectar: function () {
        return fetch("/estado", {cache: "no-store"}).then(function (r) { return r.json(); }).then(function (est) {
          es = new EventSource("/eventos?rol=" + (rol === "salida" && RT.params().vista ? "vista" : rol) + "&id=" + yo);
          es.onopen = function () { ev.emit("red", "conectado"); };
          es.onerror = function () { ev.emit("red", "reconectando"); };
          es.onmessage = function (m) {
            var d; try { d = JSON.parse(m.data); } catch (e) { return; }
            if (d.tipo === "estado" && d.de !== yo) { ev.emit(rol === "salida" ? "estado" : "remoto", d.estado); }
            if (d.tipo === "presencia") { ev.emit("presencia", d); }
          };
          if (rol === "salida") { ev.emit("estado", est || {}); }
          return {estado: est && est.config ? est : null};
        });
      },
      publicar: function (estado) {
        fetch("/cmd", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({tipo: "estado", estado: estado, de: yo})})
          .then(function () { ev.emit("guardado", "ok"); }, function () { ev.emit("guardado", "error"); });
      },
      links: function () { return RT.infoServidor ? {control: RT.infoServidor.control, salida: RT.infoServidor.salida} : null; }
    };
  }

  /* ======================= LOCAL (mismo navegador / OBS) ======================= */
  var LS = "te_local_estado_v3";
  function Local(rol) {
    var ev = emisor(), bc = window.BroadcastChannel ? new BroadcastChannel("te_local_v3") : null;
    function leer() { try { return JSON.parse(localStorage.getItem(LS) || "null"); } catch (e) { return null; } }
    if (bc) { bc.onmessage = function (m) { var d = m.data || {}; if (d.t === "estado") { ev.emit(rol === "salida" ? "estado" : "remoto", d.estado); } }; }
    addEventListener("storage", function (e) { if (e.key === LS && e.newValue) { try { ev.emit(rol === "salida" ? "estado" : "remoto", JSON.parse(e.newValue)); } catch (x) {} } });
    return {
      on: ev.on, modo: "local",
      conectar: function () { var e = leer(); setTimeout(function () { ev.emit("red", "local"); if (rol === "salida") { ev.emit("estado", e || {}); } }, 0); return Promise.resolve({estado: e}); },
      publicar: function (estado) {
        try { localStorage.setItem(LS, JSON.stringify(estado)); ev.emit("guardado", "ok"); } catch (e) { ev.emit("guardado", "error", "Sin espacio en el navegador (¿logo muy pesado?)"); }
        if (bc) { bc.postMessage({t: "estado", estado: estado}); }
      },
      links: function () {
        var base = location.href.replace(/[?#].*$/, "").replace(/[^/]*$/, "");
        return {control: base + "panel.html?local=1", salida: base + "salida.html?local=1"};
      }
    };
  }

  /* Elige el modo según el link. rol = "control" | "salida" */
  RT.abrir = function (rol) {
    var p = RT.params();
    if (p.sala && (p.t || p.k)) { return Promise.resolve(rol === "salida" ? SalaSalida(p.sala, p.k || p.t) : SalaControl(p.sala, p.t)); }
    if (p.local || !/^http/.test(location.protocol)) { return Promise.resolve(Local(rol)); }
    return fetch("/info", {cache: "no-store"}).then(function (r) { if (!r.ok) { throw 0; } return r.json(); }).then(function (info) {
      if (!info || info.servidor !== "terapia-espacial") { throw 0; }
      RT.infoServidor = info; return Servidor(rol);
    }).catch(function () { return Local(rol); });
  };
  RT.crearSala = function (nombre) { return RT.rpc("cg_crear_sala", {p_nombre: nombre || "Terapia Espacial"}); };
})();
