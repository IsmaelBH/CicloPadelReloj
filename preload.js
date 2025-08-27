const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('CicloAPI', {
    // Control -> Main -> Display
    showAlarm: (data) => ipcRenderer.send('display:showAlarm', data),
    hideAlarm: () => ipcRenderer.send('display:hideAlarm'),
    toggleFullscreen: () => ipcRenderer.send('display:toggleFullscreen'),
    pingDisplay: () => ipcRenderer.send('display:ping'),

    // Display escucha
    onDisplay: (channel, cb) => {
        const valid = ['display:showAlarm', 'display:hideAlarm', 'display:pong'];
        if (valid.includes(channel)) {
            ipcRenderer.on(channel, (_e, payload) => cb(payload));
        }
    }
});
