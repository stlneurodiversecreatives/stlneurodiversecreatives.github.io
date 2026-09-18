// ==========================================
// STLNC DARK MODE
// ==========================================

const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggle && currentTheme === 'dark') {
        themeToggle.textContent = '☀️ Light Mode';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {

        const theme =
            document.documentElement.getAttribute('data-theme');

        if (theme === 'dark') {

            document.documentElement.removeAttribute('data-theme');

            localStorage.setItem('theme', 'light');

            themeToggle.textContent = '🌙 Dark Mode';

        } else {

            document.documentElement.setAttribute(
                'data-theme',
                'dark'
            );

            localStorage.setItem('theme', 'dark');

            themeToggle.textContent = '☀️ Light Mode';
        }
    });
}


// ==========================================
// STLNC ACCOUNT NAVIGATION
// ==========================================
// ==========================================
// STLNC ACCOUNT NAVIGATION
// ==========================================

async function updateAccountNav() {

  const accountLinks =
    document.getElementById('account-links');

  if (!accountLinks) {
    return;
  }

  if (!window.supabaseClient) {
    console.error('STLNC: Supabase client not found.');
    return;
  }

  try {

    const { data, error } =
      await window.supabaseClient.auth.getSession();

    if (error) {
      console.error(
        'STLNC: Error checking login status:',
        error
      );
      return;
    }

    if (data.session) {

      // LOGGED IN
      accountLinks.innerHTML = `
        <a href="profile.html">My Profile</a>
        <a href="#" id="logout-link">Log Out</a>
      `;

      const logoutLink =
        document.getElementById('logout-link');

      logoutLink.addEventListener('click', async function(event) {

        event.preventDefault();

        const { error } =
          await window.supabaseClient.auth.signOut();

        if (error) {
          console.error(
            'STLNC: Logout error:',
            error
          );
          return;
        }

        window.location.href = 'index.html';
      });

    } else {

      // LOGGED OUT
      accountLinks.innerHTML = `
        <a href="signup.html">Join STLNC</a>
        <a href="login.html">Log In</a>
      `;
    }

  } catch (error) {

    console.error(
      'STLNC: Account navigation error:',
      error
    );
  }
}


// Check login status when page loads
document.addEventListener(
  'DOMContentLoaded',
  updateAccountNav
);
