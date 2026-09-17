// ================================
// STLNC SITE JAVASCRIPT
// ================================


// -------------------------------
// DARK MODE
// -------------------------------

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
        let theme = document.documentElement.getAttribute('data-theme');

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

async function updateAccountNav() {

    // Make sure Supabase has loaded
    if (!window.supabaseClient) {
        return;
    }

    // Find the account navigation
    const accountNav = document.querySelector('.account-nav');

    if (!accountNav) {
        return;
    }

    // Check whether someone is currently logged in
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session) {

        // LOGGED IN
        accountNav.innerHTML = `
            <a href="profile.html">My Profile</a>
            <a href="#" id="logout-link">Log Out</a>
        `;

        const logoutLink = document.getElementById('logout-link');

        logoutLink.addEventListener('click', async (event) => {
            event.preventDefault();

            const { error } = await supabaseClient.auth.signOut();

            if (error) {
                console.error('Logout error:', error);
                alert('There was a problem logging out.');
                return;
            }

            window.location.href = 'index.html';
        });

    } else {

        // LOGGED OUT
        accountNav.innerHTML = `
            <a href="signup.html">Join STLNC</a>
            <a href="login.html">Log In</a>
        `;
    }
}


// Run account navigation when the page loads
updateAccountNav();
