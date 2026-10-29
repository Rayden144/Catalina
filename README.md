# HelpyouRYC

Web estática de apoyo psicopedagógico para estudiantes que compatibilizan trabajo, estudios, vida personal y familiar. HTML, CSS y JavaScript nativos: sin dependencias de producción, cuentas, backend ni compilación. Compatible con GitHub Pages y Apache.

## Qué incluye

- Inicio con botones **Iniciar** y **Organizador**, y navegación de vuelta al inicio.
- 12 ítems del proyecto: 3 laborales, 3 personales, 3 académicos y 3 familiares.
- Cuatro frecuencias originales: Nunca, A veces, Frecuentemente y Siempre.
- Etiqueta emocional opcional, elegida explícitamente por la persona: tristeza, estrés, enojo, alegría, angustia, miedo o preocupación.
- Gráfico circular interactivo y lista equivalente, utilizables con teclado. Porcentaje = apariciones de una etiqueta / total de etiquetas elegidas × 100. Las omisiones se excluyen; los empates se muestran. Redondeo a un decimal (la suma visible puede variar una décima).
- Consulta de los cuatro focos generales de apoyo del documento al elegir una emoción.
- Organizador por semanas, lunes–domingo, con horas, ámbitos y actividades que pueden añadirse, editarse y eliminarse.
- Descarga directa de un PDF local, multipágina si es necesario. No se solicita correo ni se envían actividades fuera del dispositivo. El PDF conserva español y signos WinAnsi; emojis y caracteres fuera de esa codificación se sustituyen por `?`.

## Base documental y límites

Se usaron **solo las páginas físicas 1–21** de `ENTREGABLE I_ Avance I.pdf`, la fotografía de notas y los requisitos escritos. No se ha recibido un segundo documento. No se consultaron páginas posteriores ni fuentes externas de contenido psicopedagógico. Consulta [SOURCES.md](SOURCES.md) para la trazabilidad.

El documento no contiene una clave frecuencia → emoción ni un repertorio de estrategias por emoción. Para no inventarlos, se conservó la escala original y se incorporó una autoetiqueta emocional separada. Esta selección de ítems e interfaz es una adaptación, no un instrumento validado ni un diagnóstico de burnout. Las frecuencias no se puntúan como intensidad clínica.

Los focos de apoyo son los mismos para las siete emociones y se identifican como generales. No se presentan técnicas clínicas o recomendaciones específicas no documentadas. Las preguntas de revisión del organizador son adaptaciones funcionales de los objetivos descritos en la fuente. El segundo documento sigue siendo necesario si aporta estrategias diferenciadas o una clave que deba implementarse.

## Privacidad

Las respuestas del recorrido quedan únicamente en memoria y se pierden al recargar/cerrar la página. Volver al inicio o visitar el organizador no las borra. «Volver a responder» pide confirmación y reinicia únicamente el cuestionario.

Las actividades también quedan en memoria por defecto. **Guardar mi organizador en este dispositivo** permite persistirlas en `localStorage` únicamente en ese navegador. Al desmarcar se elimina la copia guardada. En equipos compartidos, no activar esa opción. El alojamiento web puede registrar visitas técnicas.

La exportación crea un archivo en el navegador; el navegador decide dónde descargarlo o muestra su selector. La web no puede escribir arbitrariamente en una carpeta del equipo ni confirmar que la persona haya conservado el archivo.

## Desarrollo

Usa el checkout existente: las tareas de nube ya están aisladas; no crees un Git worktree salvo petición expresa.

```sh
cd /workspace/Catalina
python3 -m http.server 8000 --bind 0.0.0.0
```

Abre `http://localhost:8000` en el equipo que ejecuta el servidor. En Windows se puede usar `py -m http.server 8000 --bind 0.0.0.0`. Detén el servidor con Ctrl+C. Los módulos JavaScript deben servirse por HTTP, no abriendo `index.html` con `file://`.

Desde teléfonos en la misma red, entra a `http://IP-DEL-NOTEBOOK:8000/` usando la IPv4 local del notebook. `localhost` desde el teléfono apunta al teléfono. Algunos Wi-Fi de invitados y puntos de acceso aíslan dispositivos. Mantén el notebook y servidor encendidos y permite el puerto únicamente en redes privadas; no expongas este servidor de prueba a internet.

### Apache / XAMPP

Copia los archivos del proyecto a una carpeta de la raíz pública (por ejemplo `htdocs/catalina`) y enciende Apache. En el notebook abre `http://localhost/catalina/` y desde la misma red `http://IP-DEL-NOTEBOOK/catalina/`. No requiere PHP ni base de datos.

### GitHub Pages

En `Rayden144/Catalina`: **Settings → Pages → Deploy from a branch → main → / (root) → Save**. El enlace esperado es `https://rayden144.github.io/Catalina/`. Publicar en Pages permite acceso desde cualquier red con internet, sin mantener el notebook encendido. Una actualización de `main` vuelve a desplegar el sitio; espera a que GitHub confirme el despliegue. El repositorio y su ruta siguen llamándose Catalina; la aplicación se llama HelpyouRYC.

No publiques el PDF original ni datos personales en el repositorio. No se requiere descargar ni cargar manualmente archivos cuando se suben los cambios mediante Git.

## Editar

- `content.js`: preguntas, páginas fuente, etiquetas, colores y focos documentales. No añadas relaciones entre frecuencia y emoción sin sustento del proyecto.
- `app.js`: navegación, cuestionario, resultados y gráfico.
- `organizer.js`: calendario, persistencia opcional y generador PDF.
- `index.html`: nombre, cabecera e información del proyecto.
- `styles.css`: diseño adaptable a móvil y preferencia de movimiento reducido.

## Verificación

Con Node.js moderno:

```sh
node --check app.js
node --check content.js
node --check organizer.js
node --test tests/core.test.mjs
```

La prueba de navegador usa Playwright solo como herramienta de desarrollo; la web no depende de él. Con Chromium instalado, se puede instalar Playwright fuera del checkout y ejecutar contra el servidor ya iniciado:

```sh
npm install --prefix /tmp/helpyou-browser-check --cache /tmp/helpyou-npm-cache --no-package-lock playwright
NODE_PATH=/tmp/helpyou-browser-check/node_modules APP_URL=http://127.0.0.1:8000/ node tests/browser.cjs
```

`CHROMIUM_PATH` permite ajustar la ruta al navegador (por defecto `/usr/bin/chromium`). La prueba cubre las 12 preguntas, selección obligatoria, edición hacia atrás, empates, omisiones, gráfico por teclado, cuatro ámbitos, reinicio, organizador, semanas, privacidad, PDF y tamaños de pantalla 360/390/768/1280. Sus capturas y PDF se escriben en `/tmp`, fuera del checkout.
