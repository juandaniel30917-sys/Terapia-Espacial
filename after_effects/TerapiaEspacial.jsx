/* =========================================================================
   TERAPIA ESPACIAL — Paquete gráfico para After Effects  v1.0
   -------------------------------------------------------------------------
   Concepto: «la abducción». Un ovni cae, enciende su rayo tractor y deja
   el GC; en la salida lo absorbe y se va.

   Cómo usarlo:
     A) Archivo > Scripts > Ejecutar archivo de script...  > TerapiaEspacial.jsx
     B) Panel acoplable: copia este archivo en
        Adobe After Effects 2026/Support Files/Scripts/ScriptUI Panels/
        reinicia AE y ábrelo desde el menú Ventana.

   Funciona en AE en español o inglés (usa solo matchNames "ADBE ...").
   Prefijo de comps y capas: TE_
   ========================================================================= */

(function TerapiaEspacial(thisObj) {

    var VERSION = "1.0";

    // =====================================================================
    // CONFIG — todo lo editable vive aquí (el panel lo sobrescribe)
    // =====================================================================
    var CONFIG = {
        programa: "TERAPIA ESPACIAL",
        conductor: "Luis A. Monasterios",
        prefijo: "TE_",
        ancho: 1920, alto: 1080, fps: 29.97,
        fondo: "verde",                 // "verde" (chroma) | "espacio" (fondo estrellado) | "transparente" (alfa)
        verde: [0, 1, 0],
        colores: {
            espacio: "#0B0B1A",
            violeta: "#7B2FF7",
            magenta: "#FF3DCB",
            rayo:    "#FFF4C2",
            blanco:  "#FFFFFF",
            menta:   "#D6EFC7",
            violetaOsc: "#4A1A9E",
            violetaClaro: "#A77BFF",
            pantalon: "#26244F",
            piel:    "#E8A987",
            pelo:    "#3A1B4F"
        },
        fuentes: { titulo: "Arial-BoldMT", texto: "ArialMT" },
        bordeIzq: 140,                  // borde izquierdo de los GC (px)
        logoArchivo: null,              // File opcional (png / ai / mov)
        dur: { gc: 10, aviso: 8, volvemos: 8, titulo: 8, cortina: 2.5, transicion: 2,
               apertura: 15, cierre: 9.5, bug: 10, multiplex: 60, titular: 9, avance: 8 },
        // GC: [nombre, cargo, icono]  icono: "" | "terapeuta" | "alien"
        gcs: [
            ["Luis Monasterios", "Presentador", ""],
            ["Benjamín Castillo", "Parapsicólogo", ""],
            ["Sophia Jaque", "Psicóloga", "terapeuta"],
            ["Paciente X-27", "Visitante de otro planeta", "alien"]
        ],
        avance: { titulo: "AVANCE INFORMATIVO", sub: "ÚLTIMAS NOTICIAS · TALCA · CHILE · INTERNACIONAL" },
        // Titulares «Últimas Noticias»: [GC, subtítulo, esquina superior derecha (Ciudad, Región), fondo ("verde" | "espacio" | "" = general)]
        titulares: [
            ["Últimas Noticias", "Los últimos acontecimientos en materia meteorológica, deportiva y cultural", "Talca, Región del Maule", "verde"],
            ["Últimas Noticias", "Los últimos sucesos de política y economía que afectan a nuestro país.", "Santiago, Región Metropolitana", "verde"],
            ["Últimas Noticias", "Noticia Internacional", "Barquisimeto, Venezuela", "verde"],
            ["Últimas Noticias", "Noticia Internacional", "Buenos Aires, Argentina", "verde"],
            ["Últimas Noticias", "Noticia Internacional", "Hollywood, Estados Unidos", "verde"]
        ],
        etiquetaSesion: "SESIÓN EN CURSO",
        cortinaTitulo: { titulo: "OVNIS CAPTADOS EN CÁMARA", sub: "¿ESTAMOS SOLOS EN EL UNIVERSO?" },
        triplex: { titulo: "OVNI · OSNI · FANI", etiquetas: ["LUIS MONASTERIOS", "AVISTAMIENTOS", "BENJAMÍN CASTILLO"] },
        duplex:  { titulo: "SALUD MENTAL", etiquetas: ["SOPHIA JAQUE", "NOTA · SALUD MENTAL"] },
        aviso:   { titulo: "¡NUEVO AVISTAMIENTO!", sub: "El Enladrillado · Región del Maule" },
        volvemos: { titulo: "VOLVEMOS ENSEGUIDA", sub: "LA SESIÓN CONTINÚA" },
        cierre:  { titulo: "TERAPIA ESPACIAL", sub: "FIN DE LA SESIÓN · NOS VEMOS EN UN NUEVO PROGRAMA" },
        apertura:{ titulo: "TERAPIA ESPACIAL", sub: "CON LUIS A. MONASTERIOS" }
    };

    // @@ESCENA_INICIO (generado por herramientas/construir_escena.py — no editar a mano)
    var ESCENA_DATOS = {"escena":[{"k":"g","n":"lapiz","o":[284.0,-24.0],"h":[{"f":"piel","s":"blanco","w":3.0,"k":"ell","p":[248.0,36.0],"t":[18.0,18.0]},{"f":null,"s":"magenta","w":5.0,"k":"path","sp":[{"v":[[250.0,36.0],[234.0,50.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"rayo","w":14.0,"k":"path","sp":[{"v":[[284.0,-24.0],[250.0,32.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"blanco","w":22.0,"k":"path","sp":[{"v":[[284.0,-24.0],[250.0,32.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]}]},{"f":"piel","s":"blanco","w":3.0,"k":"ell","p":[224.0,28.0],"t":[18.0,18.0]},{"f":null,"s":"rayo","w":14.0,"k":"path","sp":[{"v":[[250.0,-28.0],[226.0,24.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"blanco","w":22.0,"k":"path","sp":[{"v":[[250.0,-28.0],[226.0,24.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"violeta","w":3.0,"k":"path","sp":[{"v":[[214.0,16.0],[248.0,16.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false},{"v":[[214.0,28.0],[246.0,28.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false},{"v":[[214.0,40.0],[240.0,40.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":"violeta","s":null,"w":0,"k":"rect","p":[232.0,-3.0],"t":[20.0,10.0],"r":3.0},{"f":"blanco","s":"espacio","w":3.0,"k":"rect","p":[232.0,31.0],"t":[52.0,66.0],"r":6.0},{"k":"g","n":"cabezaTerapeuta","o":[262.0,-50.0],"h":[{"f":null,"s":"espacio","w":3.0,"k":"path","sp":[{"v":[[250.0,-62.0],[268.0,-62.0]],"i":[[0,0],[-4.0,5.0]],"o":[[6.0,5.0],[0,0]],"c":false}]},{"f":"espacio","s":null,"w":0,"k":"ell","p":[269.0,-75.0],"t":[5.0,5.0]},{"f":"espacio","s":null,"w":0,"k":"ell","p":[245.0,-75.0],"t":[5.0,5.0]},{"f":null,"s":"espacio","w":3.0,"k":"path","sp":[{"v":[[256.0,-76.0],[262.0,-76.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"espacio","w":3.0,"k":"ell","p":[271.0,-76.0],"t":[18.0,18.0]},{"f":null,"s":"espacio","w":3.0,"k":"ell","p":[247.0,-76.0],"t":[18.0,18.0]},{"f":"pelo","s":"blanco","w":4.0,"k":"ell","p":[286.0,-120.0],"t":[30.0,30.0]},{"f":"pelo","s":"blanco","w":3.0,"k":"path","sp":[{"v":[[230.0,-82.0],[288.0,-96.0],[232.0,-78.0]],"i":[[0,0],[-20.0,-20.0],[16.0,-20.0]],"o":[[4.0,-26.0],[-18.0,-6.0],[0,0]],"c":true}]},{"f":"piel","s":"blanco","w":5.0,"k":"ell","p":[260.0,-78.0],"t":[60.0,60.0]}]},{"f":"piel","s":"blanco","w":4.0,"k":"rect","p":[262.0,-46.0],"t":[18.0,20.0],"r":6.0},{"f":null,"s":"violeta","w":4.0,"k":"path","sp":[{"v":[[260.0,-38.0],[264.0,-18.0],[272.0,-38.0]],"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"c":false}]},{"f":"rayo","s":"blanco","w":5.0,"k":"path","sp":[{"v":[[234.0,64.0],[250.0,-38.0],[292.0,-26.0],[292.0,66.0]],"i":[[0,0],[-20.0,18.0],[-8.0,-16.0],[8.0,-20.0]],"o":[[-8.0,-40.0],[16.0,-8.0],[10.0,34.0],[0,0]],"c":true}]},{"f":"pelo","s":"blanco","w":4.0,"k":"path","sp":[{"v":[[228.0,-74.0],[290.0,-118.0],[304.0,6.0],[284.0,0.0],[260.0,-90.0],[232.0,-62.0]],"i":[[0,0],[-30.0,-20.0],[16.0,-44.0],[0,0],[22.0,8.0],[2.0,-20.0]],"o":[[-10.0,-46.0],[26.0,20.0],[0,0],[6.0,-40.0],[-14.0,-2.0],[0,0]],"c":true}]},{"f":"magenta","s":"blanco","w":4.0,"k":"ell","p":[226.0,160.0],"t":[40.0,16.0]},{"f":"magenta","s":"blanco","w":4.0,"k":"ell","p":[188.0,154.0],"t":[44.0,18.0]},{"f":null,"s":"pantalon","w":27.0,"k":"path","sp":[{"v":[[284.0,62.0],[190.0,60.0],[198.0,148.0]],"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"c":false}]},{"f":null,"s":"blanco","w":36.0,"k":"path","sp":[{"v":[[284.0,62.0],[190.0,60.0],[198.0,148.0]],"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"c":false}]},{"f":null,"s":"pantalon","w":25.0,"k":"path","sp":[{"v":[[282.0,78.0],[226.0,86.0],[232.0,154.0]],"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"c":false}]},{"f":null,"s":"blanco","w":34.0,"k":"path","sp":[{"v":[[282.0,78.0],[226.0,86.0],[232.0,154.0]],"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"c":false}]},{"f":"violetaClaro","s":"blanco","w":5.0,"k":"rect","p":[264.0,72.0],"t":[140.0,24.0],"r":10.0},{"f":null,"s":"blanco","w":7.0,"k":"path","sp":[{"v":[[214.0,82.0],[204.0,160.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false},{"v":[[314.0,82.0],[324.0,160.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":"violetaClaro","s":"blanco","w":5.0,"k":"rect","p":[323.0,13.0],"t":[26.0,150.0],"r":10.0},{"k":"g","n":"globo","o":[72.0,-110.0],"h":[{"f":null,"s":"rayo","w":5.0,"k":"path","sp":[{"v":[[148.0,-132.0],[176.0,-132.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"rayo","w":5.0,"k":"path","sp":[{"v":[[148.0,-146.0],[190.0,-146.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"rayo","w":5.0,"k":"path","sp":[{"v":[[148.0,-160.0],[200.0,-160.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"rayo","w":3.0,"k":"path","sp":[{"v":[[106.0,-142.0],[98.0,-128.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false},{"v":[[118.0,-142.0],[126.0,-128.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":"espacio","s":"rayo","w":4.0,"k":"ell","p":[112.0,-150.0],"t":[48.0,14.0]},{"f":"espacio","s":"rayo","w":4.0,"k":"path","sp":[{"v":[[98.0,-152.0],[126.0,-152.0]],"i":[[0,0],[0.0,-16.0]],"o":[[0.0,-16.0],[0,0]],"c":false}]},{"f":"espacio","s":"blanco","w":5.0,"k":"rect","p":[146.0,-151.0],"t":[148.0,70.0],"r":24.0},{"f":"espacio","s":"blanco","w":5.0,"k":"path","sp":[{"v":[[90.0,-124.0],[72.0,-92.0],[116.0,-120.0]],"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"c":true}]}]},{"k":"g","n":"cabezaAlien","o":[56.0,-58.0],"h":[{"k":"g","n":"boca","o":[58.0,-37.0],"h":[{"f":"espacio","s":null,"w":0,"k":"ell","p":[58.0,-37.0],"t":[16.0,12.0]}]},{"f":null,"s":"espacio","w":3.0,"k":"path","sp":[{"v":[[66.0,-80.0],[84.0,-74.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"espacio","w":3.0,"k":"path","sp":[{"v":[[32.0,-74.0],[50.0,-80.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":"blanco","s":null,"w":0,"k":"ell","p":[79.0,-64.0],"t":[7.0,7.0]},{"f":"blanco","s":null,"w":0,"k":"ell","p":[47.0,-64.0],"t":[7.0,7.0]},{"f":"espacio","s":null,"w":0,"k":"ell","p":[74.0,-62.0],"t":[28.0,18.0]},{"f":"espacio","s":null,"w":0,"k":"ell","p":[42.0,-62.0],"t":[28.0,18.0]},{"f":"menta","s":"blanco","w":5.0,"k":"path","sp":[{"v":[[56.0,-108.0],[96.0,-64.0],[56.0,-18.0],[16.0,-64.0]],"i":[[-30.0,0.0],[4.0,-22.0],[16.0,-4.0],[4.0,24.0]],"o":[[30.0,0.0],[-4.0,24.0],[-16.0,-4.0],[-4.0,-22.0]],"c":true}]}]},{"k":"g","n":"gesto","o":[-8.0,-12.0],"h":[{"f":null,"s":"blanco","w":5.0,"k":"path","sp":[{"v":[[-75.0,-132.0],[-68.0,-144.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"blanco","w":5.0,"k":"path","sp":[{"v":[[-84.0,-136.0],[-86.0,-150.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"blanco","w":5.0,"k":"path","sp":[{"v":[[-94.0,-132.0],[-104.0,-144.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":"menta","s":"blanco","w":4.0,"k":"ell","p":[-86.0,-124.0],"t":[26.0,26.0]},{"f":null,"s":"magenta","w":17.0,"k":"path","sp":[{"v":[[-8.0,-12.0],[-34.0,-78.0],[-80.0,-118.0]],"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"c":false}]},{"f":null,"s":"blanco","w":26.0,"k":"path","sp":[{"v":[[-8.0,-12.0],[-34.0,-78.0],[-80.0,-118.0]],"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"c":false}]}]},{"f":"menta","s":"blanco","w":4.0,"k":"ell","p":[-108.0,10.0],"t":[20.0,20.0]},{"f":null,"s":"magenta","w":14.0,"k":"path","sp":[{"v":[[-46.0,2.0],[-104.0,12.0]],"i":[[0,0],[16.0,8.0]],"o":[[-16.0,16.0],[0,0]],"c":false}]},{"f":null,"s":"blanco","w":22.0,"k":"path","sp":[{"v":[[-46.0,2.0],[-104.0,12.0]],"i":[[0,0],[16.0,8.0]],"o":[[-16.0,16.0],[0,0]],"c":false}]},{"f":"magenta","s":"blanco","w":5.0,"k":"path","sp":[{"v":[[-158.0,-10.0],[24.0,-18.0],[20.0,32.0],[-158.0,32.0]],"i":[[-16.0,10.0],[-42.0,-12.0],[20.0,-8.0],[40.0,10.0]],"o":[[40.0,-20.0],[16.0,6.0],[-60.0,10.0],[-16.0,-8.0]],"c":true}]},{"f":"menta","s":"blanco","w":4.0,"k":"ell","p":[-326.0,-78.0],"t":[34.0,22.0]},{"f":null,"s":"pantalon","w":30.0,"k":"path","sp":[{"v":[[-144.0,16.0],[-242.0,-14.0],[-314.0,-66.0]],"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"c":false}]},{"f":null,"s":"blanco","w":40.0,"k":"path","sp":[{"v":[[-144.0,16.0],[-242.0,-14.0],[-314.0,-66.0]],"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"c":false}]},{"f":null,"s":"blanco","w":3.0,"k":"ell","p":[69.0,-28.0],"t":[40.0,40.0]},{"f":"violeta","s":"blanco","w":5.0,"k":"rect","p":[69.0,19.0],"t":[78.0,174.0],"r":39.0},{"f":null,"s":"blanco","w":3.0,"k":"ell","p":[-319.0,-28.0],"t":[40.0,40.0]},{"f":"violeta","s":"blanco","w":5.0,"k":"rect","p":[-319.0,19.0],"t":[78.0,174.0],"r":39.0},{"f":"espacio","s":"blanco","w":4.0,"k":"rect","p":[25.0,118.0],"t":[18.0,34.0],"r":4.0},{"f":"espacio","s":"blanco","w":4.0,"k":"rect","p":[-275.0,118.0],"t":[18.0,34.0],"r":4.0},{"f":null,"s":"blanco","w":3.0,"k":"path","sp":[{"v":[[-294.0,50.0],[44.0,50.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":"violeta","s":"blanco","w":5.0,"k":"rect","p":[-125.0,64.0],"t":[370.0,80.0],"r":18.0},{"f":"violetaOsc","s":"blanco","w":5.0,"k":"rect","p":[-125.0,-18.0],"t":[390.0,120.0],"r":46.0}],"terapeuta":[{"k":"g","n":"cabezaTerapeuta","o":[262.0,-50.0],"h":[{"f":null,"s":"espacio","w":3.0,"k":"path","sp":[{"v":[[250.0,-62.0],[268.0,-62.0]],"i":[[0,0],[-4.0,5.0]],"o":[[6.0,5.0],[0,0]],"c":false}]},{"f":"espacio","s":null,"w":0,"k":"ell","p":[269.0,-75.0],"t":[5.0,5.0]},{"f":"espacio","s":null,"w":0,"k":"ell","p":[245.0,-75.0],"t":[5.0,5.0]},{"f":null,"s":"espacio","w":3.0,"k":"path","sp":[{"v":[[256.0,-76.0],[262.0,-76.0]],"i":[[0,0],[0,0]],"o":[[0,0],[0,0]],"c":false}]},{"f":null,"s":"espacio","w":3.0,"k":"ell","p":[271.0,-76.0],"t":[18.0,18.0]},{"f":null,"s":"espacio","w":3.0,"k":"ell","p":[247.0,-76.0],"t":[18.0,18.0]},{"f":"pelo","s":"blanco","w":4.0,"k":"ell","p":[286.0,-120.0],"t":[30.0,30.0]},{"f":"pelo","s":"blanco","w":3.0,"k":"path","sp":[{"v":[[230.0,-82.0],[288.0,-96.0],[232.0,-78.0]],"i":[[0,0],[-20.0,-20.0],[16.0,-20.0]],"o":[[4.0,-26.0],[-18.0,-6.0],[0,0]],"c":true}]},{"f":"piel","s":"blanco","w":5.0,"k":"ell","p":[260.0,-78.0],"t":[60.0,60.0]}]},{"f":"pelo","s":"blanco","w":4.0,"k":"path","sp":[{"v":[[228.0,-74.0],[290.0,-118.0],[304.0,6.0],[284.0,0.0],[260.0,-90.0],[232.0,-62.0]],"i":[[0,0],[-30.0,-20.0],[16.0,-44.0],[0,0],[22.0,8.0],[2.0,-20.0]],"o":[[-10.0,-46.0],[26.0,20.0],[0,0],[6.0,-40.0],[-14.0,-2.0],[0,0]],"c":true}]}]};
    // @@ESCENA_FIN

    // =====================================================================
    // UTILIDADES
    // =====================================================================
    function N(n) { return CONFIG.prefijo + n; }
    function trim(s) { return String(s).replace(/^\s+|\s+$/g, ""); }
    function hex(h) {
        h = trim(h).replace("#", "");
        if (h.length === 3) { h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2); }
        return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255];
    }
    // con verde o espacio el rayo va opaco y sin glow; solo en transparente lleva brillo
    function esVerde() { return CONFIG.fondo !== "transparente"; }
    function q(s) { return '"' + s + '"'; }   // comillas para expresiones

    function carpeta(nombre) {
        var p = app.project, i;
        for (i = 1; i <= p.numItems; i++) {
            if (p.item(i) instanceof FolderItem && p.item(i).name === nombre) { return p.item(i); }
        }
        return p.items.addFolder(nombre);
    }

    function nuevaComp(nombre, dur) {
        var c = app.project.items.addComp(N(nombre), CONFIG.ancho, CONFIG.alto, 1, dur, CONFIG.fps);
        c.parentFolder = carpeta(N("GRAFICAS"));
        c.bgColor = [0, 0, 0];
        c.motionBlur = true;
        return c;
    }

    function tr(layer, mn) { return layer.property("ADBE Transform Group").property(mn); }

    function suavizar(prop) {
        var n = 1, k, e = [], i, t = prop.propertyValueType;
        if (t === PropertyValueType.TwoD) { n = 2; }
        else if (t === PropertyValueType.ThreeD) { n = 3; }
        for (i = 0; i < n; i++) { e.push(new KeyframeEase(0, 80)); }
        for (k = 1; k <= prop.numKeys; k++) {
            try { prop.setTemporalEaseAtKey(k, e, e); } catch (err) {}
        }
    }
    // pares = [[tiempo, valor], ...]
    function anim(prop, pares, lineal) {
        var i;
        for (i = 0; i < pares.length; i++) { prop.setValueAtTime(pares[i][0], pares[i][1]); }
        if (!lineal) { suavizar(prop); }
    }

    function marcador(comp, t, txt) {
        try { comp.markerProperty.setValueAtTime(t, new MarkerValue(txt)); } catch (e) {}
    }

    // ---------- efectos de control ----------
    function fx(layer, mn, nombre) {
        var f = layer.property("ADBE Effect Parade").addProperty(mn);
        f.name = nombre;
        return f;
    }
    function slider(layer, nombre, v) { var f = fx(layer, "ADBE Slider Control", nombre); f.property(1).setValue(v); return f.property(1); }
    function check(layer, nombre, v) { var f = fx(layer, "ADBE Checkbox Control", nombre); f.property(1).setValue(v); return f.property(1); }
    function colorCtrl(layer, nombre, c) { var f = fx(layer, "ADBE Color Control", nombre); f.property(1).setValue(c); return f.property(1); }

    // ---------- capas de forma ----------
    function capaForma(comp, nombre) { var l = comp.layers.addShape(); l.name = nombre; return l; }
    function grupo(layer, nombre) {
        var g = layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        g.name = nombre;
        return g;
    }
    function cont(g) { return g.property("ADBE Vectors Group"); }
    function gtr(g, mn) { return g.property("ADBE Vector Transform Group").property(mn); }
    function rect(g, size, pos, round) {
        var r = cont(g).addProperty("ADBE Vector Shape - Rect");
        r.name = "RECT";
        r.property("ADBE Vector Rect Size").setValue(size);
        if (pos) { r.property("ADBE Vector Rect Position").setValue(pos); }
        if (round) { r.property("ADBE Vector Rect Roundness").setValue(round); }
        return r;
    }
    function elipse(g, size, pos) {
        var e = cont(g).addProperty("ADBE Vector Shape - Ellipse");
        e.property("ADBE Vector Ellipse Size").setValue(size);
        if (pos) { e.property("ADBE Vector Ellipse Position").setValue(pos); }
        return e;
    }
    function trazo(g, verts, cerrado, inT, outT) {
        var p = cont(g).addProperty("ADBE Vector Shape - Group");
        p.name = "TRAZO";
        var s = new Shape(), z = [], n;
        for (n = 0; n < verts.length; n++) { z.push([0, 0]); }
        s.vertices = verts;
        s.inTangents = inT || z;
        s.outTangents = outT || z;
        s.closed = cerrado;
        p.property("ADBE Vector Shape").setValue(s);
        return p;
    }
    function relleno(g, color, op) {
        var f = cont(g).addProperty("ADBE Vector Graphic - Fill");
        f.property("ADBE Vector Fill Color").setValue(color);
        if (op !== undefined) { f.property("ADBE Vector Fill Opacity").setValue(op); }
        return f;
    }
    function contorno(g, color, w, op) {
        var s = cont(g).addProperty("ADBE Vector Graphic - Stroke");
        s.property("ADBE Vector Stroke Color").setValue(color);
        s.property("ADBE Vector Stroke Width").setValue(w);
        try { s.property("ADBE Vector Stroke Line Cap").setValue(2); } catch (e) {}
        try { s.property("ADBE Vector Stroke Line Join").setValue(2); } catch (e2) {}
        if (op !== undefined) { s.property("ADBE Vector Stroke Opacity").setValue(op); }
        return s;
    }
    function recorte(g) { return cont(g).addProperty("ADBE Vector Filter - Trim"); }
    function grupoEn(padre, nombre) { var g = cont(padre).addProperty("ADBE Vector Group"); g.name = nombre; return g; }

    // ---------- texto ----------
    function crearTexto(comp, txt, fuente, tam, color, tracking, nombre, centrado) {
        var l = comp.layers.addText(txt);
        l.name = nombre;
        var p = l.property("ADBE Text Properties").property("ADBE Text Document");
        var d = p.value;
        try { d.resetCharStyle(); d.resetParagraphStyle(); } catch (e) {}
        d.text = txt;
        d.font = fuente;
        d.fontSize = tam;
        d.applyFill = true;
        d.fillColor = color;
        d.applyStroke = false;
        d.tracking = tracking || 0;
        d.justification = centrado ? ParagraphJustification.CENTER_JUSTIFY : ParagraphJustification.LEFT_JUSTIFY;
        p.setValue(d);
        return l;
    }

    function brillo(layer) {
        if (esVerde()) { return; }          // con chroma, sin glow (mancha el verde)
        try { layer.property("ADBE Effect Parade").addProperty("ADBE Glo2"); } catch (e) {}
    }

    // =====================================================================
    // FONDOS
    // =====================================================================
    function estrellas(comp) {
        var l = capaForma(comp, N("ESTRELLAS")), g = grupo(l, "ESTRELLAS"), i, s;
        for (i = 0; i < 130; i++) {
            s = 2 + Math.random() * 4;
            elipse(g, [s, s], [Math.random() * 2400 - 1100, Math.random() * 1080 - 540]);
        }
        relleno(g, hex(CONFIG.colores.blanco), 100);
        tr(l, "ADBE Opacity").expression = "75 + 25*Math.sin(time*2.2)";
        tr(l, "ADBE Position").expression = "value + [-time*14, 0]";
        return l;
    }

    function ponerFondo(comp, completo, fondo) {
        var l, f = fondo || CONFIG.fondo;
        if (completo) {
            estrellas(comp).moveToEnd();
            l = comp.layers.addSolid(hex(CONFIG.colores.espacio), N("FONDO_ESPACIO"), comp.width, comp.height, 1, comp.duration);
            l.moveToEnd();
        } else if (f === "espacio") {
            estrellas(comp).moveToEnd();
            l = comp.layers.addSolid(hex(CONFIG.colores.espacio), N("FONDO_ESPACIO"), comp.width, comp.height, 1, comp.duration);
            l.moveToEnd();
        } else if (f === "verde") {
            l = comp.layers.addSolid(CONFIG.verde, N("FONDO_VERDE_CHROMA"), comp.width, comp.height, 1, comp.duration);
            l.comment = "Verde puro 0,255,0 para chroma key en OBS";
            l.moveToEnd();
        }
    }

    // =====================================================================
    // MÓDULO OVNI (dibujo de línea blanca, como la referencia)
    // =====================================================================
    function ovni(comp, nombre) {
        var cs = CONFIG.colores;
        var l = capaForma(comp, nombre || N("OVNI"));
        // luces del borde (arriba en la lista = se dibuja encima)
        var gl = grupo(l, "LUCES");
        elipse(gl, [14, 14], [-64, 6]);
        elipse(gl, [14, 14], [0, 13]);
        elipse(gl, [14, 14], [64, 6]);
        relleno(gl, hex(cs.magenta), 100);
        gtr(gl, "ADBE Vector Group Opacity").expression = "Math.floor(time*4)%2==0 ? 100 : 35";
        // brillo de la cúpula
        var gb = grupo(l, "BRILLO");
        trazo(gb, [[20, -60], [40, -40]], false, [[0, 0], [2, -12]], [[12, 2], [0, 0]]);
        contorno(gb, hex(cs.blanco), 5);
        // platillo
        var gp = grupo(l, "PLATILLO");
        elipse(gp, [232, 58], [0, 0]);
        contorno(gp, hex(cs.blanco), 6);
        relleno(gp, hex(cs.espacio), 100);
        // cúpula
        var gc = grupo(l, "CUPULA");
        trazo(gc, [[-64, -4], [0, -78], [64, -4]], true,
              [[0, 0], [-38, 0], [0, -42]],
              [[0, -42], [38, 0], [0, 0]]);
        contorno(gc, hex(cs.blanco), 6);
        relleno(gc, hex(cs.espacio), 100);
        // halo violeta detrás (sólido: sirve también con chroma)
        var gh = grupo(l, "HALO");
        elipse(gh, [250, 74], [0, 0]);
        contorno(gh, hex(cs.violeta), 6, 100);
        l.motionBlur = true;
        brillo(l);
        return l;
    }

    // =====================================================================
    // MÓDULO PACIENTE (alien en terapia) — dibujo original, línea blanca
    // =====================================================================
    // Cabeza de alien dentro de un grupo contenedor (se puede escalar/rotar)
    function cabezaAlien(contenedor, nombre, x, y, esc, rot) {
        var cs = CONFIG.colores;
        var h = grupo(contenedor, nombre);   // contenedor = capa de forma
        var gp = grupoEn(h, "PUPILAS");
        elipse(gp, [6, 6], [-19, -1]); elipse(gp, [6, 6], [13, -1]);
        relleno(gp, hex(cs.blanco), 100);
        var o1 = grupoEn(h, "OJO_IZQ"); elipse(o1, [28, 16], [0, 0]); relleno(o1, hex(cs.espacio), 100);
        gtr(o1, "ADBE Vector Position").setValue([-16, 2]); gtr(o1, "ADBE Vector Rotation").setValue(28);
        var o2 = grupoEn(h, "OJO_DER"); elipse(o2, [28, 16], [0, 0]); relleno(o2, hex(cs.espacio), 100);
        gtr(o2, "ADBE Vector Position").setValue([16, 2]); gtr(o2, "ADBE Vector Rotation").setValue(-28);
        var gb = grupoEn(h, "BOCA");
        trazo(gb, [[-6, 26], [6, 26]], false, [[0, 0], [-4, 3]], [[4, 3], [0, 0]]);
        contorno(gb, hex(cs.espacio), 3);
        var gc = grupoEn(h, "CABEZA");
        trazo(gc, [[0, -46], [40, -2], [0, 44], [-40, -2]], true,
              [[-30, 0], [4, -22], [16, -4], [4, 24]],
              [[30, 0], [-4, 24], [-16, -4], [-4, -22]]);
        contorno(gc, hex(cs.blanco), 5);
        relleno(gc, hex(cs.menta), 100);
        gtr(h, "ADBE Vector Position").setValue([x, y]);
        gtr(h, "ADBE Vector Scale").setValue([esc * 100, esc * 100]);
        if (rot) { gtr(h, "ADBE Vector Rotation").setValue(rot); }
        return h;
    }

    // Paciente recostado en el diván con burbuja de pensamiento (capa de forma)
    function paciente(comp, nombre) {
        var cs = CONFIG.colores, B = hex(cs.blanco);
        var l = capaForma(comp, nombre);
        function forma(n, verts, cerrado, inT, outT, colorRelleno, w) {
            var g = grupo(l, n);
            trazo(g, verts, cerrado, inT, outT);
            contorno(g, B, w || 5);
            if (colorRelleno) { relleno(g, hex(colorRelleno), 100); }
            return g;
        }
        function caja(n, size, pos, rr, color) {
            var g = grupo(l, n); rect(g, size, pos, rr); contorno(g, B, 5); relleno(g, hex(color), 100); return g;
        }
        cabezaAlien(l, "CABEZA_PACIENTE", -110, -46, 1.05, -62);
        forma("BRAZO", [[10, -30], [54, -12]], false, [[0, 0], [-14, 8]], [[10, 24], [0, 0]]);
        forma("CUERPO", [[-70, -14], [140, -26], [140, -4]], true,
              [[30, 20], [-60, -18], [16, -2]], [[30, -30], [16, 6], [-60, 8]], cs.menta);
        var gpt = grupo(l, "PATAS");
        trazo(gpt, [[-170, 64], [-180, 88]], false); trazo(gpt, [[170, 64], [180, 88]], false);
        contorno(gpt, B, 6);
        caja("APOYABRAZOS", [40, 70], [184, 13], 16, cs.violeta);
        caja("COJIN", [300, 32], [18, 8], 14, cs.magenta);
        caja("ASIENTO", [396, 46], [-2, 41], 18, cs.violeta);
        forma("RESPALDO", [[-196, 40], [-150, -70], [-128, -70], [-128, 40]], true,
              [[0, 0], [-38, 0], [0, 0], [0, 0]], [[-10, -70], [0, 0], [0, 0], [0, 0]], cs.violeta);
        var gbu = grupo(l, "BURBUJA");
        var gpu = grupoEn(gbu, "PUNTOS");
        elipse(gpu, [12, 12], [16, -182]); elipse(gpu, [12, 12], [40, -182]); elipse(gpu, [12, 12], [64, -182]);
        relleno(gpu, hex(cs.rayo), 100);
        gtr(gpu, "ADBE Vector Group Opacity").expression = 'Math.sin(time*2) > -0.3 ? 100 : 25';
        var gnb = grupoEn(gbu, "NUBE");
        elipse(gnb, [14, 14], [-46, -118]); elipse(gnb, [22, 22], [-22, -146]); elipse(gnb, [124, 72], [40, -182]);
        contorno(gnb, B, 5); relleno(gnb, hex(cs.espacio), 100);
        l.motionBlur = true;
        return l;
    }

    // =====================================================================
    // ESCENA DE SESIÓN (terapeuta + paciente alien) — datos en ESCENA_DATOS
    // =====================================================================
    var ANIM_ESCENA = {
        gesto: ["rot", "Math.sin(time*2.2)*12"],
        cabezaAlien: ["rot", "Math.sin(time*1.7)*4"],
        cabezaTerapeuta: ["rot", "Math.sin(time*1.3)*4"],
        lapiz: ["rot", "Math.sin(time*12)*5"],
        globo: ["esc", "var s=100+Math.sin(time*3)*4;[s,s]"],
        boca: ["esc", "[100,(0.35+Math.abs(Math.sin(time*9))*0.75)*100]"]
    };
    function colorEscena(n) { return hex(CONFIG.colores[n] || CONFIG.colores.blanco); }
    function dibujarPiezas(capa, padre, lista) {
        var i, p, g, j, sp;
        for (i = 0; i < lista.length; i++) {
            p = lista[i];
            g = padre ? grupoEn(padre, p.k === "g" ? p.n : "PIEZA " + (i + 1)) : grupo(capa, p.k === "g" ? p.n : "PIEZA " + (i + 1));
            if (p.k === "g") {
                gtr(g, "ADBE Vector Anchor").setValue(p.o);
                gtr(g, "ADBE Vector Position").setValue(p.o);
                var an = ANIM_ESCENA[p.n];
                if (an) {
                    if (an[0] === "rot") { gtr(g, "ADBE Vector Rotation").expression = an[1]; }
                    else { gtr(g, "ADBE Vector Scale").expression = an[1]; }
                }
                dibujarPiezas(capa, g, p.h);
                continue;
            }
            if (p.k === "rect") { rect(g, p.t, p.p, p.r || 0); }
            else if (p.k === "ell") { elipse(g, p.t, p.p); }
            else if (p.k === "path") {
                for (j = 0; j < p.sp.length; j++) { sp = p.sp[j]; trazo(g, sp.v, sp.c, sp.i, sp.o); }
            }
            if (p.s && p.w) { contorno(g, colorEscena(p.s), p.w, 100); }
            if (p.f) { relleno(g, colorEscena(p.f), 100); }
        }
    }
    // capa con la escena completa (centrada en 0,0; 760×380 al 100 %)
    function escenaSesion(comp, nombre, ancho) {
        var l = capaForma(comp, nombre || N("ESCENA_SESION"));
        dibujarPiezas(l, null, ESCENA_DATOS.escena);
        var e = (ancho || 760) / 760 * 100;
        tr(l, "ADBE Scale").setValue([e, e, 100]);
        return l;
    }
    // ícono: cabeza de la terapeuta (para el GC de la psicóloga)
    function iconoTerapeuta(comp, nombre, tam) {
        var l = capaForma(comp, nombre), g = grupo(l, "TERAPEUTA");
        dibujarPiezas(l, g, ESCENA_DATOS.terapeuta);
        gtr(g, "ADBE Vector Position").setValue([-270, 88]);
        var e = tam / 108 * 100;
        tr(l, "ADBE Scale").setValue([e, e, 100]);
        return l;
    }

    // =====================================================================
    // NÚCLEO: ABDUCCIÓN  (ovni + rayo + barra + subbarra + textos)
    // Lo usan: GC, CORTINA TÍTULO, AVISO, VOLVEMOS, APERTURA, CIERRE, MULTIPLEX
    // =====================================================================
    function abduccion(o) {
        var cs = CONFIG.colores;
        var S = o.S || 100, T = o.tIn || 0, X = o.tOut;
        var comp = nuevaComp(o.nombre, o.dur);
        var C = N("CONTROL"), G = N("GRUPO"), U = N("OVNI"), TT = N("TITULO"), TS = N("SUBTITULO");
        var barH = o.barH || Math.round(o.tamT * 1.65);
        var subH = Math.round(o.tamS * 1.7);
        var mT = Math.round(o.tamT * 0.75), mS = Math.round(o.tamS * 0.9);
        var ufoY = o.barY - barH / 2 - o.rayoLargo - 20 * S / 100;
        var hoverY = o.barY - barH / 2 - 18 * S / 100;
        var subY = barH / 2 + subH / 2 + 6;
        var icoW = o.icono ? Math.round(barH * 0.9) : 0;
        var maxW = o.maxW || 0;

        // ---------- CONTROL ----------
        var ctrl = comp.layers.addNull(o.dur);
        ctrl.name = C;
        var pAncho = slider(ctrl, "Ancho barra", 400);
        var pSub = slider(ctrl, "Ancho sub", 200);
        slider(ctrl, "Margen", mT);
        slider(ctrl, "Ancho minimo", o.minW || 360);
        slider(ctrl, "Alto barra", barH);
        slider(ctrl, "Borde izquierdo", CONFIG.bordeIzq);
        check(ctrl, "Centrado", o.centrado ? 1 : 0);
        slider(ctrl, "Bamboleo", 1);
        var pLado = slider(ctrl, "OVNI lado", 0);
        check(ctrl, "OVNI en pausa", o.ovniPausa === false ? 0 : 1);
        colorCtrl(ctrl, "Color rayo", hex(cs.rayo));
        colorCtrl(ctrl, "Color barra", hex(o.colorBarra || cs.espacio));
        colorCtrl(ctrl, "Color sub", hex(o.colorSub || cs.violeta));
        colorCtrl(ctrl, "Color acento", hex(o.colorAcento || cs.magenta));

        var EC = 'var c=thisComp.layer(' + q(C) + ');';
        var EW = EC + 'var w=c.effect("Ancho barra")(1);var ws=c.effect("Ancho sub")(1);var cen=c.effect("Centrado")(1);';
        function col(n) { return 'thisComp.layer(' + q(C) + ').effect(' + q(n) + ')(1)'; }

        // ---------- GRUPO (null padre de barra y textos) ----------
        var g = comp.layers.addNull(o.dur);
        g.name = G;
        tr(g, "ADBE Anchor Point").setValue([0, 0]);
        tr(g, "ADBE Position").setValue([960, o.barY]);

        // ---------- BARRA ----------
        var barra = capaForma(comp, N("BARRA"));
        var ga = grupo(barra, "ACENTO");
        var ra = rect(ga, [14, barH], [0, 0], 0);
        ra.property("ADBE Vector Rect Position").expression = EW + '[-w/2+7, 0]';
        relleno(ga, hex(cs.magenta), 100).property("ADBE Vector Fill Color").expression = col("Color acento");
        var gli = grupo(barra, "LINEA");
        var rl = rect(gli, [400, 5], [0, 0], 0);
        rl.property("ADBE Vector Rect Size").expression = EW + '[w, 5]';
        rl.property("ADBE Vector Rect Position").expression = '[0, ' + (-barH / 2 + 2.5) + ']';
        relleno(gli, hex(cs.violeta), 100).property("ADBE Vector Fill Color").expression = col("Color sub");
        var gba = grupo(barra, "BASE");
        var rb = rect(gba, [400, barH], [0, 0], 6);
        rb.property("ADBE Vector Rect Size").expression = EW + '[w, ' + barH + ']';
        relleno(gba, hex(cs.espacio), 100).property("ADBE Vector Fill Color").expression = col("Color barra");
        barra.parent = g;
        tr(barra, "ADBE Position").setValue([0, 0]);

        // ---------- SUBBARRA ----------
        var sb = capaForma(comp, N("SUBBARRA"));
        var gs = grupo(sb, "SUB");
        var rs = rect(gs, [200, subH], [0, 0], 4);
        rs.property("ADBE Vector Rect Size").expression = EW + '[ws, ' + subH + ']';
        rs.property("ADBE Vector Rect Position").expression = EW + '[cen==1 ? 0 : -w/2+ws/2, 0]';
        relleno(gs, hex(cs.violeta), 100).property("ADBE Vector Fill Color").expression = col("Color sub");
        sb.parent = g;
        tr(sb, "ADBE Position").setValue([0, subY]);

        // ---------- TEXTOS ----------
        var tt = crearTexto(comp, o.titulo, CONFIG.fuentes.titulo, o.tamT, hex(cs.blanco), o.trackT || 20, TT, false);
        tt.parent = g;
        var ts = crearTexto(comp, String(o.sub || "").toUpperCase(), CONFIG.fuentes.texto, o.tamS, hex(o.colorTextoSub || cs.blanco), 80, TS, false);
        ts.parent = g;
        tt.motionBlur = ts.motionBlur = barra.motionBlur = sb.motionBlur = true;

        // ---------- ICONO (paciente alien o terapeuta) en la barra ----------
        var ico = null;
        if (o.icono === "terapeuta") {
            ico = iconoTerapeuta(comp, N("ICONO_TERAPEUTA"), icoW);
            ico.parent = g;
            ico.moveBefore(tt);
        } else if (o.icono) {
            ico = capaForma(comp, N("ICONO_PACIENTE"));
            cabezaAlien(ico, "ALIEN", 0, 0, icoW / 100, 0);
            ico.parent = g;
            ico.moveBefore(tt);
        }
        // ---------- ETIQUETA DE SECCIÓN (titulares) ----------
        var etqT = null, etqB = null;
        if (o.etiqueta) {
            var colEt = { TALCA: [cs.magenta, cs.blanco], CHILE: [cs.violeta, cs.blanco], INTERNACIONAL: [cs.rayo, cs.espacio] }[o.etiqueta] || [cs.violeta, cs.blanco];
            etqT = crearTexto(comp, o.etiqueta, CONFIG.fuentes.titulo, 21, hex(colEt[1]), 140, N("ETIQUETA_SECCION"), false);
            etqB = capaForma(comp, N("ETIQUETA_SECCION_FONDO"));
            var ge = grupo(etqB, "PILDORA");
            var re = rect(ge, [200, 38], [0, 0], 4);
            var exE = 'var w=thisComp.layer(' + q(N("ETIQUETA_SECCION")) + ').sourceRectAtTime(0,false).width+36;';
            re.property("ADBE Vector Rect Size").expression = exE + '[w,38]';
            re.property("ADBE Vector Rect Position").expression = exE + '[w/2,0]';
            relleno(ge, hex(colEt[0]), 100);
            etqB.parent = g; etqT.parent = g;
            etqB.moveAfter(etqT);
        }
        // ---------- ILUSTRACIÓN (sesión: terapeuta + paciente alien) ----------
        var ilus = null, anchoIlus = o.anchoIlus || 620;
        if (o.ilustracion === "sesion" && !(o.usarLogo && CONFIG.logoArchivo)) {
            ilus = escenaSesion(comp, N("ESCENA_SESION"), anchoIlus);
            ilus.parent = g;
        }

        // ---------- RAYO ----------
        var r = capaForma(comp, N("RAYO"));
        var EB = 'var u=thisComp.layer(' + q(U) + ');var g=thisComp.layer(' + q(G) + ');var c=thisComp.layer(' + q(C) + ');' +
                 'var s=u.transform.scale[0]/100;var top=u.toComp([0,20]);' +
                 'var bot=g.toComp([0,-c.effect("Alto barra")(1)/2]);' +
                 'var H=Math.max(1,bot[1]-top[1]);var dx=bot[0]-top[0];' +
                 'var tw=90*s;var bw=Math.max(tw,c.effect("Ancho barra")(1)*g.transform.scale[0]/100);' +
                 'var kk=transform.scale[1]/100; bw=tw+(bw-tw)*kk;';
        var i, gr, er;
        // anillos de energía (bajan en la entrada, suben en la salida)
        for (i = 0; i < 5; i++) {
            gr = grupo(r, "ANILLO " + (i + 1));
            er = elipse(gr, [90, 26], [0, 0]);
            var EF = EB + 'var f=((' + i + '+time*1.4)%5)/5; if(time>' + X + ') f=1-f;';
            er.property("ADBE Vector Ellipse Size").expression = EF + 'var ww=tw+(bw-tw)*f; [ww, ww*0.16+12]';
            er.property("ADBE Vector Ellipse Position").expression = EF + '[dx*f, H*f]';
            contorno(gr, hex(cs.rayo), 4, 100).property("ADBE Vector Stroke Color").expression = col("Color rayo");
            gtr(gr, "ADBE Vector Group Opacity").expression = EF + 'Math.sin(f*Math.PI)*100';
        }
        if (esVerde()) {
            // líneas interiores opacas (dan textura sin semitransparencias)
            var gln = grupo(r, "LINEAS");
            var qs = [-0.25, 0, 0.25], j, pth;
            for (j = 0; j < qs.length; j++) {
                pth = trazo(gln, [[0, 0], [0, 100]], false);
                pth.property("ADBE Vector Shape").expression = EB + 'var k=' + qs[j] + ';createPath([[tw*k,0],[dx+bw*k,H]],[],[],false)';
            }
            contorno(gln, hex(cs.rayo), 3, 100).property("ADBE Vector Stroke Color").expression = col("Color rayo");
        } else {
            var gn = grupo(r, "NUCLEO");
            trazo(gn, [[0, 0], [1, 0], [1, 1]], true).property("ADBE Vector Shape").expression =
                EB + 'var k=0.3;createPath([[-tw*k,0],[tw*k,0],[dx+bw*k*0.5,H],[dx-bw*k*0.5,H]],[],[],true)';
            relleno(gn, hex(cs.blanco), 55);
        }
        var gco = grupo(r, "CONO");
        trazo(gco, [[0, 0], [1, 0], [1, 1]], true).property("ADBE Vector Shape").expression =
            EB + 'createPath([[-tw/2,0],[tw/2,0],[dx+bw/2,H],[dx-bw/2,H]],[],[],true)';
        contorno(gco, hex(cs.rayo), 5, 100).property("ADBE Vector Stroke Color").expression = col("Color rayo");
        relleno(gco, hex(cs.rayo), esVerde() ? 0 : 35).property("ADBE Vector Fill Color").expression = col("Color rayo");
        tr(r, "ADBE Position").expression = 'var p=thisComp.layer(' + q(U) + ').toComp([0,20]);[p[0],p[1]]';
        tr(r, "ADBE Opacity").expression = 'transform.scale[1] < 1 ? 0 : value';
        tr(r, "ADBE Scale").setValue([100, 0, 100]);
        brillo(r);

        // ---------- OVNI ----------
        var u = ovni(comp, U);

        ctrl.moveToBeginning();
        if (!o.sinFondo) { ponerFondo(comp, o.completo, o.fondo); }

        // ---------- EXPRESIONES (ya existen todas las capas) ----------
        pAncho.expression = 'var L=thisComp.layer(' + q(TT) + ');var t=L.sourceRectAtTime(0,false).width*L.transform.scale[0]/100;' +
                            'Math.max(t+effect("Margen")(1)*2+' + icoW + ', effect("Ancho minimo")(1))';
        if (maxW) {
            // si el texto es muy largo se achica hasta caber en maxW
            tr(tt, "ADBE Scale").expression = 'var w0=sourceRectAtTime(0,false).width;' +
                'var m=thisComp.layer(' + q(C) + ').effect("Margen")(1);' +
                'var s=Math.min(100,(' + maxW + '-m*2-' + icoW + ')/Math.max(1,w0)*100);[s,s]';
        }
        if (ico) { tr(ico, "ADBE Position").expression = EW + '[-w/2+' + Math.round(mT * 0.5 + 6 + icoW / 2) + ', 0]'; }
        if (etqT) {
            tr(etqB, "ADBE Position").expression = EW + '[-w/2, ' + (-barH / 2 - 27) + ']';
            tr(etqT, "ADBE Position").expression = EW + '[-w/2+18, ' + (-barH / 2 - 27 + 8) + ']';
        }
        if (ilus) {
            tr(ilus, "ADBE Position").expression = '[0, ' + Math.round(-barH / 2 - 24 - 190 * anchoIlus / 760) + '+Math.sin(time*1.6)*6]';
        }
        pSub.expression = 'var t=thisComp.layer(' + q(TS) + ').sourceRectAtTime(0,false).width;' +
                          't>2 ? t+' + (mS * 2) + ' : 0';
        tr(g, "ADBE Position").expression = EW +
            'var x = cen==1 ? thisComp.width/2 : c.effect("Borde izquierdo")(1)+w/2; [x, value[1]]';
        tr(tt, "ADBE Position").expression = EW +
            'var sc=transform.scale[0]/100; var wt=sourceRectAtTime(0,false).width*sc;' +
            (maxW && o.centrado ? 'var x0 = -wt/2 + ' + (icoW / 2) + ';' : 'var x0 = -w/2 + c.effect("Margen")(1) + ' + icoW + ';') +
            '[x0, ' + Math.round(o.tamT * 0.36) + '*sc]';
        tr(ts, "ADBE Position").expression = EW +
            'var x0 = cen==1 ? -ws/2 : -w/2; [x0+' + mS + ', ' + Math.round(subY + o.tamS * 0.36) + ']';
        tr(sb, "ADBE Opacity").expression = EC + 'c.effect("Ancho sub")(1) > 1 ? value : 0';
        tr(u, "ADBE Position").expression = EW +
            'var b=c.effect("Bamboleo")(1);var lado=c.effect("OVNI lado")(1);' +
            'var cx=thisComp.layer(' + q(G) + ').transform.position[0];' +
            '[cx+value[0]+lado*(w/2-20), value[1]+Math.sin(time*3.1)*6*b]';
        tr(u, "ADBE Rotate Z").expression = EC + 'value + Math.sin(time*2.3)*3*c.effect("Bamboleo")(1)';
        var a1 = T + 2.0, b1 = X + 0.3;
        tr(u, "ADBE Opacity").expression = EC + 'var on=c.effect("OVNI en pausa")(1);' +
            'if(on==1){value}else{var a=' + a1 + ',b=' + b1 + ';' +
            'var k=time<a?1:(time<a+0.3?1-(time-a)/0.3:(time<b-0.3?0:(time<b?(time-(b-0.3))/0.3:1)));value*k}';

        // ---------- ANIMACIÓN ----------
        u.inPoint = T; r.inPoint = T;
        var sm = S / 100;
        anim(tr(u, "ADBE Position"), [
            [T, [-1500, ufoY - 500]], [T + 0.7, [0, ufoY]],
            [T + 1.9, [0, ufoY]], [T + 2.5, [0, hoverY]],
            [X, [0, hoverY]], [X + 0.5, [0, ufoY]],
            [X + 1.6, [0, ufoY]], [X + 2.0, [1500, ufoY - 500]]
        ]);
        anim(tr(u, "ADBE Scale"), [
            [T, [S * 0.4, S * 0.4, 100]], [T + 0.7, [S, S, 100]],
            [T + 1.9, [S, S, 100]], [T + 2.5, [S * 0.5, S * 0.5, 100]],
            [X, [S * 0.5, S * 0.5, 100]], [X + 0.5, [S, S, 100]],
            [X + 1.6, [S, S, 100]], [X + 2.0, [S * 0.4, S * 0.4, 100]]
        ]);
        anim(tr(u, "ADBE Rotate Z"), [[T, -25], [T + 0.7, 0], [X + 1.6, 0], [X + 2.0, 20]]);
        anim(pLado, [[T + 1.9, 0], [T + 2.5, 1], [X, 1], [X + 0.5, 0]]);

        anim(tr(r, "ADBE Scale"), [
            [T + 0.7, [100, 0, 100]], [T + 1.0, [100, 100, 100]],
            [T + 1.6, [100, 100, 100]], [T + 1.85, [100, 0, 100]],
            [X + 0.5, [100, 0, 100]], [X + 0.8, [100, 100, 100]],
            [X + 1.4, [100, 100, 100]], [X + 1.6, [100, 0, 100]]
        ]);

        anim(tr(g, "ADBE Position"), [
            [T + 0.95, [960, ufoY + 40 * sm]], [T + 1.45, [960, o.barY]],
            [X + 0.85, [960, o.barY]], [X + 1.4, [960, ufoY + 40 * sm]]
        ]);
        anim(tr(g, "ADBE Scale"), [
            [T + 0.95, [8, 8, 100]], [T + 1.45, [100, 100, 100]],
            [X + 0.85, [100, 100, 100]], [X + 1.4, [5, 5, 100]]
        ]);
        var capasBarra = [barra, sb], k;
        for (k = 0; k < capasBarra.length; k++) {
            anim(tr(capasBarra[k], "ADBE Opacity"), [[T + 0.95, 0], [T + 1.05, 100], [X + 1.25, 100], [X + 1.4, 0]], true);
        }
        var capasTexto = [tt, ts];
        if (ico) { capasTexto.push(ico); }
        if (etqT) { capasTexto.push(etqT); capasTexto.push(etqB); }
        if (ilus) { capasTexto.push(ilus); }
        for (k = 0; k < capasTexto.length; k++) {
            anim(tr(capasTexto[k], "ADBE Opacity"), [
                [T + 1.3, 0], [T + 1.36, 100], [T + 1.42, 25], [T + 1.5, 100],
                [X + 1.1, 100], [X + 1.25, 0]
            ], true);
        }

        // ---------- LOGO opcional (apertura / cierre) ----------
        if (o.usarLogo && CONFIG.logoArchivo) {
            var lg = ponerLogo(comp, 260);
            if (lg) {
                lg.parent = g;
                tr(lg, "ADBE Position").setValue([0, -barH / 2 - 170]);
                anim(tr(lg, "ADBE Opacity"), [[T + 1.3, 0], [T + 1.6, 100], [X + 1.1, 100], [X + 1.3, 0]]);
            }
        }

        marcador(comp, T, "ENTRADA");
        marcador(comp, T + 2.5, "PAUSA");
        marcador(comp, X, "SALIDA");
        return comp;
    }

    // ---------- logo importado ----------
    var logoItem = null;
    function ponerLogo(comp, altoMax) {
        try {
            if (!logoItem) {
                var io = new ImportOptions(CONFIG.logoArchivo);
                logoItem = app.project.importFile(io);
                logoItem.parentFolder = carpeta(N("RECURSOS"));
            }
            var l = comp.layers.add(logoItem);
            l.name = N("LOGO");
            var e = Math.min(100, altoMax / logoItem.height * 100);
            tr(l, "ADBE Scale").setValue([e, e, 100]);
            return l;
        } catch (err) { return null; }
    }

    // =====================================================================
    // GRÁFICAS
    // =====================================================================
    function crearGC(nombre, cargo, icono) {
        var limpio = nombre.replace(/[^A-Za-z0-9áéíóúñÁÉÍÓÚÑ ]/g, "");
        var o = { nombre: "GC_" + limpio, titulo: nombre, sub: cargo,
            tamT: 54, tamS: 28, barY: 880, rayoLargo: 230, S: 100,
            tIn: 0, tOut: CONFIG.dur.gc - 2, dur: CONFIG.dur.gc };
        if (icono === "alien" || icono === 1) { o.icono = "alien"; o.colorSub = CONFIG.colores.magenta; o.colorAcento = CONFIG.colores.menta; }
        else if (icono === "terapeuta") { o.icono = "terapeuta"; o.colorAcento = CONFIG.colores.violetaClaro; }
        return abduccion(o);
    }

    // ---------- AVANCE INFORMATIVO ----------
    function crearAvance() {
        return abduccion({ nombre: "AVANCE_PORTADA", titulo: CONFIG.avance.titulo, sub: CONFIG.avance.sub,
            tamT: 84, tamS: 30, barY: 600, rayoLargo: 260, S: 140, centrado: true, minW: 900, maxW: 1720,
            tIn: 0, tOut: CONFIG.dur.avance - 2, dur: CONFIG.dur.avance });
    }
    function crearTitular(i) {
        var h = CONFIG.titulares[i], n = (i < 9 ? "0" : "") + (i + 1), X = CONFIG.dur.titular - 2;
        var lugarTxt = String(h[2] || ""), ciudad = lugarTxt.split(",")[0], limpio = ciudad.replace(/[^A-Za-z0-9áéíóúñÁÉÍÓÚÑ ]/g, "");
        var comp = abduccion({ nombre: "TITULAR_" + n + (limpio ? "_" + limpio : ""), titulo: h[0], sub: h[1], fondo: h[3] || "",
            tamT: 64, tamS: 30, barY: 850, rayoLargo: 300, S: 120, centrado: true, minW: 900, maxW: 1720,
            tIn: 0, tOut: X, dur: CONFIG.dur.titular });
        if (lugarTxt) { lugarEsquina(comp, lugarTxt, 1.0, X + 1.2); }
        return comp;
    }
    // Esquina superior derecha: pin + «Ciudad» + «REGIÓN»
    function lugarEsquina(comp, texto, tIn, tOut) {
        var cs = CONFIG.colores, i = texto.indexOf(",");
        var a = i >= 0 ? trim(texto.substr(0, i)) : trim(texto), b = i >= 0 ? trim(texto.substr(i + 1)).toUpperCase() : "";
        var t1 = crearTexto(comp, a, CONFIG.fuentes.titulo, 34, hex(cs.blanco), 40, N("LUGAR_CIUDAD"), false);
        var t2 = crearTexto(comp, b, CONFIG.fuentes.texto, 19, hex(cs.menta), 120, N("LUGAR_REGION"), false);
        var pl = capaForma(comp, N("LUGAR_PLACA"));
        var gpin = grupo(pl, "PIN");
        trazo(gpin, [[0, 29], [-19, 5], [0, -27], [19, 5]], true, [[0, 0], [0, 12], [-11, 0], [0, -14]], [[0, 0], [0, -14], [11, 0], [0, 12]]);
        elipse(gpin, [16, 16], [0, -5]);
        contorno(gpin, hex(cs.blanco), 4, 100); relleno(gpin, hex(cs.magenta), 100);
        var gp = grupo(pl, "PLACA");
        var rp = rect(gp, [400, 112], [0, 0], 56);
        contorno(gp, hex(cs.violeta), 4, 100); relleno(gp, hex(cs.espacio), 100);
        // ancho automático según el texto más largo; alineado a la derecha (margen 96)
        var EWL = 'var w=Math.max(thisComp.layer(' + q(N("LUGAR_CIUDAD")) + ').sourceRectAtTime(0,false).width,thisComp.layer(' + q(N("LUGAR_REGION")) + ').sourceRectAtTime(0,false).width)+110;';
        rp.property("ADBE Vector Rect Size").expression = EWL + '[w,112]';
        rp.property("ADBE Vector Rect Position").expression = EWL + '[-w/2,0]';
        gtr(gpin, "ADBE Vector Position").expression = EWL + '[-w+46,0]';
        tr(pl, "ADBE Position").setValue([1920 - 96, 54 + 56]);
        tr(t1, "ADBE Position").expression = EWL + '[1920-96-w+82, 54+50]';
        tr(t2, "ADBE Position").expression = EWL + '[1920-96-w+82, 54+82]';
        pl.moveAfter(t2);
        var capas = [pl, t1, t2], k;
        for (k = 0; k < capas.length; k++) {
            anim(tr(capas[k], "ADBE Opacity"), [[tIn, 0], [tIn + 0.35, 100], [tOut, 100], [tOut + 0.35, 0]]);
        }
        anim(tr(pl, "ADBE Scale"), [[tIn, [20, 20, 100]], [tIn + 0.45, [100, 100, 100]], [tOut, [100, 100, 100]], [tOut + 0.35, [20, 20, 100]]]);
    }

    function crearCortinaTitulo() {
        return abduccion({ nombre: "CORTINA_TITULO", titulo: CONFIG.cortinaTitulo.titulo, sub: CONFIG.cortinaTitulo.sub,
            tamT: 72, tamS: 36, barY: 800, rayoLargo: 300, S: 130, centrado: true, minW: 700, maxW: 1720,
            tIn: 0, tOut: CONFIG.dur.titulo - 2, dur: CONFIG.dur.titulo });
    }

    function crearAviso() {
        return abduccion({ nombre: "AVISO", titulo: CONFIG.aviso.titulo, sub: CONFIG.aviso.sub,
            tamT: 50, tamS: 28, barY: 880, rayoLargo: 230, S: 100,
            colorBarra: CONFIG.colores.magenta, colorAcento: CONFIG.colores.rayo, colorSub: CONFIG.colores.espacio,
            tIn: 0, tOut: CONFIG.dur.aviso - 2, dur: CONFIG.dur.aviso });
    }

    function crearVolvemos() {
        return abduccion({ nombre: "VOLVEMOS", titulo: CONFIG.volvemos.titulo, sub: CONFIG.volvemos.sub,
            tamT: 84, tamS: 36, barY: 800, rayoLargo: 420, S: 140, centrado: true, minW: 800, maxW: 1720, ilustracion: "sesion", anchoIlus: 560,
            tIn: 0, tOut: CONFIG.dur.volvemos - 2, dur: CONFIG.dur.volvemos });
    }

    function crearApertura() {
        return abduccion({ nombre: "APERTURA", titulo: CONFIG.apertura.titulo, sub: CONFIG.apertura.sub,
            tamT: 120, tamS: 40, barY: 760, rayoLargo: 420, S: 170, centrado: true, minW: 900, maxW: 1720,
            completo: true, ovniPausa: true, usarLogo: true, ilustracion: "sesion",
            colorBarra: CONFIG.colores.espacio,
            tIn: 1.5, tOut: CONFIG.dur.apertura - 2.8, dur: CONFIG.dur.apertura });
    }

    function crearCierre() {
        return abduccion({ nombre: "CIERRE", titulo: CONFIG.cierre.titulo, sub: CONFIG.cierre.sub,
            tamT: 110, tamS: 34, barY: 760, rayoLargo: 420, S: 170, centrado: true, minW: 900, maxW: 1720,
            completo: true, usarLogo: true, ilustracion: "sesion",
            tIn: 0.5, tOut: CONFIG.dur.cierre - 2, dur: CONFIG.dur.cierre });
    }

    // ---------- CORTINA (stinger): barrido de ida y vuelta ----------
    function crearCortina() {
        var cs = CONFIG.colores, D = CONFIG.dur.cortina;
        var comp = nuevaComp("CORTINA", D);
        var U = N("OVNI");
        function panel(nombre, color, retraso) {
            var l = capaForma(comp, nombre), gp = grupo(l, "PANEL");
            var rr = rect(gp, [10, 1080], [0, 0], 0);
            var E = 'var u=thisComp.layer(' + q(U) + ');var R=Math.max(0,u.transform.position.valueAtTime(time-' + retraso + ')[0]+60);';
            rr.property("ADBE Vector Rect Size").expression = E + '[R,1080]';
            rr.property("ADBE Vector Rect Position").expression = E + '[R/2-960,0]';
            relleno(gp, hex(color), 100);
            return l;
        }
        var p2 = panel(N("CORTINA_B"), cs.magenta, 0.12);
        var p1 = panel(N("CORTINA_A"), cs.violeta, 0);
        var t = crearTexto(comp, CONFIG.programa, CONFIG.fuentes.titulo, 110, hex(cs.blanco), 60, N("CORTINA_TEXTO"), true);
        tr(t, "ADBE Position").setValue([960, 840]);
        var esc = escenaSesion(comp, N("CORTINA_ESCENA"), 760);
        tr(esc, "ADBE Position").setValue([960, 520]);
        anim(tr(esc, "ADBE Opacity"), [[0.8, 0], [1.0, 100], [1.35, 100], [1.55, 0]]);
        esc.moveBefore(t);
        anim(tr(t, "ADBE Opacity"), [[0.85, 0], [1.05, 100], [1.35, 100], [1.55, 0]]);
        anim(tr(t, "ADBE Scale"), [[0.85, [90, 90, 100]], [1.55, [104, 104, 100]]]);
        // columna de luz bajo el ovni
        var colm = capaForma(comp, N("COLUMNA")), gcl = grupo(colm, "COLUMNA");
        trazo(gcl, [[-40, 0], [40, 0], [110, 900], [-110, 900]], true);
        contorno(gcl, hex(cs.blanco), 4, 100);
        relleno(gcl, hex(cs.rayo), 100);
        tr(colm, "ADBE Position").expression = 'var p=thisComp.layer(' + q(U) + ').toComp([0,20]);[p[0],p[1]]';
        var u = ovni(comp, U);
        tr(u, "ADBE Scale").setValue([150, 150, 100]);
        anim(tr(u, "ADBE Position"), [[0, [-200, 200]], [1.1, [2150, 200]], [1.3, [2150, 200]], [2.3, [-200, 200]]]);
        tr(u, "ADBE Position").expression = 'value + [0, Math.sin(time*6)*8]';
        anim(tr(u, "ADBE Rotate Z"), [[0, 12], [1.1, 12], [1.3, -12], [2.3, -12]]);
        // orden: ovni, columna, texto, panel A, panel B
        t.moveToBeginning(); colm.moveToBeginning(); u.moveToBeginning();
        p2.moveToEnd();
        ponerFondo(comp, false);
        marcador(comp, 1.2, "PUNTO DE CORTE (1200 ms)");
        return comp;
    }

    // =====================================================================
    // TRANSICIONES VARIADAS — 2 s, punto de corte 1,0 s
    // =====================================================================
    // 1) Rayo: el haz del ovni se abre a pantalla completa
    function crearTransicionRayo() {
        var cs = CONFIG.colores, D = CONFIG.dur.transicion;
        var comp = nuevaComp("TRANSICION_RAYO", D);
        var U = N("OVNI"), C = N("CONTROL");
        var ctrl = comp.layers.addNull(D); ctrl.name = C;
        var ap = slider(ctrl, "Apertura", 0);
        var r = capaForma(comp, N("RAYO")), gr = grupo(r, "RAYO");
        var E = 'var a=thisComp.layer(' + q(C) + ').effect("Apertura")(1);var tw=110+a*2400;var bw=160+a*2600;var y0=-a*500;';
        trazo(gr, [[0, 0], [1, 0], [1, 1]], true).property("ADBE Vector Shape").expression =
            E + 'createPath([[-tw/2,y0],[tw/2,y0],[bw/2,1000],[-bw/2,1000]],[],[],true)';
        contorno(gr, hex(cs.violeta), 10, 100);
        relleno(gr, hex(cs.rayo), 100);
        tr(r, "ADBE Position").expression = 'var p=thisComp.layer(' + q(U) + ').toComp([0,20]);[p[0],p[1]]';
        var u = ovni(comp, U);
        anim(tr(u, "ADBE Position"), [[0, [960, -150]], [0.45, [960, 180]], [1.45, [960, 180]], [1.95, [960, -220]]]);
        tr(u, "ADBE Scale").setValue([120, 120, 100]);
        anim(tr(r, "ADBE Scale"), [[0.45, [100, 0, 100]], [0.65, [100, 100, 100]], [1.35, [100, 100, 100]], [1.55, [100, 0, 100]]]);
        anim(ap, [[0.65, 0], [0.95, 1], [1.1, 1], [1.35, 0]]);
        ctrl.moveToBeginning();
        ponerFondo(comp, false);
        marcador(comp, 1.0, "PUNTO DE CORTE (1000 ms)");
        return comp;
    }

    // 2) Hipnosis: espiral del terapeuta que se abre desde el centro
    function crearTransicionHipnosis() {
        var cs = CONFIG.colores, D = CONFIG.dur.transicion;
        var comp = nuevaComp("TRANSICION_HIPNOSIS", D);
        var l = capaForma(comp, N("ESPIRAL"));
        var verts = [], a;
        for (a = 0; a < Math.PI * 18; a += 0.12) { verts.push([Math.cos(a) * 21 * a, Math.sin(a) * 21 * a]); }
        var gb = grupo(l, "BORDE"); elipse(gb, [2300, 2300], [0, 0]); contorno(gb, hex(cs.rayo), 10, 100);
        var g2 = grupo(l, "ESPIRAL_FINA"); trazo(g2, verts, false); contorno(g2, hex(cs.magenta), 8, 100);
        gtr(g2, "ADBE Vector Rotation").setValue(90);
        var g1 = grupo(l, "ESPIRAL"); trazo(g1, verts, false); contorno(g1, hex(cs.violeta), 52, 100);
        var gd = grupo(l, "DISCO"); elipse(gd, [2300, 2300], [0, 0]); relleno(gd, hex(cs.espacio), 100);
        tr(l, "ADBE Position").setValue([960, 540]);
        tr(l, "ADBE Rotate Z").expression = '-time*320';
        anim(tr(l, "ADBE Scale"), [[0, [0, 0, 100]], [0.9, [100, 100, 100]], [1.1, [100, 100, 100]], [2.0, [0, 0, 100]]]);
        var al = capaForma(comp, N("OJOS_PACIENTE"));
        cabezaAlien(al, "ALIEN", 0, 0, 2.4, 0);
        tr(al, "ADBE Position").setValue([960, 540]);
        anim(tr(al, "ADBE Opacity"), [[0.6, 0], [0.85, 100], [1.2, 100], [1.45, 0]]);
        ponerFondo(comp, false);
        marcador(comp, 1.0, "PUNTO DE CORTE (1000 ms)");
        return comp;
    }

    // 3) Rorschach: mancha simétrica (distinta cada vez que se crea)
    function mancha(g, rmin, rmax) {
        var n = 9, pts = [], i, ang, rr;
        for (i = 0; i <= n; i++) {
            ang = -Math.PI / 2 + Math.PI * i / n; rr = rmin + Math.random() * (rmax - rmin);
            pts.push([Math.cos(ang) * rr, Math.sin(ang) * rr]);
        }
        var todos = pts.slice(0);
        for (i = pts.length - 2; i >= 1; i--) { todos.push([-pts[i][0], pts[i][1]]); }
        var N2 = todos.length, inT = [], outT = [], p0, p2;
        for (i = 0; i < N2; i++) {
            p0 = todos[(i - 1 + N2) % N2]; p2 = todos[(i + 1) % N2];
            outT.push([(p2[0] - p0[0]) / 6, (p2[1] - p0[1]) / 6]);
            inT.push([-(p2[0] - p0[0]) / 6, -(p2[1] - p0[1]) / 6]);
        }
        trazo(g, todos, true, inT, outT);
    }
    function crearTransicionRorschach() {
        var cs = CONFIG.colores, D = CONFIG.dur.transicion;
        var comp = nuevaComp("TRANSICION_RORSCHACH", D);
        var l = capaForma(comp, N("MANCHA")), i, x, y, r;
        var g3 = grupo(l, "CENTRO"); mancha(g3, 50, 110); relleno(g3, hex(cs.magenta), 100);
        var g2 = grupo(l, "MEDIA"); mancha(g2, 140, 230); relleno(g2, hex(cs.violeta), 100);
        var gg = grupo(l, "GOTAS");
        for (i = 0; i < 6; i++) {
            x = 330 + Math.random() * 120; y = -260 + Math.random() * 520; r = 20 + Math.random() * 52;
            elipse(gg, [r, r], [x, y]); elipse(gg, [r, r], [-x, y]);
        }
        relleno(gg, hex(cs.espacio), 100);
        var g1 = grupo(l, "MANCHA"); mancha(g1, 280, 390); contorno(g1, hex(cs.magenta), 4, 100); relleno(g1, hex(cs.espacio), 100);
        tr(l, "ADBE Position").setValue([960, 540]);
        anim(tr(l, "ADBE Scale"), [[0, [0, 0, 100]], [0.95, [440, 440, 100]], [1.05, [440, 440, 100]], [2.0, [0, 0, 100]]]);
        anim(tr(l, "ADBE Rotate Z"), [[0, -8], [2, 8]]);
        ponerFondo(comp, false);
        marcador(comp, 1.0, "PUNTO DE CORTE (1000 ms)");
        return comp;
    }

    // 4) Onda cerebral: electroencefalograma que cruza y abre una franja
    function crearTransicionOnda() {
        var cs = CONFIG.colores, D = CONFIG.dur.transicion;
        var comp = nuevaComp("TRANSICION_ONDA", D);
        function banda(n, color, keys) {
            var b = capaForma(comp, n), gb = grupo(b, "BANDA");
            var rr = rect(gb, [1920, 0], [0, 0], 0);
            relleno(gb, hex(color), 100);
            tr(b, "ADBE Position").setValue([960, 540]);
            var k = [], i;
            for (i = 0; i < keys.length; i++) { k.push([keys[i][0], [1920, keys[i][1]]]); }
            anim(rr.property("ADBE Vector Rect Size"), k);
            return b;
        }
        banda(N("BANDA_B"), cs.magenta, [[0.28, 0], [0.8, 1200], [1.2, 1200], [1.7, 0]]);
        var bA = banda(N("BANDA_A"), cs.violeta, [[0.35, 0], [0.85, 1200], [1.15, 1200], [1.6, 0]]);
        var l = capaForma(comp, N("ONDA")), go = grupo(l, "EEG");
        var v = [[-980, 0]], x = -980, amp, w;
        while (x < 980) {
            amp = 60 + Math.random() * 160; w = 50 + Math.random() * 40;
            v.push([x + 40, 0]); v.push([x + 40 + w * 0.3, -amp]); v.push([x + 40 + w * 0.6, amp * 0.7]); v.push([x + 40 + w, 0]);
            x += 40 + w + 30 + Math.random() * 60;
        }
        trazo(go, v, false);
        contorno(go, hex(cs.rayo), 10, 100);
        var tm = recorte(go);
        anim(tm.property("ADBE Vector Trim End"), [[0, 0], [0.5, 100]]);
        anim(tm.property("ADBE Vector Trim Start"), [[1.45, 0], [1.95, 100]]);
        tr(l, "ADBE Position").setValue([960, 540]);
        var t = crearTexto(comp, CONFIG.programa, CONFIG.fuentes.titulo, 84, hex(cs.blanco), 100, N("ONDA_TEXTO"), true);
        tr(t, "ADBE Position").setValue([960, 330]);
        anim(tr(t, "ADBE Opacity"), [[0.8, 0], [0.95, 100], [1.1, 100], [1.25, 0]]);
        ponerFondo(comp, false);
        marcador(comp, 1.0, "PUNTO DE CORTE (1000 ms)");
        return comp;
    }

    // ---------- TRIPLEX / DUPLEX ----------
    function crearMultiplex(nombre, titulo, etiquetas, cajas, etqArriba) {
        var cs = CONFIG.colores, D = CONFIG.dur.multiplex, X = D - 2.2;
        var comp = abduccion({ nombre: nombre, titulo: titulo, sub: "",
            tamT: 46, tamS: 24, barY: 965, rayoLargo: 50, S: 80, centrado: true, minW: 520,
            tIn: 0, tOut: X, dur: D, sinFondo: true });
        // fondo: espacio en todo el cuadro y SOLO el interior de las ventanas en verde (o transparente)
        var fm = capaForma(comp, N("FONDO_SESION")), k2, intento, sx, sy, dentro;
        var gEst = grupo(fm, "ESTRELLAS");
        for (k2 = 0; k2 < 160; k2++) {
            for (intento = 0; intento < 10; intento++) {
                sx = Math.random() * 1920; sy = Math.random() * 1080; dentro = false;
                for (var w2 = 0; w2 < cajas.length; w2++) {
                    if (sx > cajas[w2][0] - 8 && sx < cajas[w2][0] + cajas[w2][2] + 8 && sy > cajas[w2][1] - 8 && sy < cajas[w2][1] + cajas[w2][3] + 8) { dentro = true; }
                }
                if (!dentro) { break; }
            }
            if (!dentro) { var ts2 = 2 + Math.random() * 4; elipse(gEst, [ts2, ts2], [sx - 960, sy - 540]); }
        }
        relleno(gEst, hex(cs.blanco), 85);
        var gF = grupo(fm, "ESPACIO_CON_VENTANAS");
        rect(gF, [1920, 1080], [0, 0], 0);
        for (k2 = 0; k2 < cajas.length; k2++) { rect(gF, [cajas[k2][2], cajas[k2][3]], [cajas[k2][0] + cajas[k2][2] / 2 - 960, cajas[k2][1] + cajas[k2][3] / 2 - 540], 16); }
        var mg = cont(gF).addProperty("ADBE Vector Filter - Merge");
        try { mg.property("ADBE Vector Merge Type").setValue(3); } catch (e3) {}   // restar: las ventanas quedan huecas
        relleno(gF, hex(cs.espacio), 100);
        tr(fm, "ADBE Position").setValue([960, 540]);
        fm.moveToEnd();
        if (CONFIG.fondo !== "transparente") {
            var verde = comp.layers.addSolid(CONFIG.verde, N("VENTANAS_VERDE_CHROMA"), 1920, 1080, 1, D);
            verde.comment = "Verde puro solo visible dentro de las ventanas";
            verde.moveToEnd();
        }
        // chip «SESIÓN EN CURSO 00:00» con onda cerebral
        var chip = capaForma(comp, N("SESION_CHIP")), gch = grupo(chip, "PILDORA");
        var gpd = grupo(chip, "PUNTO"); elipse(gpd, [12, 12], [-196, 0]); relleno(gpd, hex(cs.magenta), 100);
        gtr(gpd, "ADBE Vector Group Opacity").expression = 'Math.floor(time*2)%2==0 ? 100 : 20';
        rect(gch, [440, 46], [0, 0], 23); contorno(gch, hex(cs.violeta), 3, 100); relleno(gch, hex(cs.espacio), 100);
        tr(chip, "ADBE Position").setValue([96 + 220, 54 + 23]);
        var chipT = crearTexto(comp, CONFIG.etiquetaSesion + "  00:00", CONFIG.fuentes.titulo, 19, hex(cs.blanco), 120, N("SESION_TEXTO"), false);
        tr(chipT, "ADBE Position").setValue([96 + 44, 54 + 30]);
        chipT.property("ADBE Text Properties").property("ADBE Text Document").expression =
            'var t=Math.max(0,Math.floor(time-0.4));var m=Math.floor(t/60),s=t%60;' +
            q(CONFIG.etiquetaSesion) + '+"  "+(m<10?"0":"")+m+":"+(s<10?"0":"")+s';
        var eeg = capaForma(comp, N("SESION_ONDA")), ge = grupo(eeg, "EEG"), vv = [], xi;
        for (xi = 0; xi < 6; xi++) { vv.push([xi * 30, 0]); vv.push([xi * 30 + 12, -11]); vv.push([xi * 30 + 17, 11]); vv.push([xi * 30 + 22, 0]); }
        trazo(ge, vv, false); contorno(ge, hex(cs.rayo), 3, 100);
        var te = recorte(ge);
        te.property("ADBE Vector Trim Start").setValue(0); te.property("ADBE Vector Trim End").setValue(40);
        te.property("ADBE Vector Trim Offset").expression = 'time*220';
        tr(eeg, "ADBE Position").setValue([96 + 330, 54 + 23]);
        var capasChip = [chip, chipT, eeg], ci;
        for (ci = 0; ci < capasChip.length; ci++) {
            anim(tr(capasChip[ci], "ADBE Opacity"), [[0.4, 0], [0.8, 100], [X, 100], [X + 0.4, 0]]);
        }
        var i, b, v, gm, gi, tp, et, lb;
        for (i = 0; i < cajas.length; i++) {
            b = cajas[i];   // [x, y, ancho, alto] esquina superior izquierda
            v = capaForma(comp, N("VENTANA_" + (i + 1)));
            gm = grupo(v, "MARCO");
            rect(gm, [b[2], b[3]], [0, 0], 16);
            contorno(gm, hex(cs.violeta), 8, 100);
            gi = grupo(v, "MARCO_INT");
            rect(gi, [b[2] - 18, b[3] - 18], [0, 0], 10);
            contorno(gi, hex(cs.blanco), 2, 100);
            // los marcos se dibujan con Recortar trazados
            var tr1 = recorte(gm);
            var tr2 = recorte(gi);
            anim(tr1.property("ADBE Vector Trim End"), [[0.3 + i * 0.15, 0], [0.9 + i * 0.15, 100], [X, 100], [X + 0.6, 0]]);
            anim(tr2.property("ADBE Vector Trim End"), [[0.4 + i * 0.15, 0], [1.0 + i * 0.15, 100], [X, 100], [X + 0.6, 0]]);
            tr(v, "ADBE Position").setValue([b[0] + b[2] / 2, b[1] + b[3] / 2]);
            // etiqueta
            et = crearTexto(comp, etiquetas[i] || "", CONFIG.fuentes.titulo, 26, hex(cs.blanco), 80, N("ETIQUETA_" + (i + 1)), false);
            var yEt = etqArriba ? b[1] - 33 : b[1] + b[3] + 34;
            tr(et, "ADBE Position").setValue([b[0] + 22, yEt + 10]);
            lb = capaForma(comp, N("ETIQUETA_BARRA_" + (i + 1)));
            var gl = grupo(lb, "BARRA");
            var rr = rect(gl, [200, 46], [0, 0], 4);
            var ex = 'var w=thisComp.layer(' + q(N("ETIQUETA_" + (i + 1))) + ').sourceRectAtTime(0,false).width+44;';
            rr.property("ADBE Vector Rect Size").expression = ex + '[w,46]';
            rr.property("ADBE Vector Rect Position").expression = ex + '[w/2,0]';
            relleno(gl, hex(cs.espacio), 100);
            var ga = grupo(lb, "ACENTO");
            rect(ga, [8, 46], [4, 0], 0);
            relleno(ga, hex(cs.magenta), 100);
            lb.moveAfter(et);
            tr(lb, "ADBE Position").setValue([b[0], yEt]);
            anim(tr(et, "ADBE Opacity"), [[0.9 + i * 0.15, 0], [1.2 + i * 0.15, 100], [X, 100], [X + 0.3, 0]]);
            anim(tr(lb, "ADBE Opacity"), [[0.8 + i * 0.15, 0], [1.1 + i * 0.15, 100], [X, 100], [X + 0.3, 0]]);
        }
        return comp;
    }

    function crearTriplex() {
        var c = CONFIG.triplex;
        // costados verticales 9:16 · centro 16:9
        return crearMultiplex("TRIPLEX", c.titulo, c.etiquetas,
            [[180, 280, 287, 510], [507, 280, 907, 510], [1454, 280, 287, 510]], true);
    }
    function crearDuplex() {
        var c = CONFIG.duplex;
        // izquierda: cámara de la psicóloga (9:16, más chica) · centro: video 16:9
        return crearMultiplex("DUPLEX", c.titulo, c.etiquetas,
            [[96, 262, 300, 533], [440, 210, 1040, 585]], true);
    }

    // ---------- BUG / LOGO de esquina ----------
    function crearBug() {
        var cs = CONFIG.colores, D = CONFIG.dur.bug;
        var comp = nuevaComp("BUG", D);
        var cx = 1920 - 96 - 180, cy = 54 + 62;
        var placa = capaForma(comp, N("BUG_PLACA")), gp = grupo(placa, "PLACA");
        rect(gp, [360, 112], [0, 0], 56);
        contorno(gp, hex(cs.violeta), 4, 100);
        relleno(gp, hex(cs.espacio), 100);
        tr(placa, "ADBE Position").setValue([cx, cy]);
        if (CONFIG.logoArchivo) {
            var lg = ponerLogo(comp, 92);
            if (lg) { tr(lg, "ADBE Position").setValue([cx + 40, cy]); }
        } else {
            var partes = CONFIG.programa.split(" ");
            var l1 = partes.shift(), l2 = partes.join(" ");
            crearTexto(comp, l1, CONFIG.fuentes.titulo, 32, hex(cs.blanco), 60, N("BUG_TEXTO_1"), false);
            tr(comp.layer(1), "ADBE Position").setValue([cx - 60, cy - 6]);
            crearTexto(comp, l2, CONFIG.fuentes.titulo, 32, hex(cs.menta), 60, N("BUG_TEXTO_2"), false);
            tr(comp.layer(1), "ADBE Position").setValue([cx - 60, cy + 32]);
        }
        var u = ovni(comp, N("BUG_OVNI"));
        tr(u, "ADBE Scale").setValue([40, 40, 100]);
        tr(u, "ADBE Position").setValue([cx - 112, cy + 4]);
        tr(u, "ADBE Position").expression = 'value + [0, Math.sin(time*3)*5]';
        tr(u, "ADBE Rotate Z").expression = 'Math.sin(time*2.2)*6';
        // EN VIVO
        var pv = capaForma(comp, N("BUG_VIVO")), gv = grupo(pv, "PILDORA");
        rect(gv, [150, 38], [0, 0], 19);
        relleno(gv, hex(cs.magenta), 100);
        var gd = grupo(pv, "PUNTO");
        elipse(gd, [12, 12], [-52, 0]);
        relleno(gd, hex(cs.blanco), 100);
        gtr(gd, "ADBE Vector Group Opacity").expression = 'Math.floor(time*2)%2==0 ? 100 : 20';
        pv.moveToBeginning();
        tr(pv, "ADBE Position").setValue([cx + 105, cy + 84]);
        var tv = crearTexto(comp, "EN VIVO", CONFIG.fuentes.titulo, 20, hex(cs.blanco), 100, N("BUG_VIVO_TEXTO"), false);
        tr(tv, "ADBE Position").setValue([cx + 70, cy + 91]);
        ponerFondo(comp, false);
        return comp;
    }

    // =====================================================================
    // CREAR
    // =====================================================================
    var MODULOS = [
        ["gc", "GC (todos los de la lista)"],
        ["avance", "Avance informativo (portada + titulares)"],
        ["apertura", "Apertura 15″ (escena de sesión)"],
        ["cortinaTitulo", "Cortina título (compilado)"],
        ["cortina", "Cortina / stinger"],
        ["transicion", "Transiciones ×4 (rayo, hipnosis, Rorschach, onda)"],
        ["triplex", "Triplex OVNI·OSNI·FANI"],
        ["duplex", "Duplex Salud Mental"],
        ["volvemos", "Volvemos enseguida"],
        ["aviso", "Aviso de avistamiento"],
        ["bug", "Bug / logo esquina"],
        ["cierre", "Cierre"]
    ];

    function crear(sel) {
        if (!app.project) { app.newProject(); }
        logoItem = null;
        app.beginUndoGroup("Terapia Espacial — crear gráficas");
        var hechas = [], ultima = null, i;
        try {
            if (sel.gc) { for (i = 0; i < CONFIG.gcs.length; i++) { ultima = crearGC(CONFIG.gcs[i][0], CONFIG.gcs[i][1], CONFIG.gcs[i][2]); hechas.push(ultima.name); } }
            if (sel.avance) {
                ultima = crearAvance(); hechas.push(ultima.name);
                for (i = 0; i < CONFIG.titulares.length; i++) { ultima = crearTitular(i); hechas.push(ultima.name); }
            }
            if (sel.apertura) { ultima = crearApertura(); hechas.push(ultima.name); }
            if (sel.cortinaTitulo) { ultima = crearCortinaTitulo(); hechas.push(ultima.name); }
            if (sel.cortina) { ultima = crearCortina(); hechas.push(ultima.name); }
            if (sel.transicion) {
                ultima = crearTransicionRayo(); hechas.push(ultima.name);
                ultima = crearTransicionHipnosis(); hechas.push(ultima.name);
                ultima = crearTransicionRorschach(); hechas.push(ultima.name);
                ultima = crearTransicionOnda(); hechas.push(ultima.name);
            }
            if (sel.triplex) { ultima = crearTriplex(); hechas.push(ultima.name); }
            if (sel.duplex) { ultima = crearDuplex(); hechas.push(ultima.name); }
            if (sel.volvemos) { ultima = crearVolvemos(); hechas.push(ultima.name); }
            if (sel.aviso) { ultima = crearAviso(); hechas.push(ultima.name); }
            if (sel.bug) { ultima = crearBug(); hechas.push(ultima.name); }
            if (sel.cierre) { ultima = crearCierre(); hechas.push(ultima.name); }
            if (ultima) { ultima.openInViewer(); }
        } catch (e) {
            alert("Terapia Espacial — error:\n" + e.toString() + "\nLínea: " + e.line + "\n\nSe crearon: " + hechas.join(", "));
        }
        app.endUndoGroup();
        return hechas;
    }

    // =====================================================================
    // PANEL ScriptUI
    // =====================================================================
    function ui(thisObj) {
        var w = (thisObj instanceof Panel) ? thisObj :
            new Window("palette", "Terapia Espacial · Paquete gráfico v" + VERSION, undefined, { resizeable: true });
        w.orientation = "column"; w.alignChildren = ["fill", "top"]; w.spacing = 6; w.margins = 10;

        var tabs = w.add("tabbedpanel"); tabs.alignChildren = ["fill", "top"];
        function campo(par, etiqueta, valor, ancho) {
            var g = par.add("group"); g.orientation = "row"; g.alignChildren = ["left", "center"];
            var st = g.add("statictext", undefined, etiqueta); st.preferredSize.width = 120;
            var e = g.add("edittext", undefined, valor); e.preferredSize.width = ancho || 240;
            return e;
        }

        // --- General ---
        var tg = tabs.add("tab", undefined, "General"); tg.alignChildren = ["fill", "top"];
        var ePrograma = campo(tg, "Programa", CONFIG.programa);
        var gF = tg.add("panel", undefined, "Fondo"); gF.orientation = "row";
        var rbV = gF.add("radiobutton", undefined, "Verde");
        var rbE = gF.add("radiobutton", undefined, "Espacio");
        var rbT = gF.add("radiobutton", undefined, "Transparente");
        rbV.value = true;
        var eFT = campo(tg, "Fuente títulos", CONFIG.fuentes.titulo);
        var eFX = campo(tg, "Fuente textos", CONFIG.fuentes.texto);
        tg.add("statictext", undefined, "Nombre PostScript. Ej: Orbitron-Bold, Exo2-Bold, Arial-BoldMT");
        var eBorde = campo(tg, "Borde izq. GC (px)", String(CONFIG.bordeIzq), 80);
        var eDurMx = campo(tg, "Duplex/triplex (s)", String(CONFIG.dur.multiplex), 80);
        var eDurTit = campo(tg, "Cada titular (s)", String(CONFIG.dur.titular), 80);
        var gL = tg.add("group");
        gL.add("statictext", undefined, "Logo (opcional)").preferredSize.width = 120;
        var eLogo = gL.add("statictext", undefined, "— sin logo —"); eLogo.preferredSize.width = 170;
        var bLogo = gL.add("button", undefined, "Elegir…");
        bLogo.onClick = function () {
            var f = File.openDialog("Elige el logo (png, ai, psd, mov)");
            if (f) { CONFIG.logoArchivo = f; eLogo.text = decodeURI(f.name); }
        };

        // --- Textos ---
        var tx = tabs.add("tab", undefined, "Textos"); tx.alignChildren = ["fill", "top"];
        tx.add("statictext", undefined, "GC — una línea por persona:  Nombre | Cargo | estilo   (estilo: terapeuta o alien)");
        var lineas = [], i;
        for (i = 0; i < CONFIG.gcs.length; i++) { lineas.push(CONFIG.gcs[i][0] + " | " + CONFIG.gcs[i][1] + (CONFIG.gcs[i][2] ? " | " + CONFIG.gcs[i][2] : "")); }
        var eGC = tx.add("edittext", undefined, lineas.join("\n"), { multiline: true });
        eGC.preferredSize = [360, 90];
        tx.add("statictext", undefined, "Titulares — una línea cada uno:  GC | subtítulo | Ciudad, Región | fondo (verde / espacio)");
        var lt = [];
        for (i = 0; i < CONFIG.titulares.length; i++) { lt.push(CONFIG.titulares[i].join(" | ")); }
        var eTit = tx.add("edittext", undefined, lt.join("\n"), { multiline: true });
        eTit.preferredSize = [360, 110];
        var eAvT = campo(tx, "Avance título", CONFIG.avance.titulo);
        var eAvS = campo(tx, "Avance subtítulo", CONFIG.avance.sub);
        var eCT = campo(tx, "Cortina título", CONFIG.cortinaTitulo.titulo);
        var eCS = campo(tx, "Cortina subtítulo", CONFIG.cortinaTitulo.sub);
        var eTT = campo(tx, "Triplex título", CONFIG.triplex.titulo);
        var eTE = campo(tx, "Triplex etiquetas", CONFIG.triplex.etiquetas.join(" | "));
        var eDT = campo(tx, "Duplex título", CONFIG.duplex.titulo);
        var eDE = campo(tx, "Duplex etiquetas", CONFIG.duplex.etiquetas.join(" | "));
        var eAT = campo(tx, "Aviso título", CONFIG.aviso.titulo);
        var eAS = campo(tx, "Aviso texto", CONFIG.aviso.sub);
        var eVT = campo(tx, "Volvemos", CONFIG.volvemos.titulo);
        var eAP = campo(tx, "Apertura sub", CONFIG.apertura.sub);
        var eCI = campo(tx, "Cierre sub", CONFIG.cierre.sub);

        // --- Colores ---
        var tc = tabs.add("tab", undefined, "Colores"); tc.alignChildren = ["fill", "top"];
        var ec = {}, kc;
        for (kc in CONFIG.colores) {
            if (CONFIG.colores.hasOwnProperty(kc)) { ec[kc] = campo(tc, kc, CONFIG.colores[kc], 100); }
        }
        tc.add("statictext", undefined, "Evita verdes saturados: se borran con el chroma.");

        // --- Crear ---
        var tk = tabs.add("tab", undefined, "Crear"); tk.alignChildren = ["fill", "top"];
        var cbs = {};
        for (i = 0; i < MODULOS.length; i++) {
            cbs[MODULOS[i][0]] = tk.add("checkbox", undefined, MODULOS[i][1]);
            cbs[MODULOS[i][0]].value = true;
        }
        var gb = tk.add("group");
        var bNada = gb.add("button", undefined, "Ninguno");
        var bTodo = gb.add("button", undefined, "Todos");
        bNada.onClick = function () { for (var k in cbs) { if (cbs.hasOwnProperty(k)) { cbs[k].value = false; } } };
        bTodo.onClick = function () { for (var k in cbs) { if (cbs.hasOwnProperty(k)) { cbs[k].value = true; } } };

        var bCrear = w.add("button", undefined, "CREAR GRÁFICAS SELECCIONADAS");
        bCrear.preferredSize.height = 34;
        var estado = w.add("statictext", undefined, "Listo. Prefijo de capas y comps: TE_", { multiline: true });
        estado.preferredSize = [360, 34];

        function separar(s) {
            var p = String(s).split("|"), out = [], j;
            for (j = 0; j < p.length; j++) { out.push(trim(p[j])); }
            return out;
        }

        bCrear.onClick = function () {
            CONFIG.programa = trim(ePrograma.text) || CONFIG.programa;
            CONFIG.fondo = rbV.value ? "verde" : (rbE.value ? "espacio" : "transparente");
            CONFIG.fuentes.titulo = trim(eFT.text); CONFIG.fuentes.texto = trim(eFX.text);
            CONFIG.bordeIzq = parseFloat(eBorde.text) || 140;
            var ls = eGC.text.split(/\r\n|\r|\n/), j, p;
            CONFIG.gcs = [];
            for (j = 0; j < ls.length; j++) {
                if (trim(ls[j]) === "") { continue; }
                p = separar(ls[j]);
                CONFIG.gcs.push([p[0], p[1] || "", /alien|paciente/i.test(p[2] || "") ? "alien" : (/terapeuta|psic/i.test(p[2] || "") ? "terapeuta" : "")]);
            }
            var lt2 = eTit.text.split(/\r\n|\r|\n/);
            CONFIG.titulares = [];
            for (j = 0; j < lt2.length; j++) {
                if (trim(lt2[j]) === "") { continue; }
                p = separar(lt2[j]);
                CONFIG.titulares.push([p[0] || "Últimas Noticias", p[1] || "", p[2] || "", /esp/i.test(p[3] || "") ? "espacio" : (/verde/i.test(p[3] || "") ? "verde" : "")]);
            }
            CONFIG.avance = { titulo: trim(eAvT.text), sub: trim(eAvS.text) };
            CONFIG.dur.multiplex = Math.max(10, parseFloat(eDurMx.text) || 60);
            CONFIG.dur.titular = Math.max(5, parseFloat(eDurTit.text) || 9);
            CONFIG.cortinaTitulo = { titulo: trim(eCT.text), sub: trim(eCS.text) };
            CONFIG.triplex = { titulo: trim(eTT.text), etiquetas: separar(eTE.text) };
            CONFIG.duplex = { titulo: trim(eDT.text), etiquetas: separar(eDE.text) };
            CONFIG.aviso = { titulo: trim(eAT.text), sub: trim(eAS.text) };
            CONFIG.volvemos = { titulo: trim(eVT.text), sub: CONFIG.programa };
            CONFIG.apertura = { titulo: CONFIG.programa, sub: trim(eAP.text) };
            CONFIG.cierre = { titulo: CONFIG.programa, sub: trim(eCI.text) };
            for (var k in ec) { if (ec.hasOwnProperty(k)) { CONFIG.colores[k] = trim(ec[k].text); } }
            var sel = {};
            for (var m in cbs) { if (cbs.hasOwnProperty(m)) { sel[m] = cbs[m].value; } }
            estado.text = "Creando… (puede tardar unos segundos)";
            var hechas = crear(sel);
            estado.text = "Listo: " + hechas.length + " comps creadas en la carpeta TE_GRAFICAS.";
        };

        if (w instanceof Window) { w.center(); w.show(); } else { w.layout.layout(true); }
        w.onResizing = w.onResize = function () { this.layout.resize(); };
        return w;
    }

    ui(thisObj);

})(this);
