# Ciclo Padel Reloj

Aplicación de escritorio (Electron) para mostrar en una TV el **reloj en tiempo real** y placas de **fin de turno por cancha** en un club de pádel.

## 🚀 Funcionalidades
- Reloj grande en pantalla completa.
- Envío de placas con mensaje **"Turno Finalizado"** y canchas seleccionadas.
- Texto opcional para mostrar jugadores o notas, soporta **múltiples líneas**.
- Control desde panel separado.
- Logo del club integrado en reloj y placa.

## 🛠️ Tecnologías
- [Electron](https://www.electronjs.org/)
- HTML / CSS / JavaScript

## ▶️ Uso en desarrollo
Clonar el repositorio y luego:

```bash
npm install
npm start
```

Esto abre la app en modo desarrollo.

## 📦 Build / Ejecutable
Para generar el instalador de Windows:

```bash
npm run dist
```

El archivo de instalación se genera en la carpeta `dist/`.

También podés usar:

```bash
npm run pack
```

para crear una versión portable sin instalación (en `dist/win-unpacked`).

## 📂 Estructura
```
CicloPadelReloj/
 ├─ assets/           # logo, videos de ejemplo
 ├─ public/           # html, css, js del reloj y panel
 ├─ main.js           # proceso principal de Electron
 ├─ preload.js        # puente seguro para IPC
 ├─ package.json
 └─ ...
```

---

## 🔑 Notas
- Para fullscreen limpio, se eliminó la barra de menú de Electron.
- El instalador puede mostrar un aviso de Windows SmartScreen (al no estar firmado).
- En próximas versiones se agregará **soporte para videos promocionales**.

---

## 🚧 Autor
Desarrollado por **Ismael Barbé** (2025).
