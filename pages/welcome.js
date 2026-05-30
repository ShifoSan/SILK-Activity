import { MenuPage } from './menu.js';

export const WelcomePage = {
    render() {
        return `
            <div id="page-welcome" class="page-layer" style="
                text-align: center; 
                cursor: pointer; 
                padding: 24px; 
                justify-content: center;
                background: radial-gradient(circle at center, #351C10 0%, #1C0F0A 45%, #050302 100%);
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
                
                <style>
                    /* 📱 DYNAMIC GOOGLE FONTS INGESTION PARSER */
                    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;800&display=swap');

                    /* 3D Space Scene Canvas Frame */
                    .matrix-scene3d {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        perspective: 1000px;
                        overflow: hidden;
                        pointer-events: none;
                        z-index: 1;
                    }
                    
                    /* Modular 3D Cube Structure Definitions */
                    .box3d-wrapper {
                        position: absolute;
                        width: 45px;
                        height: 45px;
                        transform-style: preserve-3d;
                    }
                    
                    .box3d-body {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        transform-style: preserve-3d;
                    }
                    
                    .box3d-face {
                        position: absolute;
                        width: 45px;
                        height: 45px;
                        background: rgba(197, 160, 89, 0.06);
                        border: 1px solid rgba(197, 160, 89, 0.28);
                        box-shadow: inset 0 0 8px rgba(197, 160, 89, 0.15);
                    }
                    
                    /* Structural geometric offsets mapping the 6 cube vertices */
                    .face-front  { transform: rotateY(0deg) translateZ(22.5px); }
                    .face-back   { transform: rotateY(180deg) translateZ(22.5px); }
                    .face-right  { transform: rotateY(90deg) translateZ(22.5px); }
                    .face-left   { transform: rotateY(-90deg) translateZ(22.5px); }
                    .face-top    { transform: rotateX(90deg) translateZ(22.5px); }
                    .face-bottom { transform: rotateX(-90deg) translateZ(22.5px); }
                    
                    /* 🚀 HIGH-VELOCITY INCREASED DENSITY 3D DEPTH TIMELINES */
                    @keyframes travelBox1 {
                        0% { transform: translate3d(-15vw, 85vh, -400px) rotateX(0deg) rotateY(0deg); opacity: 0; }
                        15%, 85% { opacity: 1; }
                        100% { transform: translate3d(120vw, -15vh, 200px) rotateX(360deg) rotateY(720deg); opacity: 0; }
                    }
                    @keyframes travelBox2 {
                        0% { transform: translate3d(95vw, 110vh, -200px) rotateX(45deg) rotateY(0deg); opacity: 0; }
                        10%, 90% { opacity: 0.85; }
                        100% { transform: translate3d(-25vw, -20vh, 400px) rotateX(405deg) rotateY(360deg); opacity: 0; }
                    }
                    @keyframes travelBox3 {
                        0% { transform: translate3d(10vw, 110vh, -500px) rotateX(0deg) rotateY(30deg); opacity: 0; }
                        20%, 80% { opacity: 0.95; }
                        100% { transform: translate3d(85vw, -35vh, 100px) rotateX(720deg) rotateY(390deg); opacity: 0; }
                    }
                    @keyframes travelBox4 {
                        0% { transform: translate3d(115vw, 25vh, -300px) rotateX(120deg) rotateY(60deg); opacity: 0; }
                        15%, 85% { opacity: 0.8; }
                        100% { transform: translate3d(-20vw, 80vh, 300px) rotateX(480deg) rotateY(-300deg); opacity: 0; }
                    }
                    @keyframes travelBox5 {
                        0% { transform: translate3d(-20vw, -10vh, -350px) rotateX(10deg) rotateY(90deg); opacity: 0; }
                        10%, 85% { opacity: 0.9; }
                        100% { transform: translate3d(110vw, 90vh, 150px) rotateX(540deg) rotateY(180deg); opacity: 0; }
                    }
                    @keyframes travelBox6 {
                        0% { transform: translate3d(50vw, 120vh, -600px) rotateX(90deg) rotateY(45deg); opacity: 0; }
                        25%, 75% { opacity: 0.75; }
                        100% { transform: translate3d(45vw, -25vh, 250px) rotateX(90deg) rotateY(720deg); opacity: 0; }
                    }
                    @keyframes travelBox7 {
                        0% { transform: translate3d(120vw, 90vh, -250px) rotateX(0deg) rotateY(0deg); opacity: 0; }
                        15%, 80% { opacity: 0.85; }
                        100% { transform: translate3d(-15vw, 10vh, 350px) rotateX(360deg) rotateY(-360deg); opacity: 0; }
                    }
                    @keyframes travelBox8 {
                        0% { transform: translate3d(-10vw, 40vh, -450px) rotateX(20deg) rotateY(110deg); opacity: 0; }
                        10%, 90% { opacity: 0.9; }
                        100% { transform: translate3d(115vw, 55vh, 200px) rotateX(740deg) rotateY(470deg); opacity: 0; }
                    }

                    /* Speeds optimized dynamically to look crisp and active (reduced travel intervals) */
                    .b1 { animation: travelBox1 7.5s linear infinite; }
                    .b2 { animation: travelBox2 10.5s linear infinite; }
                    .b3 { animation: travelBox3 9.0s linear infinite; }
                    .b4 { animation: travelBox4 12.0s linear infinite; }
                    .b5 { animation: travelBox5 8.5s linear infinite; }
                    .b6 { animation: travelBox6 13.0s linear infinite; }
                    .b7 { animation: travelBox7 11.0s linear infinite; }
                    .b8 { animation: travelBox8 9.5s linear infinite; }

                    /* Cinematic Foreground text fade-in rise transition */
                    @keyframes cinematicIntroText {
                        0% { opacity: 0; transform: translateY(15px); filter: blur(4px); }
                        100% { opacity: 1; transform: translateY(0); filter: blur(0); }
                    }

                    /* 🌟 METHOD 3: TACTICAL PROGRAMMATIC TEXT SPARKLE EFFECT */
                    /* Cycles lighting and shadow filters to create high-fidelity glints over gold fields */
                    @keyframes pristineSparkle {
                        0%, 100% { 
                            text-shadow: 0px 5px 15px rgba(0,0,0,0.95);
                            filter: brightness(1);
                        }
                        48% {
                            text-shadow: 0px 5px 15px rgba(0,0,0,0.95);
                            filter: brightness(1);
                        }
                        50% { 
                            text-shadow: 0 0 12px rgba(255, 245, 214, 0.65), 0 0 20px rgba(170, 124, 17, 0.4), 0px 5px 15px rgba(0,0,0,0.95);
                            filter: brightness(1.22);
                        }
                        52% {
                            text-shadow: 0px 5px 15px rgba(0,0,0,0.95);
                            filter: brightness(1);
                        }
                    }

                    .main-title-sparkle {
                        animation: pristineSparkle 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    }

                    /* Smooth Text Pulse Feedback loop for prompt tracking */
                    @keyframes promptPulse {
                        0%, 100% { opacity: 0.35; transform: scale(1); }
                        50% { opacity: 0.85; transform: scale(1.02); }
                    }

                    /* Class rule to trigger performance engine unmounting */
                    .halt-animation * {
                        animation: none !important;
                    }
                </style>

                <div id="welcome-matrix-bg" class="matrix-scene3d">
                    <div class="box3d-wrapper b1"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                    <div class="box3d-wrapper b2"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                    <div class="box3d-wrapper b3"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                    <div class="box3d-wrapper b4"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                    <div class="box3d-wrapper b5"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                    <div class="box3d-wrapper b6"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                    <div class="box3d-wrapper b7"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                    <div class="box3d-wrapper b8"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                </div>

                <div style="position: relative; z-index: 5; display: flex; flex-direction: column; align-items: center; justify-content: center; animation: cinematicIntroText 1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;">
                    
                    <h1 class="main-title-sparkle" style="
                        font-family: 'Viaoda Libre', serif; 
                        font-size: 2.9rem; 
                        font-weight: normal; 
                        color: #AA7C11; 
                        margin-bottom: 2px; 
                        letter-spacing: 0.08em; 
                    ">
                        Welcome to SILK
                    </h1>
                    
                    <h2 style="
                        font-family: 'Viaoda Libre', serif;
                        font-size: 1.3rem;
                        font-weight: normal;
                        color: #B5924B;
                        margin-bottom: 85px;
                        letter-spacing: 0.12em;
                        opacity: 0.85;
                        text-shadow: 0px 3px 10px rgba(0,0,0,0.95);
                    ">
                        Trading Center
                    </h2>
                    
                    <p style="
                        font-family: 'Cinzel', serif;
                        font-size: 0.85rem; 
                        color: #AA7C11; /* Swapped to dark gold matching theme metrics */
                        letter-spacing: 0.2em; 
                        text-transform: uppercase;
                        animation: promptPulse 2.4s ease-in-out infinite;
                        font-weight: 800;
                    ">
                        Click anywhere to continue
                    </p>
                    
                </div>
            </div>
        `;
    },
    
    init() {
        const welcomeLayer = document.getElementById('page-welcome');
        const matrixBackground = document.getElementById('welcome-matrix-bg');
        
        welcomeLayer.addEventListener('click', function() {
            // Un-mute and fire audio graphics safely
            window.silkAudio.fadeInMusic();
            
            // Trigger physical transition out zoom effect
            welcomeLayer.style.transform = "scale(1.06)";
            welcomeLayer.style.opacity = "0";
            welcomeLayer.style.pointerEvents = "none";
            
            setTimeout(() => {
                // Kill computation loop intervals to save mobile processes
                matrixBackground.classList.add('halt-animation');
                welcomeLayer.classList.add('hidden');
                
                // Route and mount the optimized video menu state layer
                const viewport = document.getElementById('app-viewport');
                viewport.innerHTML = MenuPage.render();
                MenuPage.init();
            }, 550);
        });
    }
};
