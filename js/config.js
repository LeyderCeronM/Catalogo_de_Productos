/* ============================================================
   CONFIGURACIÓN DEL CATÁLOGO
   Edita SOLO los valores entre comillas.
   ============================================================ */
window.CONFIG = {
  // ---------- ACCESO AL PANEL DE ADMINISTRADOR ----------
  // La contraseña NO se escribe aquí: solo su huella cifrada.
  // Para cambiar usuario/contraseña abre  generar-clave.html  en el sitio,
  // escribe tus datos y pega aquí las 3 líneas que te entrega.
  // (Credenciales de demostración: admin / cambiar123 — cámbialas al entregar)
  ADMIN_USUARIO: 'admin',
  ADMIN_SAL: '86d8eee5f6dd12adeee1c8316bcd7717',
  ADMIN_CLAVE_HASH: '39c3551e471b9a6983c378aab97788ff7492f5aaa01cfb9deb93421fd1d0f865',

  // Minutos que dura la sesión del administrador antes de pedir clave otra vez.
  SESION_MINUTOS: 120,

  // ---------- VALORES POR DEFECTO ----------
  // Se usan sólo si el catálogo publicado (data/catalogo.json) no trae "ajustes".
  // Desde el panel de administrador puedes cambiarlos sin tocar este archivo.
  NEGOCIO: 'Mi Catálogo',
  // Número de WhatsApp con indicativo de país, sin "+", espacios ni guiones.
  // Ejemplo Colombia: 573001234567
  WHATSAPP: '573000000000',

  // Productos que se muestran por "página" mientras el cliente hace scroll.
  PRODUCTOS_POR_PAGINA: 24
};
