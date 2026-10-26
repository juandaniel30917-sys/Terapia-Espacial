"""Convierte fuentes/escena-sesion.svg en:
   1) obs/escena.js            -> SVG listo para el HTML (salida, panel, inicio) + animación
   2) datos dentro de after_effects/TerapiaEspacial.jsx (entre @@ESCENA_INICIO y @@ESCENA_FIN)
      para que el script dibuje la misma escena como capas de forma.
Uso:  python3 herramientas/construir_escena.py
"""
import json, re, os, xml.etree.ElementTree as ET

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SVG = os.path.join(RAIZ, 'fuentes', 'escena-sesion.svg')
JS = os.path.join(RAIZ, 'obs', 'escena.js')
JSX = os.path.join(RAIZ, 'after_effects', 'TerapiaEspacial.jsx')
NS = '{http://www.w3.org/2000/svg}'

arbol = ET.parse(SVG)
raiz = arbol.getroot()
vb = [float(x) for x in raiz.get('viewBox').split()]
CX, CY = vb[0] + vb[2] / 2, vb[1] + vb[3] / 2


def color(v):
    if not v or v == 'none':
        return None
    m = re.match(r'var\(--(\w+)\)', v)
    return m.group(1) if m else v


def num(v, d=0):
    return float(v) if v is not None else d


def parse_path(d):
    toks = re.findall(r'[MLCZ]|-?\d*\.?\d+', d)
    subs, cur, i, cmd = [], None, 0, None
    while i < len(toks):
        t = toks[i]
        if t in 'MLCZ':
            cmd = t; i += 1
            if cmd == 'Z':
                if cur:
                    cur['c'] = True
                    v = cur['v']
                    if len(v) > 1 and abs(v[0][0] - v[-1][0]) < .01 and abs(v[0][1] - v[-1][1]) < .01:
                        cur['i'][0] = cur['i'][-1]
                        v.pop(); cur['i'].pop(); cur['o'].pop()
                continue
        if cmd == 'M':
            cur = {'v': [], 'i': [], 'o': [], 'c': False}; subs.append(cur)
            x, y = float(toks[i]), float(toks[i + 1]); i += 2
            cur['v'].append([x, y]); cur['i'].append([0, 0]); cur['o'].append([0, 0]); cmd = 'L'
        elif cmd == 'L':
            x, y = float(toks[i]), float(toks[i + 1]); i += 2
            cur['v'].append([x, y]); cur['i'].append([0, 0]); cur['o'].append([0, 0])
        elif cmd == 'C':
            x1, y1, x2, y2, x, y = [float(t) for t in toks[i:i + 6]]; i += 6
            px, py = cur['v'][-1]
            cur['o'][-1] = [x1 - px, y1 - py]
            cur['v'].append([x, y]); cur['i'].append([x2 - x, y2 - y]); cur['o'].append([0, 0])
    return subs


def r2(v):
    return round(v, 2)


def mover(subs):
    for s in subs:
        s['v'] = [[r2(x - CX), r2(y - CY)] for x, y in s['v']]
        s['i'] = [[r2(a), r2(b)] for a, b in s['i']]
        s['o'] = [[r2(a), r2(b)] for a, b in s['o']]
    return subs


def prim(e):
    tag = e.tag.replace(NS, '')
    base = {'f': color(e.get('fill')), 's': color(e.get('stroke')), 'w': num(e.get('stroke-width'))}
    if tag == 'rect':
        x, y, w, h = [num(e.get(k)) for k in ('x', 'y', 'width', 'height')]
        base.update(k='rect', p=[r2(x + w / 2 - CX), r2(y + h / 2 - CY)], t=[w, h], r=num(e.get('rx')))
    elif tag == 'circle':
        r = num(e.get('r'))
        base.update(k='ell', p=[r2(num(e.get('cx')) - CX), r2(num(e.get('cy')) - CY)], t=[2 * r, 2 * r])
    elif tag == 'ellipse':
        base.update(k='ell', p=[r2(num(e.get('cx')) - CX), r2(num(e.get('cy')) - CY)], t=[2 * num(e.get('rx')), 2 * num(e.get('ry'))])
    elif tag == 'path':
        base.update(k='path', sp=mover(parse_path(e.get('d'))))
    else:
        return None
    return base


def recorrer(nodo, filtro=None):
    """Devuelve la lista en orden SVG (abajo -> arriba)."""
    out = []
    for e in list(nodo):
        tag = e.tag.replace(NS, '')
        if filtro and not e.get('data-icono') == filtro:
            if tag == 'g':
                out += recorrer(e, filtro)
            continue
        if tag == 'g':
            g = {'k': 'g', 'n': e.get('data-anim') or 'GRUPO', 'o': [r2(num(e.get('data-ox')) - CX), r2(num(e.get('data-oy')) - CY)], 'h': recorrer(e)}
            out.append(g)
        else:
            p = prim(e)
            if p:
                out.append(p)
    return out


