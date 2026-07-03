document.addEventListener('DOMContentLoaded', () => {
  // --- STATE SYSTEM ---
  const state = {
    theme: localStorage.getItem('theme') || 'dark',
    dir: localStorage.getItem('dir') || 'ltr',
    user: null,
    crate: [null, null, null], // Max 3 items in the crate
    cratePriceBase: 15.00,
    jarPrice: 8.00,
    activeView: 'home1',
    quizAnswers: {},
    faqStates: {},
    marketSearch: '',
    batches: [
      { id: 'B-402', product: 'Spicy Kimchi Classic', date: '2026-06-10', acidity: '4.2 pH', status: 'fermenting', color: 'fermenting' },
      { id: 'B-399', product: 'Classic Sour Dill', date: '2026-05-28', acidity: '3.8 pH', status: 'aging', color: 'aging' },
      { id: 'B-395', product: 'Habanero Beets', date: '2026-05-15', acidity: '3.6 pH', status: 'ready', color: 'ready' }
    ]
  };

  // --- SELECTORS ---
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .footer-links a, .hero-buttons .btn, .cta-link');
  const viewSections = document.querySelectorAll('.view-section');
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const dirToggles = document.querySelectorAll('.dir-toggle-btn');
  
  // Login / Auth elements removed

  // Gift Crate Builder elements
  const builderSlots = document.querySelectorAll('.builder-slot');
  const selectorItems = document.querySelectorAll('.selector-item');
  const crateTotalEl = document.getElementById('crate-total');
  const btnAddCrateCart = document.getElementById('btn-add-crate-cart');

  // Quiz elements
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizNextBtns = document.querySelectorAll('.quiz-next-btn');
  const quizPrevBtns = document.querySelectorAll('.quiz-prev-btn');
  const quizProgressBar = document.querySelector('.quiz-progress-bar');
  const quizResultSection = document.querySelector('.quiz-result');
  const quizRestartBtn = document.getElementById('quiz-restart-btn');

  // FAQ & Career accordions
  const faqItems = document.querySelectorAll('.faq-item');
  const careerItems = document.querySelectorAll('.career-item');

  // Market Search
  const marketSearchInput = document.getElementById('market-search-input');
  const marketCards = document.querySelectorAll('.market-card');
  const mapDots = document.querySelectorAll('.map-dot');

  // Dashboard elements removed

  // Toast container
  const toastContainer = document.getElementById('toast-container');

  // --- INITIALIZATION ---
  function init() {
    // 1. Theme init
    if (state.theme === 'light') {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }

    // 2. Direction init
    if (state.dir === 'rtl') {
      body.setAttribute('dir', 'rtl');
      document.querySelectorAll('.dir-text').forEach(el => el.textContent = 'RTL');
    } else {
      body.setAttribute('dir', 'ltr');
      document.querySelectorAll('.dir-text').forEach(el => el.textContent = 'LTR');
    }



    // 4. Scrolled header effect
    window.addEventListener('scroll', () => {
      const header = document.querySelector('header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    renderCrate();

    // 5. Session init removed
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon selection
    let icon = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
    if (type === 'error') {
      icon = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `;
    }
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Auto-remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  function navigate(viewId) {

    // Toggle active view
    viewSections.forEach(section => {
      if (section.id === `${viewId}-view`) {
        section.classList.add('active');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        section.classList.remove('active');
      }
    });

    // Toggle header and footer visibility removed

    // Update active nav link classes
    document.querySelectorAll('.nav-item').forEach(item => {
      const link = item.querySelector('.nav-link');
      if (link && link.dataset.view === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    state.activeView = viewId;
    window.location.hash = viewId;
  }

  // Mobile Hamburger menu toggle
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburgerToggle && navMenu) {
    hamburgerToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Bind route triggers
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const dropdown = link.nextElementSibling;
      if (window.innerWidth <= 768 && dropdown && dropdown.classList.contains('dropdown-menu')) {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('open');
        const arrow = link.querySelector('svg');
        if (arrow) {
          arrow.style.transform = dropdown.classList.contains('open') ? 'rotate(180deg)' : 'none';
        }
        return;
      }

      const view = link.dataset.view;
      if (view) {
        e.preventDefault();
        navigate(view);
        if (navMenu) {
          navMenu.classList.remove('active');
        }
      }
    });
  });

  // Dashboard Sidebar Mobile Toggles removed

  // --- THEME TOGGLE ---
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.theme === 'dark') {
        state.theme = 'light';
        body.classList.add('light-theme');
        showToast('Switched to Light Theme!');
      } else {
        state.theme = 'dark';
        body.classList.remove('light-theme');
        showToast('Switched to Dark Theme!');
      }
      localStorage.setItem('theme', state.theme);
    });
  });

  // --- LTR/RTL DIRECTION TOGGLE ---
  dirToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.dir === 'ltr') {
        state.dir = 'rtl';
        body.setAttribute('dir', 'rtl');
        document.querySelectorAll('.dir-text').forEach(el => el.textContent = 'RTL');
        showToast('Direction set to RTL!');
      } else {
        state.dir = 'ltr';
        body.setAttribute('dir', 'ltr');
        document.querySelectorAll('.dir-text').forEach(el => el.textContent = 'LTR');
        showToast('Direction set to LTR!');
      }
      localStorage.setItem('dir', state.dir);
    });
  });

  // Auth modal logic and user sessions removed

  // --- GIFT CRATE BUILDER ---
  function getJarSVGMarkup(type) {
    if (!type) {
      return `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; opacity: 0.5;">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      `;
    }
    
    let colorStart = '#2ecc71';
    let colorEnd = '#27ae60';
    let textTag = 'JAR';
    let labelSize = '7';

    const cleanType = (type || '').toLowerCase();

    if (cleanType.includes('dill') || cleanType.includes('sour-dill')) {
      colorStart = '#a8e063';
      colorEnd = '#56ab2f';
      textTag = 'DILL';
    } else if (cleanType.includes('kimchi')) {
      colorStart = '#ff7675';
      colorEnd = '#d63031';
      textTag = 'KIMCHI';
    } else if (cleanType.includes('carrot') || cleanType.includes('ginger-carrot')) {
      colorStart = '#ffeaa7';
      colorEnd = '#e67e22';
      textTag = 'CARROT';
      labelSize = '6';
    } else if (cleanType.includes('beet') || cleanType.includes('spicy-beets') || cleanType.includes('purple')) {
      colorStart = '#fd79a8';
      colorEnd = '#833ab4';
      textTag = 'BEETS';
    } else if (cleanType.includes('cauli')) {
      colorStart = '#f9ca24';
      colorEnd = '#f0932b';
      textTag = 'CAULI';
    } else if (cleanType.includes('garlic') || cleanType.includes('escabeche')) {
      colorStart = '#ffeaa7';
      colorEnd = '#d35400';
      textTag = 'GARLIC';
    }

    return `
      <svg width="36" height="42" viewBox="0 0 100 120" style="display: block; margin: 0 auto;">
        <defs>
          <linearGradient id="jarFillGrad_${textTag}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${colorStart}"></stop>
            <stop offset="100%" stop-color="${colorEnd}"></stop>
          </linearGradient>
        </defs>
        <rect x="25" y="30" width="50" height="80" rx="15" fill="url(#jarFillGrad_${textTag})"></rect>
        <rect x="25" y="30" width="50" height="80" rx="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" stroke-width="2"></rect>
        <rect x="30" y="18" width="40" height="12" rx="3" fill="var(--secondary)"></rect>
        <line x1="30" y1="24" x2="70" y2="24" stroke="rgba(0,0,0,0.2)" stroke-width="2"></line>
        <rect x="35" y="50" width="30" height="20" rx="2" fill="white" opacity="0.9"></rect>
        <text x="50" y="62" text-anchor="middle" fill="#333" font-size="${labelSize}" font-weight="700">${textTag}</text>
      </svg>
    `;
  }

  function renderCrate() {
    let count = 0;
    state.crate.forEach((item, index) => {
      const slotEl = builderSlots[index];
      const nameEl = slotEl.querySelector('.slot-name');
      const emojiEl = slotEl.querySelector('.slot-emoji');
      
      if (item) {
        slotEl.classList.add('filled');
        nameEl.textContent = item.name;
        emojiEl.innerHTML = getJarSVGMarkup(item.type);
        count++;
      } else {
        slotEl.classList.remove('filled');
        nameEl.textContent = 'Empty Slot';
        emojiEl.innerHTML = getJarSVGMarkup(null);
      }
    });

    const total = state.cratePriceBase + (count * state.jarPrice);
    crateTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  // Adding product from grid selector
  selectorItems.forEach(item => {
    item.addEventListener('click', () => {
      const name = item.dataset.name;
      const type = item.dataset.type;
      
      // Find first empty slot
      const emptyIdx = state.crate.indexOf(null);
      if (emptyIdx !== -1) {
        state.crate[emptyIdx] = { name, type };
        renderCrate();
        showToast(`${name} added to Crate!`);
      } else {
        showToast('Your Gift Crate is full! Remove an item to add another.', 'error');
      }
    });
  });

  // Removing items by clicking slots
  builderSlots.forEach((slot, index) => {
    slot.addEventListener('click', () => {
      if (state.crate[index]) {
        const removedName = state.crate[index].name;
        state.crate[index] = null;
        renderCrate();
        showToast(`Removed ${removedName} from Crate.`);
      }
    });
  });

  // Crate purchase trigger
  btnAddCrateCart.addEventListener('click', () => {
    const filledCount = state.crate.filter(item => item !== null).length;
    if (filledCount === 0) {
      showToast('Please add at least one jar to your crate before checking out!', 'error');
      return;
    }
    const finalPrice = state.cratePriceBase + (filledCount * state.jarPrice);
    showToast(`Custom Gift Crate added to shopping cart! Total: $${finalPrice.toFixed(2)}`, 'success');
  });

  // --- QUIZ LOGIC ---
  let currentQuizStep = 0;

  function updateQuizStep() {
    quizSteps.forEach((step, idx) => {
      if (idx === currentQuizStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    
    // Update progress bar width
    const percentage = ((currentQuizStep + 1) / quizSteps.length) * 100;
    quizProgressBar.style.width = `${percentage}%`;
  }

  quizNextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Find selected answer for current step
      const currentStepEl = quizSteps[currentQuizStep];
      const selectedOption = currentStepEl.querySelector('input[type="radio"]:checked');
      
      if (!selectedOption) {
        showToast('Please select an option to continue!', 'error');
        return;
      }

      state.quizAnswers[currentStepEl.dataset.quizKey] = selectedOption.value;

      if (currentQuizStep < quizSteps.length - 1) {
        currentQuizStep++;
        updateQuizStep();
      } else {
        calculateQuizResult();
      }
    });
  });

  quizPrevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentQuizStep > 0) {
        currentQuizStep--;
        updateQuizStep();
      }
    });
  });

  function calculateQuizResult() {
    // Hide questions
    quizSteps.forEach(step => step.classList.remove('active'));
    quizProgressBar.style.width = '100%';
    
    // Simple mock logic for recommended product based on answers
    const spice = state.quizAnswers['spice'];
    const flavor = state.quizAnswers['flavor'];
    
    let recommendation = {
      name: 'Classic Polish Sour Dill',
      emoji: '🥒',
      desc: 'Our original crisp pickles, barrel-cured in garlic, dill crowns, and sea salt. Crisp, refreshing, and clean.'
    };

    if (spice === 'hot') {
      recommendation = {
        name: 'Spicy Kimchi Classic',
        emoji: '🌶️',
        desc: 'Wild-fermented napa cabbage spiked with ginger, organic garlic, and intense gochugaru hot peppers.'
      };
    } else if (flavor === 'sweet') {
      recommendation = {
        name: 'Sweet Mustard Turmeric Cauliflower',
        emoji: '🥦',
        desc: 'Crunchy florets pickled with rich mustard seeds, fresh turmeric root, and organic cane sweetness.'
      };
    } else if (flavor === 'earthy') {
      recommendation = {
        name: 'Smoky Garlic Escabeche',
        emoji: '🧄',
        desc: 'Traditional Latin-American ferment of pickled jalapeños, onions, carrots, and wild mountain oregano.'
      };
    }

    // Display recommendation
    document.getElementById('recommended-title').textContent = recommendation.name;
    const recommendedEmojiContainer = document.getElementById('recommended-emoji-container');
    if (recommendedEmojiContainer) {
      recommendedEmojiContainer.innerHTML = getJarSVGMarkup(recommendation.name);
    }
    document.getElementById('recommended-desc').textContent = recommendation.desc;
    
    quizResultSection.style.display = 'block';
    showToast('Quiz complete! Finding your perfect ferment...');
  }

  quizRestartBtn.addEventListener('click', () => {
    currentQuizStep = 0;
    state.quizAnswers = {};
    quizResultSection.style.display = 'none';
    
    // Clear selections
    quizSteps.forEach(step => {
      const checkedInput = step.querySelector('input[type="radio"]:checked');
      if (checkedInput) checkedInput.checked = false;
    });

    updateQuizStep();
  });

  // --- ACCORDIONS (FAQ & CAREERS) ---
  function setupAccordion(elements, openClass) {
    elements.forEach(item => {
      const header = item.querySelector('header') || item.querySelector('.faq-header') || item.querySelector('.career-header');
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains(openClass);
        
        // Close all others
        elements.forEach(el => el.classList.remove(openClass));
        
        if (!isOpen) {
          item.classList.add(openClass);
        }
      });
    });
  }

  setupAccordion(faqItems, 'open');
  setupAccordion(careerItems, 'open');

  // --- FARMERS MARKET FILTERING & INTERACTIVE MAP ---
  if (marketSearchInput) {
    marketSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      marketCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const desc = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(query) || desc.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  marketCards.forEach(card => {
    card.addEventListener('click', () => {
      marketCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      // Highlight corresponding map marker
      const targetDot = card.dataset.dot;
      mapDots.forEach(dot => {
        if (dot.id === targetDot) {
          dot.classList.add('active');
          // Scale animation
          dot.style.transform = 'scale(1.8)';
          dot.style.fill = '#ffb300';
          setTimeout(() => {
            dot.style.transform = 'scale(1)';
          }, 600);
        } else {
          dot.classList.remove('active');
          dot.style.fill = '#4caf50';
        }
      });

      showToast(`Selected: ${card.querySelector('h4').textContent}`);
    });
  });

  // Map Dots interactive
  mapDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetCard = document.querySelector(`.market-card[data-dot="${dot.id}"]`);
      if (targetCard) {
        targetCard.click();
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Dashboard panel switches and interactions removed

  // Contact Forms submit handlers
  const contactFormEl = document.getElementById('contact-form-el');
  if (contactFormEl) {
    contactFormEl.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been sent successfully.', 'success');
      contactFormEl.reset();
    });
  }

  const wholesaleFormEl = document.getElementById('wholesale-form-el');
  if (wholesaleFormEl) {
    wholesaleFormEl.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Wholesale application received! We will contact you within 48 hours.', 'success');
      wholesaleFormEl.reset();
    });
  }

  // Newsletter form
  const newsletterFormEl = document.getElementById('newsletter-form-el');
  if (newsletterFormEl) {
    newsletterFormEl.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for subscribing! Check your email for your 10% coupon code.', 'success');
      newsletterFormEl.reset();
    });
  }

  // Launch initial setup
  init();
});
