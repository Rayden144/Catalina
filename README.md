# Catalina

Web interactiva, en español y adaptada a teléfonos, para reconocer emociones y explorar prácticas educativas de autocuidado. Incluye tristeza, estrés, enojo, felicidad y angustia, recomendaciones, una reflexión temporal y un ejercicio de respiración con opción de detenerlo.

Está construida con HTML, CSS y JavaScript sin frameworks, dependencias de producción, cuentas, analítica ni fuentes externas. No requiere backend ni claves. El texto de reflexión permanece en memoria y se borra al cerrar su ventana; no se envía ni se almacena.

El contenido es orientación general, no diagnóstico ni tratamiento. Antes de utilizarlo en un establecimiento educativo, revisar su pertinencia y lenguaje con profesionales de psicopedagogía y salud mental, considerando la edad de los participantes. No se presenta como contenido clínicamente validado.

## Publicar gratis en GitHub Pages (recomendado)

1. Sube `index.html`, `styles.css`, `app.js` y este README a la raíz del repositorio `Rayden144/Catalina`, en la rama `main`. Puedes hacerlo desde GitHub con **Add file → Upload files** o mediante Git. No basta con tener un repositorio vacío.
2. En GitHub, abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Elige la rama **main**, la carpeta **/ (root)** y pulsa **Save**.
5. Espera a que termine el despliegue. Usa el enlace que GitHub muestre en Pages. La dirección esperada para este repositorio es `https://rayden144.github.io/Catalina/`; no estará activa hasta publicar correctamente.

Los teléfonos podrán entrar desde cualquier red, sin Apache y sin mantener encendido un notebook. Puedes compartir el enlace o crear un código QR. GitHub Pages es gratuito con repositorios públicos en GitHub Free; si el repositorio es privado, comprueba las condiciones de tu plan. Todo archivo publicado es accesible para los visitantes: no subas información personal ni secretos. Los cambios posteriores en la rama de publicación se despliegan de nuevo.

## Probar en el notebook y en teléfonos de la misma red

Con Python 3 instalado, abre una terminal en la carpeta del proyecto y ejecuta:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

En Windows puedes usar `py -m http.server 8000 --bind 0.0.0.0`. Comprueba la página en el propio notebook abriendo `http://localhost:8000`. Detén el servidor con Ctrl+C.

Para otros teléfonos:

1. Conecta el notebook y los teléfonos al mismo Wi-Fi, o conecta el notebook al punto de acceso del teléfono.
2. Busca la dirección IPv4 local del notebook: `ipconfig` en Windows, `ip addr` en Linux o los ajustes de red en macOS.
3. En los teléfonos abre `http://IP-DEL-NOTEBOOK:8000/`, reemplazando el texto por esa IPv4. Por ejemplo, si es `192.168.1.20`, usa `http://192.168.1.20:8000/`.
4. Si el firewall pregunta, permite el servidor únicamente en tu red privada. Mantén el notebook encendido y el servidor abierto.

`localhost` en un teléfono apunta al teléfono, no al notebook. Algunas redes de invitados y puntos de acceso móviles aíslan los dispositivos entre sí; si ocurre, utiliza una red que permita comunicación local o publica en GitHub Pages. Este servidor sirve para demostración local, no para exposición pública; no abras puertos del router.

### Usar Apache o XAMPP

Copia la carpeta del proyecto a la raíz pública de Apache (por ejemplo, `htdocs/catalina` en XAMPP). Con Apache iniciado, prueba en el notebook `http://localhost/catalina/`. Desde los teléfonos de la misma red, usa `http://IP-DEL-NOTEBOOK/catalina/` (añade el puerto si Apache usa uno distinto de 80). No necesitas PHP, base de datos ni reglas de reescritura.

## Cambiar o añadir emociones

Edita el arreglo `emotions` al comienzo de `app.js`. Cada entrada define `id`, `name`, `symbol`, `color`, `accent`, `teaser`, `title`, `description` y `steps` (pares de título y recomendación). La interfaz genera automáticamente las tarjetas y sus recomendaciones. Usa identificadores únicos y colores que mantengan buena legibilidad. Los textos se insertan como texto, sin interpretar HTML.

La apariencia está en `styles.css`; los textos generales y la estructura están en `index.html`. Puedes solicitar cambios de contenido, colores o nuevas emociones sin cambiar de tecnología.

## Desarrollo y comprobación

No hay instalación ni compilación. Usa el checkout existente; cada tarea de nube ya está aislada y no necesita un Git worktree adicional.

```sh
node --check app.js
python3 -m http.server 8000 --bind 0.0.0.0
```

Prueba cada emoción, cierra las ventanas con el botón y Escape, comprueba que la reflexión se borra, inicia y detén la respiración y revisa la interfaz en pantalla móvil. El ejercicio dura cuatro ciclos de cuatro segundos de inspiración y seis de espiración; se reinicia si se oculta la pestaña. Respeta la preferencia del sistema de reducir movimiento. Las ventanas nativas `dialog` requieren un navegador moderno.
