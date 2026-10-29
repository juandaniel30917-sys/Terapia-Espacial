# PROMPT · «ENTRE OVNIS Y FANTASMAS» — paquete gráfico en vivo (HTML para OBS)

## Rol
Actúas como **director de televisión, diseñador de gráficas y switchman / controlador de gráficas** de un programa
paranormal en vivo. Piensas cada gráfica en función del momento del libreto, de lo que hace la cámara y de
cómo la va a disparar el operador con un solo toque (tablet, celular, Stream Deck o teclado).

## Programa
- **Nombre:** ENTRE OVNIS Y FANTASMAS · capítulo piloto · 30 min, 2 bloques de 15 min.
- **Conductor:** Luis Monasterios · **Parapsicólogo:** Benjamín Castillo (BECA).
- **Bloque 1 · OVNIS:** VTR de avistamientos, El enigma de Colbún, triplex alien, mención Lay's.
- **Bloque 2 · FANTASMAS:** Sanatorio Los Maitenes, duplex fantasmas, mención One Wish Willow, «La Nota Espectral»,
  cierre y mención Santo Tomás.
- Es un **programa nuevo**: reemplaza a Terapia Espacial, que queda oculto detrás de un botón (no se borra).

## Base técnica (no cambia)
Mismo sistema del repo `Terapia-Espacial`: panel/botonera + salida para OBS, salas por internet (Supabase),
servidor local y modo local. Un toque pone la gráfica al aire y otro la saca. Todo editable desde el ✎ de cada botón.
El programa nuevo vive en `obs/eoyf.js` (salida) y `obs/eoyf-panel.js` (botonera, pauta y textos).

## Identidad visual (tomada de las gráficas que ya existen en After Effects)
- **Logo:** «Entre Ovnis y Fantasmas» en letra de terror blanca, con la cabeza alien como «O» y el platillo arriba.
- **Barras:** gris carbón casi negro, con cortes en diagonal (estilo *news lower third*).
- **Acentos:** **verde alien** para OVNIS · **naranjo calabaza** para FANTASMAS · **rojo sangre** para alertas.
- **Tipografías:** Cinzel (nombres y títulos, serif de misterio), Special Elite (máquina de escribir de expediente),
  Montserrat (textos chicos).
- **Íconos:** cabeza alien verde (ovnis), calabaza (fantasmas), fantasma, pin de ubicación, cámara REC.
- **Recursos del usuario:** logo, mano zombie, destellos glitch (ojo, araña, alien, estatua, calavera),
  rayo sobre la ciudad, textura grunge, logos de Lay's, One Wish Willow y Santo Tomás.

## Gráficas
| Gráfica | Texto | Zona |
|---|---|---|
| Marca de agua | logo del programa (esquina superior derecha, semitransparente) | fija |
| Ticker | noticias ovni y fantasma del Maule, con «ÚLTIMAS NOTICIAS» | cinta inferior |
| GC personas | Luis Monasterios (Conductor) · Benjamín Castillo (Parapsicólogo) · Noris Ystúriz (Testigo) · Andrea Monasterios (Testigo) · Lucía Osorio (Reportera) · Canela Arroyo (Reportera) | tercio inferior |
| Título | OVNIS CAPTADOS EN CÁMARA · ¿Estamos solos en el universo? | tercio inferior |
| Título | EL ENIGMA DE COLBÚN · LA NOTA ESPECTRAL · PRÓXIMO CAPÍTULO | tercio inferior |
| En terreno | REC + lugar + bajada, para las notas de terreno | tercio inferior |
| Dato Maitenes | Sanatorio Los Maitenes: «Se estima que a lo largo de los años, entre 500 y 1000 fallecidos han perdido la vida en este recinto. Siendo la era de tuberculosis la más fuerte» | tarjeta lateral |
| Dato Colbún | Lago Colbún: «San Clemente, El Enladrillado y Vilches Alto componen la denominada Ruta Ufológica» | tarjeta lateral |
| ¿Sabías qué? | «Los hombres suelen estar más interesados en las historias de ovnis y las mujeres en las de fantasmas» | tercio inferior |
| Promo ALIEN | «Envía ALIEN a nuestro número y obtén un código de dscto de hasta un 50%» + 666-9999 | tarjeta |
| Llámenos | «Déjanos tu mensaje de voz al 666-9999» con la mano zombie | tercio inferior |
| Menciones | Lay's · One Wish Willow («Con el código de DSCTO ALIEN hasta un 50% en todas nuestras sucursales») · Santo Tomás («Lux et veritas») | tarjeta con logo |
| Cortina OVNI | rayo + platillo + destellos glitch, corte a 0,6 s | pantalla completa |
| Cortina FANTASMA | niebla + fantasma + destellos glitch, corte a 0,6 s | pantalla completa |
| Triplex alien / Duplex fantasmas | ventanas para cámaras (interior en verde o transparente) | pantalla completa |

## Reglas de switch
- Un GC, título, dato, promo o mención comparten el **tercio inferior**: uno reemplaza al otro.
- Las tarjetas de dato (Maitenes / Colbún) van al costado y **no** tapan al entrevistado.
- La marca de agua y el ticker son fijos; el ticker baja el tercio inferior para que no choquen.
- Fondo de la salida: **transparente** (OBS), **azul** (chroma como el logo permanente) o **verde**.
  Con verde se avisa que el acento verde alien se borra con el chroma.
- Las cortinas se lanzan y se van solas; tocar otra vez las saca.

## Pauta
La pauta sigue el libreto paso a paso (cada paso dispara lo que pide la columna «Gráfica»), con ◀ ▶ y Av Pág / Re Pág.
