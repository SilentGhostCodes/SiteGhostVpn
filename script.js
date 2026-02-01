// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ===
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initAnimations();
  initMobileOptimizations();
});

// === СОЗДАНИЕ АНИМИРОВАННЫХ ЧАСТИЦ ===
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  
  // Определяем количество частиц в зависимости от устройства
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 25 : 50;

  for (let i = 0; i < particleCount; i++) {
    createParticle(particlesContainer);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Случайные параметры частицы
  const isMobile = window.innerWidth < 768;
  const size = Math.random() * (isMobile ? 3 : 4) + 2;
  const startX = Math.random() * 100;
  const drift = (Math.random() - 0.5) * (isMobile ? 50 : 100);
  const duration = Math.random() * 20 + 15;
  const delay = Math.random() * 5;
  
  // Применяем стили
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${startX}%`;
  particle.style.setProperty('--drift', `${drift}px`);
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `${delay}s`;
  
  container.appendChild(particle);
  
  // Пересоздаём частицу после завершения анимации
  particle.addEventListener('animationend', () => {
    particle.remove();
    createParticle(container);
  });
}

// === ФУНКЦИЯ КОПИРОВАНИЯ ПОДПИСКИ ===
function copySubscription(button) {
  const inputGroup = button.closest('.sub-input-group');
  const input = inputGroup.querySelector('.sub-input');
  const btnText = button.querySelector('.btn-text');
  const originalText = btnText.textContent;
  
  // Выделяем и копируем текст
  input.select();
  input.setSelectionRange(0, 99999);
  
  try {
    // Современный метод копирования
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(input.value).then(() => {
        showCopySuccess(button, btnText, originalText);
        // Добавляем вибрацию на мобильных устройствах
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }).catch(() => {
        // Fallback для старых браузеров
        fallbackCopy(input, button, btnText, originalText);
      });
    } else {
      fallbackCopy(input, button, btnText, originalText);
    }
  } catch (err) {
    console.error('Ошибка копирования:', err);
    fallbackCopy(input, button, btnText, originalText);
  }
  
  // Убираем выделение для лучшего UX
  setTimeout(() => {
    window.getSelection().removeAllRanges();
    input.blur();
  }, 100);
}

// Fallback метод копирования для старых браузеров
function fallbackCopy(input, button, btnText, originalText) {
  try {
    document.execCommand('copy');
    showCopySuccess(button, btnText, originalText);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  } catch (err) {
    console.error('Fallback copy failed:', err);
    btnText.textContent = 'Ошибка';
    setTimeout(() => {
      btnText.textContent = originalText;
    }, 2000);
  }
}

// === ВИЗУАЛЬНАЯ ОБРАТНАЯ СВЯЗЬ ПРИ КОПИРОВАНИИ ===
function showCopySuccess(button, btnText, originalText) {
  button.classList.add('copied');
  btnText.textContent = 'Скопировано!';
  
  createCheckmark(button);
  
  setTimeout(() => {
    button.classList.remove('copied');
    btnText.textContent = originalText;
  }, 2000);
}

// === СОЗДАНИЕ АНИМИРОВАННОЙ ГАЛОЧКИ ===
function createCheckmark(button) {
  const checkmark = document.createElement('div');
  checkmark.innerHTML = '✓';
  checkmark.style.cssText = `
    position: fixed;
    color: #10b981;
    font-size: 24px;
    font-weight: bold;
    pointer-events: none;
    z-index: 9999;
    animation: floatUp 1s ease-out forwards;
  `;
  
  const rect = button.getBoundingClientRect();
  checkmark.style.left = `${rect.left + rect.width / 2}px`;
  checkmark.style.top = `${rect.top}px`;
  
  document.body.appendChild(checkmark);
  
  setTimeout(() => checkmark.remove(), 1000);
}

// === CSS ДЛЯ АНИМАЦИИ ГАЛОЧКИ ===
const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    0% {
      transform: translate(-50%, 0) scale(0.5);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50px) scale(1.5);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// === ИНИЦИАЛИЗАЦИЯ АНИМАЦИЙ ПРИ СКРОЛЛЕ ===
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
}

// === МОБИЛЬНАЯ ОПТИМИЗАЦИЯ ===
function initMobileOptimizations() {
  // Предотвращаем зум при двойном тапе на iOS
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Улучшенная обработка фокуса для мобильных
  const inputs = document.querySelectorAll('.sub-input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      // Прокручиваем к элементу на мобильных
      if (window.innerWidth < 768) {
        setTimeout(() => {
          this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    });
  });

  // Добавляем touch feedback для всех интерактивных элементов
  const interactiveElements = document.querySelectorAll('.btn, .social-link, .subscription-item');
  interactiveElements.forEach(el => {
    el.addEventListener('touchstart', function() {
      this.style.opacity = '0.7';
    });
    
    el.addEventListener('touchend', function() {
      this.style.opacity = '1';
    });
    
    el.addEventListener('touchcancel', function() {
      this.style.opacity = '1';
    });
  });
}

// === ПАРАЛЛАКС ЭФФЕКТ (ОТКЛЮЧЕН НА МОБИЛЬНЫХ) ===
if (window.innerWidth > 768) {
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const header = document.querySelector('.header');
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (header) {
          header.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// === ПРОИЗВОДИТЕЛЬНОСТЬ: THROTTLE ФУНКЦИЯ ===
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// === ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ОКНА ===
const handleResize = throttle(() => {
  const particlesContainer = document.getElementById('particles');
  const isMobile = window.innerWidth < 768;
  const particles = particlesContainer.querySelectorAll('.particle');
  
  const targetCount = isMobile ? 25 : 50;
  
  if (particles.length > targetCount) {
    // Удаляем лишние частицы
    particles.forEach((particle, index) => {
      if (index >= targetCount) particle.remove();
    });
  } else if (particles.length < targetCount) {
    // Добавляем недостающие частицы
    const needed = targetCount - particles.length;
    for (let i = 0; i < needed; i++) {
      createParticle(particlesContainer);
    }
  }
}, 250);

window.addEventListener('resize', handleResize);

// === ОБРАБОТКА ИЗМЕНЕНИЯ ОРИЕНТАЦИИ ===
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    handleResize();
  }, 200);
});

// === PREFERS REDUCED MOTION ===
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.particle').forEach(particle => {
    particle.style.animation = 'none';
  });
  
  // Отключаем параллакс
  const header = document.querySelector('.header');
  if (header) {
    header.style.transform = 'none';
  }
}

// === ОПРЕДЕЛЕНИЕ PWA ===
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('PWA install prompt available');
});

// === ОБРАБОТКА ОШИБОК ===
window.addEventListener('error', (e) => {
  console.error('Ошибка:', e.message);
}, true);

// === УЛУЧШЕННАЯ ПОДДЕРЖКА iOS ===
// Устраняем проблему с :active на iOS
document.addEventListener('touchstart', function(){}, true);

// Предотвращаем pull-to-refresh на некоторых устройствах
let startY = 0;
document.addEventListener('touchstart', (e) => {
  startY = e.touches[0].pageY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  const y = e.touches[0].pageY;
  if (window.pageYOffset === 0 && y > startY) {
    // На верху страницы и тянем вниз - можем предотвратить
  }
}, { passive: true });

// === КОНСОЛЬНОЕ СООБЩЕНИЕ ===
console.log('%c👻 Ghost VPN', 'color: #8b5cf6; font-size: 24px; font-weight: bold;');
console.log('%cОптимизировано для мобильных устройств', 'color: #ec4899; font-size: 14px;');
console.log('%cВерсия: 2.0 Mobile', 'color: #06b6d4; font-size: 12px;');

// === ЭКСПОРТ ФУНКЦИЙ ===
window.copySubscription = copySubscription;

// === СЕРВИС ВОРКЕР (опционально для PWA) ===
if ('serviceWorker' in navigator) {
  // Раскомментируйте для использования PWA
  // navigator.serviceWorker.register('/sw.js')
  //   .then(reg => console.log('Service Worker registered'))
  //   .catch(err => console.log('Service Worker registration failed'));
}
