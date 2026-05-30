import { MenuPage } from './menu.js';

export const WelcomePage = {
    render() {
        return `
            <div id="page-welcome" class="page-layer" style="
                text-align: center; 
                cursor: pointer; 
                padding: 24px; 
                justify-content: space-between; /* Evenly splits user banner, titles, and prompt */
                background: linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.65)), 
                            url('./assets/welcome_bg.webp') no-repeat center center fixed;
                background-size: cover;
                position: absolute;
                width: 100%;
                height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 10;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-in-out;
            ">
                
                <canvas id="welcome-rain-canvas" style="
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    z-index: 1;
                    pointer-events: none;
                    display: block;
                "></canvas>

                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&display=swap');

                    /* Cinematic slow vertical floating wavelength loop */
                    @keyframes cinematicFloat {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-8px); }
                    }

                    /* Delicate gold glimmer shimmer tracking */
                    @keyframes pureSparkle {
                        0%, 100% { filter: brightness(1); }
                        50% { filter: brightness(1.2); }
                    }

                    .floating-title-block {
                        animation: cinematicFloat 5s ease-in-out infinite, pureSparkle 6s ease-in-out infinite;
                    }

                    /* Continue text flashing rhythm pulse */
                    @keyframes promptPulse {
                        0%, 100% { opacity: 0.35; transform: scale(1); }
                        50% { opacity: 0.85; transform: scale(1.02); }
                    }
                </style>

                <div id="welcome-user-banner" style="
                    z-index: 5;
                    margin-top: 16px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    opacity: 0;
                    transition: opacity 0.8s ease-out;
                ">
                    <div style="
                        width: 54px; height: 54px;
                        border-radius: 50%;
                        border: 2px solid #AA7C11;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.75);
                        overflow: hidden;
                        background: #1C0F0A;
                    ">
                        <img id="welcome-avatar-target" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='35' r='20' fill='%23B5924B'/><path d='M10,85 C10,60 90,60 90,85 Z' fill='%23B5924B'/></svg>" style="width:100%; height:100%; object-fit:cover;" />
                    </div>
                    <div id="welcome-username-target" style="
                        font-family: 'Cinzel', serif;
                        font-size: 0.75rem;
                        color: #E2E8F0;
                        letter-spacing: 0.15em;
                        text-transform: uppercase;
                        text-shadow: 0 2px 8px rgba(0,0,0,0.95);
                        background: rgba(18, 9, 5, 0.6);
                        padding: 4px 12px;
                        border-radius: 20px;
                        border: 1px solid rgba(170, 124, 17, 0.25);
                    ">
                        AUTHORIZED SOLDIER
                    </div>
                </div>

                <div class="floating-title-block" style="position: relative; z-index: 5; margin-top: auto; margin-bottom: auto;">
                    
                    <h1 style="
                        font-family: 'Viaoda Libre', serif; 
                        font-size: 3.1rem; 
                        font-weight: normal; 
                        color: #AA7C11; 
                        margin-bottom: 2px; 
                        letter-spacing: 0.06em; 
                        text-shadow: 0 4px 10px rgba(0,0,0,0.95), 0 12px 25px rgba(0,0,0,0.85);
                    ">
                        Welcome to SILK
                    </h1>
                    
                    <h2 style="
                        font-family: 'Viaoda Libre', serif;
                        font-size: 1.35rem;
                        font-weight: normal;
                        color: #B5924B;
                        letter-spacing: 0.14em;
                        opacity: 0.85;
                        text-shadow: 0 3px 8px rgba(0,0,0,0.95), 0 8px 20px rgba(0,0,0,0.8);
                    ">
                        Trading Center
                    </h2>
                </div>

                <div style="position: relative; z-index: 5; margin-bottom: 32px;">
                    <p style="
                        font-family: 'Cinzel', serif;
                        font-size: 0.85rem; 
                        color: #AA7C11; 
                        letter-spacing: 0.2em; 
                        text-transform: uppercase;
                        animation: promptPulse 2.4s ease-in-out infinite;
                        font-weight: 800;
                        text-shadow: 0 2px 6px rgba(0,0,0,0.95);
                    ">
                        Click anywhere to continue
                    </p>
                </div>
            </div>
        `;
    },
    
    init() {
        const welcomeLayer = document.getElementById('page-welcome');
        const userBanner = document.getElementById('welcome-user-banner');
        
        // Dynamic Fade-In entry for user data assets
        setTimeout(() => { userBanner.style.opacity = "1"; }, 150);

        // =====================================================================
        // 🖥️ PARSE DISCORD RUNTIME PARAMETERS FOR ACCOUNT ASSETS
        // =====================================================================
        // Safely crawls internal storage layers to parse user profiles natively
        try {
            if (window.discordSdk && window.discordSdk.userId) {
                // Query local user state keys fetched during index handshake boot loops
                const targetName = window.discordUsername || "PLAYER SOLDIER";
                const targetAvatar = window.discordAvatarUrl || "";
                
                if (targetAvatar) document.getElementById('welcome-avatar-target').src = targetAvatar;
                document.getElementById('welcome-username-target').innerText = targetName.toUpperCase();
            }
        } catch (err) {
            console.log("Preloader Handshake Idle: Displaying local account backup values safely.");
        }

        // =====================================================================
        // 🌧️ UPGRADE 3: HIGH-PERFORMANCE LIGHTWEIGHT RAIN DROPLETS ENGINE
        // =====================================================================
        const canvas = document.getElementById('welcome-rain-canvas');
        const ctx = canvas.getContext('2d');
        let rainDropsArray = [];
        const maximumDropsCeiling = 60; // Clean particle threshold to guarantee 60 FPS processing loops
        let rainAnimationFrameId = null;

        function resizeRainCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeRainCanvas);
        resizeRainCanvas();

        // Build continuous rain drop asset arrays mapping geometric spatial bounds
        for (let i = 0; i < maximumDropsCeiling; i++) {
            rainDropsArray.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                length: Math.random() * 20 + 15,
                speed: Math.random() * 8 + 12,
                weight: Math.random() * 1 + 0.5
            });
        }

        // Infinite tick render routine loop drawing vectors directly to viewport
        function renderRainTick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Styled with your thematic antique gold tracking colors to fit the aesthetic context cleanly
            ctx.strokeStyle = 'rgba(181, 146, 75, 0.18)';
            ctx.linecap = 'round';

            for (let i = 0; i < rainDropsArray.length; i++) {
                let p = rainDropsArray[i];
                ctx.lineWidth = p.weight;
                
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + (p.speed * 0.05), p.y + p.length); // Adds realistic angular velocity tracking fall paths
                ctx.stroke();

                p.y += p.speed;

                // Recycle rain droplet parameters when tracking boundaries reach bottom viewport bounds
                if (p.y > canvas.height) {
                    p.x = Math.random() * canvas.width;
                    p.y = -20;
                    p.speed = Math.random() * 8 + 12;
                }
            }
            rainAnimationFrameId = requestAnimationFrame(renderRainTick);
        }
        renderRainTick();

        // =====================================================================
        // 🔒 APPLICATION PERSISTENT CONTROL SWITCH TRIGGERS
        // =====================================================================
        welcomeLayer.addEventListener('click', function() {
            window.silkAudio.fadeInMusic();
            
            // Clean up drawing frame calculation structures to safeguard mobile memory allocations
            cancelAnimationFrame(rainAnimationFrameId);
            window.removeEventListener('resize', resizeRainCanvas);
            
            // High-fidelity transition out zoom timeline sequence block
            welcomeLayer.style.transform = "scale(1.06)";
            welcomeLayer.style.opacity = "0";
            welcomeLayer.style.pointerEvents = "none";
            
            setTimeout(() => {
                welcomeLayer.classList.add('hidden');
                welcomeLayer.remove(); // Drops the layer entirely to clear memory space
                
                // Fire and mount the customized high-performance video backdrop menu hub layer
                const viewport = document.getElementById('app-viewport');
                viewport.innerHTML = MenuPage.render();
                MenuPage.init();
            }, 550);
        });
    }
};
