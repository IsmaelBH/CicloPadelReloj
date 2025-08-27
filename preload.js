// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('CicloAPI', {
    // Control -> Main
    showAlarm: (payload) => ipcRenderer.send('display:showAlarm', payload),
    hideAlarm: () => ipcRenderer.send('display:hideAlarm'),
    toggleFullscreen: () => ipcRenderer.send('display:toggleFullscreen'),

    // Videos (archivo)
    playVideo: ({ path }) => ipcRenderer.send('display:playVideo', { path }),
    pauseVideo: () => ipcRenderer.send('display:pauseVideo'),
    resumeVideo: () => ipcRenderer.send('display:resumeVideo'),
    stopVideo: () => ipcRenderer.send('display:stopVideo'),

    // Video demo embebido
    playDemo: () => ipcRenderer.send('display:playDemo'),

    // Main -> Display (suscripciones)
    onDisplay: (channel, listener) => {
        ipcRenderer.on(channel, (_evt, data) => listener(data));
    }
});
