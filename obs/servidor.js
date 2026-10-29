// TERAPIA ESPACIAL — servidor local sin dependencias (solo Node.js)
// Uso: doble clic en INICIAR.bat (Windows) o:  node servidor.js
// Panel:  http://localhost:8080/panel.html   (o desde el celular con la IP que aparece abajo)
// Salida: http://localhost:8080/salida.html  (Fuente de navegador en OBS, 1920x1080)
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PUERTO = Number(process.env.PORT) || 8080;
const CARPETA = __dirname;
const ARCHIVO_ESTADO = path.join(CARPETA, 'estado.json');
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webm': 'video/webm', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.ico': 'image/x-icon'
};

let estado = null;
try { estado = JSON.parse(fs.readFileSync(ARCHIVO_ESTADO, 'utf8')); } catch (e) { estado = null; }

const clientes = new Set();     // { res, rol }
function emitir(msg) {
  const linea = 'data: ' + JSON.stringify(msg) + '\n\n';
  for (const c of clientes) { try { c.res.write(linea); } catch (e) { clientes.delete(c); } }
}
function presencia() {
  let salidas = 0, controles = 0;
  for (const c of clientes) { if (c.rol === 'salida') salidas++; else controles++; }
  emitir({ tipo: 'presencia', salidas, controles });
}
function ipsLocales() {
  const ips = [];
  for (const lista of Object.values(os.networkInterfaces())) for (const i of lista || []) if (i.family === 'IPv4' && !i.internal) ips.push(i.address);
  return ips;
}

let guardadoPendiente = null;
function guardar() {
  clearTimeout(guardadoPendiente);
  guardadoPendiente = setTimeout(() => {
    fs.writeFile(ARCHIVO_ESTADO, JSON.stringify(estado), () => {});
  }, 400);
}

const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');

  if (url.pathname === '/eventos') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write('retry: 1500\n\n');
    const cli = { res, rol: url.searchParams.get('rol') === 'salida' ? 'salida' : 'control' };
    clientes.add(cli);
    presencia();
    const latido = setInterval(() => { try { res.write(': latido\n\n'); } catch (e) {} }, 15000);
    req.on('close', () => { clearInterval(latido); clientes.delete(cli); presencia(); });
    return;
  }

  if (url.pathname === '/info') {
    const ip = ipsLocales()[0] || 'localhost';
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(JSON.stringify({
      servidor: 'terapia-espacial', ips: ipsLocales(), puerto: PUERTO,
      control: 'http://' + ip + ':' + PUERTO + '/panel.html',
      salida: 'http://localhost:' + PUERTO + '/salida.html'
    }));
    return;
  }

  if (url.pathname === '/estado' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(JSON.stringify(estado || {}));
    return;
  }

  if (url.pathname === '/cmd' && req.method === 'POST') {
    let cuerpo = '';
    req.on('data', d => { cuerpo += d; if (cuerpo.length > 15e6) req.destroy(); });
    req.on('end', () => {
      try {
        const msg = JSON.parse(cuerpo);
        if (msg.tipo === 'estado' && msg.estado) { estado = msg.estado; guardar(); }
        emitir(msg);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch (e) {
        res.writeHead(400); res.end('{"ok":false}');
      }
    });
    return;
  }

  // subir un video (cortinas en video): se guarda en obs/videos/subidos
  if (url.pathname === '/subir' && req.method === 'POST') {
    const nombre = String(url.searchParams.get('nombre') || 'video.mp4');
    const ext = (path.extname(nombre).toLowerCase().match(/^\.(mp4|webm|mov|m4v)$/) || [])[0];
    if (!ext) { res.writeHead(415, { 'Content-Type': 'application/json' }); res.end('{"error":"Formato no permitido. Usa MP4 o WebM."}'); return; }
    const dir = path.join(CARPETA, 'videos', 'subidos');
    fs.mkdirSync(dir, { recursive: true });
    const archivo = Date.now().toString(36) + Math.random().toString(36).slice(2, 6) + ext;
    const destino = fs.createWriteStream(path.join(dir, archivo));
    let total = 0;
    req.on('data', d => { total += d.length; if (total > 500e6) { req.destroy(); destino.destroy(); } });
    req.pipe(destino);
    destino.on('finish', () => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ url: 'videos/subidos/' + archivo })); });
    destino.on('error', () => { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end('{"error":"No se pudo guardar"}'); });
    return;
  }

  // archivos estáticos
  let ruta = decodeURIComponent(url.pathname);
  if (ruta === '/') ruta = '/index.html';
  const archivo = path.normalize(path.join(CARPETA, ruta));
  if (!archivo.startsWith(CARPETA)) { res.writeHead(403); res.end(); return; }
  fs.readFile(archivo, (err, datos) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('No encontrado'); return; }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(datos);
  });
});

servidor.listen(PUERTO, '0.0.0.0', () => {
  const ips = ipsLocales();
  console.log('\n  ✦ TERAPIA ESPACIAL — servidor de gráficas listo ✦\n');
  console.log('  Inicio (links):    http://localhost:' + PUERTO + '/');
  console.log('  Panel (este PC):   http://localhost:' + PUERTO + '/panel.html');
  console.log('  Salida para OBS:   http://localhost:' + PUERTO + '/salida.html');
  ips.forEach(ip => console.log('  Panel en celular:  http://' + ip + ':' + PUERTO + '/panel.html'));
  console.log('\n  Deja esta ventana abierta mientras transmites. Ctrl+C para cerrar.\n');
});
