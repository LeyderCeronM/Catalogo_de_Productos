/* ============================================================
   Capa de datos compartida (catálogo + panel de administrador)
   - Carga el catálogo publicado (data/catalogo.json)
   - Guarda el borrador del administrador en IndexedDB
   - Guarda los archivos (imágenes / videos) subidos desde el panel
   ============================================================ */
(function () {
  const DB_NOMBRE = 'catalogo-db';
  const DB_VERSION = 1;
  const URL_CATALOGO = 'data/catalogo.json';

  let dbPromesa = null;

  function abrirDB() {
    if (dbPromesa) return dbPromesa;
    dbPromesa = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NOMBRE, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
        if (!db.objectStoreNames.contains('media')) db.createObjectStore('media');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromesa;
  }

  async function tx(store, modo, fn) {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {
      const t = db.transaction(store, modo);
      const s = t.objectStore(store);
      let resultado;
      const r = fn(s);
      if (r) r.onsuccess = () => { resultado = r.result; };
      t.oncomplete = () => resolve(resultado);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  }

  const idb = {
    get: (store, key) => tx(store, 'readonly', s => s.get(key)),
    set: (store, key, val) => tx(store, 'readwrite', s => s.put(val, key)),
    del: (store, key) => tx(store, 'readwrite', s => s.delete(key)),
    keys: (store) => tx(store, 'readonly', s => s.getAllKeys()),
    clear: (store) => tx(store, 'readwrite', s => s.clear())
  };

  function normalizar(cat) {
    cat = cat || {};
    const ajustes = Object.assign({
      negocio: CONFIG.NEGOCIO,
      whatsapp: CONFIG.WHATSAPP,
      eslogan: '',
      saludo: 'Hola, quiero cotizar los siguientes productos:'
    }, cat.ajustes || {});
    return {
      version: cat.version || 1,
      actualizado: cat.actualizado || new Date().toISOString(),
      ajustes,
      categorias: Array.isArray(cat.categorias) ? cat.categorias : [],
      productos: Array.isArray(cat.productos) ? cat.productos : []
    };
  }

  async function cargarPublicado() {
    const res = await fetch(URL_CATALOGO, { cache: 'no-cache' });
    if (!res.ok) throw new Error('No se pudo cargar el catálogo (' + res.status + ')');
    return normalizar(await res.json());
  }

  // ---------- Borrador del administrador ----------
  async function cargarBorrador() {
    const b = await idb.get('kv', 'borrador');
    return b ? normalizar(b) : null;
  }
  async function guardarBorrador(cat) {
    cat.actualizado = new Date().toISOString();
    await idb.set('kv', 'borrador', cat);
  }
  async function borrarBorrador() {
    await idb.del('kv', 'borrador');
    await idb.clear('media');
  }

  // ---------- Archivos subidos desde el panel ----------
  const urlsMedia = new Map();
  async function guardarMedia(ruta, blob) {
    await idb.set('media', ruta, blob);
    if (urlsMedia.has(ruta)) { URL.revokeObjectURL(urlsMedia.get(ruta)); urlsMedia.delete(ruta); }
  }
  const obtenerMedia = (ruta) => idb.get('media', ruta);
  const listarMedia = () => idb.keys('media');
  const borrarMedia = (ruta) => idb.del('media', ruta);

  // Devuelve una URL utilizable: si el archivo existe en IndexedDB (subido
  // desde el panel y aún no publicado) crea un object URL; si no, la ruta tal cual.
  async function resolverMedia(ruta) {
    if (!ruta) return '';
    if (/^(https?:|data:|blob:)/.test(ruta)) return ruta;
    if (urlsMedia.has(ruta)) return urlsMedia.get(ruta);
    try {
      const blob = await obtenerMedia(ruta);
      if (blob) {
        const u = URL.createObjectURL(blob);
        urlsMedia.set(ruta, u);
        return u;
      }
    } catch (e) { /* sin IndexedDB: usar la ruta */ }
    return ruta;
  }

  // ---------- Utilidades ----------
  function esc(txt) {
    return String(txt == null ? '' : txt)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function sinAcentos(txt) {
    return String(txt || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }
  function idYouTube(url) {
    const m = String(url || '').match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  // Color estable por texto (para las miniaturas sin imagen)
  function colorDe(txt) {
    let h = 0;
    for (const c of String(txt)) h = (h * 31 + c.charCodeAt(0)) % 360;
    return h;
  }
  function iniciales(txt) {
    return String(txt || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  window.Datos = {
    URL_CATALOGO, idb, normalizar, cargarPublicado,
    cargarBorrador, guardarBorrador, borrarBorrador,
    guardarMedia, obtenerMedia, listarMedia, borrarMedia, resolverMedia,
    esc, sinAcentos, idYouTube, colorDe, iniciales
  };
})();
