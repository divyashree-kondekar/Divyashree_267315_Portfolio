const themeButton = document.querySelector('.theme-toggle');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const contactForm = document.querySelector('.contact-form');
const copyButton = document.querySelector('.copy-message');
const formStatus = document.querySelector('.form-status');
let preparedMessage = '';

// Remember a visitor's light/dark preference.
if (localStorage.getItem('divyashree-theme') === 'dark') document.body.classList.add('dark');
updateThemeButton();
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('divyashree-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  updateThemeButton();
});
function updateThemeButton() {
  const dark = document.body.classList.contains('dark');
  themeButton.innerHTML = `<span aria-hidden="true">${dark ? '☀' : '☾'}</span>`;
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
}

// Keep the compact navigation accessible on smaller screens.
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
  mobileNav.hidden = expanded;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  mobileNav.hidden = true;
}));

// Validate the contact form and prepare a message the visitor can copy.
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const data = new FormData(contactForm);
  preparedMessage = `From: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
  formStatus.textContent = 'Your message is ready. Copy it, then email it to me.';
  copyButton.hidden = false;
});
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(preparedMessage);
    formStatus.textContent = 'Message copied. You can now paste it into an email to me.';
  } catch {
    formStatus.textContent = 'Clipboard access is unavailable here. Select and copy your details from the form.';
  }
});

// Reveal project cards as they enter the viewport.
const revealItems = document.querySelectorAll('[data-reveal]:not(.hero-copy):not(.hero-art)');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('is-visible'));

document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());
