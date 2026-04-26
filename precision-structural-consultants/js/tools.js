// js/tools.js

// Simple calculators and UI switching for Tools & Calculators panel
document.addEventListener('DOMContentLoaded', () => {
    const toolButtons = document.querySelectorAll('.tool-btn'); // legacy
    const tabButtons = document.querySelectorAll('.top-tool-btn'); // new top tabs
    const toolPages = document.querySelectorAll('.tool-page');

    function showTool(name) {
        toolPages.forEach(p => {
            p.hidden = p.id !== `tool-${name}`;
        });
        // update legacy left buttons if present and set aria-selected
        toolButtons.forEach(b => {
            const active = b.getAttribute('data-tool') === name;
            b.classList.toggle('active', active);
            b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        // update top tabs and set aria-selected
        tabButtons.forEach(b => {
            const active = b.getAttribute('data-tool') === name;
            b.classList.toggle('active', active);
            b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    }

    // legacy left selector handlers
    toolButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = btn.getAttribute('data-tool');
            showTool(name);
        });
    });

    // top tab handlers (direct) + delegation fallback
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = btn.getAttribute('data-tool');
            showTool(name);
        });
        // keyboard activation
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showTool(btn.getAttribute('data-tool'));
            }
        });
    });

    // Delegated click handler as a fallback if direct listeners fail
    document.addEventListener('click', (e) => {
        const btn = e.target.closest && e.target.closest('.top-tool-btn');
        if (btn) {
            e.preventDefault();
            const name = btn.getAttribute('data-tool');
            showTool(name);
        }
    });

    // info icons for each tool toggle their respective description and tooltip
    const tabInfoBtns = document.querySelectorAll('.tab-info-btn');
    tabInfoBtns.forEach(btn => {
        // ensure initial aria state
        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            // find the tool page containing this button
            const page = btn.closest('.tool-page');
            if (!page) return;
            const name = page.id && page.id.replace(/^tool-/, '') || 'material';
            // show corresponding tab/page first
            showTool(name);
            const desc = page.querySelector('.tool-desc');
            if (!desc) return;
            desc.hidden = !desc.hidden;
            btn.setAttribute('aria-expanded', desc.hidden ? 'false' : 'true');
            // keep focus for keyboard users
            btn.focus({preventScroll:true});
        });
    });

    // default show material
    showTool('material');
    // hide all tool descriptions by default (they are hidden via HTML too) -- ensure consistent state
    document.querySelectorAll('.tool-desc').forEach(d => d.hidden = true);

    // Material calculator
    const formMaterial = document.getElementById('form-material');
    if (formMaterial) {
        formMaterial.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(formMaterial);
            const length = parseFloat(data.get('length')) || 0;
            const width = parseFloat(data.get('width')) || 0;
            const thickness = parseFloat(data.get('thickness')) || 0;
            const floors = parseInt(data.get('floors')) || 1;

            const volume = length * width * thickness * floors; // cubic meters
            // Example conversion: cement bags ~ 6.5 bags per m3 (configurable later)
            const cementBags = Math.ceil(volume * 6.5);
            // show result in popup
            const html = `
                <p><strong>Concrete Volume:</strong> <span>${volume.toFixed(3)} m<sup>3</sup></span></p>
                <p><strong>Cement (approx):</strong> <span>${cementBags} bags</span></p>
                <p class="popup-extra">This is an approximate estimate. Connect with our engineer for a detailed, site-specific plan.</p>
            `;
            showPopup(html);
        });
    }

    // Steel weight calculator
    const formSteel = document.getElementById('form-steel');
    if (formSteel) {
        formSteel.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(formSteel);
            const dia = parseFloat(data.get('diameter')) || 0; // mm
            const len = parseFloat(data.get('length')) || 0; // m
            const qty = parseInt(data.get('quantity')) || 1;
            // steel weight formula: (d^2/162) * length (meters) * quantity
            const weightPerBar = (dia * dia / 162) * len; // kg
            const totalWeight = weightPerBar * qty;
            const html = `
                <p><strong>Estimated Steel Weight:</strong> <span>${totalWeight.toFixed(2)} kg</span></p>
                <p class="popup-extra">Approximate result — contact our engineer to verify for your specific requirements.</p>
            `;
            showPopup(html);
        });
    }

    // Quotation generator (simple estimator)
    const formQuote = document.getElementById('form-quotation');
    if (formQuote) {
        formQuote.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(formQuote);
            const service = data.get('service');
            const area = parseFloat(data.get('area')) || 0;
            // simple rates (INR per sqft) -- placeholder values
            const rates = { basic: 1200, standard: 1600, premium: 2200 };
            const rate = rates[service] || rates.standard;
            const estimate = area * rate;
            const html = `
                <p><strong>Estimated Construction Cost:</strong> <span>₹ ${estimate.toLocaleString()}</span></p>
                <p class="popup-extra">This estimate is indicative. Contact our engineer for a comprehensive quotation tailored to your project.</p>
            `;
            showPopup(html);
        });
    }

    // Popup helpers
    const popup = document.getElementById('calc-popup');
    const popupBody = document.getElementById('popup-body');
    const popupClose = document.querySelector('.popup-close');
    const popupBackdrop = document.querySelector('.popup-backdrop');
    const popupWA = document.getElementById('popup-wa');
    const popupCall = document.getElementById('popup-call');

    function showPopup(html) {
        if (!popup) return;
        popupBody.innerHTML = html;
        const waHref = document.getElementById('whatsapp-button')?.href || '#';
        const callHref = document.getElementById('call-button')?.href || '#';
        popupWA.href = waHref;
        popupWA.innerHTML = '<img src="assets/icons/whatsapp.svg" class="popup-icon" alt="WhatsApp"> Message on WhatsApp';
        popupCall.href = callHref;
        popupCall.innerHTML = '<img src="assets/icons/phone.svg" class="popup-icon" alt="Call"> Call Us';
        popup.removeAttribute('hidden');
        popup.removeAttribute('inert');
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        popupClose?.focus();
    }

    function closePopup() {
        if (!popup) return;
        popup.classList.remove('active');
        popup.setAttribute('hidden', '');
        popup.setAttribute('inert', '');
        document.body.style.overflow = '';
        popupBody.innerHTML = '';
    }

    popupClose?.addEventListener('click', closePopup);
    popupBackdrop?.addEventListener('click', closePopup);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });
});
