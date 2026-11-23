// RAJASHEELA FOUNDATION (Reg No 552/26) - Interactive Scripts (script.js)

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

  // 3. UPI App Deep-Linking with Fallback (PhonePe, GPay, Other UPI Apps)
  // Update UPI_ID below if your foundation uses a different UPI ID
  const UPI_ID = '9959711525@ybl';
  const PAYEE_NAME = 'RAJASHEELA FOUNDATION';
  const AMOUNT = '2999';
  const NOTE = 'Awards 2027 Registration';

  const upiParams = `pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(NOTE)}`;
  const genericUpiUrl = `upi://pay?${upiParams}`;

  const upiHelper = document.getElementById('upiHelper');
  document.querySelectorAll('.upi-pay-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const app = btn.getAttribute('data-app');
      let targetUrl = genericUpiUrl;

      if (app === 'phonepe') {
        targetUrl = `phonepe://pay?${upiParams}`;
      } else if (app === 'gpay') {
        targetUrl = `tez://upi/pay?${upiParams}`;
      }

      if (upiHelper) {
        upiHelper.innerHTML = `Opening <strong>${app === 'phonepe' ? 'PhonePe' : app === 'gpay' ? 'GPay' : 'UPI App'}</strong> for <strong>₹${AMOUNT}</strong>... If it does not open automatically, scan the QR code or pay to <strong>${UPI_ID}</strong>.`;
      }

      window.location.href = targetUrl;

      // Fallback to standard upi:// intent if specific app scheme is not registered on device
      if (app === 'phonepe' || app === 'gpay') {
        setTimeout(() => {
          if (!document.hidden) {
            window.location.href = genericUpiUrl;
          }
        }, 1200);
      }
    });
  });

  // 4. Candidate Registration Form Handler (#candidateForm)
  const candidateForm = document.getElementById('candidateForm');
  const formMessage = document.getElementById('formMessage');

  if (candidateForm) {
    candidateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(candidateForm);
      const refId = 'RF2027-' + Math.floor(100000 + Math.random() * 900000);

      const fullName = data.get('fullName') || '';
      const fatherName = data.get('fatherName') || '';
      const phone = data.get('phone') || '';
      const email = data.get('email') || '';
      const age = data.get('age') || '';
      const occupation = data.get('occupation') || '';
      const service = data.get('service') || '';
      const achievements = data.get('achievements') || 'N/A';
      const address = data.get('address') || '';

      if (formMessage) {
        formMessage.innerHTML = `<strong>Application Prepared (${refId}):</strong> Opening your email app to send details to <strong>rajasheela108@gmail.com</strong>. Please also complete the ₹2,999 payment below.`;
        formMessage.style.color = '#0B1F3A';
      }

      const subject = encodeURIComponent(
        `Rajasheela Foundation Award Application - ${fullName} (${refId})`
      );
      const body = encodeURIComponent(
        `RAJASHEELA FOUNDATION (Reg No 552/26) - Candidate Registration\n` +
        `Application ID: ${refId}\n` +
        `Full Name: ${fullName}\n` +
        `Father's Name: ${fatherName}\n` +
        `Phone Number: ${phone}\n` +
        `GMail: ${email}\n` +
        `Age: ${age}\n` +
        `Current Occupation: ${occupation}\n` +
        `Social Service Activities: ${service}\n` +
        `Previous Achievements: ${achievements}\n` +
        `Full Address: ${address}\n\n` +
        `Note: Please attach your supporting PDF documents if selected.`
      );

      window.location.href = `mailto:rajasheela108@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
