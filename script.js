(function () {
  var modal = document.getElementById('modal');
  var form = document.getElementById('contact-form');
  var success = document.getElementById('success');
  var closeBtn = document.getElementById('modal-close');
  var about = document.getElementById('about');
  var gallery = document.getElementById('gallery');
  var lastFocused = null;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scrollBehavior = reduceMotion ? 'auto' : 'smooth';

  function scrollToEl(el) {
    el.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
  }

  /* ----- Modal ----- */
  function getFocusable() {
    return modal.querySelectorAll('button, input, textarea, a[href]');
  }

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('name').focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    form.reset();
    form.hidden = false;
    success.hidden = true;
    clearErrors();
    if (lastFocused) lastFocused.focus();
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal(); // backdrop click
  });

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'Tab') {
      // Keep focus inside the modal
      var items = Array.prototype.filter.call(getFocusable(), function (el) {
        return el.offsetParent !== null;
      });
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ----- Validation ----- */
  function setError(id, message) {
    var input = document.getElementById(id);
    document.getElementById(id + '-error').textContent = message;
    input.parentElement.classList.toggle('invalid', !!message);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function clearErrors() {
    ['name', 'email', 'message'].forEach(function (id) { setError(id, ''); });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    var firstInvalid = null;

    clearErrors();

    if (name.length < 2) {
      setError('name', 'Please enter your name (at least 2 characters).');
      firstInvalid = firstInvalid || form.name;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email', 'Please enter a valid email address.');
      firstInvalid = firstInvalid || form.email;
    }
    if (message.length < 10) {
      setError('message', 'Please write a message of at least 10 characters.');
      firstInvalid = firstInvalid || form.message;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  /* ----- Buttons and navigation ----- */
  document.getElementById('get-started').addEventListener('click', openModal);
  document.getElementById('learn-more').addEventListener('click', function () {
    scrollToEl(about);
  });

  document.querySelectorAll('[data-nav]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = link.getAttribute('data-nav');
      if (target === 'home') window.scrollTo({ top: 0, behavior: scrollBehavior });
      else if (target === 'about') scrollToEl(about);
      else if (target === 'services') scrollToEl(gallery);
      else if (target === 'contact') openModal();
    });
  });
})();
