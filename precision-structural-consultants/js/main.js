// main.js: UI behaviours (counter, contact form handling, smooth in-page scrolling)

// ── Navbar: scroll-shrink + active-link tracking ───────────────────────────
(function () {
    const header  = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');
    const sections = [];

    // collect section elements once DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        navLinks.forEach(link => {
            const id = link.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) sections.push({ link, el });
        });
    });

    function onScroll() {
        // scroll-shrink
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }
        // active link — section whose top edge is nearest above viewport midpoint
        const mid = window.scrollY + window.innerHeight * 0.35;
        let active = null;
        sections.forEach(({ el }) => {
            if (el.offsetTop <= mid) active = el.id;
        });
        navLinks.forEach(link => {
            const id = link.getAttribute('href').slice(1);
            link.classList.toggle('active', id === active);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
})();

document.addEventListener('DOMContentLoaded', () => {
    // ── Projects arrow slider ──────────────────────────────────────────────
    const sliderTrack = document.getElementById('projects-list');
    const prevBtn     = document.querySelector('.proj-arrow-prev');
    const nextBtn     = document.querySelector('.proj-arrow-next');

    if (sliderTrack && prevBtn && nextBtn) {
        let currentIndex = 0;

        function getVisibleCount() {
            const vw = window.innerWidth;
            if (vw >= 900) return 3;
            if (vw >= 520) return 2;
            return 1;
        }

        function getCardCount() {
            return sliderTrack.querySelectorAll('.project-card').length;
        }

        function updateSlider() {
            const visibleCount  = getVisibleCount();
            const totalCards    = getCardCount();
            const maxIndex      = Math.max(0, totalCards - visibleCount);
            currentIndex        = Math.min(Math.max(currentIndex, 0), maxIndex);

            // set each card width to exactly 1/Nth of the viewport minus gaps and padding, capped at 320px
            const viewport   = sliderTrack.parentElement; // .projects-slider-viewport
            const pad        = 16; // must match .projects-slider-track padding
            const gap        = 32;
            const available  = viewport.clientWidth - pad * 2;
            const cardWidth  = Math.min(320, Math.floor((available - gap * (visibleCount - 1)) / visibleCount));
            sliderTrack.querySelectorAll('.project-card').forEach(card => {
                card.style.width      = cardWidth + 'px';
                card.style.minWidth   = cardWidth + 'px';
                card.style.maxWidth   = cardWidth + 'px';
                card.style.flexShrink = '0';
            });

            sliderTrack.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;

            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        }

        prevBtn.addEventListener('click', () => { currentIndex--; updateSlider(); });
        nextBtn.addEventListener('click', () => { currentIndex++; updateSlider(); });

        // recalculate on resize
        let _rto = null;
        window.addEventListener('resize', () => {
            clearTimeout(_rto);
            _rto = setTimeout(() => { currentIndex = 0; updateSlider(); }, 150);
        });

        // re-init after data-loader populates project cards
        document.addEventListener('dataLoaded', () => { currentIndex = 0; updateSlider(); });
        setTimeout(updateSlider, 100);
    }

    // animate stats counters — runs after data-loader sets data-target from config
    function runCounters() {
        document.querySelectorAll('.num').forEach(counter => {
            const update = () => {
                const target = +counter.getAttribute('data-target');
                const current = +counter.innerText || 0;
                const increment = Math.ceil(target / 100);
                if (current < target) {
                    counter.innerText = current + increment;
                    setTimeout(update, 20);
                } else {
                    counter.innerText = target;
                }
            };
            update();
        });
    }
    document.addEventListener('dataLoaded', runCounters);
    setTimeout(runCounters, 800); // fallback for file:// if dataLoaded misfires

    // update footer year automatically
    const year = document.getElementById('footer-year');
    if (year) year.textContent = new Date().getFullYear();
});
