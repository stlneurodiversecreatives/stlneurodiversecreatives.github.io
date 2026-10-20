/* =========================================================
   STLNC — shared script (loaded on every page)
   1. Supabase client
   2. Display settings (theme, text size, spacing)
   3. Account links in the header (Join / Log in  <->  My Profile / Log out)
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. Supabase ---------- */
  var SUPABASE_URL = 'https://nwmnamevyasyruygapeb.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_OWaZPpZTVGK6FYETNa0VLQ_-1gAz1qQ';

  var client = null;
  try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
      console.error('STLNC: Supabase library did not load.');
    }
  } catch (err) {
    console.error('STLNC: Could not create Supabase client.', err);
  }
  // Page scripts (directory.js, profile.js, ...) use this.
  window.supabaseClient = client;

  /* ---------- 2. Display settings ---------- */
  var root = document.documentElement;

  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, value) {
    try {
      if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
    } catch (e) { /* storage blocked: settings just won't persist */ }
  }

  function applySettings() {
    var theme = read('theme');
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');

    var text = read('stlnc-text');
    if (text === 'large' || text === 'xl') root.setAttribute('data-text', text);
    else root.removeAttribute('data-text');

    if (read('stlnc-spacing') === '1') root.setAttribute('data-spacing', '1');
    else root.removeAttribute('data-spacing');
  }

  function setupDisplaySettings() {
    var toggle = document.getElementById('display-toggle');
    var panel = document.getElementById('display-panel');
    if (!toggle || !panel) return;

    function syncControls() {
      var theme = read('theme');
      var themeValue = (theme === 'light' || theme === 'dark') ? theme : 'auto';
      var text = read('stlnc-text');
      var textValue = (text === 'large' || text === 'xl') ? text : 'default';
      var r;
      r = panel.querySelector('input[name="theme"][value="' + themeValue + '"]');
      if (r) r.checked = true;
      r = panel.querySelector('input[name="textsize"][value="' + textValue + '"]');
      if (r) r.checked = true;
      var sp = document.getElementById('spacing-toggle');
      if (sp) sp.checked = read('stlnc-spacing') === '1';
    }

    function open() {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }
    function close(returnFocus) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      if (panel.hidden) open(); else close(false);
    });

    panel.addEventListener('change', function (event) {
      var t = event.target;
      if (t.name === 'theme') write('theme', t.value === 'auto' ? null : t.value);
      else if (t.name === 'textsize') write('stlnc-text', t.value === 'default' ? null : t.value);
      else if (t.id === 'spacing-toggle') write('stlnc-spacing', t.checked ? '1' : null);
      applySettings();
    });

    var reset = document.getElementById('display-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        write('theme', null); write('stlnc-text', null); write('stlnc-spacing', null);
        applySettings(); syncControls();
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) close(true);
    });
    document.addEventListener('click', function (event) {
      if (!panel.hidden && !panel.contains(event.target) && !toggle.contains(event.target)) close(false);
    });

    syncControls();
  }

  /* ---------- 3. Account navigation ---------- */
  function makeLink(href, text, extraClass) {
    var a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    a.className = extraClass || 'btn btn-small';
    return a;
  }

  async function updateAccountNav() {
    var box = document.getElementById('account-links');
    if (!box || !client) return;

    try {
      var result = await client.auth.getSession();
      if (result.error) {
        console.error('STLNC: Error checking login status:', result.error);
        return;
      }
      box.textContent = '';

      if (result.data && result.data.session) {
        box.appendChild(makeLink('profile.html', 'My Profile', 'btn btn-small btn-sun'));

        var out = document.createElement('button');
        out.type = 'button';
        out.className = 'btn btn-small';
        out.textContent = 'Log Out';
        out.addEventListener('click', async function () {
          var res = await client.auth.signOut({ scope: 'local' });
          if (res.error) {
            console.error('STLNC: Logout error:', res.error);
            return;
          }
          window.location.href = 'index.html';
        });
        box.appendChild(out);
      } else {
        box.appendChild(makeLink('signup.html', 'Join STLNC', 'btn btn-small btn-sun'));
        box.appendChild(makeLink('login.html', 'Log In', 'btn btn-small'));
      }
    } catch (err) {
      console.error('STLNC: Account navigation error:', err);
    }
  }

  function init() {
    applySettings();
    setupDisplaySettings();
    updateAccountNav();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
