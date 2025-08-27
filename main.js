// main.js
const { app, BrowserWindow, ipcMain, screen, Menu } = require('electron');
const path = require('path');

let controlWindow = null;
let displayWindow = null;

function createWindows() {
    // Quitar menú por defecto
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
            nodeIntegration: false
        },
        title: 'Ciclo Padel – Control'
    });
    controlWindow.loadFile(path.join(__dirname, 'public', 'control.html'));

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
            nodeIntegration: false
        },
        title: 'Ciclo Padel – Pantalla'
    });
    displayWindow.loadFile(path.join(__dirname, 'public', 'display.html'));

    // Intentar posicionar en 2do monitor
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
    displayWindow && displayWindow.webContents.send('display:showAlarm', payload);
});

ipcMain.on('display:hideAlarm', () => {
    displayWindow && displayWindow.webContents.send('display:hideAlarm');
});

ipcMain.on('display:toggleFullscreen', () => {
    if (!displayWindow) return;
    const isFS = displayWindow.isFullScreen();
    displayWindow.setFullScreen(!isFS);
});

/* ===== IPC: Video archivo ===== */
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

/* ===== IPC: Video demo embebido ===== */
ipcMain.on('display:playDemo', () => {
    // Resolvemos la ruta al demo incluso dentro del .asar
    // __dirname apunta a la raíz de la app empaquetada
    const demoFile = path.join(__dirname, 'assets', 'demo.mp4');
    displayWindow && displayWindow.webContents.send('display:playVideo', { path: demoFile });
});
