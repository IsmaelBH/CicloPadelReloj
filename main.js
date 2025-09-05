// main.js
const { app, BrowserWindow, ipcMain, screen, Menu } = require('electron');
const path = require('path');

let controlWindow = null;
let displayWindow = null;

function createWindows() {
    // Sin menú
    Menu.setApplicationMenu(null);

    // Ventana de control
    controlWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets', 'logo.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        title: 'Ciclo Padel – Control',
    });
    controlWindow.loadFile(path.join(__dirname, 'public', 'control.html'));

    // Si se cierra el Panel, cerramos TODA la app
    controlWindow.on('closed', () => {
        controlWindow = null;
        app.quit();
    });

    // Ventana de display
    displayWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        backgroundColor: '#000000',
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets', 'logo.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        title: 'Ciclo Padel – Pantalla',
    });
    displayWindow.loadFile(path.join(__dirname, 'public', 'display.html'));

    displayWindow.on('closed', () => { displayWindow = null; });

    // Intentar poner Display en el 2º monitor si existe
    try {
        const displays = screen.getAllDisplays();
        if (displays.length > 1) {
            const external = displays[1];
            displayWindow.setBounds({
                x: external.bounds.x + 50,
                y: external.bounds.y + 50,
                width: Math.min(1600, external.workArea.width - 100),
                height: Math.min(900, external.workArea.height - 100),
            });
        }
    } catch (_) { }
}

app.whenReady().then(() => {
    createWindows();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindows();
    });
});

// Cerrar app cuando no quedan ventanas (incluye macOS)
app.on('window-all-closed', () => { app.quit(); });

/* ===== IPC: Control -> Display ===== */

// Alarma (placa 60s)
ipcMain.on('display:showAlarm', (_evt, payload) => {
    displayWindow && displayWindow.webContents.send('display:showAlarm', payload);
});
ipcMain.on('display:hideAlarm', () => {
    displayWindow && displayWindow.webContents.send('display:hideAlarm');
});

// Fullscreen ON/OFF
ipcMain.on('display:toggleFullscreen', () => {
    if (!displayWindow) return;
    displayWindow.setFullScreen(!displayWindow.isFullScreen());
});

/* ===== IPC: Media ===== */
// Video (compatibilidad con tu flujo actual)
ipcMain.on('display:playVideo', (_evt, { path: filePath }) => {
    displayWindow && displayWindow.webContents.send('display:playVideo', { path: filePath });
});
ipcMain.on('display:pauseVideo', () => {
    displayWindow && displayWindow.webContents.send('display:pauseVideo');
});
ipcMain.on('display:resumeVideo', () => {
    displayWindow && displayWindow.webContents.send('display:resumeVideo');
});
ipcMain.on('display:stopVideo', () => {
    displayWindow && displayWindow.webContents.send('display:stopVideo');
});

// Imagen estática
ipcMain.on('display:showImage', (_evt, { path: filePath }) => {
    displayWindow && displayWindow.webContents.send('display:showImage', { path: filePath });
});

// Demo embebido (video)
ipcMain.on('display:playDemo', () => {
    const demoFile = path.join(__dirname, 'assets', 'demo.mp4');
    displayWindow && displayWindow.webContents.send('display:playVideo', { path: demoFile });
});

