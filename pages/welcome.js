import { MenuPage } from './menu.js';

export const WelcomePage = {
    render() {
        return `
            <div id="page-welcome" class="page-layer" style="
                text-align: center; 
                cursor: pointer; 
                padding: 24px; 
                justify-content: center;
                background: radial-gradient(circle at center, #0F1A2C 0%, #04070D 100%);
                background-size: 200% 200%;
                animation: pathsAtmosphere 12s ease infinite;
                display: flex;
                flex-direction: column;
                align-items: center;
            ">
                
                <style>
                    @keyframes pathsAtmosphere {
                        0%, 100% { background-position: 50% 0%; }
                        50% { background-position: 50% 100%; }
                    }
                    
                    @keyframes textPulse {
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50% { opacity: 0.75; transform: scale(1.02); }
                    }
                </style>

                <h1 style="
                    font-family: 'Viaoda Libre', serif; 
                    font-size: 2.8rem; 
                    font-weight: normal; 
                    color: #F8FAFC; 
                    margin-bottom: 8px; 
                    letter-spacing: 0.04em; 
                    text-shadow: 0 0 25px rgba(56,189,248,0.3), 0 0 50px rgba(56,189,248,0.1);
                ">
                    Welcome to <span style="color: #38BDF8;">SILK</span>
                </h1>
                
                <h2 style="
                    font-family: 'Viaoda Libre', serif;
                    font-size: 1.4rem;
                    font-weight: normal;
                    color: #94A3B8;
                    opacity: 0.8;
                    margin-bottom: 40px;
                    letter-spacing: 0.08em;
                ">
                    Trading Center
                </h2>
                
                <p style="
                    font-size: 0.8rem; 
                    color: #38BDF8; 
                    letter-spacing: 0.15em; 
                    text-transform: uppercase;
                    animation: textPulse 2.5s ease-in-out infinite;
                    font-weight: bold;
                    background: rgba(56, 189, 248, 0.05);
                    padding: 8px 18px;
                    border-radius: 20px;
                    border: 1px solid rgba(56, 189, 248, 0.15);
                    box-shadow: inset 0 0 10px rgba(56,189,248,0.05);
                ">
                    Click anywhere to continue
                </p>
            </div>
        `;
    },
    
    init() {
        const welcomeLayer = document.getElementById('page-welcome');
        
        welcomeLayer.addEventListener('click', function() {
            // Satisfy browser security gestures to fade-in our background track loop
            window.silkAudio.fadeInMusic();
            
            // Initiate clean out-of-view opacity fade transitions
            welcomeLayer.classList.add('fade-out');
            
            setTimeout(() => {
                welcomeLayer.classList.add('hidden');
                
                // Render the newly calibrated 16:9 pixel-perfect main menu dashboard
                const viewport = document.getElementById('app-viewport');
                viewport.innerHTML = MenuPage.render();
                MenuPage.init();
            }, 500);
        });
    }
};
