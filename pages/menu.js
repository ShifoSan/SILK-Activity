import { ValuesPage } from './values.js';

export const MenuPage = {
    render() {
        return `
            <div id="page-menu" class="page-layer" style="
                opacity: 0; 
                transition: opacity 0.5s ease-in-out; 
                width: 100%; 
                height: 100vh; 
                position: relative;
                background-color: #000000;
                overflow: hidden;
                display: flex;
            ">
                
                <video autoplay loop muted playsinline style="
                    position: absolute;
                    top: 0; left: 0;
                    width: 100vw; height: 100vh;
                    object-fit: cover;
                    filter: blur(12px);
                    transform: scale(1.1);
                    z-index: 1;
                ">
                    <source src="./assets/menu_bg_video.mp4" type="video/mp4" />
                </video>

                <div style="
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: radial-gradient(circle at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.82) 100%);
                    z-index: 2;
                    pointer-events: none;
                "></div>

                <div style="
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    display: flex; justify-content: center; align-items: center;
                    z-index: 10; pointer-events: none;
                ">
                    
                    <div style="
                        display: flex; flex-direction: row; justify-content: center; align-items: center;
                        gap: 32px; width: 100%; max-width: 900px; padding: 24px; pointer-events: auto;
                    ">
                        
                        <div id="zone-values" class="menu-card-wrapper">
                            <img src="./assets/value.webp" alt="Values" class="menu-card-img" />
                        </div>
                        
                        <div id="zone-compare" class="menu-card-wrapper">
                            <img src="./assets/compare.webp" alt="Compare" class="menu-card-img" />
                        </div>
                        
                        <div id="zone-trading" class="menu-card-wrapper">
                            <img src="./assets/trade.webp" alt="Trading" class="menu-card-img" />
                        </div>
                        
                    </div>
                </div>

                <style>
                    .menu-card-wrapper {
                        width: 11.5vw; max-width: 120px; height: auto;
                        cursor: pointer; display: flex; justify-content: center; align-items: center;
                        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), filter 0.2s ease;
                        -webkit-tap-highlight-color: transparent;
                        filter: drop-shadow(0 15px 30px rgba(0,0,0,0.85));
                    }
                    .menu-card-img { width: 100%; height: auto; object-fit: contain; display: block; }
                    .menu-card-wrapper:active { transform: scale(0.92); filter: brightness(0.75) drop-shadow(0 4px 8px rgba(0,0,0,0.9)); }
                </style>

            </div>
        `;
    },
    
    init() {
        const menuLayer = document.getElementById('page-menu');
        setTimeout(() => { menuLayer.style.opacity = "1"; }, 50);

        document.getElementById('zone-values').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation System -> Sourcing Value Finder Page Module...");
            
            // 1. Target the current menu layer and fade it out
            menuLayer.style.opacity = "0";
            menuLayer.style.pointerEvents = "none";
            
            // 2. Wait for the fade transition, then replace the DOM
            setTimeout(() => {
                menuLayer.remove(); 
                
                const viewport = document.getElementById('app-viewport');
                
                // 3. Inject the Values Page without changing the URL
                viewport.innerHTML = ValuesPage.render(); 
                ValuesPage.init(); 
                
            }, 500); 
        });

        document.getElementById('zone-compare').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation System -> Initializing Trade Compare Matrix...");
        });

        document.getElementById('zone-trading').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation System -> Fetching Shared Instance Bulletin Board...");
        });
    }
};
