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

  /* ---------- VÍA RÁPIDA (salida inmediata en OBS) ----------
     Al apretar un botón, además de guardar en la base, el panel avisa al tiro por Realtime SOLO qué está al aire
     (aire del programa, aire de EOYF y paso) + una huella del resto del estado. La salida usa el contenido que ya
     leyó de la base; si la huella no calza (texto editado, gráfica nueva) espera la lectura normal de la base. */
  function muestra(t) {
    var n = t.length, paso = Math.floor(n / 256), r = t.slice(0, 64) + t.slice(n - 64);
    for (var i = 64; i < n - 64; i += paso) { r += t.charAt(i); }
    return "\u00a7" + n + ":" + r;
  }
  function canon(o) {
    if (typeof o === "string" && o.length > 2048) { return JSON.stringify(muestra(o)); } /* fotos en base64: muestra rápida */
    if (o === null || typeof o !== "object") { return JSON.stringify(o === undefined ? null : o); }
    if (Array.isArray(o)) { return "[" + o.map(canon).join(",") + "]"; }
    return "{" + Object.keys(o).sort().filter(function (k) { return o[k] !== undefined; }).map(function (k) { return JSON.stringify(k) + ":" + canon(o[k]); }).join(",") + "}";
  }
  RT.huella = function (o) {
    var s = canon(o), h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36) + "." + s.length.toString(36);
  };
  function partes(est) {
    var resto = Object.assign({}, est || {}), e = resto.eoyf;
    var r = {aire: resto.aire === undefined ? null : resto.aire, eaire: e && e.aire !== undefined ? e.aire : null, paso: resto.paso === undefined ? null : resto.paso};
    delete resto.aire; delete resto.paso; delete resto.seq;
    if (e && typeof e === "object") { resto.eoyf = Object.assign({}, e); delete resto.eoyf.aire; }
    r.h = RT.huella(resto);
    return r;
  }
  /* ---------------- CONEXIÓN DIRECTA (WebRTC) botonera ⇄ salida de OBS ----------------
     En la misma red wifi el aviso llega en milisegundos, sin pasar por el servidor de Supabase (Oregón).
     La coordinación inicial viaja por el canal Realtime de la sala. Si no se logra, todo sigue por Realtime. */
  function Directo(rt, alMensaje, alCambio) {
    var pares = {}, ICE = {iceServers: [{urls: "stun:stun.l.google.com:19302"}, {urls: "stun:stun1.l.google.com:19302"}]};
    if (!window.RTCPeerConnection) { return {senal: function () {}, conectar: function () {}, cerrar: function () {}, ids: function () { return []; }, enviar: function () { return 0; }, abiertos: function () { return 0; }, latencia: function () { return null; }, medir: function () {}}; }
    function abiertos() { var n = 0; Object.keys(pares).forEach(function (id) { var dc = pares[id].dc; if (dc && dc.readyState === "open") { n++; } }); return n; }
    /* latencia de ida (ms) de la conexión directa más lenta abierta */
    function latencia() { var m = null; Object.keys(pares).forEach(function (id) { var p = pares[id]; if (p.dc && p.dc.readyState === "open" && p.rtt != null) { var v = Math.round(p.rtt / 2); if (m === null || v > m) { m = v; } } }); return m; }
    function aviso() { if (alCambio) { try { alCambio(abiertos(), latencia()); } catch (e) {} } }
    var ahora = function () { return window.performance && performance.now ? performance.now() : Date.now(); };
    function cerrar(id) { var p = pares[id]; if (!p) { return; } delete pares[id]; try { if (p.dc) { p.dc.close(); } } catch (e) {} try { p.pc.close(); } catch (e) {} aviso(); }
    function listo(p) { p.remoto = true; var c = p.cola; p.cola = []; c.forEach(function (x) { p.pc.addIceCandidate(x).catch(function () {}); }); }
    function nuevo(id, inicia) {
      cerrar(id);
      var pc = new RTCPeerConnection(ICE), p = {pc: pc, dc: null, t: Date.now(), cola: [], remoto: false}; pares[id] = p;
      pc.onicecandidate = function (e) { if (e.candidate) { rt.enviar("rtc", {de: yo, para: id, c: e.candidate.toJSON ? e.candidate.toJSON() : e.candidate}); } };
      pc.onconnectionstatechange = function () { if (/failed|closed/.test(pc.connectionState) && pares[id] === p) { cerrar(id); } };
      function usar(dc) {
        p.dc = dc;
        dc.onopen = aviso;
        dc.onmessage = function (m) {
          var d; try { d = JSON.parse(m.data); } catch (e) { return; }
          if (d && d.ping !== undefined) { try { dc.send(JSON.stringify({pong: d.ping})); } catch (e) {} return; }
          if (d && d.pong !== undefined) { var r = ahora() - d.pong; p.rtt = p.rtt == null ? r : p.rtt * 0.6 + r * 0.4; aviso(); return; }
          alMensaje(d);
        };
        dc.onclose = function () { if (pares[id] === p) { cerrar(id); } };
      }
      if (inicia) {
        usar(pc.createDataChannel("cg", {ordered: true}));
        pc.createOffer().then(function (o) { return pc.setLocalDescription(o); })
          .then(function () { rt.enviar("rtc", {de: yo, para: id, sdp: {type: pc.localDescription.type, sdp: pc.localDescription.sdp}}); })
          .catch(function () { cerrar(id); });
      } else { pc.ondatachannel = function (e) { usar(e.channel); }; }
      return p;
    }
    return {
      senal: function (d) {
        if (!d || d.para !== yo || !d.de) { return; }
        var p = pares[d.de];
        if (d.sdp && d.sdp.type === "offer") {
          p = nuevo(d.de, false);
          p.pc.setRemoteDescription(d.sdp).then(function () { listo(p); return p.pc.createAnswer(); })
            .then(function (a) { return p.pc.setLocalDescription(a); })
            .then(function () { rt.enviar("rtc", {de: yo, para: d.de, sdp: {type: p.pc.localDescription.type, sdp: p.pc.localDescription.sdp}}); })
            .catch(function () { cerrar(d.de); });
        } else if (d.sdp && p) {
          p.pc.setRemoteDescription(d.sdp).then(function () { listo(p); }, function () { cerrar(d.de); });
        } else if (d.c && p) {
          if (p.remoto) { p.pc.addIceCandidate(d.c).catch(function () {}); } else { p.cola.push(d.c); }
        }
      },
      /* el panel llama esto por cada salida que ve; reintenta solo si no hay canal abierto y pasaron 8 s */
      conectar: function (id) { var p = pares[id]; if (p && ((p.dc && p.dc.readyState === "open") || Date.now() - p.t < 8000)) { return; } nuevo(id, true); },
      cerrar: cerrar,
      ids: function () { return Object.keys(pares); },
      enviar: function (obj) { var s = JSON.stringify(obj), n = 0; Object.keys(pares).forEach(function (id) { var dc = pares[id].dc; if (dc && dc.readyState === "open") { try { dc.send(s); n++; } catch (e) {} } }); return n; },
      abiertos: abiertos,
      latencia: latencia,
      medir: function () { var s = JSON.stringify({ping: ahora()}); Object.keys(pares).forEach(function (id) { var dc = pares[id].dc; if (dc && dc.readyState === "open") { try { dc.send(s); } catch (e) {} } }); }
    };
  }
  RT.Directo = Directo;

  function conPartes(est, d) {
    var n = Object.assign({}, est, {aire: d.aire, paso: d.paso, seq: d.seq});
    if (n.eoyf && typeof n.eoyf === "object") { n.eoyf = Object.assign({}, n.eoyf, {aire: d.eaire}); }
    return n;
  }

  /* ======================= CONTROL (panel / botonera) ======================= */
  function SalaControl(sala, token) {
    var ev = emisor(), rt = null, rev = 0, outKey = null, guardando = false, pendiente = null, falla = 0, tReint = 0, seq = 0;
    var directo = null, salidasVistas = [];
    function rapido(est) {
      if (!rt) { return; }
      try {
        var d = partes(est); d.seq = est.seq; d.de = yo;
        if (directo) { directo.enviar(d); }        /* primero el canal directo (milisegundos) */
        if (rt.conectado()) { rt.enviar("ya", d); } /* y por Realtime para las salidas sin canal directo */
      } catch (e) { console.warn("[via rapida]", e); }
    }
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
            directo = Directo(rt, function () {}, function (n, ms) { ev.emit("directo", n, ms); });
            var unirSalidas = function () { salidasVistas.forEach(function (id) { directo.conectar(id); }); directo.ids().forEach(function (id) { if (salidasVistas.indexOf(id) < 0) { directo.cerrar(id); } }); };
            setInterval(function () { if (rt.conectado()) { unirSalidas(); } }, 5000);
            setInterval(function () { directo.medir(); }, 2000);
            rt.on("estado", function (s) { ev.emit("red", s === "conectado" ? "conectado" : "reconectando"); if (s === "conectado") { releer().catch(function () {}); if (pendiente) { guardar(); } } });
            rt.on("presencia", function (l) {
              salidasVistas = l.filter(function (p) { return p.rol === "salida" && p.id; }).map(function (p) { return p.id; }); unirSalidas();
              ev.emit("presencia", {salidas: l.filter(function (p) { return p.rol === "salida"; }).length, controles: l.filter(function (p) { return p.rol === "control"; }).length}); });
            rt.on("mensaje", function (evento, d) {
              if (evento === "rev" && d.de !== yo && d.rev > rev) { releer().catch(function () {}); }
              if (evento === "rtc") { directo.senal(d); return; }
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
      publicar: function (estado) {
        seq = Math.max(seq + 1, Date.now()); estado.seq = seq;
        rapido(estado);   /* antes de copiar el estado: el aviso sale lo antes posible */
        pendiente = JSON.parse(JSON.stringify(estado)); guardar();
      },
      links: function () {
        var base = location.href.replace(/[?#].*$/, "").replace(/[^/]*$/, "");
        return {control: base + "panel.html?sala=" + sala + "#t=" + token, salida: base + "salida.html?sala=" + sala + "&k=" + outKey};
      },
      regenerar: function () { return RT.rpc("cg_regenerar", {p_sala: sala, p_token: token}); },
      // sube un video a la sala (Supabase Storage, bucket cg-media, máx. 50 MB) con permiso firmado por la función cg-media
      subir: function (archivo, progreso) { return subirSala(sala, token, archivo, progreso); }
    };
  }

  function SalaSalida(sala, clave) {
    var ev = emisor(), rt = null, rev = -1, leyendo = false, otraVez = false, seq = 0, ultimo = null;
    var hUlt = null, directo = null;
    function emitir(e, h) { ultimo = e; hUlt = h || null; ev.emit("estado", e); }
    function rapido(d) {
      if (!ultimo || !d || !(+d.seq > seq)) { return; }
      if (hUlt === null) { hUlt = partes(ultimo).h; }
      if (hUlt !== d.h) { return; } /* el contenido cambió: que llegue desde la base */
      seq = +d.seq; emitir(conPartes(ultimo, d), hUlt);
    }
    function leer() {
      if (leyendo) { otraVez = true; return; }
      leyendo = true;
      RT.rpc("cg_leer", {p_sala: sala, p_clave: clave}).then(function (r) {
        leyendo = false;
        var s = (r.estado && +r.estado.seq) || 0;
        if (r.rev !== rev && s >= seq) { rev = r.rev; seq = s; emitir(r.estado || {}); }
        ev.emit("red", rt && rt.conectado() ? "conectado" : "respaldo");
        if (otraVez) { otraVez = false; leer(); }
      }, function (e) { leyendo = false; ev.emit("red", "sin-conexion", e.message); if (otraVez) { otraVez = false; setTimeout(leer, 1500); } });
    }
    return {
      on: ev.on, modo: "sala",
      conectar: function () {
        return RT.rpc("cg_leer", {p_sala: sala, p_clave: clave}).then(function (r) {
          rev = r.rev; seq = (r.estado && +r.estado.seq) || 0; emitir(r.estado || {});
          return (r.rol === "control" ? RT.claveSalida(clave) : Promise.resolve(clave)).then(nombreCanal).then(function (canal) {
            rt = RT.Realtime(canal, {presencia: {rol: RT.params().vista ? "vista" : "salida", id: yo, desde: Date.now()}});
            directo = Directo(rt, rapido);
            rt.on("estado", function (s) { if (s === "conectado") { ev.emit("red", "conectado"); leer(); rt.enviar("hola", {}); } else { ev.emit("red", "reconectando"); } });
            rt.on("mensaje", function (evento, d) {
              if (evento === "ya") { rapido(d); return; }
              if (evento === "rtc") { directo.senal(d); return; }
              if (evento === "rev" && +d.rev !== rev) { leer(); }
            });
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
      links: function () { return RT.infoServidor ? {control: RT.infoServidor.control, salida: RT.infoServidor.salida} : null; },
      // sube el video al computador del servidor (carpeta obs/videos/subidos)
      subir: function (archivo, progreso) {
        return new Promise(function (ok, mal) {
          var x = new XMLHttpRequest();
          x.open("POST", "/subir?nombre=" + encodeURIComponent(archivo.name));
          x.upload.onprogress = function (e) { if (e.lengthComputable && progreso) { progreso(e.loaded / e.total); } };
          x.onload = function () { try { var j = JSON.parse(x.responseText); if (x.status === 200 && j.url) { ok({url: j.url}); } else { mal(new Error(j.error || "La subida falló")); } } catch (e) { mal(new Error("La subida falló")); } };
          x.onerror = function () { mal(new Error("Se cortó la conexión con el servidor")); };
          x.send(archivo);
        });
      }
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
      },
      // modo local: el video queda guardado en este navegador (sirve para el panel como dock de OBS + la salida en el mismo OBS)
      subir: function (archivo, progreso) {
        var id = "v" + Date.now().toString(36);
        if (progreso) { progreso(0.5); }
        return RT.mediaLocal.guardar(id, archivo).then(function () { if (progreso) { progreso(1); } return {url: "idb:" + id}; });
      }
    };
  }

  /* ======================= ARCHIVOS ======================= */
  function subirSala(sala, token, archivo, progreso) {
    var tipo = archivo.type || (/\.webm$/i.test(archivo.name) ? "video/webm" : /\.mp4$/i.test(archivo.name) ? "video/mp4" : /\.mov$/i.test(archivo.name) ? "video/quicktime" : "");
    return fetch(URL_SB + "/functions/v1/cg-media", {method: "POST", headers: {"apikey": KEY, "Authorization": "Bearer " + KEY, "Content-Type": "application/json"},
      body: JSON.stringify({accion: "subir", sala: sala, token: token, tipo: tipo, tam: archivo.size})})
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { throw new Error(j.error || ("Error " + r.status)); } return j; }); },
        function (e) { throw new Error(traducir(e, 0)); })
      .then(function (p) {
        return new Promise(function (ok, mal) {
          var x = new XMLHttpRequest();
          x.open("PUT", p.signedUrl);
          x.setRequestHeader("Content-Type", tipo); x.setRequestHeader("x-upsert", "false"); x.setRequestHeader("apikey", KEY);
          x.upload.onprogress = function (e) { if (e.lengthComputable && progreso) { progreso(e.loaded / e.total); } };
          x.onload = function () { if (x.status >= 200 && x.status < 300) { ok({url: p.url, path: p.path}); } else { mal(new Error("La subida falló (" + x.status + ")")); } };
          x.onerror = function () { mal(new Error("Se cortó la conexión durante la subida")); };
          x.send(archivo);
        });
      });
  }
  var dbP = null;
  function db() {
    if (dbP) { return dbP; }
    dbP = new Promise(function (ok, mal) {
      if (!window.indexedDB) { mal(new Error("Este navegador no permite guardar videos")); return; }
      var r = indexedDB.open("te_media_v1", 1);
      r.onupgradeneeded = function () { r.result.createObjectStore("archivos"); };
      r.onsuccess = function () { ok(r.result); }; r.onerror = function () { mal(r.error || new Error("No se pudo abrir el almacenamiento local")); };
    });
    return dbP;
  }
  RT.mediaLocal = {
    guardar: function (id, blob) { return db().then(function (d) { return new Promise(function (ok, mal) { var t = d.transaction("archivos", "readwrite"); t.objectStore("archivos").put(blob, id); t.oncomplete = function () { ok(); }; t.onerror = function () { mal(t.error || new Error("Sin espacio para guardar el video")); }; }); }); },
    leer: function (id) { return db().then(function (d) { return new Promise(function (ok, mal) { var q = d.transaction("archivos").objectStore("archivos").get(id); q.onsuccess = function () { ok(q.result || null); }; q.onerror = function () { mal(q.error); }; }); }); }
  };
  var urlsLocales = {};
  // convierte la url guardada en una que el navegador pueda reproducir
  RT.resolverVideo = function (url) {
    if (!url) { return Promise.resolve(null); }
    if (/^idb:/.test(url)) {
      var id = url.slice(4);
      if (urlsLocales[id]) { return Promise.resolve(urlsLocales[id]); }
      return RT.mediaLocal.leer(id).then(function (b) { if (!b) { return null; } urlsLocales[id] = URL.createObjectURL(b); return urlsLocales[id]; }, function () { return null; });
    }
    return Promise.resolve(url);
  };

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
