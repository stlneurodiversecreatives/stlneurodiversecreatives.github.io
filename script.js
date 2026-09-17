// =========================================================
// STLNC — SHARED JAVASCRIPT
// =========================================================


// =========================================================
// SUPABASE SETTINGS
// =========================================================

const SUPABASE_URL = 'https://nwmnamevyasyruygapeb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OWaZPpZTVGK6FYETNa0VLQ_-1gAz1qQ';


// =========================================================
// DARK MODE
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  const themeToggle = document.getElementById('theme-toggle');

  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {

    document.documentElement.setAttribute(
      'data-theme',
      currentTheme
    );

  }

  if (!themeToggle) {
    return;
  }

  if (currentTheme === 'dark') {

    themeToggle.textContent = '☀️ Light Mode';

  } else {

    themeToggle.textContent = '🌙 Dark Mode';

  }


  themeToggle.addEventListener('click', function () {

    const theme =
      document.documentElement.getAttribute('data-theme');


    if (theme === 'dark') {

      document.documentElement.removeAttribute(
        'data-theme'
      );

      localStorage.setItem(
        'theme',
        'light'
      );

      themeToggle.textContent =
        '🌙 Dark Mode';

    } else {

      document.documentElement.setAttribute(
        'data-theme',
        'dark'
      );

      localStorage.setItem(
        'theme',
        'dark'
      );

      themeToggle.textContent =
        '☀️ Light Mode';

    }

  });

});


// =========================================================
// ACCOUNT NAVIGATION
// =========================================================

async function updateAccountNav() {

  const accountNav = document.getElementById('account-nav');

  if (!accountNav) {
    return;
  }

  // Make sure the Supabase client exists
  if (typeof supabaseClient === 'undefined') {
    console.error('STLNC: supabaseClient was not found.');

    accountNav.innerHTML = `
      <a href="signup.html">Join STLNC</a>
      <a href="login.html">Log In</a>
    `;

    return;
  }

  try {

    const {
      data,
      error
    } = await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }

    const session = data.session;

    accountNav.innerHTML = '';

    if (session) {

      accountNav.innerHTML = `
        <a href="profile.html">My Profile</a>
        <a href="#" id="logout-link">Log Out</a>
      `;

      document
        .getElementById('logout-link')
        .addEventListener('click', async function(event) {

          event.preventDefault();

          const { error } =
            await supabaseClient.auth.signOut();

          if (error) {
            console.error('Logout error:', error);
            return;
          }

          window.location.href = 'index.html';

        });

    } else {

      accountNav.innerHTML = `
        <a href="signup.html">Join STLNC</a>
        <a href="login.html">Log In</a>
      `;

    }

  } catch (error) {

    console.error(
      'STLNC account navigation error:',
      error
    );

    // If Supabase fails, don't leave the user staring at
    // "Loading account..."
    accountNav.innerHTML = `
      <a href="signup.html">Join STLNC</a>
      <a href="login.html">Log In</a>
    `;

  }
}


// Start account navigation
document.addEventListener('DOMContentLoaded', function() {
  updateAccountNav();
});

  // =======================================================
  // LOGGED OUT
  // =======================================================

  else {

    const signupLink =
      document.createElement('a');

    signupLink.href =
      'signup.html';

    signupLink.textContent =
      'Join STLNC';


    const loginLink =
      document.createElement('a');

    loginLink.href =
      'login.html';

    loginLink.textContent =
      'Log In';


    accountNav.appendChild(
      signupLink
    );

    accountNav.appendChild(
      loginLink
    );

  }


  // =======================================================
  // WATCH FOR AUTH CHANGES
  // =======================================================

  supabaseClient.auth.onAuthStateChange(
    function () {

      updateAccountNav();

    }
  );

}


// =========================================================
// START
// =========================================================

document.addEventListener(
  'DOMContentLoaded',
  function () {

    updateAccountNav();

  }
);
