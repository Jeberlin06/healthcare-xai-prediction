/**
 * HealthAI - Global Application Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // 1. Mobile Sidebar Navigation Toggle
    // ------------------------------------------------------------------
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (navToggle && sidebar) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });

        // Close sidebar when user clicks anywhere outside of it on mobile
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !navToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    // ------------------------------------------------------------------
    // 2. Dark Mode Toggle with LocalStorage Persistence
    // ------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeButtonIcon(savedTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeButtonIcon(newTheme);
        });
    }

    function updateThemeButtonIcon(theme) {
        if (!themeToggleBtn) return;
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Toggle Light Mode';
        } else {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Toggle Dark Mode';
        }
    }

    // ------------------------------------------------------------------
    // 3. Diabetes Prediction Form Handler
    // ------------------------------------------------------------------
    const diabetesForm = document.getElementById('diabetes-form');
    if (diabetesForm) {
        diabetesForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                glucose: document.getElementById('glucose')?.value,
                bp: document.getElementById('bp')?.value,
                bmi: document.getElementById('bmi')?.value,
                age: document.getElementById('age')?.value,
                insulin: document.getElementById('insulin')?.value,
                skin: document.getElementById('skin')?.value
            };

            // Save clinical inputs for the diagnostic and explainability pages
            localStorage.setItem('lastDiabetesAssessment', JSON.stringify(formData));

            // Redirect to Diagnostic Results
            window.location.href = 'diagnosis-result.html';
        });
    }
});