// ================================
// STLNC SITE JAVASCRIPT
// ================================


// -------------------------------
// DARK MODE

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
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️ Light Mode';
        }
    });
}


// -------------------------------
// ACCOUNT NAVIGATION
// -------------------------------
document.addEventListener('DOMContentLoaded', function () {

  const accountNav = document.getElementById('account-nav');

  if (!accountNav) {
    console.error('STLNC: account-nav was not found.');
    return;
  }

  accountNav.innerHTML = `
    <a href="signup.html">Join STLNC</a>
    <a href="login.html">Log In</a>
  `;

});

async function updateAccountNav() {

    const accountNav = document.querySelector('.account-nav');

    if (!accountNav) {
        return;
    }

    // Make sure Supabase exists on this page
    if (!window.supabase || !window.supabaseClient) {
        console.error('Supabase client was not found.');
        return;
    }

    const { data, error } =
        await window.supabaseClient.auth.getSession();

    if (error) {
        console.error('Could not check login session:', error);
        return;
    }

    const session = data.session;

    if (session) {

        // USER IS LOGGED IN
        accountNav.innerHTML = `
            <a href="profile.html">My Profile</a>
            <a href="#" id="logout-link">Log Out</a>
        `;

        const logoutLink =
            document.getElementById('logout-link');

        logoutLink.addEventListener('click', async (event) => {

            event.preventDefault();

            const { error } =
                await window.supabaseClient.auth.signOut();

            if (error) {
                console.error('Logout error:', error);
                alert('There was a problem logging out.');
                return;
            }

            window.location.href = 'index.html';
        });

    } else {

        // USER IS LOGGED OUT
        accountNav.innerHTML = `
            <a href="signup.html">Join STLNC</a>
            <a href="login.html">Log In</a>
        `;
    }
}


// Run when the page loads
updateAccountNav();
