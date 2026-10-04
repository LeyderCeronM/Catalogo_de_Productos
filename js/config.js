/* ============================================================
   CONFIGURACIÓN DEL CATÁLOGO
   Edita SOLO los valores entre comillas.
   ============================================================ */
window.CONFIG = {
  // ---------- ACCESO AL PANEL DE ADMINISTRADOR ----------
  // La contraseña NO se escribe aquí: solo su huella cifrada.
  // Para cambiar usuario/contraseña abre  generar-clave.html  en el sitio,
  // escribe tus datos y pega aquí las 3 líneas que te entrega.
  ADMIN_USUARIO: "robinson",
  ADMIN_SAL: '881897b9816eb2cd658f2eb0a4f8fe4b',
  ADMIN_CLAVE_HASH: 'be5aeb5a78dc7dabac3f4aa5bc77fed9d6e04ab884ea4dad2a128b80505f0dfe',

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
