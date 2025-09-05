// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('CicloAPI', {
    // Placa
    showAlarm: (payload) => ipcRenderer.send('display:showAlarm', payload),
    hideAlarm: () => ipcRenderer.send('display:hideAlarm'),

    // Fullscreen
    toggleFullscreen: () => ipcRenderer.send('display:toggleFullscreen'),

    // Video (compat)
    playVideo: ({ path }) => ipcRenderer.send('display:playVideo', { path }),
    pauseVideo: () => ipcRenderer.send('display:pauseVideo'),
    resumeVideo: () => ipcRenderer.send('display:resumeVideo'),
    stopVideo: () => ipcRenderer.send('display:stopVideo'),
    playDemo: () => ipcRenderer.send('display:playDemo'),

    // 🆕 Imagen estática
    showImage: ({ path }) => ipcRenderer.send('display:showImage', { path }),

    // Eventos que vienen desde main -> display (renderer)
    onDisplay: (channel, fn) => {
        ipcRenderer.on(channel, (_evt, data) => fn(data));
    },
});
