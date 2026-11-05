/**
 * Page motion with no library: an observer adds a class and CSS does the rest.
 * Everything still reads normally if this file never loads.
 */
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sticky header: shrinks after the first scroll.
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  const onScroll = () => header.toggleAttribute('data-compact', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Announcement bar: rotates gently, stays still for people who ask for less motion.
const announce = document.querySelector<HTMLElement>('[data-announce]');
if (announce && !calm) {
  const messages = JSON.parse(announce.dataset.announce ?? '[]') as string[];
  let index = 0;
  if (messages.length > 1) {
    window.setInterval(() => {
      announce.classList.add('is-leaving');
      window.setTimeout(() => {
        index = (index + 1) % messages.length;
        announce.textContent = messages[index];
        announce.classList.remove('is-leaving');
      }, 260);
    }, 4800);
  }
}

if (!calm) {
  // Hiding starts here, not in the page, so content never depends on this script.
  document.documentElement.classList.add('js');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  for (const section of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    section.querySelectorAll<HTMLElement>('[data-reveal-item]').forEach((item, index) => {
      item.style.setProperty('--i', String(index));
    });
    observer.observe(section);
  }

  // Background blobs drift a little as the page scrolls.
  const drifters = [...document.querySelectorAll<HTMLElement>('[data-drift]')];
  if (drifters.length) {
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          for (const element of drifters) {
            const box = element.getBoundingClientRect();
            const offset = (box.top + box.height / 2 - window.innerHeight / 2) * -0.05;
            element.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
          }
          ticking = false;
        });
      },
      { passive: true },
    );
  }
}
