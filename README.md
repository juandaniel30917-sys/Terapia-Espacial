# TERAPIA ESPACIAL — Paquete gráfico v2

**Concepto:** un ovni cae, enciende su rayo tractor y deja el GC. En la salida vuelve, lo absorbe y se va.
**Premisa:** una consulta de psicología para pacientes de otro planeta. Por eso hay un alien en el diván, la sesión en curso, la espiral hipnótica, la mancha de Rorschach y la onda cerebral.

**Novedades de la v2**
- Avance informativo: una portada y 8 titulares (Talca, Chile, Internacional), centrados como GC. Se pueden lanzar en automático o uno por uno.
- Transiciones variadas de 2 s (corte a 1 s): rayo, hipnosis, Rorschach y onda cerebral. En la botonera también hay modo aleatorio.
- El triplex tiene los costados verticales 9:16 y el centro 16:9. El duplex tiene ventanas más grandes.
- El duplex y el triplex duran 60 s en After Effects (se puede ajustar en el panel). En OBS quedan al aire hasta que los saques.
- GC de paciente alienígena y chip «SESIÓN EN CURSO» con cronómetro.

```
TerapiaEspacial_v1/
├── PROMPT_TerapiaEspacial.md        ← prompt creativo + técnico (para reutilizar y sumar referencias)
├── after_effects/
│   └── TerapiaEspacial.jsx          ← script con panel (crea todas las comps)
└── obs/
    ├── INICIAR.bat                  ← Windows: doble clic para encender el servidor
    ├── INICIAR.command              ← Mac: lo mismo
    ├── servidor.js                  ← servidor local (Node.js, sin instalar nada más)
    ├── panel.html                   ← botonera + pauta + textos + configuración
    ├── salida.html                  ← lo que va en OBS
    └── comun.js
```

---

## 1. After Effects

1. Abre After Effects 2026 y crea un proyecto nuevo (o usa el tuyo).
2. Ve a **Archivo → Scripts → Ejecutar archivo de script…** y elige `TerapiaEspacial.jsx`.
   - Si quieres tenerlo siempre como panel, copia el archivo en `Adobe After Effects 2026/Support Files/Scripts/ScriptUI Panels/`, reinicia AE y ábrelo desde **Ventana**.
3. El panel tiene cuatro pestañas:
   - **General:** nombre del programa, fondo **Verde** o **Transparente**, fuentes (nombre PostScript, por ejemplo `Orbitron-Bold`) y logo opcional.
   - **Textos:** los GC (una línea por persona: `Nombre | Cargo`) y los textos de cortina, triplex, duplex, aviso, volvemos y cierre.
   - **Colores:** los colores en hexadecimal.
   - **Crear:** marca lo que necesitas y presiona **CREAR GRÁFICAS SELECCIONADAS**.
4. Todo queda en la carpeta **TE_GRAFICAS**.

| Comp | Duración | Uso |
|---|---|---|
| TE_GC_(nombre) | 10 s | GC con abducción (entra 0–2,5 s · pausa · sale 8–10 s) |
| TE_APERTURA | 15 s | Intro con fondo espacial y estrellas |
| TE_CORTINA_TITULO | 8 s | «OVNIS CAPTADOS EN CÁMARA» sobre el compilado |
| TE_CORTINA | 2,5 s | Stinger de ida y vuelta (**corte a los 1,2 s**) |
| TE_TRANSICION_RAYO / _HIPNOSIS / _RORSCHACH / _ONDA | 2 s | Cuatro transiciones (**corte a 1 s**) |
| TE_AVANCE_PORTADA + TE_TITULAR_01…08 | 8 s / 9 s | Avance informativo, titulares centrados con etiqueta de sección |
| TE_TRIPLEX / TE_DUPLEX | 60 s | Marcos, chip de sesión y título traído por el ovni |
| TE_VOLVEMOS · TE_AVISO | 8 s | Lead a comercial · avistamiento |
| TE_BUG | 10 s | Logo de esquina con «EN VIVO» (en loop) |
| TE_CIERRE | 9,5 s | El ovni se lleva el logo |

**Para editar después:** en cada comp, el null **TE_CONTROL** tiene estos controles:
- Ancho de barra (automático según el texto) y Margen.
- **Centrado** y **Borde izquierdo**.
- **Bamboleo** del ovni.
- **OVNI en pausa:** si lo apagas, el ovni se va mientras el GC está en pantalla.
- **Color rayo / barra / sub / acento.**

Para cambiar un nombre, edita la capa **TE_TITULO**: la barra y el rayo se ajustan solos. Los marcadores ENTRADA / PAUSA / SALIDA indican dónde cortar.

