// main.js
const { app, BrowserWindow, ipcMain, screen, Menu } = require('electron');
const path = require('path');

let controlWindow = null;
let displayWindow = null;

function createWindows() {
    // Eliminar completamente el menú por defecto (File/Edit/View/…)
    Menu.setApplicationMenu(null);

    // Ventana de control (operador)
    controlWindow = new BrowserWindow({
        width: 900,
        height: 650,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true, // oculta la barra de menú (aunque se presione Alt)
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        title: 'Ciclo Padel – Control'
    });
    controlWindow.loadFile(path.join(__dirname, 'public', 'control.html'));

    // Ventana de display (TV)
    displayWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        backgroundColor: '#000000',
        autoHideMenuBar: true, // oculta la barra de menú (aunque se presione Alt)
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        title: 'Ciclo Padel – Pantalla'
    });
    displayWindow.loadFile(path.join(__dirname, 'public', 'display.html'));

    // Intentar mover el display al segundo monitor (HDMI) si existe
    try {
        const displays = screen.getAllDisplays();
        if (displays.length > 1) {
            const external = displays[1];
            displayWindow.setBounds({
                x: external.bounds.x + 50,
                y: external.bounds.y + 50,
                width: Math.min(1600, external.workArea.width - 100),
                height: Math.min(900, external.workArea.height - 100)
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

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

/* ===== IPC: Control -> Display ===== */
ipcMain.on('display:showAlarm', (_evt, payload) => {
    if (displayWindow) displayWindow.webContents.send('display:showAlarm', payload);
});

ipcMain.on('display:hideAlarm', () => {
    if (displayWindow) displayWindow.webContents.send('display:hideAlarm');
});

ipcMain.on('display:toggleFullscreen', () => {
    if (!displayWindow) return;
    const isFS = displayWindow.isFullScreen();
    displayWindow.setFullScreen(!isFS);
});

// Reservado por si querés sincronizar algo a futuro
ipcMain.on('display:ping', () => {
    if (displayWindow) displayWindow.webContents.send('display:pong', Date.now());
});