def ae_orden(lista):
    """AE dibuja arriba lo primero de la lista: invertimos recursivamente."""
    r = []
    for x in reversed(lista):
        if x['k'] == 'g':
            x = dict(x, h=ae_orden(x['h']))
        r.append(x)
    return r


escena = recorrer(raiz)
icono = recorrer(raiz, 'terapeuta')
datos = {'escena': ae_orden(escena), 'terapeuta': ae_orden(icono)}

# ---------- 1) escena.js ----------
svg_txt = open(SVG, encoding='utf-8').read()
svg_txt = re.sub(r'<!--.*?-->', '', svg_txt, flags=re.S)
svg_txt = re.sub(r'\s+', ' ', svg_txt).strip()
js = """/* TERAPIA ESPACIAL · escena de sesión (terapeuta + paciente alien).
   Archivo generado por herramientas/construir_escena.py desde fuentes/escena-sesion.svg. No editar a mano. */
(function () {
  var SVG = %s;
  var ANIM = {
    gesto: function (t) { return 'rotate(' + (Math.sin(t * 2.2) * 12) + ')'; },
    cabezaAlien: function (t) { return 'rotate(' + (Math.sin(t * 1.7) * 4) + ')'; },
    boca: function (t) { return 'scale(1,' + (0.35 + Math.abs(Math.sin(t * 9)) * 0.75) + ')'; },
    globo: function (t) { var s = 1 + Math.sin(t * 3) * 0.04; return 'scale(' + s + ')'; },
    cabezaTerapeuta: function (t) { return 'rotate(' + (Math.sin(t * 1.3) * 4) + ')'; },
    lapiz: function (t) { return 'rotate(' + (Math.sin(t * 12) * 5) + ')'; }
  };
  function crear(opciones) {
    opciones = opciones || {};
    var d = document.createElement('div');
    d.innerHTML = SVG;
    var s = d.firstChild;
    if (opciones.ancho) { s.setAttribute('width', opciones.ancho); s.setAttribute('height', opciones.ancho * 380 / 760); }
    if (opciones.vista) { s.setAttribute('viewBox', opciones.vista); }
    s.classList.add('escena-sesion');
    return s;
  }
  function animar(raiz, t) {
    var gs = raiz.querySelectorAll('g[data-anim]');
    for (var i = 0; i < gs.length; i++) {
      var g = gs[i], f = ANIM[g.getAttribute('data-anim')];
      if (!f) continue;
      var ox = g.getAttribute('data-ox'), oy = g.getAttribute('data-oy');
      g.setAttribute('transform', 'translate(' + ox + ' ' + oy + ') ' + f(t) + ' translate(' + (-ox) + ' ' + (-oy) + ')');
    }
  }
  // ícono: solo la cabeza de la terapeuta
  function terapeuta(tam) {
    var s = crear({ vista: '596 48 108 108' });
    s.setAttribute('width', tam); s.setAttribute('height', tam);
    var quitar = s.querySelectorAll(':scope > *:not([data-icono])');
    for (var i = 0; i < quitar.length; i++) quitar[i].remove();
    return s;
  }
  window.TE_ESCENA = { crear: crear, animar: animar, terapeuta: terapeuta };
})();
""" % json.dumps(svg_txt, ensure_ascii=False)
open(JS, 'w', encoding='utf-8').write(js)

# ---------- 2) datos para After Effects ----------
def es3(o):
    return json.dumps(o, ensure_ascii=False, separators=(',', ':'))

bloque = ('    // @@ESCENA_INICIO (generado por herramientas/construir_escena.py — no editar a mano)\n'
          '    var ESCENA_DATOS = ' + es3(datos) + ';\n'
          '    // @@ESCENA_FIN')
jsx = open(JSX, encoding='utf-8-sig').read()
if '@@ESCENA_INICIO' in jsx:
    jsx = re.sub(r'    // @@ESCENA_INICIO.*?// @@ESCENA_FIN', lambda m: bloque, jsx, flags=re.S)
else:
    jsx = jsx.replace('    // =====================================================================\n    // UTILIDADES', bloque + '\n\n    // =====================================================================\n    // UTILIDADES', 1)
open(JSX, 'w', encoding='utf-8').write(jsx)
print('escena.js y datos de AE actualizados:', len(escena), 'piezas;', len(icono), 'piezas de ícono')
