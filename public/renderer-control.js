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

        // Selección de canchas
        const seleccion = new Set();
        const updateBadge = () => {
            selBadge.textContent = seleccion.size === 0
                ? 'Ninguna'
                : Array.from(seleccion).sort((a, b) => a - b).map(n => `Cancha ${n}`).join(', ');
        };
        const toggleCancha = (n) => { seleccion.has(n) ? seleccion.delete(n) : seleccion.add(n); updateBadge(); };

        // Bind selección
        onClick('sel1', () => toggleCancha(1));
        onClick('sel2', () => toggleCancha(2));
        onClick('sel3', () => toggleCancha(3));

        // Botones de utilidad
        onClick('limpiar', () => { seleccion.clear(); updateBadge(); });
        onClick('clearMsg', () => { if (msgInput) msgInput.value = ''; });

        // Mensaje (multilínea por textarea). Si está vacío, no manda texto extra.
        const getMensaje = () => {
            const val = (msgInput?.value || '').trim();
            return val.length ? val : '';
        };

        // Enviar placa (selección múltiple)
        onClick('enviar', () => {
            if (!api) return;
            const arr = Array.from(seleccion).sort((a, b) => a - b);
            if (arr.length === 0) return;
            api.showAlarm({ canchas: arr, mensaje: getMensaje() });
            if (estadoPantalla) estadoPantalla.textContent = 'Placa de turno';
        });

        // Envío rápido (una cancha) usando el mensaje actual
        onClick('quick1', () => api && api.showAlarm({ canchas: [1], mensaje: getMensaje() }));
        onClick('quick2', () => api && api.showAlarm({ canchas: [2], mensaje: getMensaje() }));
        onClick('quick3', () => api && api.showAlarm({ canchas: [3], mensaje: getMensaje() }));

        // Fullscreen / Ocultar
        onClick('btnFS', () => api && api.toggleFullscreen());
        onClick('btnOcultarAlarma', () => {
            api && api.hideAlarm();
            if (estadoPantalla) estadoPantalla.textContent = 'Reloj';
        });

        // Inicial
        updateBadge();
    });
})();
