const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('visible'));

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// Front-end validation only. Connect a secure backend (such as Google Apps Script) before accepting live applications.
const form = document.getElementById('candidateForm');
const message = document.getElementById('formMessage');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  message.textContent = 'Your details passed the form checks. Online submission is not enabled yet; please contact the Foundation to submit your application.';
  message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
