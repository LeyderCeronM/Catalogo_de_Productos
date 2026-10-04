/* ============================================================
   CONFIGURACIÓN DEL CATÁLOGO
   Edita SOLO los valores entre comillas.
   ============================================================ */
window.CONFIG = {
  // ---------- ACCESO AL PANEL DE ADMINISTRADOR ----------
  // Escribe aquí el usuario y la contraseña del dueño.
  ADMIN_USUARIO: 'admin',        // <-- cambia por tu usuario
  ADMIN_CLAVE:   'cambiar123',   // <-- cambia por tu contraseña

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
