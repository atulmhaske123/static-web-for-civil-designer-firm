// data-loader.js — populates the page from config/*.js globals.
// All data lives in config/config.js, config/services.js, config/projects.js,
// config/clients.js, and config/formulas.js. Edit those files to change content.
// This file contains only rendering logic — never paste data here.

// ── DOM population ───────────────────────────────────────────────────────────

function populateConfig() {
    try {
        document.title = CONFIG.companyName || document.title;
        const logo = document.getElementById('logo');
        if (logo) logo.src = CONFIG.logoPath || logo.src;
        const company = document.getElementById('company-name');
        if (company) company.textContent = CONFIG.companyName;
        const tagline = document.getElementById('tagline');
        if (tagline) tagline.textContent = CONFIG.tagline;
        const heroSub = document.getElementById('hero-subtitle');
        if (heroSub && CONFIG.heroSubtitle) heroSub.textContent = CONFIG.heroSubtitle;
        const phone = document.getElementById('contact-phone');
        if (phone) phone.textContent = CONFIG.phone;
        const email = document.getElementById('contact-email');
        if (email) email.textContent = CONFIG.email;
        const address = document.getElementById('contact-address');
        if (address) address.textContent = CONFIG.address;
        const wa = document.getElementById('whatsapp-button');
        if (wa && CONFIG.whatsappNumber) {
            const n = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
            wa.href = `https://wa.me/${n}`;
        }
        const callBtn = document.getElementById('call-button');
        if (callBtn && CONFIG.phone) {
            const p = CONFIG.phone.replace(/[^0-9+]/g, '');
            callBtn.href = `tel:${p.startsWith('+') ? p : '+' + p}`;
        }
        const footerCompany = document.getElementById('footer-company');
        if (footerCompany) footerCompany.textContent = CONFIG.companyName;
        if (CONFIG.stats) {
            ['projects', 'clients', 'years'].forEach(key => {
                const item = CONFIG.stats[key];
                if (!item) return;
                const numEl = document.getElementById(`stat-${key}`);
                if (numEl) { numEl.setAttribute('data-target', item.count); numEl.textContent = '0'; }
                const labelEl = document.getElementById(`stat-${key}-label`);
                if (labelEl) labelEl.textContent = item.label;
            });
        }
    } catch (e) {
        console.error('Error populating config:', e);
    }
}

function populateProjects() {
    try {
        const track = document.getElementById('projects-list');
        if (!track) return;
        track.innerHTML = '';
        PROJECTS.projects.forEach((project, pi) => {
            // Support both `images` array (new) and legacy `image` string
            const images = project.images
                ? project.images
                : (project.image ? [project.image] : []);

            const card = document.createElement('div');
            card.className = 'project-card';

            // Image area with optional prev/next arrows and dots
            let imgAreaHtml = '';
            if (images.length > 0) {
                const arrowsHtml = images.length > 1
                    ? `<button class="proj-arr proj-arr-prev" aria-label="Previous image">&#8249;</button>
                       <button class="proj-arr proj-arr-next" aria-label="Next image">&#8250;</button>
                       <div class="proj-dots">${images.map((_, i) =>
                           `<button class="proj-dot${i === 0 ? ' active' : ''}" data-idx="${i}" aria-label="Image ${i + 1}"></button>`
                       ).join('')}</div>`
                    : '';
                imgAreaHtml = `
                    <div class="proj-slider-shell">
                    <div class="proj-img-wrap">
                        <img class="proj-img-main" src="${images[0]}" alt="${project.projectName}" data-proj="${pi}" data-img="0">
                        ${arrowsHtml}
                        <span class="proj-zoom-lens" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                        </span>
                    </div>
                    </div>`;
            }

            card.innerHTML = `
                ${imgAreaHtml}
                <div class="proj-info">
                    <span class="proj-type-badge">${project.projectType}</span>
                    <h3>${project.projectName}</h3>
                    <p>${project.description}</p>
                    <p class="project-location">${project.location}</p>
                </div>
            `;

            // Mini-slider logic (only if >1 image)
            const imgEl = card.querySelector('.proj-img-main');
            if (images.length > 1 && imgEl) {
                let current = 0;
                const dotEls = card.querySelectorAll('.proj-dot');
                function goTo(idx) {
                    current = (idx + images.length) % images.length;
                    imgEl.src = images[current];
                    imgEl.dataset.img = current;
                    dotEls.forEach((d, i) => d.classList.toggle('active', i === current));
                }
                card.querySelector('.proj-arr-prev').addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
                card.querySelector('.proj-arr-next').addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });
                dotEls.forEach((d, i) => d.addEventListener('click', e => { e.stopPropagation(); goTo(i); }));
            }

            // Click on image → open lightbox
            if (imgEl && images.length > 0) {
                imgEl.addEventListener('click', () => {
                    openLightbox(images, parseInt(imgEl.dataset.img) || 0);
                });
            }

            track.appendChild(card);
        });
    } catch (e) {
        console.error('Error populating projects:', e);
    }
}

