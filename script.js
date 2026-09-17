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

  const accountNav =
    document.getElementById('account-nav');


  if (!accountNav) {
    return;
  }


  // Make sure Supabase loaded

  if (!window.supabase) {

    console.error(
      'STLNC: Supabase library was not loaded.'
    );

    accountNav.innerHTML = `
      <a href="signup.html">Join STLNC</a>
      <a href="login.html">Log In</a>
    `;

    return;
  }


  // Create Supabase client

  const supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );


  // Check current login session

  const {
    data: {
      session
    },
    error
  } =
    await supabaseClient.auth.getSession();


  if (error) {

    console.error(
      'STLNC: Could not check login status:',
      error
    );

    accountNav.innerHTML = `
      <a href="signup.html">Join STLNC</a>
      <a href="login.html">Log In</a>
    `;

    return;
  }


  // Remove "Loading account..."

  accountNav.innerHTML = '';


  // =======================================================
  // LOGGED IN
  // =======================================================

  if (session) {

    const profileLink =
      document.createElement('a');

    profileLink.href =
      'profile.html';

    profileLink.textContent =
      'My Profile';


    const logoutLink =
      document.createElement('a');

    logoutLink.href =
      '#';

    logoutLink.textContent =
      'Log Out';


    logoutLink.addEventListener(
      'click',
      async function (event) {

        event.preventDefault();


        const {
          error
        } =
          await supabaseClient.auth.signOut();


        if (error) {

          console.error(
            'STLNC: Logout error:',
            error
          );

          return;
        }


        window.location.href =
          'index.html';

      }
    );


    accountNav.appendChild(
      profileLink
    );

    accountNav.appendChild(
      logoutLink
    );

  }


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
