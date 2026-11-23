// RAJASHEELA FOUNDATION (Reg No 552/26) - Interactive Scripts (script.js)

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzA63zlo9Kt0tsUF8WS_Wed3sqqguuOT0zJAUWpz-T81zDIYofLtfTM1s6G-NLeuw/exec';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Scroll-Triggered Blur Reveal Animation (.reveal -> .visible)
  const revealElements = document.querySelectorAll('.reveal');

  const showAll = () => {
    revealElements.forEach((el) => el.classList.add('visible'));
  };

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -20px 0px',
        threshold: 0.02
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
    setTimeout(showAll, 1200);
  } else {
    showAll();
  }

  // 3. NPCI-Safe UPI Intent Deep-Linking
  const UPI_ID = 'gthilaknadh077-7@okicici';
  const PAYEE_NAME = 'RAJASHEELA FOUNDATION';
  const isAndroid = /Android/i.test(navigator.userAgent);

  const baseParams = `pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR`;
  const standardUpiUrl = `upi://pay?${baseParams}`;

  const upiHelper = document.getElementById('upiHelper');
  document.querySelectorAll('.upi-pay-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const app = btn.getAttribute('data-app');
      let targetUrl = standardUpiUrl;

      if (isAndroid && app === 'phonepe') {
        targetUrl = `intent://pay?${baseParams}#Intent;scheme=upi;package=com.phonepe.app;end`;
      } else if (isAndroid && app === 'gpay') {
        targetUrl = `intent://pay?${baseParams}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
      }

      if (upiHelper) {
        upiHelper.innerHTML = `Opening UPI app... Please enter <strong>₹2,999</strong> and complete payment to <strong>${UPI_ID}</strong>.`;
      }

      window.location.href = targetUrl;
    });
  });

  // Copy UPI ID button
  const copyUpiBtn = document.getElementById('copyUpiBtn');
  if (copyUpiBtn) {
    copyUpiBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(UPI_ID);
        copyUpiBtn.textContent = 'Copied!';
        setTimeout(() => { copyUpiBtn.textContent = 'Copy UPI ID'; }, 2000);
      } catch (err) {
        if (upiHelper) {
          upiHelper.innerHTML = `UPI ID: <strong>${UPI_ID}</strong> (long-press to copy)`;
        }
      }
    });
  }

  // 4. Candidate Registration Form -> Google Sheets Submission
  const candidateForm = document.getElementById('candidateForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');

  if (candidateForm) {
    candidateForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(candidateForm);
      const refId = 'RF2027-' + Math.floor(100000 + Math.random() * 900000);

      const file1 = candidateForm.querySelector('input[name="attachment1"]')?.files[0];
      const file2 = candidateForm.querySelector('input[name="attachment2"]')?.files[0];

      const payload = new URLSearchParams();
      payload.append('applicationId', refId);
      payload.append('fullName', data.get('fullName') || '');
      payload.append('fatherName', data.get('fatherName') || '');
      payload.append('phone', data.get('phone') || '');
      payload.append('email', data.get('email') || '');
      payload.append('age', data.get('age') || '');
      payload.append('occupation', data.get('occupation') || '');
      payload.append('service', data.get('service') || '');
      payload.append('achievements', data.get('achievements') || '');
      payload.append('address', data.get('address') || '');
      payload.append('pdf1Name', file1 ? file1.name : 'None');
      payload.append('pdf2Name', file2 ? file2.name : 'None');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';
      }
      if (formMessage) {
        formMessage.textContent = 'Saving your application to Google Sheets...';
        formMessage.style.color = '#0B1F3A';
      }

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: payload.toString()
        });

        if (formMessage) {
          formMessage.innerHTML = `<strong>Submitted Successfully!</strong> Application ID: <strong>${refId}</strong>. Please complete the ₹2,999 payment below.`;
          formMessage.style.color = '#15803d';
        }
        candidateForm.reset();
        document.getElementById('payment')?.scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        if (formMessage) {
          formMessage.innerHTML = '<strong>Submission Error:</strong> Please check your internet connection and try again.';
          formMessage.style.color = '#b91c1c';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Submit Application <span>→</span>';
        }
      }
    });
  }
});
