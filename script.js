// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ===
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initAnimations();
});

// === СОЗДАНИЕ АНИМИРОВАННЫХ ЧАСТИЦ ===
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50; // Количество частиц

  for (let i = 0; i < particleCount; i++) {
    createParticle(particlesContainer);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Случайные параметры частицы
  const size = Math.random() * 4 + 2; // Размер от 2 до 6px
  const startX = Math.random() * 100; // Начальная позиция по X (0-100%)
  const drift = (Math.random() - 0.5) * 100; // Смещение по X во время движения
  const duration = Math.random() * 20 + 15; // Длительность анимации 15-35 секунд
  const delay = Math.random() * 5; // Задержка перед началом 0-5 секунд
  
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
  input.setSelectionRange(0, 99999); // Для мобильных устройств
  
  try {
    // Современный метод копирования
    navigator.clipboard.writeText(input.value).then(() => {
      showCopySuccess(button, btnText, originalText);
    }).catch(() => {
      // Fallback для старых браузеров
      document.execCommand('copy');
      showCopySuccess(button, btnText, originalText);
    });
  } catch (err) {
    console.error('Ошибка копирования:', err);
  }
  
  // Убираем выделение
  window.getSelection().removeAllRanges();
}

// === ВИЗУАЛЬНАЯ ОБРАТНАЯ СВЯЗЬ ПРИ КОПИРОВАНИИ ===
function showCopySuccess(button, btnText, originalText) {
  // Добавляем класс успешного копирования
  button.classList.add('copied');
  btnText.textContent = 'Скопировано!';
  
  // Создаём эффект "летящей" галочки
  createCheckmark(button);
  
  // Возвращаем исходное состояние через 2 секунды
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
  
  // Удаляем элемент после завершения анимации
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
  
  // Наблюдаем за всеми карточками
  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
}

// === ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ ===
window.addEventListener('scroll', () => {
  const elements = document.querySelectorAll('.card, .social-link');
  
  elements.forEach(element => {
    const position = element.getBoundingClientRect();
    
    if (position.top < window.innerHeight && position.bottom >= 0) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
});

// === ПАРАЛЛАКС ЭФФЕКТ ДЛЯ ЗАГОЛОВКА ===
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

// === УЛУЧШЕНИЕ ДОСТУПНОСТИ ===
// Добавляем поддержку клавиатуры для кнопок копирования
document.querySelectorAll('.btn-copy').forEach(button => {
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copySubscription(button);
    }
  });
});

// === ОБРАБОТКА ОШИБОК ЗАГРУЗКИ ===
window.addEventListener('error', (e) => {
  console.error('Ошибка загрузки ресурса:', e);
}, true);

// === ОПРЕДЕЛЕНИЕ ТЕМНОЙ ТЕМЫ СИСТЕМЫ ===
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
}

// === ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЙ ТЕМЫ ===
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (e.matches) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});

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
  // Пересоздаём частицы при изменении размера окна
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer && window.innerWidth < 768) {
    // Уменьшаем количество частиц на мобильных устройствах
    const particles = particlesContainer.querySelectorAll('.particle');
    if (particles.length > 30) {
      particles.forEach((particle, index) => {
        if (index % 2 === 0) particle.remove();
      });
    }
  }
}, 250);

window.addEventListener('resize', handleResize);

// === PREFERS REDUCED MOTION ===
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Отключаем сложные анимации для пользователей с настройками доступности
  document.querySelectorAll('.particle').forEach(particle => {
    particle.style.animation = 'none';
  });
}

// === КОНСОЛЬНОЕ СООБЩЕНИЕ ДЛЯ РАЗРАБОТЧИКОВ ===
console.log('%c👻 Ghost VPN', 'color: #8b5cf6; font-size: 24px; font-weight: bold;');
console.log('%cСайт работает на GitHub Pages', 'color: #ec4899; font-size: 14px;');
console.log('%cВерсия: 2.0', 'color: #06b6d4; font-size: 12px;');

// === ЭКСПОРТ ФУНКЦИЙ ДЛЯ ГЛОБАЛЬНОГО ИСПОЛЬЗОВАНИЯ ===
window.copySubscription = copySubscription;
