// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let cursorActive = false;

  // Initially hide the cursor to prevent it from sitting in the corner on mobile
  cursor.style.opacity = '0';
  cursorFollower.style.opacity = '0';

  document.addEventListener('mousemove', (e) => {
    if (!cursorActive) {
      cursor.style.opacity = '1';
      cursorFollower.style.opacity = '1';
      document.body.classList.add('custom-cursor-active');
      cursorActive = true;
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Direct position for main cursor
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth follow for outer ring
  function animate() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animate);
  }
  animate();

  // Hover effects
  const hoverTargets = document.querySelectorAll('a, button, .lc-step, .dash-row');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorFollower.classList.remove('hover');
    });
  });
}

// Nav Scroll Effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Number Counter Animation
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Ease out expo
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Handle Stats Counter
      if (entry.target.classList.contains('hero-stats')) {
        const numbers = entry.target.querySelectorAll('.stat-num');
        numbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'));
          animateValue(num, 0, target, 2000);
          num.removeAttribute('data-target'); // prevent re-animating
        });
        observer.unobserve(entry.target);
      }
      
      // Handle Statement Lines
      if (entry.target.classList.contains('statement')) {
        const lines = entry.target.querySelectorAll('.statement-line');
        const sub = entry.target.querySelector('.statement-sub');
        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('visible'), i * 300);
        });
        if(sub) sub.classList.add('visible');
        observer.unobserve(entry.target);
      }

      // Handle Finance Bars
      if (entry.target.classList.contains('finance-preview') || entry.target.classList.contains('split-visual')) {
        const bars = entry.target.querySelectorAll('.fp-bar');
        bars.forEach(bar => {
          bar.style.height = bar.getAttribute('style').match(/--h:(.*?);/)[1];
        });
        
        const invBars = entry.target.querySelectorAll('.inv-bar');
        invBars.forEach(bar => {
          bar.style.width = bar.parentElement.nextElementSibling.innerText;
        });
      }
    }
  });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
  const stats = document.querySelector('.hero-stats');
  if(stats) observer.observe(stats);
  
  const statements = document.querySelectorAll('.statement');
  statements.forEach(el => observer.observe(el));
  
  const financeSections = document.querySelectorAll('.finance-preview, .split-visual:not(.native-anim)');
  financeSections.forEach(el => observer.observe(el));

  // Native Mobile Animations setup
  const nativeAnims = document.querySelectorAll('.native-anim');
  if (window.innerWidth <= 768) {
    nativeAnims.forEach(el => nativeAnimObserver.observe(el));
  } else {
    // If on desktop, reset styles applied by CSS so they show normally
    nativeAnims.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none'; // Prevents jump on initial load
    });
  }
});

// Native Mobile Animations Observer
const nativeAnimObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      nativeAnimObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
});

// Lifecycle Interactive Track
const lcSteps = document.querySelectorAll('.lc-step');

lcSteps.forEach((step, index) => {
  step.addEventListener('click', () => {
    // Remove active from all
    lcSteps.forEach(s => s.classList.remove('active'));
    
    // Add active to clicked and previous
    for(let i = 0; i <= index; i++) {
      lcSteps[i].classList.add('active');
    }
    
    // On mobile, try to center the clicked step smoothly
    if (window.innerWidth <= 768) {
      step.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
});

// Mobile Menu Logic
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-menu-cta');

if (mobileMenuBtn && mobileMenuOverlay) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('open');
    document.body.style.overflow = mobileMenuOverlay.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      mobileMenuOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

