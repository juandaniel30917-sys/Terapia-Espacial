# TERAPIA ESPACIAL — Paquete gráfico v3

**Concepto:** un ovni cae, enciende su rayo tractor y deja el GC. En la salida vuelve, lo absorbe y se va.
**Premisa:** una consulta de psicología para pacientes de otro planeta. Una **terapeuta** toma notas mientras un **paciente alien**, despierto en el diván, le cuenta su abducción.

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
| Triplex | C1 Luis (vertical 9:16) | 180 | 280 | 287 | 510 |
| | VTR avistamientos (16:9) | 507 | 280 | 907 | 510 |
| | C3 Benjamín (vertical 9:16) | 1454 | 280 | 287 | 510 |
| Duplex | C1 Luis | 96 | 230 | 832 | 468 |
| | C3 Sophia | 992 | 230 | 832 | 468 |

## 5. After Effects
1. Ve a **Archivo → Scripts → Ejecutar archivo de script…** y elige `after_effects/TerapiaEspacial.jsx`. También puedes copiarlo en *ScriptUI Panels* para tenerlo como panel.
2. Pestañas del panel:
   - **General:** fondo (Verde / Espacio / Transparente), fuentes, logo y duraciones.
   - **Textos:** GC en formato `Nombre | Cargo | estilo`, donde el estilo es `terapeuta` o `alien`. También los titulares en formato `TALCA | texto`.
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
