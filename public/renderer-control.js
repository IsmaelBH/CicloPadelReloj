(function () {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(() => {
        const api = window.CicloAPI;
        if (!api) console.warn('[CicloAPI] No disponible en Control. Revisá preload.js y webPreferences.preload en main.js');

        // Helpers UI
        const byId = (id) => document.getElementById(id);
        const onClick = (id, handler) => { const el = byId(id); if (el) el.addEventListener('click', handler); };

        const estadoPantalla = byId('estadoPantalla');
        const selBadge = byId('seleccionadas');
        const msgInput = byId('msgInput');

        // ==== SELECCIÓN CANCHAS ====
        const seleccion = new Set();
        const updateBadge = () => {
            selBadge.textContent = seleccion.size === 0
                ? 'Ninguna'
                : Array.from(seleccion).sort((a, b) => a - b).map(n => `Cancha ${n}`).join(', ');
        };
        const toggleCancha = (n) => { seleccion.has(n) ? seleccion.delete(n) : seleccion.add(n); updateBadge(); };

        onClick('sel1', () => toggleCancha(1));
        onClick('sel2', () => toggleCancha(2));
        onClick('sel3', () => toggleCancha(3));
        onClick('limpiar', () => { seleccion.clear(); updateBadge(); });
        onClick('clearMsg', () => { if (msgInput) msgInput.value = ''; });

        const getMensaje = () => (msgInput?.value || '').trim();

        onClick('enviar', () => {
            if (!api) return;
            const arr = Array.from(seleccion).sort((a, b) => a - b);
            if (arr.length === 0) return;
            api.showAlarm({ canchas: arr, mensaje: getMensaje() });
            if (estadoPantalla) estadoPantalla.textContent = 'Placa de turno';
        });

        onClick('quick1', () => api && api.showAlarm({ canchas: [1], mensaje: getMensaje() }));
        onClick('quick2', () => api && api.showAlarm({ canchas: [2], mensaje: getMensaje() }));
        onClick('quick3', () => api && api.showAlarm({ canchas: [3], mensaje: getMensaje() }));

        onClick('btnFS', () => api && api.toggleFullscreen());
        onClick('btnOcultarAlarma', () => {
            api && api.hideAlarm();
            if (estadoPantalla) estadoPantalla.textContent = 'Reloj';
        });

        // ==== MEDIA (video/imágenes) ====
        const videoFileInput = byId('videoFile');
        const videoName = byId('videoName');
        let selectedPath = '';
        let selectedMime = '';

        const isImageFile = (mimeOrPath) => {
            if (!mimeOrPath) return false;
            if (mimeOrPath.startsWith?.('image/')) return true;
            const p = (mimeOrPath || '').toLowerCase();
            return p.endsWith('.jpg') || p.endsWith('.jpeg') || p.endsWith('.png') || p.endsWith('.gif') || p.endsWith('.webp') || p.endsWith('.bmp');
        };
        const isVideoFile = (mimeOrPath) => {
            if (!mimeOrPath) return false;
            if (mimeOrPath.startsWith?.('video/')) return true;
            const p = (mimeOrPath || '').toLowerCase();
            return p.endsWith('.mp4') || p.endsWith('.webm') || p.endsWith('.mov') || p.endsWith('.mkv') || p.endsWith('.avi');
        };

        if (videoFileInput) {
            videoFileInput.addEventListener('change', (e) => {
                const f = e.target.files && e.target.files[0];
                selectedPath = f ? (f.path || '') : '';
                selectedMime = f ? (f.type || '') : '';
                videoName.textContent = f ? (f.name || selectedPath) : 'Ningún archivo seleccionado';
            });
        }

        onClick('btnPlayVideo', () => {
            if (!api) return;
            if (!selectedPath || !isVideoFile(selectedMime || selectedPath)) {
                alert('Elegí un archivo de video válido (mp4/webm/etc.).');
                return;
            }
            api.playVideo({ path: selectedPath });
            if (estadoPantalla) estadoPantalla.textContent = 'Video (loop)';
        });

        onClick('btnShowImage', () => {
            if (!api) return;
            if (!selectedPath || !isImageFile(selectedMime || selectedPath)) {
                alert('Elegí un archivo de imagen válido (jpg/png/webp/etc.).');
                return;
            }
            api.showImage({ path: selectedPath });
            if (estadoPantalla) estadoPantalla.textContent = 'Imagen';
        });

        let paused = false;
        onClick('btnPauseResume', () => {
            if (!api) return;
            if (!paused) {
                api.pauseVideo();
                byId('btnPauseResume').textContent = 'Reanudar';
                paused = true;
            } else {
                api.resumeVideo();
                byId('btnPauseResume').textContent = 'Pausar';
                paused = false;
            }
        });

        onClick('btnStopVideo', () => {
            if (!api) return;
            api.stopVideo(); // también oculta imagen en display (ver display.html)
            if (estadoPantalla) estadoPantalla.textContent = 'Reloj';
            paused = false;
            const btn = byId('btnPauseResume');
            if (btn) btn.textContent = 'Pausar';
        });

        // Demo embebido
        onClick('btnPlayDemo', () => {
            if (!api) return;
            api.playDemo();
            if (estadoPantalla) estadoPantalla.textContent = 'Video demo (loop)';
        });

        // Inicial
        updateBadge();
    });
})();
