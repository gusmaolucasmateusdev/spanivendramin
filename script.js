const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navItems = document.querySelectorAll('.nav-item.has-menu');

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('menu-open', open);
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      mainNav.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
});

navItems.forEach(item => {
  const trigger = item.querySelector(':scope > a');
  trigger?.addEventListener('click', event => {
    if (window.innerWidth <= 900) {
      event.preventDefault();
      const wasOpen = item.classList.contains('open');
      navItems.forEach(other => other.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    }
  });
});

// Scroll reveal animation, with a graceful fallback for older browsers.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Interactive career timeline.
const eras = [
  {
    kicker: 'CHAPTER ONE', title: 'Early years',
    description: 'Every story begins somewhere. Early experiences fostered curiosity, persistence, and the instinct to keep asking questions — qualities that would become essential to a life in medicine.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85', alt: 'Mountain range at dusk'
  },
  {
    kicker: 'CHAPTER TWO', title: 'Guided by greats',
    description: 'Mentorship, observation, and years of training shaped a philosophy rooted in precision and restraint. The lessons of respected teachers became a foundation for an individual approach to aesthetic surgery.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85', alt: 'Quiet, carefully composed interior'
  },
  {
    kicker: 'CHAPTER THREE', title: 'Into the spotlight',
    description: 'Television and patient education brought aesthetic surgery into a broader public conversation. Visibility created an opportunity to replace mystery with information and to encourage thoughtful questions.',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85', alt: 'Cinema and media production'
  },
  {
    kicker: 'CHAPTER FOUR', title: 'Recognition',
    description: 'Recognition from peers and the public reflects a career devoted to detail, consistency, and individual care. The focus remains on the work itself and the trust built with each patient.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', alt: 'Professional portrait in a suit'
  },
  {
    kicker: 'CHAPTER FIVE', title: 'Life today',
    description: 'Experience continues to inform the next chapter: a commitment to patients, family, discretion, and the enduring belief that thoughtful work never needs to chase a trend.',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85', alt: 'Peaceful landscape in warm light'
  }
];
let currentEra = 0;
const timelineTabs = [...document.querySelectorAll('.timeline-tab')];
const timelineImage = document.querySelector('#timeline-image');
const timelineKicker = document.querySelector('#timeline-kicker');
const timelineTitle = document.querySelector('#timeline-title');
const timelineDescription = document.querySelector('#timeline-description');
const timelineCount = document.querySelector('#timeline-count');
function showEra(index) {
  currentEra = (index + eras.length) % eras.length;
  const era = eras[currentEra];
  timelineImage.style.opacity = '0.25';
  window.setTimeout(() => {
    timelineImage.src = era.image;
    timelineImage.alt = era.alt;
    timelineKicker.textContent = era.kicker;
    timelineTitle.textContent = era.title;
    timelineDescription.textContent = era.description;
    timelineCount.innerHTML = `${String(currentEra + 1).padStart(2, '0')} <i>/</i> ${String(eras.length).padStart(2, '0')}`;
    timelineImage.style.opacity = '1';
  }, 130);
  timelineTabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === currentEra);
    tab.setAttribute('aria-selected', String(i === currentEra));
  });
}
timelineTabs.forEach(tab => tab.addEventListener('click', () => showEra(Number(tab.dataset.era))));
document.querySelector('#timeline-prev')?.addEventListener('click', () => showEra(currentEra - 1));
document.querySelector('#timeline-next')?.addEventListener('click', () => showEra(currentEra + 1));

// Gallery category filters.
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
function filterGallery(category) {
  filterButtons.forEach(button => button.classList.toggle('active', button.dataset.filter === category));
  galleryItems.forEach(item => {
    item.classList.toggle('is-hidden', category !== 'All' && item.dataset.category !== category);
  });
}
filterButtons.forEach(button => button.addEventListener('click', () => filterGallery(button.dataset.filter)));
document.querySelectorAll('[data-gallery-link]').forEach(link => link.addEventListener('click', () => filterGallery(link.dataset.galleryLink)));

// Accessible image lightbox.
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('p');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
let previousFocus = null;
function openLightbox(item) {
  previousFocus = document.activeElement;
  lightboxImage.src = item.dataset.image;
  lightboxImage.alt = item.querySelector('img')?.alt || item.dataset.title;
  lightboxCaption.textContent = item.dataset.title;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}
function closeLightbox() {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  previousFocus?.focus();
}
galleryItems.forEach(item => item.addEventListener('click', () => openLightbox(item)));
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox(); });

// Demo-only inquiry form: validates fields and provides a local confirmation.
const inquiryForm = document.querySelector('#inquiry-form');
inquiryForm?.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(inquiryForm);
  const firstName = String(formData.get('name') || '').trim().split(/\s+/)[0];
  const interest = String(formData.get('interest') || 'your inquiry');
  const feedback = inquiryForm.querySelector('.form-feedback');
  feedback.textContent = `Thank you${firstName ? `, ${firstName}` : ''}. Your ${interest.toLowerCase()} inquiry has been prepared in this demo. No information was sent or saved.`;
  inquiryForm.reset();
});

document.querySelector('#year').textContent = new Date().getFullYear();