function populateClients() {
    try {
        const clientsContainer = document.getElementById('clients-list');
        if (!clientsContainer) return;
        CLIENTS.clients.forEach(client => {
            const clientElement = document.createElement('div');
            clientElement.className = 'client-card';
            clientElement.innerHTML = `
                <img src="${client.logo}" alt="${client.clientName}">
                <div><h4>${client.clientName}</h4></div>
            `;
            clientsContainer.appendChild(clientElement);
        });
    } catch (e) {
        console.error('Error populating clients:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateConfig();
    populateServices();
    populateProjects();
    populateClients();
    startBackgroundSlideshow();
    initLightbox();
    document.dispatchEvent(new CustomEvent('dataLoaded'));
});

function populateServices() {
    try {
        const track = document.getElementById('services-list');
        if (!track) return;
        track.innerHTML = '';
        SERVICES.services.forEach(service => {
            const card = document.createElement('article');
            card.className = 'service-card';
            const iconHtml = service.icon
                ? `<img class="service-icon" src="${service.icon}" alt="" aria-hidden="true">`
                : '';
            card.innerHTML = `
                <div class="service-card-header">
                    ${iconHtml}
                    <h3 class="service-card-name">${service.name}</h3>
                    <button class="service-toggle-btn" aria-expanded="false" aria-label="Expand ${service.name}">
                        <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                </div>
                <div class="service-card-body" role="region">
                    <div class="service-card-body-inner">
                        <div class="service-card-desc">${service.description.split(/(?<=\.)(\s+)/).filter(s => s.trim()).map(s => `<p>${s.trim()}</p>`).join('')}</div>
                    </div>
                </div>
            `;
            const btn = card.querySelector('.service-toggle-btn');
            const header = card.querySelector('.service-card-header');
            function toggle() {
                const expanded = card.classList.toggle('expanded');
                btn.setAttribute('aria-expanded', expanded);
            }
            btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
            header.addEventListener('click', toggle);
            track.appendChild(card);
        });
    } catch (e) {
        console.error('Error populating services:', e);
    }
}

// ── Background slideshow from project images ─────────────────────────────────
function startBackgroundSlideshow() {
    // Support both `images` array (new) and legacy `image` string
    const images = PROJECTS.projects.map(p => p.images ? p.images[0] : p.image).filter(Boolean);
    if (!images.length) return;

    // Two fixed layers for crossfade — layer A (visible) and layer B (fading in)
    const layerA = document.createElement('div');
    const layerB = document.createElement('div');
    [layerA, layerB].forEach(el => {
        el.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:-1',
            'background-size:cover', 'background-position:center center',
            'background-repeat:no-repeat',
            'transition:opacity 1.2s ease-in-out',
            'pointer-events:none'
        ].join(';');
        document.body.prepend(el);
    });

    let current = 0;
    let showingA = true;

    function setBackground(idx) {
        const url = `url('${images[idx]}')`;
        if (showingA) {
            layerB.style.backgroundImage = url;
            layerB.style.opacity = '1';
            layerA.style.opacity = '0';
        } else {
            layerA.style.backgroundImage = url;
            layerA.style.opacity = '1';
            layerB.style.opacity = '0';
        }
        showingA = !showingA;
    }

    // set first image immediately (no fade)
    layerA.style.backgroundImage = `url('${images[0]}')`;
    layerA.style.opacity = '1';
    layerB.style.opacity = '0';

    setInterval(() => {
        current = (current + 1) % images.length;
        setBackground(current);
    }, 5000);
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function initLightbox() {
    // Inject overlay HTML into body
    const overlay = document.createElement('div');
    overlay.id = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.innerHTML = `
        <button id="lb-close" aria-label="Close viewer">&times;</button>
        <button id="lb-prev" aria-label="Previous image">&#8249;</button>
        <div id="lb-img-wrap">
            <img id="lb-img" src="" alt="Project image" draggable="false">
        </div>
        <button id="lb-next" aria-label="Next image">&#8250;</button>
        <div id="lb-counter"></div>
        <div id="lb-zoom-hint">Scroll to zoom &nbsp;·&nbsp; Double-click to reset</div>
    `;
    document.body.appendChild(overlay);

    let lbImages = [], lbIndex = 0, lbScale = 1, lbTX = 0, lbTY = 0;
    let isDragging = false, dragStart = { x: 0, y: 0 };

    const lbImg     = document.getElementById('lb-img');
    const lbCounter = document.getElementById('lb-counter');
    const lbPrev    = document.getElementById('lb-prev');
    const lbNext    = document.getElementById('lb-next');
    const lbHint    = document.getElementById('lb-zoom-hint');

    function applyTransform() {
        lbImg.style.transform = `translate(${lbTX}px,${lbTY}px) scale(${lbScale})`;
    }
    function resetZoom() {
        lbScale = 1; lbTX = 0; lbTY = 0;
        lbImg.style.transform = '';
        lbImg.style.cursor = 'zoom-in';
    }
    function updateCounter() {
        lbCounter.textContent = lbImages.length > 1 ? `${lbIndex + 1} / ${lbImages.length}` : '';
    }
    function showImg(idx) {
        lbIndex = (idx + lbImages.length) % lbImages.length;
        resetZoom();
        lbImg.src = lbImages[lbIndex];
        updateCounter();
        lbPrev.style.visibility = lbImages.length > 1 ? 'visible' : 'hidden';
        lbNext.style.visibility = lbImages.length > 1 ? 'visible' : 'hidden';
    }

    // Public API called by project cards
    window.openLightbox = function(images, startIdx) {
        lbImages = images;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        showImg(startIdx || 0);
    };
    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => showImg(lbIndex - 1));
    lbNext.addEventListener('click', () => showImg(lbIndex + 1));

    // Click backdrop to close
    overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });

    // Keyboard
    document.addEventListener('keydown', e => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   showImg(lbIndex - 1);
        if (e.key === 'ArrowRight')  showImg(lbIndex + 1);
    });

    // Scroll to zoom
    document.getElementById('lb-img-wrap').addEventListener('wheel', e => {
        e.preventDefault();
        lbScale = Math.min(5, Math.max(1, lbScale + (e.deltaY < 0 ? 0.18 : -0.18)));
        if (lbScale === 1) { lbTX = 0; lbTY = 0; }
        lbImg.style.cursor = lbScale > 1 ? 'grab' : 'zoom-in';
        lbHint.style.opacity = lbScale > 1 ? '0' : '0.5';
        applyTransform();
    }, { passive: false });

    // Drag to pan when zoomed
    lbImg.addEventListener('mousedown', e => {
        if (lbScale <= 1) return;
        isDragging = true;
        dragStart = { x: e.clientX - lbTX, y: e.clientY - lbTY };
        lbImg.style.cursor = 'grabbing';
        e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        lbTX = e.clientX - dragStart.x;
        lbTY = e.clientY - dragStart.y;
        applyTransform();
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) { isDragging = false; lbImg.style.cursor = lbScale > 1 ? 'grab' : 'zoom-in'; }
    });

    // Double-click to toggle zoom
    lbImg.addEventListener('dblclick', () => {
        if (lbScale > 1) { resetZoom(); applyTransform(); }
        else { lbScale = 2.5; lbImg.style.cursor = 'grab'; lbHint.style.opacity = '0'; applyTransform(); }
    });
}
