# Catálogo de productos con cotización por WhatsApp

Catálogo web **sin precios** para mostrar hasta 250 productos (o más) con fotos, videos y descripciones. Los clientes arman una lista de lo que les interesa y la envían por **WhatsApp** al dueño, que les responde con la cotización.

- **No necesita registro:** el cliente solo abre el enlace.
- **Funciona sin internet:** se instala en el celular como una app y se puede usar en zonas sin señal. Sin internet, la cotización se muestra como **código QR**.
- **Panel privado para el dueño:** agrega, edita y oculta productos desde el celular o el computador, protegido con usuario y contraseña. Los cambios se publican con un botón.
- Hecho solo con **HTML, CSS y JavaScript**, sin librerías externas. Se publica gratis en **GitHub Pages**.

**Sitio publicado:** <https://leyderceronm.github.io/Catalogo_de_Productos/> · **Panel:** <https://leyderceronm.github.io/Catalogo_de_Productos/admin.html>

## Contenido

- [Parte 1 · Manual del cliente](#parte-1--manual-del-cliente)
- [Parte 2 · Manual del administrador](#parte-2--manual-del-administrador)
- [Parte 3 · Guía técnica (desarrollador)](#parte-3--guía-técnica-desarrollador)

---

# Parte 1 · Manual del cliente

*Para las personas que consultan el catálogo y piden cotizaciones. También sirve para los empleados que muestran el catálogo en campo.*

## 1.1 Abrir el catálogo

Abre el enlace que te compartió el negocio. No necesitas crear una cuenta ni iniciar sesión.

**Instalarlo como app (recomendado):**

| Celular | Cómo instalarlo |
|---|---|
| **Android** (Chrome) | Toca el botón **⬇** que aparece arriba, o el menú **⋮** de Chrome → **Instalar aplicación** / **Agregar a pantalla de inicio**. |
| **iPhone** (Safari) | Toca **Compartir** (cuadro con flecha) → **Agregar a inicio**. |

Queda un ícono en tu pantalla y el catálogo abre como cualquier app, también sin internet.

## 1.2 Buscar productos

- **Buscador:** escribe el nombre, la referencia o una palabra de la descripción. No importa si escribes con o sin tildes.
- **Categorías:** toca una categoría (debajo del buscador) para ver solo esos productos. **Todos** quita el filtro. El número al lado indica cuántos productos hay en cada una.
- Los productos **Destacados** aparecen primero.
- Los productos van apareciendo a medida que bajas por la página.

## 1.3 Ver un producto

Toca la foto o el nombre para ver la **descripción completa** y el **video** (los productos con video tienen la etiqueta **▶ Video**).

- Puedes compartir un producto: copia la dirección del navegador mientras lo estás viendo; termina en `#p=...` y abre directamente ese producto.
- **Guardar video para ver sin conexión:** descarga ese video en tu celular.

## 1.4 Armar tu lista de cotización

1. Toca **+ Agregar** en cada producto que te interese, o en el detalle elige la cantidad y toca **Agregar a cotización**.
2. Ajusta las cantidades con **−** y **+**, directamente en la tarjeta o en la lista.
3. El botón **Cotizar** (arriba a la derecha) muestra cuántas unidades llevas. Tócalo para ver tu lista.
4. En la lista puedes cambiar cantidades, quitar productos con **×** o **Vaciar lista**.

La lista se guarda en tu celular aunque cierres la app.

## 1.5 Enviar la solicitud de cotización

En tu lista escribe, si quieres, **tu nombre** y un **comentario** (ciudad, forma de entrega, dudas…). Luego toca **Solicitar cotización por WhatsApp**:

### Con internet
Se abre WhatsApp con el mensaje listo y dirigido al negocio. Solo tienes que tocar **Enviar**:

```
Hola, quiero cotizar los siguientes productos:

1. *Taladro percutor Mini* (Ref. HER-1161) - Cant: 2
2. *Esmalte sintético Max* (Ref. PIN-1069) - Cant: 1

Total: 2 producto(s), 3 unidad(es)

Mi nombre: Juan Pérez
Comentario: Entrega en Popayán
```

Al volver al catálogo, la app pregunta si quieres **vaciar la lista** para empezar una nueva.

### Sin internet
La app lo detecta y, en lugar de abrir WhatsApp, muestra un **código QR**:

1. Escanea el QR con la **cámara de un celular que tenga WhatsApp e internet** (por ejemplo, el del cliente o el de otra persona que tenga datos).
2. Se abre WhatsApp en ese celular con la cotización lista. Toca **Enviar**.
3. En la app, toca **Ya se escaneó · Vaciar lista**.

> - También se muestra el QR si el celular tiene señal pero no datos: la app comprueba la conexión antes de abrir WhatsApp.
> - Si sí tienes internet y aun así apareció el QR (por ejemplo, con una conexión muy lenta), toca **¿Sí tienes internet? Abrir WhatsApp**.
> - El QR se escanea con facilidad hasta unos **13 productos**. Con más productos el código es más denso: sube el brillo de la pantalla y acerca la cámara. Con más de unos **34 productos** no cabe en un solo QR y la app pide **dividir la lista en dos**.

## 1.6 Usar el catálogo sin internet

Después de abrirlo una vez con internet, el catálogo abre sin conexión. Para tener también **todas las fotos y videos**:

1. Con WiFi, abre la app y toca **⋮** (arriba).
2. Marca **Incluir videos** si los quieres (ocupan más espacio).
3. Toca **Descargar catálogo** y espera a que diga **Listo**.

En esa misma ventana se ve la **fecha del catálogo guardado** y el espacio que ocupa. Cuando el negocio publique productos nuevos, repite el paso 3 con WiFi: solo descarga lo que falta.

Cuando no hay internet aparece arriba el aviso *"Sin conexión — estás viendo el catálogo guardado en tu dispositivo"*.

## 1.7 Empleados que trabajan en zonas sin internet

**Antes de salir (con WiFi):**
1. Instalar la app ([1.1](#11-abrir-el-catálogo)).
2. **⋮ → Incluir videos → Descargar catálogo** y esperar a que diga **Listo** ([1.6](#16-usar-el-catálogo-sin-internet)).
3. Revisar que haya espacio libre en el celular.

**En campo:**
1. Abrir la app **desde el ícono**, no desde el navegador.
2. Mostrar productos, fotos y videos al cliente.
3. Armar la lista y escribir el **nombre del cliente** en *Tu nombre*.
4. **Solicitar cotización por WhatsApp**: sin señal aparece el **QR**. El cliente lo escanea con su celular y envía el mensaje.
5. **Ya se escaneó · Vaciar lista** y atender al siguiente cliente.

## 1.8 Preguntas frecuentes

| Pregunta | Respuesta |
|---|---|
| ¿Por qué no hay precios? | El negocio envía la cotización personalizada por WhatsApp. |
| No veo un producto que me dijeron que existe | Búscalo por su nombre o referencia. Si usas la app sin internet, puede que tu catálogo guardado sea anterior: ábrelo con internet para actualizarlo. |
| Un video no carga sin internet | Ese video no se descargó. Con WiFi usa **⋮ → Incluir videos → Descargar catálogo**, o **Guardar video para ver sin conexión** en el producto. |
| El QR no se deja escanear | Sube el brillo de la pantalla, limpia la cámara y acércala. Si la lista es muy larga, divídela en dos. |
| Se borró mi catálogo descargado | Pasa si se borran los datos del navegador o si el celular se queda sin espacio. Vuelve a descargarlo con WiFi. |

---

# Parte 2 · Manual del administrador

*Para el dueño del negocio (o quien administra el catálogo).*

## 2.1 Entrar al panel

Abre `https://…/admin.html` (el panel no aparece enlazado en el catálogo, así que los clientes no lo ven) e ingresa tu **usuario** y **contraseña**.

- La sesión dura **2 horas**. Después vuelve a pedir la contraseña.
- Después de **5 intentos fallidos** el ingreso se bloquea **5 minutos** en ese dispositivo.
- **Salir** cierra la sesión.

Arriba del panel siempre verás el estado:

- **● Tienes cambios sin publicar**: hiciste cambios que tus clientes todavía no ven.
- **✓ Al día con lo publicado**: tus clientes ven exactamente lo mismo que tú.

## 2.2 Cómo funcionan los cambios: guardar → revisar → publicar

Es lo más importante del panel:

1. **Guardar:** todo lo que haces en el panel se guarda solo y al instante, pero **únicamente en tu navegador**.
2. **Revisar:** **Vista previa (solo tú)** abre el catálogo con tus cambios. Tiene una **franja amarilla** que dice *"VISTA PREVIA — solo la ves tú"*. **Tus clientes no ven esto.**
3. **Publicar:** en la pestaña **Publicar** tocas **Publicar ahora en GitHub**. En 1 a 2 minutos tus clientes ven los cambios.

Así puedes preparar muchos cambios con calma y publicarlos todos juntos cuando estén listos.

> **Edita siempre desde el mismo celular o computador y el mismo navegador.** Los cambios sin publicar viven ahí. Si cambias de dispositivo, publica antes.

**¿Cómo comprobar lo que ven tus clientes?** Abre el enlace del catálogo en una **ventana de incógnito** (Ctrl+Shift+N) o en otro celular.

## 2.3 Productos

**Crear:** **+ Nuevo producto**, completa los datos y toca **Guardar producto**.

| Campo | Para qué sirve |
|---|---|
| **Nombre** \* | Lo único obligatorio. |
| **Referencia / código** | Aparece en el catálogo y en el mensaje de WhatsApp, para que sepas exactamente qué producto te piden. Si repites una referencia, el panel te avisa. |
| **Categoría** | Elige una existente o **+ Crear categoría nueva…** |
| **Descripción** | Texto libre; respeta los saltos de línea. |
| **Palabras clave** | Separadas por coma. Ayudan a que el cliente encuentre el producto con el buscador (sinónimos, marca, usos). |
| **Imagen** | **Subir imagen** desde el celular o el computador. Se reduce sola a un tamaño liviano. También puedes pegar una dirección web de una imagen. |
| **Video** | **Subir video** (MP4 recomendado, **máximo 20 MB**; el panel avisa si es más pesado y GitHub no acepta archivos de más de 95 MB). También puedes pegar un enlace de **YouTube**, pero esos videos **no funcionan sin internet**. |
| **Visible para los clientes** | Desmárcalo para ocultar el producto sin borrarlo (por ejemplo, si está agotado). |
| **Destacado** | Aparece primero en el catálogo, con la etiqueta *Destacado*. |

**En la lista de productos:**
- **Buscar** por nombre o referencia y **filtrar** por categoría.
- **Interruptor verde**: visible u oculto para los clientes.
- **★**: destacado o no destacado.
- **Editar** y **🗑 Eliminar**. Eliminar no se puede deshacer, a menos que no publiques: puedes **descartar los cambios** ([2.7](#27-copias-de-seguridad-y-deshacer)).

Al guardar un producto, el panel te recuerda: *"Para que tus clientes lo vean, ve a Publicar."*

## 2.4 Categorías

- **Agregar** una categoría nueva.
- **▲ ▼**: cambian el orden en que el cliente ve las categorías.
- **Renombrar**: cambia el nombre en todos sus productos. Si eliges un nombre que ya existe, une las dos categorías.
- **Eliminar**: los productos de esa categoría quedan como **Sin categoría** y siguen apareciendo en **Todos**.

## 2.5 Ajustes

| Ajuste | Detalle |
|---|---|
| **Nombre del negocio** y **eslogan** | Aparecen en la parte de arriba del catálogo. |
| **Número de WhatsApp** | **El número que recibe las cotizaciones.** Con indicativo de país y sin "+". Colombia: `57` + celular, por ejemplo `573001234567`. Usa **Probar WhatsApp** para confirmar que es el correcto. |
| **Saludo del mensaje** | La primera línea del mensaje que envía el cliente. |

> Después de cambiar los ajustes, **publica** para que se apliquen a tus clientes.

## 2.6 Publicar

### Configurar la conexión con GitHub (una sola vez por dispositivo)

1. Entra a GitHub con la cuenta dueña del repositorio y abre <https://github.com/settings/personal-access-tokens/new>.
2. Completa:
   - **Token name:** `Catálogo`.
   - **Expiration:** por ejemplo 1 año. Cuando venza, crea otro igual.
   - **Repository access:** **Only select repositories** → el repositorio del catálogo.
   - **Permissions → Repository permissions → Contents:** **Read and write**.
3. Toca **Generate token** y **cópialo** (GitHub solo lo muestra una vez).
4. En el panel: **Publicar → Conexión con GitHub**. El usuario y el repositorio se llenan solos. Pega el token y toca **Guardar y probar conexión**. Debe decir **✓ Conexión correcta**.

El token se guarda **solo en ese dispositivo**: no queda en el código ni en el repositorio, y solo sirve para modificar los archivos de ese repositorio.

### Publicar los cambios

**Publicar → Publicar ahora en GitHub.** Una barra muestra el avance de la subida y luego:

1. *"✓ Publicado en GitHub."*
2. *"GitHub Pages está actualizando el sitio…"*
3. *"✓ Tus clientes ya ven los cambios."* (normalmente en 1 a 2 minutos).

El panel sube solo lo necesario: el catálogo y las **fotos y videos nuevos**. Cuando el sitio ya los muestra, borra la copia local para liberar espacio en tu dispositivo.

### Publicar manualmente (alternativa)

Si no usas la conexión con GitHub: **Descargar paquete (.zip)**, descomprímelo y en GitHub ve a **Add file → Upload files**. Arrastra las carpetas `data` y `media` y toca **Commit changes**. Al subir por la web, el límite es de 25 MB por archivo.

## 2.7 Copias de seguridad y deshacer

- **Descargar solo catalogo.json:** guarda una copia de todos los productos, categorías y ajustes. Hazlo de vez en cuando.
- **Importar catalogo.json:** reemplaza todo el catálogo por el de un archivo (por ejemplo, una copia de seguridad).
- **Descartar cambios y volver a lo publicado:** borra todo lo que no hayas publicado, incluidas las fotos y videos subidos, y deja el panel igual a lo que ven tus clientes.

## 2.8 Cambiar usuario y contraseña

La contraseña no se guarda en ningún lado: solo una "huella" cifrada que no permite recuperarla.

1. Abre `https://…/generar-clave.html`. También hay un enlace en **Ajustes → Crear credenciales**.
2. Escribe el usuario nuevo y la contraseña (mínimo 8 caracteres) dos veces → **Generar** → **Copiar**.
3. En GitHub abre el repositorio → carpeta `js` → `config.js` → ícono del **lápiz**.
4. Reemplaza las 3 líneas `ADMIN_USUARIO`, `ADMIN_SAL` y `ADMIN_CLAVE_HASH` por las que copiaste → **Commit changes**.
5. En 1 o 2 minutos la nueva contraseña queda activa.

> **¿Olvidaste la contraseña?** No se puede recuperar, pero puedes crear una nueva con estos mismos pasos, porque solo necesitas acceso a GitHub.

## 2.9 Problemas frecuentes

| Problema | Solución |
|---|---|
| Creé un producto pero mis clientes no lo ven | Falta **publicar** ([2.6](#26-publicar)). La Vista previa solo la ves tú. |
| "El token no es válido o ya venció" | Crea un token nuevo ([2.6](#configurar-la-conexión-con-github-una-sola-vez-por-dispositivo)) y guárdalo en **Conexión con GitHub**. |
| "El token no tiene permiso para escribir" | En GitHub, edita el token y dale **Contents: Read and write** para este repositorio. |
| "No se encontró el repositorio o la rama" | Revisa el usuario, el repositorio y la rama (`main`) en **Conexión con GitHub**. |
| Las cotizaciones no me llegan | Revisa el **número de WhatsApp** en **Ajustes**, toca **Probar WhatsApp** y **publica**. |
| No veo mis cambios en otro dispositivo | Los cambios sin publicar viven en el dispositivo donde los hiciste. Publícalos desde ese dispositivo. |
| Un video no se sube | Pesa demasiado. Comprímelo a menos de 20 MB (por ejemplo, grabándolo en 720p). |
| Cambié algo y el catálogo se ve igual | Espera 1 o 2 minutos después de publicar y **recarga** la página. Si sigue igual, ciérrala y vuelve a abrirla. |
| Perdí el celular donde administraba | En GitHub → *Settings → Developer settings → Personal access tokens*, **borra el token**. Cambia la contraseña ([2.8](#28-cambiar-usuario-y-contraseña)). |

---

# Parte 3 · Guía técnica (desarrollador)

## 3.1 Probar en el computador

El Service Worker solo funciona en `https://` o `localhost`, así que no basta con abrir `index.html` con doble clic. Desde la carpeta del proyecto:

```bash
python -m http.server 8080
```

Catálogo: <http://localhost:8080> · Panel: <http://localhost:8080/admin.html> · Credenciales: <http://localhost:8080/generar-clave.html>

## 3.2 Publicar en GitHub Pages

1. Repositorio **público** en GitHub (GitHub Pages gratis lo exige).
2. Sube el proyecto:
   ```bash
   git push -u origin main
   ```
3. En el repositorio: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
4. Queda en `https://USUARIO.github.io/REPOSITORIO/` en 1 o 2 minutos.

El archivo `.nojekyll` hace que GitHub publique los archivos tal cual. Todas las rutas son relativas, así que funciona en la raíz de un dominio o dentro de una subcarpeta como `/REPOSITORIO/`. También sirve cualquier hosting con HTTPS (Netlify, Cloudflare Pages…), pero el botón **Publicar ahora** necesita que el sitio salga de un repositorio de GitHub.

## 3.3 Entrega al cliente

1. Cambia las credenciales con el dueño presente ([2.8](#28-cambiar-usuario-y-contraseña)): él escribe su contraseña y tú pegas la huella en `config.js`.
2. Configura en **Ajustes** el número de WhatsApp real y el nombre del negocio, y **publica**.
3. Reemplaza los 250 productos de ejemplo (por ejemplo **Importar catalogo.json** con los productos reales) o elimínalos.
4. Configura el token en el dispositivo del dueño ([2.6](#26-publicar)).
5. Propiedad del sitio: **transfiere el repositorio** a la cuenta de GitHub del cliente (*Settings → General → Danger Zone → Transfer ownership*). Así el enlace pasa a `https://CLIENTE.github.io/REPOSITORIO/`. La otra opción es mantenerlo en tu cuenta como servicio.
6. Activa la **verificación en dos pasos** en la cuenta de GitHub que quede como dueña.

## 3.4 Estructura

```
index.html             Catálogo público
admin.html             Panel del administrador
generar-clave.html     Genera la huella de usuario/contraseña para config.js
manifest.webmanifest   Datos de la app instalable (PWA)
sw.js                  Service Worker: offline y caché de imágenes y videos
.nojekyll              GitHub Pages publica los archivos sin procesarlos
css/estilos.css        Estilos del catálogo (colores de marca en :root)
css/admin.css          Estilos del panel
js/config.js           Usuario, huella de la contraseña y valores por defecto
js/datos.js            Carga del catálogo, IndexedDB y verificación de contraseña
js/app.js              Catálogo: búsqueda, detalle, lista, WhatsApp y QR
js/admin.js            Lógica del panel
js/github.js           Publicación en GitHub (un commit por publicación)
js/qr.js               Generador de códigos QR (sin librerías)
js/zip.js              Generador de .zip (sin librerías)
data/catalogo.json     Catálogo publicado (ajustes, categorías y productos)
media/img, media/video Imágenes y videos subidos desde el panel
icons/                 Íconos de la app
```

## 3.5 Cómo funciona por dentro

**Datos.** `data/catalogo.json` contiene `ajustes`, `categorias` y `productos`. Cada producto tiene `id, ref, nombre, categoria, descripcion, etiquetas[], imagen, video, visible, destacado`. El panel trabaja sobre un **borrador** en IndexedDB (`catalogo-db`: `kv` para el borrador y `media` para los archivos subidos). `index.html?preview=1` muestra ese borrador.

**Offline (Service Worker `sw.js`).**

| Recurso | Estrategia |
|---|---|
| HTML, CSS, JS e íconos | Se guardan al instalar. Se sirven desde la caché y se actualizan en segundo plano. |
| `data/catalogo.json` y `js/config.js` | Primero la red (6 s); si no hay, la copia guardada. |
| Imágenes | Primero la caché; se guardan a medida que se ven. |
| Videos | Desde la caché si están descargados, incluidas las peticiones por rangos (`206`), para poder adelantar el video sin conexión. Si no, desde la red sin guardarlos. |

**Cotización.** `wa.me/<número>?text=<mensaje>`. Antes de abrir el enlace, la app comprueba si hay internet de verdad (`navigator.onLine` más una petición a `wa.me` con un límite de 2,5 s). Sin internet, el mismo enlace se convierte en un QR con `js/qr.js`: modo byte UTF-8, versiones 1 a 40, corrección L/M, dibujado en SVG con estilos en línea. Se verificó con un Reed-Solomon independiente y con el lector ZXing.

**Publicación.** `js/github.js` usa la API de Git de GitHub: crea los blobs, el árbol y el commit, y después actualiza la rama (`PATCH refs/heads/main`). Todo queda en un solo commit. Si la rama cambió mientras tanto, reintenta. Luego consulta `catalogo.json` hasta ver la nueva `version`.

**Contraseña.** PBKDF2-SHA256 con 150 000 iteraciones y una sal aleatoria (Web Crypto). `config.js` guarda el usuario, la sal y la huella.

## 3.6 Seguridad

- No hay servidor: la contraseña se verifica en el navegador. Como el repositorio es público, solo se publica la huella cifrada. Usa contraseñas largas y únicas.
- El panel **no puede cambiar lo que ven los clientes** sin un token de GitHub válido. La protección real es la cuenta de GitHub y el token (de alcance mínimo y con vencimiento).
- El token se guarda en el `localStorage` del dispositivo del administrador; nunca va al repositorio.

## 3.7 Actualizar la app

Los cambios de HTML, CSS o JS llegan a los usuarios en su **siguiente visita**. Si cambias muchos archivos, sube `VERSION` en [`sw.js`](sw.js) para forzar que todos los dispositivos renueven la caché. Si agregas archivos a la app, inclúyelos en `ARCHIVOS_APP`.

## 3.8 Limitaciones

- Los cambios no se sincronizan entre dispositivos del administrador: lo que no se ha publicado vive en un solo navegador. Para que varias personas editen a la vez en tiempo real haría falta un servidor (por ejemplo Firebase o Supabase).
- Los videos de YouTube no funcionan sin internet.
- Un QR admite hasta unos 34 productos.
- Si el usuario borra los datos del navegador, se pierde el catálogo descargado y, en el caso del administrador, los cambios sin publicar.
