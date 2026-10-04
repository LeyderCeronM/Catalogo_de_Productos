/* ============================================================
   Generador de archivos .zip (sin compresión, sin librerías)
   Uso: Zip.crear([{ nombre: 'data/catalogo.json', datos: 'texto' | Blob | Uint8Array }])
        -> Promise<Blob>
   ============================================================ */
(function () {
  const TABLA = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = TABLA[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  async function aBytes(datos) {
    if (datos instanceof Uint8Array) return datos;
    if (datos instanceof Blob) return new Uint8Array(await datos.arrayBuffer());
    return new TextEncoder().encode(String(datos));
  }

  function fechaDOS(d) {
    return {
      hora: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
      fecha: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
    };
  }

  async function crear(archivos) {
    const enc = new TextEncoder();
    const { hora, fecha } = fechaDOS(new Date());
    const partes = [];
    const central = [];
    let offset = 0;

    for (const a of archivos) {
      const nombre = enc.encode(a.nombre);
      const datos = await aBytes(a.datos);
      const crc = crc32(datos);

      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true);          // versión necesaria
      local.setUint16(6, 0x0800, true);      // nombres en UTF-8
      local.setUint16(8, 0, true);           // sin compresión
      local.setUint16(10, hora, true);
      local.setUint16(12, fecha, true);
      local.setUint32(14, crc, true);
      local.setUint32(18, datos.length, true);
      local.setUint32(22, datos.length, true);
      local.setUint16(26, nombre.length, true);
      local.setUint16(28, 0, true);
      partes.push(local.buffer, nombre, datos);

      const cd = new DataView(new ArrayBuffer(46));
      cd.setUint32(0, 0x02014b50, true);
      cd.setUint16(4, 20, true);
      cd.setUint16(6, 20, true);
      cd.setUint16(8, 0x0800, true);
      cd.setUint16(10, 0, true);
      cd.setUint16(12, hora, true);
      cd.setUint16(14, fecha, true);
      cd.setUint32(16, crc, true);
      cd.setUint32(20, datos.length, true);
      cd.setUint32(24, datos.length, true);
      cd.setUint16(28, nombre.length, true);
      cd.setUint32(42, offset, true);
      central.push(cd.buffer, nombre);

      offset += 30 + nombre.length + datos.length;
    }

    const tamCentral = central.reduce((s, p) => s + p.byteLength, 0);
    const fin = new DataView(new ArrayBuffer(22));
    fin.setUint32(0, 0x06054b50, true);
    fin.setUint16(8, archivos.length, true);
    fin.setUint16(10, archivos.length, true);
    fin.setUint32(12, tamCentral, true);
    fin.setUint32(16, offset, true);

    return new Blob([...partes, ...central, fin.buffer], { type: 'application/zip' });
  }

  window.Zip = { crear, crc32 };
})();
