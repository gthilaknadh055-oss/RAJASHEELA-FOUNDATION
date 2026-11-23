// RAJASHEELA FOUNDATION (Reg No 552/26) - Interactive Scripts (script.js)

document.addEventListener('DOMContentLoaded', () => {
  // 1. Intersection Observer for Scroll-Triggered Blur Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const scrollBlurObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-blur').forEach((el) => {
    scrollBlurObserver.observe(el);
  });

  // 2. Candidate Registration Form & Printable Receipt Modal
  const form = document.getElementById('registrationForm');
  const modal = document.getElementById('receiptModal');
  const receiptContent = document.getElementById('receiptContent');
  const emailForwardBtn = document.getElementById('emailForwardBtn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const refId = 'RF2027-' + Math.floor(100000 + Math.random() * 900000);

      const fullName = data.get('fullName');
      const fatherName = data.get('fatherName');
      const phone = data.get('phone');
      const gmail = data.get('gmail');
      const age = data.get('age');
      const occupation = data.get('occupation');
      const category = data.get('category');
      const socialService = data.get('socialService');
      const achievements = data.get('achievements');
      const address = data.get('address');

      receiptContent.innerHTML = `
        <div class="flex justify-between border-b border-sky-200/70 pb-1.5">
          <span class="font-semibold text-slate-500">Application ID:</span>
          <span class="font-extrabold text-sky-700">${refId}</span>
        </div>
        <div class="flex justify-between"><span class="font-semibold text-slate-500">Full Name:</span><span class="font-bold text-slate-900">${fullName}</span></div>
        <div class="flex justify-between"><span class="font-semibold text-slate-500">Father's Name:</span><span class="font-bold text-slate-900">${fatherName}</span></div>
        <div class="flex justify-between"><span class="font-semibold text-slate-500">Phone Number:</span><span class="font-bold text-slate-900">${phone}</span></div>
        <div class="flex justify-between"><span class="font-semibold text-slate-500">GMail:</span><span class="font-bold text-slate-900">${gmail}</span></div>
        <div class="flex justify-between"><span class="font-semibold text-slate-500">Age / Occupation:</span><span class="font-bold text-slate-900">${age} Yrs • ${occupation}</span></div>
        <div class="flex justify-between"><span class="font-semibold text-slate-500">Award Field:</span><span class="font-bold text-sky-800">${category}</span></div>
        <div class="pt-1 border-t border-sky-200/70">
          <span class="block font-semibold text-slate-500 text-xs">Social Service Activities:</span>
          <p class="text-slate-800 text-xs mt-0.5">${socialService}</p>
        </div>
        <div>
          <span class="block font-semibold text-slate-500 text-xs">Previous Achievements:</span>
          <p class="text-slate-800 text-xs mt-0.5">${achievements}</p>
        </div>
        <div>
          <span class="block font-semibold text-slate-500 text-xs">Full Address:</span>
          <p class="text-slate-800 text-xs mt-0.5">${address}</p>
        </div>
      `;

      const subject = encodeURIComponent(`Rajasheela Foundation Award Application - ${fullName} (${refId})`);
      const body = encodeURIComponent(
        `RAJASHEELA FOUNDATION (Reg No 552/26) - Candidate Registration\n` +
        `Application ID: ${refId}\n` +
        `Full Name: ${fullName}\n` +
        `Father's Name: ${fatherName}\n` +
        `Phone Number: ${phone}\n` +
        `GMail: ${gmail}\n` +
        `Age: ${age}\n` +
        `Current Occupation: ${occupation}\n` +
        `Award Category: ${category}\n` +
        `Social Service Activities: ${socialService}\n` +
        `Previous Achievements: ${achievements}\n` +
        `Full Address: ${address}\n`
      );
      emailForwardBtn.href = `mailto:rajasheela108@gmail.com?subject=${subject}&body=${body}`;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  }

  // 3. Website Login Form Handler (Candidate & Executive Director Portal)
  const loginForm = document.getElementById('loginForm');
  const loginStatus = document.getElementById('loginStatus');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const loginData = new FormData(loginForm);
      const role = loginData.get('loginRole');
      const userId = loginData.get('loginUser');

      loginStatus.classList.remove('hidden', 'bg-rose-50', 'text-rose-700', 'border-rose-200');
      loginStatus.classList.add('bg-sky-50', 'text-sky-900', 'border-sky-200');
      loginStatus.innerHTML = `
        <strong>Authenticated (${role}):</strong> Welcome, <span class="text-sky-700 font-bold">${userId}</span>.
        Redirecting to your RAJASHEELA FOUNDATION (Reg No 552/26) portal...
      `;

      setTimeout(() => {
        closeLoginModal();
        const target = role === 'Executive Director / Admin' ? '#notification' : '#register';
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
      }, 1200);
    });
  }
});

function closeModal() {
  const modal = document.getElementById('receiptModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function openLoginModal() {
  const loginModal = document.getElementById('loginModal');
  const loginStatus = document.getElementById('loginStatus');
  if (loginStatus) {
    loginStatus.classList.add('hidden');
  }
  if (loginModal) {
    loginModal.classList.remove('hidden');
    loginModal.classList.add('flex');
  }
}

function closeLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.classList.add('hidden');
    loginModal.classList.remove('flex');
  }
}
