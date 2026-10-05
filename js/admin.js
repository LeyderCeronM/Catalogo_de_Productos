/* ============================================================
   Panel del administrador
   ============================================================ */
(function () {
  const { esc, sinAcentos, idYouTube, colorDe, iniciales } = Datos;
  const $ = (s, el = document) => el.querySelector(s);
  const POR_PAGINA = 50;
  const MAX_INTENTOS = 5;
  const BLOQUEO_MIN = 5;

  let cat = null;          // borrador en edición
  let publicado = null;    // lo que está en el hosting (para saber si hay cambios)
  let mostrados = POR_PAGINA;

  document.addEventListener('DOMContentLoaded', () => {
    if (sesionValida()) entrar(); else mostrarLogin();
    eventosLogin();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  });

  // =========================================================
  // Sesión
  // =========================================================
  function sesionValida() {
    try { return Number(sessionStorage.getItem('admin-sesion')) > Date.now(); } catch (e) { return false; }
  }
  function iniciarSesion() {
    const min = CONFIG.SESION_MINUTOS || 120;
    sessionStorage.setItem('admin-sesion', String(Date.now() + min * 60000));
  }
  function cerrarSesion() {
    sessionStorage.removeItem('admin-sesion');
    location.reload();
  }
  function leerIntentos() {
    try { return JSON.parse(localStorage.getItem('admin-intentos')) || { n: 0, hasta: 0 }; } catch (e) { return { n: 0, hasta: 0 }; }
  }

  function mostrarLogin() {
    $('#vista-login').hidden = false;
    $('#vista-panel').hidden = true;
  }

  function eventosLogin() {
    $('#ver-clave').addEventListener('click', (e) => {
      const inp = $('#login-clave');
      const ver = inp.type === 'password';
      inp.type = ver ? 'text' : 'password';
      e.currentTarget.textContent = ver ? 'Ocultar' : 'Ver';
    });
    $('#form-login').addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = $('#login-error');
      const intentos = leerIntentos();
      if (intentos.hasta > Date.now()) {
        const min = Math.ceil((intentos.hasta - Date.now()) / 60000);
        err.textContent = `Demasiados intentos. Espera ${min} minuto(s).`;
        err.hidden = false;
        return;
      }
      const u = $('#login-usuario').value.trim();
      const c = $('#login-clave').value;
      const btn = e.target.querySelector('[type=submit]');
      btn.disabled = true;
      let ok = false;
      try {
        ok = u === CONFIG.ADMIN_USUARIO && (await Datos.hashClave(c, CONFIG.ADMIN_SAL)) === CONFIG.ADMIN_CLAVE_HASH;
      } catch (ex) {
        err.textContent = ex.message;
        err.hidden = false;
        btn.disabled = false;
        return;
      }
      btn.disabled = false;
      if (ok) {
        localStorage.removeItem('admin-intentos');
        iniciarSesion();
        $('#login-clave').value = '';
        entrar();
      } else {
        intentos.n++;
        if (intentos.n >= MAX_INTENTOS) { intentos.hasta = Date.now() + BLOQUEO_MIN * 60000; intentos.n = 0; }
        localStorage.setItem('admin-intentos', JSON.stringify(intentos));
        err.textContent = 'Usuario o contraseña incorrectos.';
        err.hidden = false;
        $('#login-clave').select();
      }
    });
  }

  // =========================================================
  // Carga
  // =========================================================
  let eventosListos = false;
  async function entrar() {
    $('#vista-login').hidden = true;
    $('#vista-panel').hidden = false;
    publicado = await cargarPublicadoReal();
    cat = await Datos.cargarBorrador();
    if (!cat) {
      cat = publicado ? JSON.parse(JSON.stringify(publicado)) : Datos.normalizar({});
      await Datos.guardarBorrador(cat);
    }
    asegurarCategorias();
    if (!eventosListos) { eventosPanel(); eventosListos = true; }
    pintarTodo();
    pintarConexion();
    limpiarMediaPublicada().catch(() => {});
    setInterval(() => { if (!sesionValida()) cerrarSesion(); }, 60000);
  }

  // Lo publicado de verdad: si hay conexión con GitHub se lee del repositorio
  // (así el estado es correcto aunque el panel se use desde localhost);
  // si no, el catalogo.json del sitio donde está abierto el panel.
  async function cargarPublicadoReal() {
    const c = GitHub.leerConexion();
    if (GitHub.configurada(c) && navigator.onLine) {
      try { return Datos.normalizar(await GitHub.leerPublicado(c)); } catch (e) { /* usar el del sitio */ }
    }
    try { return await Datos.cargarPublicado(); } catch (e) { return null; }
  }

  function asegurarCategorias() {
    for (const p of cat.productos) {
      if (p.categoria && !cat.categorias.includes(p.categoria)) cat.categorias.push(p.categoria);
    }
  }

  async function guardar() {
    await Datos.guardarBorrador(cat);
    pintarEstado();
  }

  function firma(c) {
    return c ? JSON.stringify([c.ajustes, c.categorias, c.productos]) : '';
  }

  function pintarTodo() {
    pintarEstado();
    pintarFiltroCategorias();
    pintarProductos();
    pintarCategorias();
    pintarAjustes();
    pintarEstadisticas();
  }

  function pintarEstado() {
    $('#adm-negocio').textContent = cat.ajustes.negocio || 'Administrar';
    const hayCambios = firma(cat) !== firma(publicado);
    const el = $('#estado-publicacion');
    el.textContent = !publicado ? 'No se pudo leer lo publicado (sin conexión)'
      : hayCambios ? '● Tienes cambios sin publicar' : '✓ Al día con lo publicado';
    el.classList.toggle('pendiente', hayCambios);
    $('#punto-cambios').hidden = !hayCambios;
  }

  // =========================================================
  // Productos
  // =========================================================
  function pintarFiltroCategorias() {
    const sel = $('#adm-filtro-cat');
    const actual = sel.value;
    sel.innerHTML = `<option value="">Todas las categorías</option>` +
      cat.categorias.map(c => `<option>${esc(c)}</option>`).join('') +
      `<option value="__sin">Sin categoría</option>`;
    sel.value = actual;
  }

  function productosFiltrados() {
    const palabras = sinAcentos($('#adm-buscar').value).split(/\s+/).filter(Boolean);
    const fc = $('#adm-filtro-cat').value;
    return cat.productos.filter(p => {
      if (fc === '__sin' ? p.categoria : (fc && p.categoria !== fc)) return false;
      if (!palabras.length) return true;
      const t = sinAcentos(p.nombre + ' ' + (p.ref || ''));
      return palabras.every(w => t.includes(w));
    });
  }

  function miniatura(p) {
    if (p.imagen) return `<img class="fp-img" data-media="${esc(p.imagen)}" alt="" loading="lazy">`;
    return `<div class="fp-img sin-imagen" style="--h:${colorDe(p.categoria || p.nombre)}"><span>${esc(iniciales(p.nombre))}</span></div>`;
  }

  async function resolverMiniaturas(raiz) {
    for (const img of raiz.querySelectorAll('img[data-media]')) {
      const r = img.dataset.media;
      img.removeAttribute('data-media');
      img.src = await Datos.resolverMedia(r);
    }
  }

  function pintarProductos() {
    const lista = productosFiltrados();
    const total = cat.productos.length;
    const visibles = cat.productos.filter(p => p.visible !== false).length;
    $('#adm-resumen').textContent = `${lista.length} de ${total} productos · ${visibles} visibles para los clientes`;
    const cont = $('#adm-lista');
    if (!lista.length) {
      cont.innerHTML = `<p class="vacio">No hay productos${total ? ' con ese filtro' : '. Crea el primero con “+ Nuevo producto”'}.</p>`;
      $('#btn-mas').hidden = true;
      return;
    }
    cont.innerHTML = lista.slice(0, mostrados).map(p => `
      <div class="fila-prod ${p.visible === false ? 'oculto' : ''}" data-id="${esc(p.id)}">
        ${miniatura(p)}
        <div class="fp-info">
          <strong>${esc(p.nombre)}</strong>
          <small>${[p.ref ? 'Ref. ' + esc(p.ref) : '', esc(p.categoria || 'Sin categoría'), p.video ? '▶ video' : ''].filter(Boolean).join(' · ')}</small>
        </div>
        <div class="fp-acciones">
          <label class="interruptor" title="Visible para los clientes">
            <input type="checkbox" data-visible ${p.visible !== false ? 'checked' : ''} aria-label="Visible">
            <span></span>
          </label>
          <button class="btn-estrella ${p.destacado ? 'activo' : ''}" data-destacar title="Destacado" aria-label="Destacado" aria-pressed="${!!p.destacado}">★</button>
          <button class="btn btn-sec btn-mini" data-editar>Editar</button>
          <button class="btn-borrar" data-borrar title="Eliminar" aria-label="Eliminar">
            <svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/></svg>
          </button>
        </div>
      </div>`).join('');
    $('#btn-mas').hidden = lista.length <= mostrados;
    resolverMiniaturas(cont);
  }

  async function eliminarProducto(id) {
    const p = cat.productos.find(x => x.id === id);
    if (!p || !confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
    cat.productos = cat.productos.filter(x => x.id !== id);
    await borrarMediaSiNoSeUsa(p.imagen);
    await borrarMediaSiNoSeUsa(p.video);
    await guardar();
    pintarProductos();
    pintarCategorias();
    toast('Producto eliminado');
  }

  async function borrarMediaSiNoSeUsa(ruta) {
    if (!ruta) return;
    const enUso = cat.productos.some(p => p.imagen === ruta || p.video === ruta);
    if (!enUso) await Datos.borrarMedia(ruta).catch(() => {});
  }

  // ---------- Editor ----------
  let edicion = null;   // { id, original, subidos: [] , guardado }

  function abrirEditor(id) {
    const p = id ? cat.productos.find(x => x.id === id) : null;
    const f = $('#form-editor');
    f.reset();
    $('#ed-titulo').textContent = p ? 'Editar producto' : 'Nuevo producto';
    $('#ed-categoria').innerHTML = `<option value="">Sin categoría</option>` +
      cat.categorias.map(c => `<option>${esc(c)}</option>`).join('') +
      `<option value="__nueva">+ Crear categoría nueva…</option>`;
    const filtro = $('#adm-filtro-cat').value;
    f.nombre.value = p ? p.nombre : '';
    f.ref.value = p ? p.ref || '' : '';
    f.categoria.value = p ? p.categoria || '' : (filtro && filtro !== '__sin' ? filtro : '');
    f.descripcion.value = p ? p.descripcion || '' : '';
    f.etiquetas.value = p ? (p.etiquetas || []).join(', ') : '';
    f.imagen.value = p ? p.imagen || '' : '';
    f.video.value = p ? p.video || '' : '';
    f.visible.checked = p ? p.visible !== false : true;
    f.destacado.checked = p ? !!p.destacado : false;
    edicion = { id: p ? p.id : null, original: p ? { imagen: p.imagen || '', video: p.video || '' } : { imagen: '', video: '' }, subidos: [], guardado: false };
    previsualizar();
    $('#dlg-editor').showModal();
    $('#dlg-editor .ed-cuerpo').scrollTop = 0;
  }

  async function previsualizar() {
    const f = $('#form-editor');
    const img = f.imagen.value.trim();
    const vid = f.video.value.trim();
    $('#ed-img-prev').innerHTML = img ? `<img src="${esc(await Datos.resolverMedia(img))}" alt="Vista previa">` : '<span class="nota">Sin imagen</span>';
    const yt = idYouTube(vid);
    $('#ed-vid-prev').innerHTML = !vid ? '<span class="nota">Sin video</span>'
      : yt ? `<img src="https://i.ytimg.com/vi/${yt}/hqdefault.jpg" alt="Miniatura de YouTube"><span class="nota">Video de YouTube</span>`
      : `<video src="${esc(await Datos.resolverMedia(vid))}" controls preload="metadata" playsinline></video>`;
  }

  function slug(txt) {
    return sinAcentos(txt).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'producto';
  }
  function aleatorio() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  async function procesarImagen(archivo) {
    if (/svg|gif/.test(archivo.type)) return { blob: archivo, ext: archivo.type.includes('svg') ? 'svg' : 'gif' };
    const MAX = 1200;
    let fuente;
    try { fuente = await createImageBitmap(archivo); } catch (e) {
      fuente = await new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = URL.createObjectURL(archivo);
      });
    }
    const w = fuente.width, h = fuente.height;
    const escala = Math.min(1, MAX / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * escala);
    canvas.height = Math.round(h * escala);
    canvas.getContext('2d').drawImage(fuente, 0, 0, canvas.width, canvas.height);
    const aBlob = (tipo, q) => new Promise(r => canvas.toBlob(r, tipo, q));
    let blob = await aBlob('image/webp', 0.82);
    let ext = 'webp';
    if (!blob || blob.type !== 'image/webp') { blob = await aBlob('image/jpeg', 0.85); ext = 'jpg'; }
    return { blob, ext };
  }

  async function subirImagen(archivo) {
    if (!archivo) return;
    if (!archivo.type.startsWith('image/')) { toast('El archivo no es una imagen.'); return; }
    const f = $('#form-editor');
    toast('Procesando imagen…');
    try {
      const { blob, ext } = await procesarImagen(archivo);
      const ruta = `media/img/${slug(f.nombre.value || archivo.name)}-${aleatorio()}.${ext}`;
      await Datos.guardarMedia(ruta, blob);
      edicion.subidos.push(ruta);
      f.imagen.value = ruta;
      previsualizar();
      toast(`Imagen lista (${(blob.size / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(e);
      toast('No se pudo procesar la imagen.');
    }
  }

  async function subirVideo(archivo) {
    if (!archivo) return;
    if (!archivo.type.startsWith('video/')) { toast('El archivo no es un video.'); return; }
    const mb = archivo.size / 1048576;
    if (mb > 20 && !confirm(`El video pesa ${mb.toFixed(1)} MB. Videos grandes tardan en cargar y ocupan espacio en los teléfonos de tus clientes. Se recomienda menos de 20 MB.\n\n¿Usarlo de todas formas?`)) return;
    const f = $('#form-editor');
    const ext = (archivo.name.split('.').pop() || 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4';
    const ruta = `media/video/${slug(f.nombre.value || archivo.name)}-${aleatorio()}.${ext}`;
    try {
      await Datos.guardarMedia(ruta, archivo);
      edicion.subidos.push(ruta);
      f.video.value = ruta;
      previsualizar();
      toast('Video listo');
    } catch (e) {
      console.error(e);
      toast('No se pudo guardar el video (¿espacio insuficiente?).');
    }
  }

  async function guardarEditor(e) {
    e.preventDefault();
    const f = $('#form-editor');
    const nombre = f.nombre.value.trim();
    if (!nombre) { f.nombre.focus(); return; }
    const datos = {
      nombre,
      ref: f.ref.value.trim(),
      categoria: f.categoria.value === '__nueva' ? '' : f.categoria.value,
      descripcion: f.descripcion.value.trim(),
      etiquetas: f.etiquetas.value.split(',').map(s => s.trim()).filter(Boolean),
      imagen: f.imagen.value.trim(),
      video: f.video.value.trim(),
      visible: f.visible.checked,
      destacado: f.destacado.checked
    };
    if (datos.ref) {
      const repetido = cat.productos.find(p => p.ref && p.ref.toLowerCase() === datos.ref.toLowerCase() && p.id !== edicion.id);
      if (repetido && !confirm(`La referencia "${datos.ref}" ya la usa "${repetido.nombre}". ¿Guardar de todas formas?`)) return;
    }
    if (edicion.id) {
      const p = cat.productos.find(x => x.id === edicion.id);
      Object.assign(p, datos);
    } else {
      cat.productos.unshift(Object.assign({ id: 'p' + aleatorio() }, datos));
    }
    edicion.guardado = true;
    // Archivos reemplazados o subidos y descartados
    for (const ruta of [edicion.original.imagen, edicion.original.video, ...edicion.subidos]) {
      await borrarMediaSiNoSeUsa(ruta);
    }
    await guardar();
    $('#dlg-editor').close();
    pintarProductos();
    pintarCategorias();
    toast((edicion && edicion.id ? 'Cambios guardados' : 'Producto creado') + '. Para que tus clientes lo vean, ve a Publicar.');
  }

  async function alCerrarEditor() {
    if (edicion && !edicion.guardado) {
      for (const ruta of edicion.subidos) await borrarMediaSiNoSeUsa(ruta);
    }
    $('#ed-vid-prev').innerHTML = '';
  }

  // =========================================================
  // Categorías
  // =========================================================
  function pintarCategorias() {
    const conteo = (c) => cat.productos.filter(p => p.categoria === c).length;
    const sin = cat.productos.filter(p => !p.categoria).length;
    $('#lista-cat').innerHTML = cat.categorias.map((c, i) => `
      <li data-i="${i}">
        <span class="cat-nombre">${esc(c)}</span>
        <span class="nota">${conteo(c)} productos</span>
        <span class="cat-acciones">
          <button class="btn-mini btn btn-sec" data-subir ${i === 0 ? 'disabled' : ''} aria-label="Subir">▲</button>
          <button class="btn-mini btn btn-sec" data-bajar ${i === cat.categorias.length - 1 ? 'disabled' : ''} aria-label="Bajar">▼</button>
          <button class="btn-mini btn btn-sec" data-renombrar>Renombrar</button>
          <button class="btn-mini btn btn-sec peligro" data-eliminar>Eliminar</button>
        </span>
      </li>`).join('') + (sin ? `<li class="cat-sin"><span class="cat-nombre">Sin categoría</span><span class="nota">${sin} productos</span></li>` : '');
  }

  async function accionCategoria(e) {
    const btn = e.target.closest('button');
    const li = e.target.closest('li[data-i]');
    if (!btn || !li) return;
    const i = Number(li.dataset.i);
    const nombre = cat.categorias[i];
    if (btn.hasAttribute('data-subir') || btn.hasAttribute('data-bajar')) {
      const j = btn.hasAttribute('data-subir') ? i - 1 : i + 1;
      [cat.categorias[i], cat.categorias[j]] = [cat.categorias[j], cat.categorias[i]];
    } else if (btn.hasAttribute('data-renombrar')) {
      const nuevo = (prompt('Nuevo nombre para la categoría:', nombre) || '').trim();
      if (!nuevo || nuevo === nombre) return;
      if (cat.categorias.includes(nuevo)) {
        if (!confirm(`Ya existe "${nuevo}". ¿Unir ambas categorías?`)) return;
        cat.categorias.splice(i, 1);
      } else {
        cat.categorias[i] = nuevo;
      }
      cat.productos.forEach(p => { if (p.categoria === nombre) p.categoria = nuevo; });
    } else if (btn.hasAttribute('data-eliminar')) {
      const n = cat.productos.filter(p => p.categoria === nombre).length;
      const msg = n ? `"${nombre}" tiene ${n} productos. Quedarán como "Sin categoría". ¿Eliminar la categoría?` : `¿Eliminar la categoría "${nombre}"?`;
      if (!confirm(msg)) return;
      cat.categorias.splice(i, 1);
      cat.productos.forEach(p => { if (p.categoria === nombre) p.categoria = ''; });
    } else return;
    await guardar();
    pintarCategorias();
    pintarFiltroCategorias();
    pintarProductos();
  }

  async function agregarCategoria(nombre) {
    nombre = (nombre || '').trim();
    if (!nombre) return false;
    if (cat.categorias.some(c => c.toLowerCase() === nombre.toLowerCase())) { toast('Esa categoría ya existe'); return false; }
    cat.categorias.push(nombre);
    await guardar();
    pintarCategorias();
    pintarFiltroCategorias();
    return true;
  }

  // =========================================================
  // Ajustes
  // =========================================================
  function pintarAjustes() {
    const f = $('#form-ajustes');
    const a = cat.ajustes;
    f.negocio.value = a.negocio || '';
    f.eslogan.value = a.eslogan || '';
    f.whatsapp.value = a.whatsapp || '';
    f.saludo.value = a.saludo || '';
  }

  async function guardarAjustes(e) {
    e.preventDefault();
    const f = e.target;
    const numero = f.whatsapp.value.replace(/\D/g, '');
    if (numero.length < 10 || numero.length > 15) { toast('Revisa el número: debe incluir el indicativo del país.'); f.whatsapp.focus(); return; }
    Object.assign(cat.ajustes, {
      negocio: f.negocio.value.trim(),
      eslogan: f.eslogan.value.trim(),
      whatsapp: numero,
      saludo: f.saludo.value.trim() || 'Hola, quiero cotizar los siguientes productos:'
    });
    f.whatsapp.value = numero;
    await guardar();
    toast('Ajustes guardados');
  }

  // =========================================================
  // Publicar
  // =========================================================
  // Archivos subidos desde el panel que todavía no están en el sitio publicado
  async function mediaPendiente() {
    const enIDB = new Set(await Datos.listarMedia());
    const yaPublicada = new Set(await leerMediaPublicada());
    const usados = new Set();
    for (const p of cat.productos) {
      for (const r of [p.imagen, p.video]) {
        if (r && enIDB.has(r) && !yaPublicada.has(r)) usados.add(r);
      }
    }
    return [...usados];
  }

  const leerMediaPublicada = async () => (await Datos.idb.get('kv', 'media-publicada').catch(() => null)) || [];

  // Cuando un archivo publicado ya responde desde el sitio, se borra la copia
  // local para liberar espacio en el dispositivo del administrador.
  async function limpiarMediaPublicada() {
    const lista = await leerMediaPublicada();
    if (!lista.length || !navigator.onLine) return;
    const c = GitHub.leerConexion();
    const base = GitHub.configurada(c) ? GitHub.urlSitio(c) : location.href;
    const quedan = [];
    for (const ruta of lista) {
      try {
        const res = await fetch(new URL(ruta, base).href, { method: 'HEAD', cache: 'no-store' });
        if (res.ok) { await Datos.borrarMedia(ruta); continue; }
      } catch (e) { /* sin conexión: se intenta otro día */ }
      quedan.push(ruta);
    }
    await Datos.idb.set('kv', 'media-publicada', quedan);
  }

  async function pintarEstadisticas() {
    const ps = cat.productos;
    const pend = await mediaPendiente();
    let bytes = 0;
    for (const r of pend) { const b = await Datos.obtenerMedia(r); if (b) bytes += b.size; }
    const dato = (n, t) => `<div><strong>${n}</strong><span>${t}</span></div>`;
    $('#estadisticas').innerHTML =
      dato(ps.length, 'productos') +
      dato(ps.filter(p => p.visible !== false).length, 'visibles') +
      dato(ps.filter(p => p.imagen).length, 'con imagen') +
      dato(ps.filter(p => p.video).length, 'con video') +
      dato(pend.length, `archivos nuevos (${(bytes / 1048576).toFixed(1)} MB)`);
  }

  function jsonParaPublicar() {
    const salida = {
      version: ((publicado && publicado.version) || cat.version || 0) + 1,
      actualizado: new Date().toISOString(),
      ajustes: cat.ajustes,
      categorias: cat.categorias,
      productos: cat.productos
    };
    return JSON.stringify(salida, null, 1);
  }

  function descargar(blob, nombre) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
  }

  const hoy = () => new Date().toISOString().slice(0, 10);

  async function descargarZip() {
    const btn = $('#btn-zip');
    btn.disabled = true;
    $('#zip-estado').textContent = 'Preparando paquete…';
    try {
      const archivos = [{ nombre: 'data/catalogo.json', datos: jsonParaPublicar() }];
      for (const ruta of await mediaPendiente()) {
        archivos.push({ nombre: ruta, datos: await Datos.obtenerMedia(ruta) });
      }
      const zip = await Zip.crear(archivos);
      descargar(zip, `catalogo-publicar-${hoy()}.zip`);
      $('#zip-estado').textContent = `Paquete listo: ${archivos.length} archivo(s), ${(zip.size / 1048576).toFixed(1)} MB. Súbelo a tu hosting.`;
    } catch (e) {
      console.error(e);
      $('#zip-estado').textContent = 'No se pudo crear el paquete: ' + e.message;
    }
    btn.disabled = false;
  }

  // ---------- Publicar directo en GitHub ----------
  function pintarConexion() {
    const c = GitHub.leerConexion();
    const f = $('#form-gh');
    f.owner.value = c.owner;
    f.repo.value = c.repo;
    f.rama.value = c.rama || 'main';
    f.token.value = '';
    f.token.placeholder = c.token ? '•••••••• (guardado en este dispositivo)' : 'github_pat_…';
    const lista = GitHub.configurada(c);
    $('#gh-config').open = !lista;
    $('#btn-gh-publicar').textContent = lista ? 'Publicar ahora en GitHub' : 'Configura la conexión con GitHub para publicar';
    $('#btn-gh-publicar').disabled = !lista;
    $('#gh-config summary').textContent = lista
      ? `Conexión con GitHub: ${c.owner}/${c.repo} (${c.rama}) ✓`
      : 'Conexión con GitHub (sin configurar)';
  }

  async function guardarConexionGH(e) {
    e.preventDefault();
    const f = e.target;
    const anterior = GitHub.leerConexion();
    const c = {
      owner: f.owner.value.trim(),
      repo: f.repo.value.trim().replace(/\.git$/, ''),
      rama: f.rama.value.trim() || 'main',
      token: f.token.value.trim() || anterior.token
    };
    if (!c.token) { toast('Pega el token de acceso de GitHub'); f.token.focus(); return; }
    const btn = f.querySelector('button:not([type=button])');
    btn.disabled = true;
    $('#gh-estado').textContent = 'Probando la conexión…';
    try {
      await GitHub.probar(c);
      GitHub.guardarConexion(c);
      $('#gh-estado').innerHTML = '<span class="ok">✓ Conexión correcta. Ya puedes publicar.</span>';
      pintarConexion();
      publicado = await cargarPublicadoReal();
      pintarEstado();
    } catch (err) {
      $('#gh-estado').textContent = '✗ ' + err.message;
    }
    btn.disabled = false;
  }

  async function publicarGitHub() {
    const c = GitHub.leerConexion();
    if (!GitHub.configurada(c)) { pintarConexion(); return; }
    if (!navigator.onLine) { toast('Necesitas internet para publicar'); return; }
    const btn = $('#btn-gh-publicar');
    btn.disabled = true;
    $('#gh-progreso').hidden = false;
    $('#gh-estado').textContent = '';
    try {
      const json = jsonParaPublicar();
      const rutasMedia = await mediaPendiente();
      const archivos = [{ ruta: 'data/catalogo.json', datos: json }];
      for (const r of rutasMedia) archivos.push({ ruta: r, datos: await Datos.obtenerMedia(r) });
      const n = cat.productos.length;
      const mensaje = `Actualizar catálogo desde el panel (${n} productos` +
        (rutasMedia.length ? `, ${rutasMedia.length} archivo(s) nuevo(s))` : ')');

      await GitHub.publicar(c, archivos, mensaje, (hechos, total, txt) => {
        $('#gh-barra').style.width = Math.round(hechos / total * 100) + '%';
        $('#gh-txt').textContent = `${txt} (${hechos}/${total})`;
      });

      const publicadas = await leerMediaPublicada();
      await Datos.idb.set('kv', 'media-publicada', [...new Set([...publicadas, ...rutasMedia])]);
      publicado = JSON.parse(json);
      pintarEstado();
      pintarEstadisticas();
      $('#gh-txt').textContent = '✓ Publicado en GitHub.';
      $('#gh-estado').textContent = 'GitHub Pages está actualizando el sitio (suele tardar 1–2 minutos)…';
      esperarDespliegue(publicado.version, c);
    } catch (err) {
      console.error(err);
      $('#gh-txt').textContent = '✗ No se pudo publicar.';
      $('#gh-estado').textContent = err.message;
      if (err.status === 401 || err.status === 404) $('#gh-config').open = true;
    }
    btn.disabled = false;
  }

  // Consulta el sitio público de GitHub Pages hasta que muestre la versión nueva (máx. ~5 min)
  async function esperarDespliegue(version, c) {
    const sitio = GitHub.urlSitio(c);
    const enlace = `<a href="${esc(sitio)}" target="_blank" rel="noopener">${esc(sitio)}</a>`;
    const notaLocal = GitHub.panelEnSitio(c) ? '' :
      '<br><small>Estás usando el panel desde otra dirección (por ejemplo <code>localhost</code>): esa copia no cambia. Tus clientes usan el enlace de arriba.</small>';
    const estado = $('#gh-estado');
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, i === 0 ? 4000 : 10000));
      try {
        const v = await GitHub.versionEnSitio(c);
        if (v === null) {
          const ajustes = `https://github.com/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/settings/pages`;
          estado.innerHTML = `Los cambios ya están guardados en GitHub, pero <strong>tu sitio público no existe todavía</strong> (${enlace} da error 404).` +
            ` Activa GitHub Pages en <a href="${ajustes}" target="_blank" rel="noopener">Settings → Pages</a>: ` +
            `<em>Deploy from a branch</em> → rama <code>${esc(c.rama)}</code> / <code>(root)</code> → Save. Seguiré revisando…`;
          continue;
        }
        if (v >= version) {
          estado.innerHTML = `<span class="ok">✓ Tus clientes ya ven los cambios en ${enlace}</span>${notaLocal}`;
          limpiarMediaPublicada().catch(() => {});
          return;
        }
        estado.innerHTML = `GitHub Pages está actualizando ${enlace} (suele tardar 1–2 minutos)…`;
      } catch (e) { /* sin conexión momentánea: seguir esperando */ }
    }
    estado.innerHTML = `Los cambios están guardados en GitHub; ${enlace} puede tardar unos minutos más en mostrarlos.${notaLocal}`;
  }

  async function importarJSON(archivo) {
    if (!archivo) return;
    try {
      const datos = JSON.parse(await archivo.text());
      if (!datos || !Array.isArray(datos.productos)) throw new Error('El archivo no tiene una lista de "productos".');
      if (!confirm(`Se reemplazará el catálogo actual por ${datos.productos.length} productos del archivo. ¿Continuar?`)) return;
      const nuevo = Datos.normalizar(datos);
      nuevo.productos.forEach(p => { if (!p.id) p.id = 'p' + aleatorio(); if (!p.nombre) p.nombre = 'Sin nombre'; });
      cat = nuevo;
      asegurarCategorias();
      await guardar();
      mostrados = POR_PAGINA;
      pintarTodo();
      toast('Catálogo importado');
    } catch (e) {
      alert('No se pudo importar: ' + e.message);
    }
  }

  async function descartar() {
    if (!publicado) { alert('No se puede leer el catálogo publicado (¿sin conexión?).'); return; }
    if (!confirm('Se perderán todos los cambios que no hayas publicado, incluidas las imágenes y videos subidos. ¿Continuar?')) return;
    await Datos.borrarBorrador();
    cat = JSON.parse(JSON.stringify(publicado));
    await guardar();
    mostrados = POR_PAGINA;
    pintarTodo();
    toast('Se restauró el catálogo publicado');
  }

  // =========================================================
  // Eventos
  // =========================================================
  function eventosPanel() {
    $('#btn-salir').addEventListener('click', cerrarSesion);

    document.querySelector('.pestanas').addEventListener('click', (e) => {
      const b = e.target.closest('[data-tab]');
      if (!b) return;
      document.querySelectorAll('.pestanas [data-tab]').forEach(x => x.setAttribute('aria-selected', x === b ? 'true' : 'false'));
      document.querySelectorAll('.tab').forEach(t => { t.hidden = t.id !== 'tab-' + b.dataset.tab; });
      if (b.dataset.tab === 'publicar') pintarEstadisticas();
    });

    // Productos
    let t;
    $('#adm-buscar').addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { mostrados = POR_PAGINA; pintarProductos(); }, 150); });
    $('#adm-filtro-cat').addEventListener('change', () => { mostrados = POR_PAGINA; pintarProductos(); });
    $('#btn-mas').addEventListener('click', () => { mostrados += POR_PAGINA; pintarProductos(); });
    $('#btn-nuevo').addEventListener('click', () => abrirEditor(null));
    $('#adm-lista').addEventListener('click', async (e) => {
      const fila = e.target.closest('.fila-prod');
      if (!fila) return;
      const id = fila.dataset.id;
      if (e.target.closest('[data-editar]')) abrirEditor(id);
      else if (e.target.closest('[data-borrar]')) eliminarProducto(id);
      else if (e.target.closest('[data-destacar]')) {
        const p = cat.productos.find(x => x.id === id);
        p.destacado = !p.destacado;
        const b = e.target.closest('[data-destacar]');
        b.classList.toggle('activo', p.destacado);
        b.setAttribute('aria-pressed', p.destacado);
        await guardar();
      }
    });
    $('#adm-lista').addEventListener('change', async (e) => {
      if (!e.target.matches('[data-visible]')) return;
      const fila = e.target.closest('.fila-prod');
      const p = cat.productos.find(x => x.id === fila.dataset.id);
      p.visible = e.target.checked;
      fila.classList.toggle('oculto', !p.visible);
      await guardar();
      toast(p.visible ? 'Ahora es visible para los clientes' : 'Oculto para los clientes');
    });

    // Editor
    const dlg = $('#dlg-editor');
    $('#form-editor').addEventListener('submit', guardarEditor);
    dlg.addEventListener('close', alCerrarEditor);
    dlg.addEventListener('click', (e) => { if (e.target.closest('[data-cerrar]')) dlg.close(); });
    $('#ed-img-archivo').addEventListener('change', (e) => { subirImagen(e.target.files[0]); e.target.value = ''; });
    $('#ed-vid-archivo').addEventListener('change', (e) => { subirVideo(e.target.files[0]); e.target.value = ''; });
    $('#ed-img-quitar').addEventListener('click', () => { $('#form-editor').imagen.value = ''; previsualizar(); });
    $('#ed-vid-quitar').addEventListener('click', () => { $('#form-editor').video.value = ''; previsualizar(); });
    $('#form-editor').imagen.addEventListener('change', previsualizar);
    $('#form-editor').video.addEventListener('change', previsualizar);
    $('#ed-categoria').addEventListener('change', async (e) => {
      if (e.target.value !== '__nueva') return;
      const nombre = (prompt('Nombre de la nueva categoría:') || '').trim();
      if (nombre && await agregarCategoria(nombre)) {
        e.target.insertBefore(new Option(nombre, nombre), e.target.querySelector('option[value="__nueva"]'));
      }
      e.target.value = cat.categorias.includes(nombre) ? nombre : '';
    });

    // Categorías
    $('#lista-cat').addEventListener('click', accionCategoria);
    $('#form-cat').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (await agregarCategoria($('#nueva-cat').value)) { $('#nueva-cat').value = ''; toast('Categoría agregada'); }
    });

    // Ajustes
    $('#form-ajustes').addEventListener('submit', guardarAjustes);
    $('#btn-probar-wa').addEventListener('click', () => {
      const n = $('#form-ajustes').whatsapp.value.replace(/\D/g, '');
      if (!n) { toast('Escribe primero el número'); return; }
      window.open('https://wa.me/' + n + '?text=' + encodeURIComponent('Mensaje de prueba del catálogo ✅'), '_blank', 'noopener');
    });

    // Publicar
    $('#btn-gh-publicar').addEventListener('click', publicarGitHub);
    $('#form-gh').addEventListener('submit', guardarConexionGH);
    $('#btn-gh-olvidar').addEventListener('click', () => {
      if (!confirm('¿Borrar el token de este dispositivo? Tendrás que pegarlo de nuevo para publicar.')) return;
      GitHub.olvidarToken();
      pintarConexion();
      $('#gh-estado').textContent = 'Token borrado de este dispositivo.';
    });
    $('#btn-zip').addEventListener('click', descargarZip);
    $('#btn-json').addEventListener('click', () => {
      descargar(new Blob([jsonParaPublicar()], { type: 'application/json' }), 'catalogo.json');
    });
    $('#input-importar').addEventListener('change', (e) => { importarJSON(e.target.files[0]); e.target.value = ''; });
    $('#btn-descartar').addEventListener('click', descartar);
  }

  let toastT;
  function toast(msg) {
    const el = $('#toast');
    const abierto = [...document.querySelectorAll('dialog[open]')].pop();
    (abierto || document.body).appendChild(el);
    el.textContent = msg;
    el.classList.add('visible');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('visible'), 2600);
  }
})();
