# PROMPT — Paquete gráfico «TERAPIA ESPACIAL» · v2

> Copia este prompt completo cuando quieras regenerar o ampliar el paquete. Cuando mandes referencias nuevas, agrégalas al final en la sección **«Referencias nuevas»** e indica en cada una a qué afecta: `CONFIG / GC / TRANSICIONES / CORTINAS / LOGO / PIP / COLORES / AVISOS`. Solo se modificará esa parte.

---

## PROMPT 1 — Dirección creativa (el QUÉ)

**Programa:** Terapia Espacial
**Conductor:** Luis A. Monasterios
**Formato:** programa de estudio con tono de noticiero. Tiene dos bloques: OVNIS (con el invitado Benjamín Castillo, parapsicólogo) y PSICOLOGÍA (con la invitada Sophia Jaque, psicóloga).
**Tono:** misterio entretenido. Debe sentirse serio como noticiero, pero con un guiño de ciencia ficción retro, de "expediente de avistamientos".

**Premisa visual (v2): psicología + ovnis.** *Terapia Espacial* es una consulta donde un profesional atiende a pacientes de otro planeta. Por eso los símbolos de la terapia se mezclan con los del espacio:
- **El paciente:** un alien de cabeza grande y ojos negros, en color menta (el mismo del logo), recostado en un **diván** violeta y magenta con una burbuja de pensamiento. Aparece en la apertura y el cierre, y tiene su propio estilo de GC.
- **La sesión:** el duplex y el triplex llevan un chip «● SESIÓN EN CURSO 00:00» con cronómetro y una onda cerebral que se mueve.
- **Las transiciones son herramientas de la consulta:** la espiral hipnótica, la mancha de Rorschach, la onda cerebral (electroencefalograma) y el rayo del ovni.
- **Textos con guiño:** «VOLVEMOS ENSEGUIDA · LA SESIÓN CONTINÚA» y «FIN DE LA SESIÓN».

**Concepto central: «la abducción».** Las gráficas no aparecen: **las trae un ovni.**
- **Entrada:** un ovni cae desde arriba con desenfoque de movimiento y queda flotando con un bamboleo suave. Desde su panza se enciende un **rayo tractor** en forma de cono, con anillos de energía que bajan por el haz. El GC baja por el rayo, desde el ovni hasta su lugar, y se materializa con un parpadeo.
- **Pausa:** el rayo se apaga y el ovni se achica y se queda flotando sobre la esquina derecha de la barra, como firma. Esto se puede desactivar.
- **Salida:** el ovni vuelve al centro, enciende el rayo y **absorbe el GC**: la barra se encoge y sube por el haz hasta desaparecer dentro del ovni. Después el ovni sale disparado.
- Este concepto se aplica a la mayoría de las gráficas: GC, cortina con título, aviso, «volvemos», apertura y cierre. Las cortinas y la transición son barridos del ovni con su columna de luz.

**Estilo visual**
- El ovni se basa en la referencia en video: un platillo dibujado con **línea blanca gruesa** (cúpula, platillo y un punto de luz), con relleno oscuro y luces de borde que parpadean.
- Logo de referencia: «Entre Ovnis y Fantasmas», con letras verde menta pálido y brillo suave sobre un óvalo oscuro. Hay que confirmar si es el logo del programa o de un segmento.
- **Paleta.** Ningún color puede ser verde saturado, porque se hace chroma key:
  - Espacio (fondo de barras): `#0B0B1A`
  - Violeta energía (acento principal): `#7B2FF7`
  - Magenta luces (alertas y luces del ovni): `#FF3DCB`
  - Luz del rayo (blanco cálido): `#FFF4C2`
  - Blanco (textos): `#FFFFFF`
  - Menta del logo (solo detalles mínimos, poco saturado): `#D6EFC7`
- **Tipografía:** títulos en sans bold con aire técnico (ideal **Orbitron Bold** o **Exo 2 Bold**; se usa Arial Bold si no están instaladas) y textos en sans limpia (Arial / Inter).
- **Movimiento:** curvas suaves (easy ease), bamboleo constante del ovni, parpadeo corto al materializarse. Nada demasiado rápido: tiene que leerse en TV.

**Gráficas según la pauta**

| Momento | Gráfica | Contenido |
|---|---|---|
| INTRO | APERTURA (15″) | Ovni que trae el título TERAPIA ESPACIAL |
| INTRO | GC | Luis Monasterios / Presentador |
| INTRO | AVANCE INFORMATIVO | Portada «AVANCE INFORMATIVO / ÚLTIMAS NOTICIAS · TALCA · CHILE · INTERNACIONAL» y luego titulares centrados como GC, cada uno con su etiqueta de sección |
| INTRO (compilado) | CORTINA TÍTULO | OVNIS CAPTADOS EN CÁMARA / ¿ESTAMOS SOLOS EN EL UNIVERSO? |
| Entrada y salida de VTR | CORTINA (stinger) | Barrido de ida y vuelta del ovni con su columna de luz |
| Cambios de cámara o de bloque | TRANSICIÓN ×4 (2″, corte a 1″) | Rayo, espiral hipnótica, mancha de Rorschach y onda cerebral. En la botonera puede ser aleatoria |
| Lead a comercial 1 y 2 | VOLVEMOS | VOLVEMOS ENSEGUIDA |
| Bloque OVNIS | GC | Benjamín Castillo / Parapsicólogo |
| Bloque OVNIS | TRIPLEX | OVNI · OSNI · FANI: Luis (C1) **vertical 9:16**, avistamientos (VTR) **16:9 al centro** y Benjamín (C3) **vertical 9:16**. Queda al aire toda la entrevista |
| Bloque PSICOLOGÍA | GC | Sophia Jaque / Psicóloga |
| Bloque PSICOLOGÍA | DUPLEX | SALUD MENTAL: Luis (C1) y Sophia (C3), con ventanas 16:9 grandes. Queda al aire toda la entrevista |
| Cuando se necesite | GC PACIENTE | «Paciente X-27 / Visitante de otro planeta», con cabeza de alien dentro de la barra |
| Todo el programa | BUG / LOGO | Esquina superior derecha, con ovni pequeño y «EN VIVO» |
| Extra | AVISO | ¡NUEVO AVISTAMIENTO! / El Enladrillado · Región del Maule |
| CIERRE | CIERRE | NOS VEMOS EN UN NUEVO PROGRAMA, y el ovni se lleva el logo |