**Render:**
- Con chroma: H.264 o ProRes 422 con el fondo verde.
- Con transparencia: ProRes 4444 con canales **RGB + alfa**. En ese caso conviene crear las gráficas con fondo **Transparente** para que tengan glow.

---

## 2. OBS (en vivo, con la botonera)

1. Instala **Node.js LTS** desde nodejs.org (una sola vez).
2. Haz doble clic en **`obs/INICIAR.bat`**. Se abre una ventana negra (no la cierres) y el panel en el navegador.
3. En OBS: **Fuentes → + → Navegador**.
   - URL: `http://localhost:8080/salida.html`
   - Ancho **1920**, alto **1080**.
   - Activa «Actualizar navegador cuando la escena se active».
4. **Chroma:**
   - Clic derecho en la fuente → **Filtros → Clave cromática** (verde).
   - O mejor: en el panel elige **Configuración → Fondo → Transparente**. La fuente de navegador ya es transparente, así que no necesitas chroma y el rayo se ve con brillo.
5. **Panel desde el celular:** conéctalo al mismo WiFi y abre la dirección «Panel en celular» que muestra la ventana negra (por ejemplo `http://192.168.1.20:8080/panel.html`).
6. **Opcional:** en OBS, **Docks → Docks de navegador personalizados** con `http://localhost:8080/panel.html` para tener la botonera dentro de OBS.

**Sin servidor:** también puedes abrir `panel.html` con doble clic y usar la vista previa. Pero para que OBS reciba los cambios necesitas el servidor.

### Botonera
- **GC:** un toque lo pone al aire y otro lo saca. Si cambias de GC, el ovni absorbe el anterior y trae el nuevo.
- **Títulos y avisos:** Cortina título, Volvemos y Aviso. Comparten la zona baja con los GC, así que se reemplazan entre sí.
- **Pantallas:** Triplex y Duplex.
- **Avance informativo:** «▶ Avance automático» (H) lanza la portada y todos los titulares seguidos. «Siguiente titular» (G) los pasa uno por uno, y también puedes tocar cualquier titular.
- **Disparos:** Apertura, Cortina, Transición (T, usa la que elegiste en Configuración, por defecto aleatoria) y Cierre. Debajo hay botones para cada variante: Rayo, Hipnosis, Rorschach y Onda cerebral.
- **Permanentes:** Bug y Ticker.
- **LIMPIAR (Esc):** saca todo menos el bug y el ticker.
- **Pauta:** los 19 pasos del guion, con el avance informativo después del GC de Luis, en orden. Puedes avanzar con **Siguiente** o con la barra espaciadora.
- **Textos:** se editan en vivo y el cambio se ve aunque la gráfica esté al aire.
- **Configuración:** colores, tipografías, logo, posición y tamaño de los GC, ovni en pausa, velocidad y respaldo en .json.

### Coordenadas de las ventanas (para ubicar las cámaras en OBS)

| | Ventana | x | y | ancho | alto |
|---|---|---|---|---|---|
| Triplex | C1 Luis (vertical 9:16) | 180 | 280 | 287 | 510 |
| | VTR avistamientos (16:9) | 507 | 280 | 907 | 510 |
| | C3 Benjamín (vertical 9:16) | 1454 | 280 | 287 | 510 |
| Duplex | C1 Luis | 96 | 230 | 832 | 468 |
| | C3 Sophia | 992 | 230 | 832 | 468 |

Para las ventanas verticales, recorta la cámara en OBS (Alt + arrastrar el borde, o Filtros → Recortar/Rellenar) y escálala para llenar 287×510.

En OBS, pon cada cámara **debajo** de la fuente de gráficas y usa clic derecho → **Transformar → Editar transformación** con esos valores.

---

## 3. Checklist antes de salir al aire
- [ ] Los nombres de la pauta están bien escritos, con tildes.
- [ ] Los GC no pasan de y = 972. Ya vienen así: margen seguro de 54 px.
- [ ] Ningún color es verde saturado. El panel avisa si eliges uno.
- [ ] El chroma está probado con el rayo encendido (en modo verde, el rayo es opaco y con líneas).
- [ ] La cortina corta a los **1,2 s** y las transiciones a **1 s**.
- [ ] El logo es un PNG transparente o tiene buen contraste sobre la placa oscura.
- [ ] El servidor queda abierto durante toda la transmisión.

## 4. Nuevas referencias
Agrégalas en `PROMPT_TerapiaEspacial.md` → **Referencias nuevas**, con la etiqueta `afecta: CONFIG / GC / TRANSICIONES / CORTINAS / LOGO / PIP / COLORES / AVISOS`. Solo se cambia esa parte.
