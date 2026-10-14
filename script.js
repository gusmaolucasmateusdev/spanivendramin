/* =========================================================
   CONFIGURAÇÃO DA CLÍNICA
   Número do WhatsApp no formato brasileiro internacional:
   55 (país) + DDD (2 dígitos) + número (8 ou 9 dígitos), só números.
   Exemplo: 5591987654321  ->  +55 (91) 98765-4321
   ========================================================= */
const CLINIC_CONFIG = {
  whatsappNumber: '5591999999999', // <- TROQUE pelo número real da clínica
  clinicName: 'nossa clínica'
};

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navItems = document.querySelectorAll('.nav-item.has-menu');

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação');
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

// Animação de revelação ao rolar a página, com alternativa para navegadores antigos.
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

// Linha do tempo interativa da carreira.
const eras = [
  {
    kicker: 'CAPÍTULO UM', title: 'Primeiros anos',
    description: 'Toda história começa em algum lugar. As primeiras experiências despertaram a curiosidade, a persistência e o instinto de nunca parar de perguntar — qualidades essenciais para uma vida dedicada à medicina.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85', alt: 'Cordilheira ao entardecer'
  },
  {
    kicker: 'CAPÍTULO DOIS', title: 'Guiado pelos grandes mestres',
    description: 'Mentoria, observação e anos de formação moldaram uma filosofia baseada em precisão e sobriedade. Os ensinamentos de professores respeitados tornaram-se a base de uma abordagem própria na cirurgia plástica estética.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85', alt: 'Ambiente tranquilo e cuidadosamente composto'
  },
  {
    kicker: 'CAPÍTULO TRÊS', title: 'Sob os holofotes',
    description: 'A televisão e a educação de pacientes levaram a cirurgia plástica estética a um debate público mais amplo. A visibilidade abriu espaço para trocar o mistério pela informação e incentivar perguntas conscientes.',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85', alt: 'Cinema e produção de mídia'
  },
  {
    kicker: 'CAPÍTULO QUATRO', title: 'Reconhecimento',
    description: 'O reconhecimento de colegas e do público reflete uma carreira dedicada ao detalhe, à consistência e ao cuidado individual. O foco continua sendo o trabalho em si e a confiança construída com cada paciente.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', alt: 'Retrato profissional de terno'
  },
  {
    kicker: 'CAPÍTULO CINCO', title: 'A vida hoje',
    description: 'A experiência continua guiando o próximo capítulo: compromisso com os pacientes, a família, a discrição e a convicção de que um trabalho bem feito nunca precisa correr atrás de tendências.',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85', alt: 'Paisagem serena sob luz dourada'
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
  if (!timelineImage) return;
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

// Filtros de categoria da galeria (ex.: Todos, Rosto, Corpo, Mama).
// Obs.: o botão "All" do HTML continua funcionando; também aceita "Todos".
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
function filterGallery(category) {
  const showAll = category === 'All' || category === 'Todos';
  filterButtons.forEach(button => button.classList.toggle('active', button.dataset.filter === category));
  galleryItems.forEach(item => {
    item.classList.toggle('is-hidden', !showAll && item.dataset.category !== category);
  });
}
filterButtons.forEach(button => button.addEventListener('click', () => filterGallery(button.dataset.filter)));
document.querySelectorAll('[data-gallery-link]').forEach(link => link.addEventListener('click', () => filterGallery(link.dataset.galleryLink)));

// Lightbox de imagens acessível.
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

/* =========================================================
   TELEFONE NO PADRÃO BRASILEIRO
   Celular: (91) 98765-4321  |  Fixo: (91) 3234-5678
   ========================================================= */

// Aplica a máscara enquanto a pessoa digita.
function formatPhoneBR(value) {
  let digits = String(value).replace(/\D/g, '');

  // Se colarem com +55 / 55 na frente, remove o código do país.
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2);
  digits = digits.slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

// Valida: DDD de 11 a 99, 10 dígitos (fixo) ou 11 dígitos (celular começando com 9).
function isValidPhoneBR(value) {
  let digits = String(value).replace(/\D/g, '');
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2);

  if (digits.length !== 10 && digits.length !== 11) return false;

  const ddd = Number(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;

  if (digits.length === 11 && digits[2] !== '9') return false; // celular
  if (digits.length === 10 && !/[2-5]/.test(digits[2])) return false; // fixo

  return true;
}

// Converte para o formato internacional usado no WhatsApp (ex.: 5591987654321).
function toWhatsAppNumber(value) {
  let digits = String(value).replace(/\D/g, '');
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2);
  return `55${digits}`;
}

const phoneInput = document.querySelector('#inquiry-form [name="phone"], #inquiry-form input[type="tel"]');
if (phoneInput) {
  phoneInput.setAttribute('inputmode', 'tel');
  phoneInput.setAttribute('autocomplete', 'tel-national');
  phoneInput.setAttribute('maxlength', '15');
  phoneInput.setAttribute('placeholder', '(91) 98765-4321');
  phoneInput.addEventListener('input', () => {
    phoneInput.value = formatPhoneBR(phoneInput.value);
    phoneInput.setCustomValidity('');
  });
}

/* =========================================================
   FORMULÁRIO DE CONTATO -> WHATSAPP DA CLÍNICA
   Valida os campos e abre o WhatsApp com a mensagem pronta.
   Campos usados (atributo name): name, phone, email, interest, message
   ========================================================= */
const inquiryForm = document.querySelector('#inquiry-form');
inquiryForm?.addEventListener('submit', event => {
  event.preventDefault();

  const feedback = inquiryForm.querySelector('.form-feedback');
  const formData = new FormData(inquiryForm);

  const fullName = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const interest = String(formData.get('interest') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const firstName = fullName.split(/\s+/)[0];

  const showError = text => {
    if (feedback) {
      feedback.textContent = text;
      feedback.setAttribute('role', 'alert');
    }
  };

  if (!fullName) {
    showError('Por favor, informe seu nome.');
    inquiryForm.querySelector('[name="name"]')?.focus();
    return;
  }

  if (phoneInput && !isValidPhoneBR(phone)) {
    phoneInput.setCustomValidity('Telefone inválido');
    showError('Informe um telefone válido com DDD, por exemplo: (91) 98765-4321.');
    phoneInput.focus();
    return;
  }

  // Monta a mensagem que será enviada pelo WhatsApp.
  const lines = [
    `Olá! Meu nome é ${fullName}.`,
    interest ? `Tenho interesse em: ${interest}.` : 'Gostaria de agendar uma avaliação.',
    message ? `Mensagem: ${message}` : '',
    phone ? `Meu telefone: ${phone}` : '',
    email ? `E-mail: ${email}` : ''
  ].filter(Boolean);

  const url = `https://wa.me/${CLINIC_CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;

  if (feedback) {
    feedback.setAttribute('role', 'status');
    feedback.textContent = `Obrigado${firstName ? `, ${firstName}` : ''}! Estamos abrindo o WhatsApp para você falar com ${CLINIC_CONFIG.clinicName}.`;
  }

  window.open(url, '_blank', 'noopener');
  inquiryForm.reset();
});

const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
