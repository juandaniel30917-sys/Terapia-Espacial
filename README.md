# TERAPIA ESPACIAL — Paquete gráfico v3.1

**Concepto:** un ovni cae, enciende su rayo tractor y deja el GC. En la salida vuelve, lo absorbe y se va.
**Premisa:** una consulta de psicología para pacientes de otro planeta. Una **terapeuta** toma notas mientras un **paciente alien**, despierto en el diván, le cuenta su abducción.

**Novedades de la v3.1**
- **Botón 🌌 Fondo espacio:** activa o desactiva el fondo del espacio y queda así hasta que lo vuelvas a tocar.
- **✎ en cada botón** (o manteniendo presionado el botón): editas los textos de la gráfica, su fondo (General / Verde / Espacio) y el botón mismo (texto, color, tecla, posición). Los cambios se ven al instante, incluso al aire.
- **Todo entra y sale con un toque.** La apertura, el cierre, la cortina y las transiciones también se sacan tocando de nuevo, si te equivocas.
- **Filtros arriba de la botonera** (Todo · 📰 Últimas Noticias · GC · Títulos · Duplex/Triplex · Cortinas · Fondo y más) para encontrar rápido cada botón en el celular.
- **Titulares «Últimas Noticias»:** GC centrado con subtítulo y el lugar en la esquina superior derecha (con pin). Vienen 5 (Talca, Santiago, Barquisimeto, Buenos Aires y Hollywood), todos con fondo verde. Mientras el lugar está en pantalla, el bug se esconde.
- **Duplex:** a la izquierda la cámara de la psicóloga (vertical, más chica) y al centro el video 16:9.

**Novedades de la v3**
- **Botonera táctil para tablet y celular:** botones grandes; un toque pone la gráfica al aire y otro la saca. La pauta avanza con ◀ ▶ y hay un botón grande de LIMPIAR. Cada botón se puede editar (acción, texto, color y tecla F13–F24).
- **Sistema de salas de Completos Mojados:** la página principal (`obs/index.html`) crea una sala y entrega el **link de control** (con QR) y el **link de OBS**. Funciona por internet, desde cualquier lugar, con la misma base Supabase de Completos Mojados.
- **Escena de sesión** (terapeuta + alien conversando): aparece en la apertura, el cierre, «Volvemos», la cortina (stinger), el ícono del GC de la psicóloga y el de la página principal.
- **Fondo a elección:** 🟩 Verde, 🌌 Espacio o ◻️ Transparente.
- **Duplex y triplex:** espacio estrellado alrededor y **solo el interior de las ventanas en verde**.

```
terapia-espacial/
├── index.html                    ← redirige a obs/index.html (para GitHub Pages)
├── PROMPT_TerapiaEspacial.md     ← prompt creativo + técnico
├── after_effects/TerapiaEspacial.jsx
├── fuentes/escena-sesion.svg     ← dibujo original de la escena (fuente única)
├── herramientas/construir_escena.py  ← regenera la escena para HTML y AE
└── obs/
    ├── index.html                ← PÁGINA PRINCIPAL: crear sala, links de control y OBS, QR
    ├── panel.html                ← botonera / panel completo
    ├── salida.html               ← lo que va en OBS
    ├── conexion.js · config.js   ← salas (Supabase), servidor local y modo local
    ├── comun.js · escena.js · qrcode.js
    ├── servidor.js + INICIAR.bat / INICIAR.command  ← opción sin internet
```

---

## 1. Publicar la página (una sola vez)
1. Abre el repositorio en GitHub y ve a **Settings → Pages**.
2. En **Source** elige **Deploy from a branch**, rama **`main`** y carpeta **`/ (root)`**. Luego **Save**.
3. En 1 o 2 minutos queda en **https://juandaniel30917-sys.github.io/terapia-espacial/**.

Cada vez que subo cambios, la página se actualiza sola.

## 2. Salir al aire (por internet)
1. Abre la página principal y presiona **Crear sala**.
2. Aparecen dos links:
   - **🎛️ Control:** escanea el QR con la tablet o el celular y se abre directo la botonera. Este link da control total, así que compártelo solo con tu equipo.
   - **📺 OBS:** en OBS, ve a Fuentes → + → **Navegador**, pega el link y pon **1920 × 1080**. Deja sin marcar «Apagar la fuente cuando no esté visible».
3. La sala queda guardada en **Mis salas**. Desde ahí puedes volver a ver los links cuando quieras, y dentro del panel también están en **⋯ → Links**.
4. Arriba, la botonera muestra **en línea** y **1 salida**, que es tu OBS conectado. Si dice **sin salida**, lo que toques no se verá al aire.
5. Si un link se filtra, usa **⋯ → Links → Generar links nuevos**. Los links anteriores dejan de funcionar.

