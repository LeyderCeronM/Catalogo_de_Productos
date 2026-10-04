# Catálogo PWA con cotización por WhatsApp

Catálogo web **sin precios** que funciona **sin conexión**, se puede instalar en el celular como app y permite que el cliente arme una lista de productos y la envíe por **WhatsApp** al dueño para que este le haga la cotización.

Hecho solo con **HTML, CSS y JavaScript** (sin frameworks ni librerías).

## 1. Poner tu usuario y contraseña de administrador

Abre [`js/config.js`](js/config.js) y cambia:

```js
ADMIN_USUARIO: 'admin',        // <-- tu usuario
ADMIN_CLAVE:   'cambiar123',   // <-- tu contraseña
WHATSAPP:      '573000000000', // <-- número por defecto (también se cambia desde el panel)
```

El panel queda en `https://tu-sitio.com/admin.html` (no aparece enlazado en el catálogo).

## 2. Probarlo en tu computador

El Service Worker solo funciona en `https://` o en `localhost`, así que no basta con abrir el `index.html` con doble clic. Desde esta carpeta:

```bash
python -m http.server 8080
```

Luego abre <http://localhost:8080> (catálogo) y <http://localhost:8080/admin.html> (panel).

## 3. Cómo lo usa el cliente

1. Abre el enlace del catálogo (no necesita registrarse).
2. Busca o filtra por categoría, toca un producto para ver la descripción y el video.
3. Pulsa **+ Agregar** en los que le interesan y ajusta cantidades.
4. En **Cotizar** escribe (opcional) su nombre y un comentario y pulsa **Solicitar cotización por WhatsApp**: se abre WhatsApp con un mensaje como este, dirigido a tu número:

```
Hola, quiero cotizar los siguientes productos:

1. *Taladro percutor Mini* (Ref. HER-1161) — Cant: 2
2. *Esmalte sintético Max* (Ref. PIN-1069) — Cant: 1

Total: 2 producto(s), 3 unidad(es)

Mi nombre: Juan Pérez
Comentario: Entrega en Popayán
```

**Sin conexión:** después de la primera visita el catálogo abre sin internet. En el menú **⋮** el cliente puede usar **Descargar catálogo** para guardar todas las imágenes (y opcionalmente los videos). Desde el detalle de un producto también puede guardar un video puntual.

## 4. Cómo administra el dueño

En `admin.html`, después de ingresar:

| Pestaña | Qué hace |
|---|---|
| **Productos** | Crear, editar, eliminar, ocultar/mostrar y destacar productos. Subir imagen (se reduce automáticamente a 1200 px en WebP) y video (MP4 recomendado, menos de 20 MB) o pegar un enlace (ruta, URL o YouTube). |
| **Categorías** | Crear, renombrar, ordenar y eliminar categorías. |
| **Ajustes** | Nombre del negocio, eslogan, número de WhatsApp y saludo del mensaje. Botón para probar WhatsApp. |
| **Publicar** | Vista previa, descargar el paquete `.zip` para publicar, exportar/importar `catalogo.json` y descartar cambios. |

### Publicar los cambios (importante)

Este proyecto es un **sitio estático**: no tiene servidor ni base de datos. Por eso, lo que el dueño edita se guarda automáticamente **en su propio navegador** (IndexedDB), y lo ve al instante con **Vista previa**. Para que los clientes lo vean:

1. Pestaña **Publicar** → **Descargar paquete para publicar (.zip)**.
2. Descomprime el .zip: trae `data/catalogo.json` y la carpeta `media/` con las imágenes y videos nuevos.
3. Súbelos al hosting reemplazando `data/catalogo.json` y agregando lo de `media/`.

Los clientes reciben la nueva versión la próxima vez que abran el catálogo con internet. El panel muestra “● Tienes cambios sin publicar” hasta que lo publicado coincida con el borrador.

> Edita siempre desde el **mismo navegador y dispositivo**: el borrador vive ahí. Usa **Descargar solo catalogo.json** como copia de seguridad.

## 5. Dónde publicarlo (gratis, con HTTPS)

- **Netlify Drop**: arrastra la carpeta del proyecto a <https://app.netlify.com/drop>. Para actualizar, vuelve a arrastrarla.
- **GitHub Pages**, **Cloudflare Pages** o cualquier hosting con HTTPS.

## Estructura

```
index.html            Catálogo público
admin.html            Panel del administrador
manifest.webmanifest  Datos de la app instalable
sw.js                 Service Worker (offline y caché de imágenes/videos)
css/estilos.css       Estilos del catálogo (colores de marca en :root)
css/admin.css         Estilos del panel
js/config.js          USUARIO, CONTRASEÑA y valores por defecto
js/datos.js           Carga del catálogo y almacenamiento local (IndexedDB)
js/app.js             Catálogo, búsqueda, detalle, carrito y WhatsApp
js/admin.js           Lógica del panel
js/zip.js             Generador de .zip sin librerías
data/catalogo.json    Productos publicados (trae 250 de ejemplo)
media/img, media/video  Imágenes y videos
icons/                Íconos de la app
```

## Notas

- **Seguridad del panel:** como no hay servidor, el usuario y la contraseña están en `js/config.js`, que cualquiera con conocimientos técnicos puede leer. El panel solo edita el borrador del navegador del dueño; **nadie puede cambiar lo que ven los clientes sin subir archivos al hosting**, así que la protección real es la cuenta del hosting. Usa una contraseña que no uses en otro lado. Si en el futuro se necesita edición en línea en tiempo real desde varios dispositivos, el siguiente paso es conectar un backend (por ejemplo Firebase o Supabase).
- **Rendimiento con 250+ productos:** los productos se muestran de 24 en 24 mientras se hace scroll, las imágenes cargan de forma diferida y los videos solo se descargan al abrir el producto.
- **Videos de YouTube:** se pueden usar, pero no funcionan sin conexión. Para uso offline sube el MP4.
- **Actualizar la app:** si cambias archivos HTML/CSS/JS, los cambios llegan en la siguiente visita. Para forzar la actualización en todos los dispositivos sube `VERSION` en [`sw.js`](sw.js).
- **Datos de ejemplo:** los 250 productos de `data/catalogo.json` son de demostración. Puedes reemplazarlos desde el panel, o importar tu propio `catalogo.json`.
