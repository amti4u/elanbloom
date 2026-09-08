/**
 * ÉLAN BLOOM — Main Application Logic
 * Navigation, Scroll-spy, Bouquet Quick-order Modal, Form Tabs, Masked Input, Validation & Submission
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Header Scroll State & Mobile Navigation
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav .nav-item');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     Scroll to Top on Brand Logo Click
     -------------------------------------------------------------------------- */
  const brandLogos = document.querySelectorAll('.brand-logo');
  brandLogos.forEach(logo => {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileNav && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        menuToggle?.classList.remove('active');
        menuToggle?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      if (window.history.pushState) {
        window.history.pushState(null, null, window.location.pathname);
      }
    });
  });

  /* --------------------------------------------------------------------------
     2. Scroll Spy for Navigation Links
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-item');

  function updateActiveNav() {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* --------------------------------------------------------------------------
     3. Scroll Reveal Animations (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* --------------------------------------------------------------------------
     4. Bouquet Data & Quick Order Modal
     -------------------------------------------------------------------------- */
  const bouquetCatalogData = {
    'velvet-hour': {
      title: 'VELVET HOUR',
      price: '12 900 ₽',
      image: 'assets/images/bouquet-1-velvet-hour.jpg',
      composition: 'Глубокие винные каллы, тёмная георгина, античная пыльная роза и ниспадающие ветви амаранта в скульптурной керамической вазе.'
    },
    'orbit-of-lilac': {
      title: 'ORBIT OF LILAC',
      price: '15 400 ₽',
      image: 'assets/images/bouquet-2-orbit-lilac.jpg',
      composition: 'Сиреневые ирисы, бархатные анемоны с темным центром, воздушные ранункулюсы и графичные изгибы ветвей.'
    },
    'solar-muse': {
      title: 'SOLAR MUSE',
      price: '13 800 ₽',
      image: 'assets/images/bouquet-3-solar-muse.jpg',
      composition: 'Коралловые пионы, ароматные кремовые садовые розы, оранжевые акценты и мягкое золотое свечение.'
    },
    'midnight-garden': {
      title: 'MIDNIGHT GARDEN',
      price: '18 600 ₽',
      image: 'assets/images/bouquet-4-midnight-garden.jpg',
      composition: 'Редкие почти черные орхидеи, фиолетовые каллы, дикие черные ягоды и графичные листья монстеры.'
    },
    'soft-static': {
      title: 'SOFT STATIC',
      price: '11 500 ₽',
      image: 'assets/images/bouquet-5-soft-static.jpg',
      composition: 'Белые анемоны, дымчато-голубые оксипеталумы, серебристый эвкалипт и матовая полупрозрачная авторская упаковка.'
    },
    'lucid-bloom': {
      title: 'LUCID BLOOM',
      price: '16 200 ₽',
      image: 'assets/images/bouquet-6-lucid-bloom.jpg',
      composition: 'Экзотические королевские протеи, утонченные лилии, лавандовые цветы и тончайшие скульптурные ветви.'
    }
  };

  const modal = document.querySelector('.quick-order-modal');
  const modalImg = document.getElementById('modal-bouquet-img');
  const modalTitle = document.getElementById('modal-bouquet-title');
  const modalPrice = document.getElementById('modal-bouquet-price');
  const modalComp = document.getElementById('modal-bouquet-comp');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalActionBtn = document.getElementById('modal-action-btn');

  let activeBouquetKey = null;

  function openBouquetModal(key) {
    const item = bouquetCatalogData[key];
    if (!item || !modal) return;
    activeBouquetKey = key;
    modalImg.src = item.image;
    modalImg.alt = item.title;
    modalTitle.textContent = item.title;
    modalPrice.textContent = item.price;
    modalComp.textContent = item.composition;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBouquetModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtn?.addEventListener('click', closeBouquetModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeBouquetModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeBouquetModal();
    }
  });

  // Direct order button inside modal -> preselects in form and scrolls down
  modalActionBtn?.addEventListener('click', () => {
    closeBouquetModal();
    if (activeBouquetKey) {
      selectBouquetInForm(activeBouquetKey);
    }
  });

  // Buttons in catalog cards
  document.querySelectorAll('.btn-quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.getAttribute('data-bouquet');
      if (key) openBouquetModal(key);
    });
  });

  document.querySelectorAll('.btn-card-order').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-bouquet');
      if (key) {
        selectBouquetInForm(key);
      }
    });
  });

  function selectBouquetInForm(key) {
    // Switch to 'Заказать букет' tab
    switchOrderTab('catalog');

    // Update select dropdown
    const bouquetSelect = document.getElementById('order-bouquet-select');
    if (bouquetSelect) {
      bouquetSelect.value = key;
      bouquetSelect.classList.add('highlight-pulse');
      setTimeout(() => bouquetSelect.classList.remove('highlight-pulse'), 1500);
    }

    // Smooth scroll to order section
    const orderSection = document.getElementById('order-section');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /* --------------------------------------------------------------------------
     5. Order Form Tabs Switching
     -------------------------------------------------------------------------- */
  const tabCatalogBtn = document.getElementById('tab-catalog');
  const tabBespokeBtn = document.getElementById('tab-bespoke');
  const groupCatalogBouquet = document.getElementById('form-group-catalog');
  const groupBespokeWish = document.getElementById('form-group-bespoke');
  const submitButtonText = document.getElementById('submit-btn-text');

  function switchOrderTab(type) {
    if (type === 'catalog') {
      tabCatalogBtn?.classList.add('active');
      tabBespokeBtn?.classList.remove('active');
      tabCatalogBtn?.setAttribute('aria-selected', 'true');
      tabBespokeBtn?.setAttribute('aria-selected', 'false');

      if (groupCatalogBouquet) groupCatalogBouquet.style.display = 'flex';
      if (groupBespokeWish) groupBespokeWish.style.display = 'none';
      if (submitButtonText) submitButtonText.textContent = 'Отправить заявку';
    } else {
      tabBespokeBtn?.classList.add('active');
      tabCatalogBtn?.classList.remove('active');
      tabBespokeBtn?.setAttribute('aria-selected', 'true');
      tabCatalogBtn?.setAttribute('aria-selected', 'false');

      if (groupCatalogBouquet) groupCatalogBouquet.style.display = 'none';
      if (groupBespokeWish) groupBespokeWish.style.display = 'flex';
      if (submitButtonText) submitButtonText.textContent = 'Отправить заявку';
    }
  }

  tabCatalogBtn?.addEventListener('click', () => switchOrderTab('catalog'));
  tabBespokeBtn?.addEventListener('click', () => switchOrderTab('bespoke'));

  // Bespoke section button click
  const bespokeCtaBtn = document.getElementById('bespoke-cta-btn');
  bespokeCtaBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    switchOrderTab('bespoke');
    const orderSection = document.getElementById('order-section');
    orderSection?.scrollIntoView({ behavior: 'smooth' });
  });

  // Hero secondary button click
  const heroBespokeBtn = document.getElementById('hero-bespoke-btn');
  heroBespokeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    switchOrderTab('bespoke');
    const orderSection = document.getElementById('order-section');
    orderSection?.scrollIntoView({ behavior: 'smooth' });
  });

  /* --------------------------------------------------------------------------
     6. Phone Input Mask (+7 (XXX) XXX-XX-XX)
     -------------------------------------------------------------------------- */
  const phoneInput = document.getElementById('order-phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = phoneInput.value.replace(/\D/g, '');
      if (val.startsWith('7') || val.startsWith('8')) {
        val = val.substring(1);
      }
      val = val.substring(0, 10);

      let formatted = '+7';
      if (val.length > 0) {
        formatted += ' (' + val.substring(0, 3);
      }
      if (val.length >= 4) {
        formatted += ') ' + val.substring(3, 6);
      }
      if (val.length >= 7) {
        formatted += '-' + val.substring(6, 8);
      }
      if (val.length >= 9) {
        formatted += '-' + val.substring(8, 10);
      }

      phoneInput.value = formatted;
    });

    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) phoneInput.value = '+7 (';
    });
  }

  // Set default minimum date for date picker to today
  const dateInput = document.getElementById('order-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  /* --------------------------------------------------------------------------
     7. Form Validation & Interactive Submission
     -------------------------------------------------------------------------- */
  const orderForm = document.getElementById('atelier-order-form');
  const formCard = document.querySelector('.order-card');
  const successState = document.querySelector('.order-success-state');
  const successUserName = document.getElementById('success-user-name');
  const resetFormBtn = document.getElementById('reset-order-form');

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('order-name');
      const phoneInput = document.getElementById('order-phone');
      const dateInput = document.getElementById('order-date');

      // Clear previous error styles
      document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameInput.classList.add('has-error');
        isValid = false;
      }

      // Validate Phone (at least 10 digits)
      const phoneDigits = phoneInput.value.replace(/\D/g, '');
      if (phoneDigits.length < 11) {
        phoneInput.classList.add('has-error');
        isValid = false;
      }

      // Validate Date
      if (!dateInput.value) {
        dateInput.classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        // Shake animation on form card
        formCard.classList.add('shake');
        setTimeout(() => formCard.classList.remove('shake'), 600);
        return;
      }

      // Loading state
      const submitBtn = document.getElementById('submit-order-btn');
      const originalBtnText = submitButtonText.textContent;
      submitButtonText.textContent = 'Создаем заявку...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Success presentation
        const clientName = nameInput.value.trim();
        if (successUserName) {
          successUserName.textContent = clientName ? `, ${clientName}` : '';
        }

        orderForm.style.display = 'none';
        if (successState) successState.style.display = 'block';

        // Reset submit button state
        submitButtonText.textContent = originalBtnText;
        submitBtn.disabled = false;
      }, 700);
    });

    // Reset button
    resetFormBtn?.addEventListener('click', () => {
      orderForm.reset();
      orderForm.style.display = 'flex';
      if (successState) successState.style.display = 'none';
    });
  }
});
