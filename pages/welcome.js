import { MenuPage } from './menu.js';

export const WelcomePage = {
    render() {
        return `
            <div id="page-welcome" class="page-layer" style="text-align: center; cursor: pointer; padding: 20px; justify-content: center;">
                <h1 style="font-family: 'Viaoda Libre', serif; font-size: 2.6rem; font-weight: normal; color: #38BDF8; margin-bottom: 14px; letter-spacing: 0.04em; text-shadow: 0 0 30px rgba(56,189,248,0.15);">
                    Welcome to SILK Trading Center
                </h1>
                <p style="font-size: 0.85rem; color: #94A3B8; opacity: 0.5; letter-spacing: 0.12em; text-transform: uppercase;">
                    Click anywhere to continue
                </p>
            </div>
        `;
    },
    
    init() {
        const welcomeLayer = document.getElementById('page-welcome');
        
        welcomeLayer.addEventListener('click', function() {
            // Unlocking user-gesture validation rules. Fade up background music loop!
            window.silkAudio.fadeInMusic();
            
            // Gracefully reduce layer opacity via CSS transitions
            welcomeLayer.classList.add('fade-out');
            
            setTimeout(() => {
                welcomeLayer.classList.add('hidden');
                
                // Mount and boot up the landscape main menu module interface dynamically
                const viewport = document.getElementById('app-viewport');
                viewport.innerHTML = MenuPage.render();
                MenuPage.init();
            }, 500);
        });
    }
};
