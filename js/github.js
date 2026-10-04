/* ============================================================
   Publicación directa en GitHub (API REST, sin librerías)
   Sube todos los archivos en UN solo commit:
   blobs -> árbol -> commit -> mover la rama.
   El token se guarda únicamente en el navegador del administrador.
   ============================================================ */
(function () {
  const API = 'https://api.github.com';
  const CLAVE = 'gh-conexion';
  const MAX_BYTES = 95 * 1024 * 1024;   // la API acepta archivos de hasta 100 MB

  function leerConexion() {
    let c = null;
    try { c = JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { /* vacío */ }
    return Object.assign({ owner: '', repo: '', rama: 'main', token: '' }, detectar(), c || {});
  }
  function guardarConexion(c) {
    localStorage.setItem(CLAVE, JSON.stringify({ owner: c.owner, repo: c.repo, rama: c.rama, token: c.token }));
  }
  function olvidarToken() {
    const c = leerConexion();
    c.token = '';
    guardarConexion(c);
  }
  const configurada = (c) => !!(c.owner && c.repo && c.rama && c.token);

  // Si el sitio ya está en usuario.github.io/repositorio, se deduce solo.
  function detectar() {
    const h = location.hostname;
    if (!h.endsWith('.github.io')) return {};
    const owner = h.split('.')[0];
    const seg = location.pathname.split('/').filter(Boolean)[0];
    const repo = seg && !/\.html?$/.test(seg) ? seg : h;
    return { owner, repo };
  }

  function rutaRepo(c, resto) {
    return `${API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}${resto}`;
  }
  const rama = (c) => c.rama.split('/').map(encodeURIComponent).join('/');

  async function api(c, metodo, resto, cuerpo) {
    let res;
    try {
      res = await fetch(rutaRepo(c, resto), {
        method: metodo,
        cache: 'no-store',
        headers: Object.assign({
          Authorization: 'Bearer ' + c.token,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }, cuerpo ? { 'Content-Type': 'application/json' } : {}),
        body: cuerpo ? JSON.stringify(cuerpo) : undefined
      });
    } catch (e) {
      throw Object.assign(new Error('No hay conexión con GitHub. Revisa tu internet e inténtalo de nuevo.'), { status: 0 });
    }
    if (!res.ok) {
      const datos = await res.json().catch(() => ({}));
      throw errorAmigable(res.status, datos.message || '');
    }
    return res.status === 204 ? null : res.json();
  }

  function errorAmigable(status, msg) {
    let texto;
    if (status === 401) texto = 'El token no es válido o ya venció. Crea uno nuevo en GitHub y guárdalo en "Conexión con GitHub".';
    else if (status === 403 && /rate limit/i.test(msg)) texto = 'GitHub limitó las peticiones por un momento. Espera unos minutos e inténtalo de nuevo.';
    else if (status === 403) texto = 'El token no tiene permiso para escribir. En GitHub dale el permiso "Contents: Read and write" para este repositorio.';
    else if (status === 404) texto = 'No se encontró el repositorio o la rama, o el token no tiene acceso a ese repositorio. Revisa usuario, repositorio y rama.';
    else if (status === 409) texto = 'El repositorio está vacío. Sube primero el proyecto completo al repositorio.';
    else if (status === 422) texto = 'GitHub rechazó el cambio (' + msg + ').';
    else texto = 'Error de GitHub (' + status + '): ' + msg;
    return Object.assign(new Error(texto), { status, original: msg });
  }

  async function probar(c) {
    const repo = await api(c, 'GET', '');
    await api(c, 'GET', `/git/ref/heads/${rama(c)}`);
    if (repo.permissions && repo.permissions.push === false) {
      throw new Error('Tu cuenta no tiene permiso de escritura en este repositorio.');
    }
    return repo;
  }

  function aBase64(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(',')[1] || '');
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });
  }

  // archivos: [{ ruta: 'data/catalogo.json', datos: string | Blob }]
  async function publicar(c, archivos, mensaje, alAvanzar) {
    const grande = archivos.find(a => a.datos instanceof Blob && a.datos.size > MAX_BYTES);
    if (grande) throw new Error(`"${grande.ruta}" pesa más de 95 MB; GitHub no lo acepta. Usa un archivo más liviano.`);

    const total = archivos.length + 1;
    const arbol = [];
    for (let i = 0; i < archivos.length; i++) {
      const a = archivos[i];
      alAvanzar && alAvanzar(i, total, 'Subiendo ' + a.ruta.split('/').pop());
      const cuerpo = typeof a.datos === 'string'
        ? { content: a.datos, encoding: 'utf-8' }
        : { content: await aBase64(a.datos), encoding: 'base64' };
      const blob = await api(c, 'POST', '/git/blobs', cuerpo);
      arbol.push({ path: a.ruta, mode: '100644', type: 'blob', sha: blob.sha });
    }

    alAvanzar && alAvanzar(archivos.length, total, 'Guardando cambios en GitHub…');
    // Si alguien más cambió la rama justo en este momento, se reintenta.
    for (let intento = 0; ; intento++) {
      const ref = await api(c, 'GET', `/git/ref/heads/${rama(c)}`);
      const padre = ref.object.sha;
      const commitPadre = await api(c, 'GET', `/git/commits/${padre}`);
      const nuevoArbol = await api(c, 'POST', '/git/trees', { base_tree: commitPadre.tree.sha, tree: arbol });
      const commit = await api(c, 'POST', '/git/commits', { message: mensaje, tree: nuevoArbol.sha, parents: [padre] });
      try {
        await api(c, 'PATCH', `/git/refs/heads/${rama(c)}`, { sha: commit.sha, force: false });
        alAvanzar && alAvanzar(total, total, 'Publicado');
        return commit;
      } catch (e) {
        if (e.status === 422 && intento < 2) continue;
        throw e;
      }
    }
  }

  window.GitHub = { leerConexion, guardarConexion, olvidarToken, configurada, probar, publicar };
})();
