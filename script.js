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

async function updateAccountNav() {

    const accountNav =
        document.getElementById('account-nav');

    if (!accountNav) {
        return;
    }

    // If Supabase isn't available,
    // leave the logged-out links alone.
    if (!window.supabase) {
        console.error('Supabase library not found.');
        return;
    }

    try {

        const {
            data: {
                session
            },
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error(
                'Error checking login status:',
                error
            );
            return;
        }


        // ======================================
        // LOGGED IN
        // ======================================

        if (session) {

            accountNav.innerHTML = `
                <a href="profile.html">My Profile</a>
                <a href="#" id="logout-link">Log Out</a>
            `;

            const logoutLink =
                document.getElementById('logout-link');

            logoutLink.addEventListener(
                'click',
                async function(event) {

                    event.preventDefault();

                    const {
                        error
                    } = await supabaseClient.auth.signOut();

                    if (error) {

                        console.error(
                            'Logout error:',
                            error
                        );

                        return;
                    }

                    window.location.href = 'index.html';
                }
            );
        }


        // ======================================
        // LOGGED OUT
        // ======================================

        else {

            accountNav.innerHTML = `
                <a href="signup.html">Join STLNC</a>
                <a href="login.html">Log In</a>
            `;
        }

    } catch (error) {

        console.error(
            'Account navigation error:',
            error
        );

        // IMPORTANT:
        // Don't erase the logged-out navigation
        // if something goes wrong.
    }
}


// ==========================================
// START
// ==========================================

document.addEventListener(
    'DOMContentLoaded',
    function() {
        updateAccountNav();
    }
);