---

## PROMPT 2 — Especificación técnica (el CÓMO)

**Formato:** 1920×1080, 29,97 fps, píxel cuadrado.

**Fondo:** verde puro `RGB 0,255,0` (`[0,1,0]`) para hacer chroma key en OBS. También existe una opción de **fondo transparente** (alfa), que es mejor para los brillos.
- Con fondo verde, el rayo se dibuja **opaco y con líneas**: contorno, núcleo y anillos. Si fuera semitransparente, se mezclaría con el verde y el chroma lo dejaría manchado. Por eso tampoco se usan glow ni sombras en este modo.
- Con fondo transparente se activan el relleno translúcido del rayo y el glow.
- Las gráficas a pantalla completa (apertura y cierre) siempre llevan fondo espacial con estrellas.

**Márgenes seguros:** 96 px a los lados y 54 px arriba y abajo. Los GC no bajan de y = 972.

**Prefijo:** todas las comps y capas usan `TE_` (Terapia Espacial).

**After Effects 2026 en español:** el script usa solo *matchNames* (`ADBE …`), así que funciona en cualquier idioma.

**Arquitectura modular**
- `CONFIG`: textos, colores, fuentes, medidas, tiempos y modo de fondo. Todo se edita desde el panel ScriptUI.
- Constructor `abduccion()`: el núcleo reutilizable que reúne ovni, rayo, barra, subbarra y textos. Lo usan GC, CORTINA TÍTULO, AVISO, VOLVEMOS, APERTURA y CIERRE.
- `ovni()`: el dibujo vectorial del ovni.
- `rayo()`: el cono, el núcleo y los anillos con repetidor. Se calcula en vivo según la posición del ovni y de la barra.
- `cortina()`, `transicion()`, `multiplex()` (triplex y duplex), `bug()` y `estrellas()`.

**Controles:** cada comp tiene un null `TE_CONTROL` con estos controles:
- Ancho de barra automático según el texto.
- Margen, ancho mínimo, borde izquierdo y centrado.
- Bamboleo y «OVNI en pausa» (checkbox).
- Colores del rayo, barra, subbarra y acento.

**Panel ScriptUI:** permite editar todos los textos (incluida la lista de GC en formato `Nombre | Cargo`), los colores en hexadecimal, las fuentes (nombre PostScript), el modo de fondo y un logo opcional. Con casillas eliges qué crear y lo generas con un botón.

**Marcadores** en cada comp: ENTRADA, PAUSA y SALIDA.

**Ventanas de triplex y duplex:** quedan huecas (con verde o transparencia detrás) para poner las cámaras debajo en OBS. Sus coordenadas exactas están en el README.

**HTML para OBS**
- `salida.html`: fuente de navegador de 1920×1080, con fondo verde o transparente.
- `panel.html`: botonera de salida en vivo y configuración de todo el programa (textos, colores, fuentes, logo, tiempos, modo de fondo). Funciona en el computador, como dock de OBS o en el celular.
- `servidor.js`: servidor local de Node sin dependencias que conecta el panel con la salida, también desde el celular en la misma red WiFi.

**Prioridades:** estabilidad antes que efectos, y arquitectura antes que funciones.

---

**Titulares del avance (tomados del libreto)**
- TALCA: Avistamientos en El Enladrillado y San Clemente vuelven a repetirse
- TALCA: Lago Colbún y laguna del Maule, en la mira de los FANI
- CHILE: Aumenta el consumo de antidepresivos en jóvenes
- CHILE: Cae el consumo de alcohol entre los jóvenes
- CHILE: Salud mental estudiantil: el desafío de volver a la presencialidad
- INTERNACIONAL: Casa Blanca y Pentágono desclasifican registros OVNI
- INTERNACIONAL: Desde 2019 se disparan los registros de ovnis en el mundo
- INTERNACIONAL: Bélgica y Asturias: los videos que reabren el debate

Colores de las etiquetas: TALCA en magenta, CHILE en violeta e INTERNACIONAL en luz del rayo con texto oscuro. Si un titular es muy largo, la letra se achica sola hasta caber en 1720 px.

## Referencias nuevas (agregar aquí)
- _(ejemplo)_ `afecta: COLORES, LOGO` — logo final en .ai con paleta X.