**Sin internet:** con **INICIAR.bat**, el computador de OBS hace de servidor y el celular controla por la red WiFi del estudio. En la página principal, la sección «Sin internet» muestra esos links. También existe el **modo local**, que funciona solo en el mismo navegador o como dock de OBS.

## 3. La botonera
- **Automático por equipo:** el celular y la tablet abren solo la botonera, y el computador abre el panel completo, que además trae vista previa, pauta, textos y configuración. Puedes cambiarlo en **⋯ → Este equipo**.
- **Botones iniciales:**
  - Los 4 GC.
  - Avance informativo y Siguiente titular.
  - Cortina título, Volvemos, Aviso, Triplex y Duplex.
  - Cortina, Transición (aleatoria), Hipnosis, Rorschach, Apertura y Cierre.
  - Bug, Ticker, Paso siguiente y Limpiar.
- **✏️ Editar botonera** (en el menú ⋯):
  - Toca un botón para cambiar su acción, texto, color y tecla.
  - Usa ◀ ▶ para moverlo.
  - Con «+ Agregar botón» sumas cualquier acción, por ejemplo un titular específico o una transición específica.
  - La botonera queda guardada en la sala, así que todos los equipos ven la misma.
- **Teclas:** F13–F24 (para un Stream Deck o un teclado externo), o cualquier tecla con «Otra tecla…». También funcionan Av Pág / Re Pág para la pauta y Esc para limpiar.
- **Reglas al aire:** los GC, los titulares, la cortina título, «Volvemos» y el aviso comparten la zona baja, así que uno reemplaza al otro. El triplex y el duplex también se reemplazan entre sí.

## 4. Fondos
- **Botón 🌌 Fondo espacio** en la botonera: alterna entre verde y espacio, y se mantiene.
- **Fondo por gráfica** (desde el ✎ de cada botón): «General» sigue el botón 🌌; «Verde» o «Espacio» se aplican solo mientras esa gráfica está al aire. Si hay varias al aire, gana Espacio.

| Fondo | Para qué |
|---|---|
| 🟩 Verde | Chroma key en OBS o en el ATEM. El rayo se dibuja opaco y con líneas para que el chroma quede limpio. |
| 🌌 Espacio | Fondo estrellado del programa: la salida se puede usar a pantalla completa. |
| ◻️ Transparente | OBS lo recibe sin fondo y el rayo se ve con brillo. |

En el **duplex y el triplex** siempre se ve el espacio alrededor. **Solo el interior de las ventanas va en verde**, para poner ahí las cámaras con chroma. En modo transparente, el interior queda hueco.

También puedes forzar el fondo desde el link de OBS agregando `&fondo=verde` o `&fondo=espacio` (en **⋯ → Links** hay botones para eso).

### Coordenadas de las ventanas
| | Ventana | x | y | ancho | alto |
|---|---|---|---|---|---|
| Triplex | C1 Luis (ancho) | 40 | 280 | 447 | 510 |
| | VTR avistamientos (16:9) | 507 | 280 | 907 | 510 |
| | C3 Benjamín (ancho) | 1434 | 280 | 446 | 510 |
| Duplex | Cámara de la psicóloga (9:16) | 96 | 262 | 300 | 533 |
| | Video / nota (16:9, al centro) | 440 | 210 | 1040 | 585 |

## 5. After Effects
1. Ve a **Archivo → Scripts → Ejecutar archivo de script…** y elige `after_effects/TerapiaEspacial.jsx`. También puedes copiarlo en *ScriptUI Panels* para tenerlo como panel.
2. Pestañas del panel:
   - **General:** fondo (Verde / Espacio / Transparente), fuentes, logo y duraciones.
   - **Textos:** GC en formato `Nombre | Cargo | estilo`, donde el estilo es `terapeuta` o `alien`. Titulares en formato `GC | subtítulo | Ciudad, Región | fondo` (verde o espacio).
   - **Colores.**
   - **Crear:** marca lo que necesitas y presiona el botón.
3. La escena de sesión se crea como **capas de forma editables**. El brazo del alien gesticula, la boca habla, el globo late, la terapeuta asiente y escribe: todo con expresiones.
4. Las comps se crean con el prefijo `TE_`: GC, avance y titulares, cortina título, cortina, 4 transiciones (corte a 1 s), triplex y duplex (60 s), «Volvemos», aviso, bug, apertura y cierre.

**Cambiar el dibujo de la escena:** edita `fuentes/escena-sesion.svg` y ejecuta `python3 herramientas/construir_escena.py`. Se actualizan a la vez el HTML y el script de After Effects.

## 6. Checklist antes de salir al aire
- [ ] La botonera dice **en línea · 1 salida**.
- [ ] El fondo elegido es el correcto (verde para chroma).
- [ ] El chroma está probado con el rayo encendido y con el triplex (solo las ventanas deben borrarse).
- [ ] Los nombres y titulares están revisados, con tildes.
- [ ] La cortina corta a los **1,2 s** y las transiciones a **1 s**.
