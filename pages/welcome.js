import { MenuPage } from './menu.js';

export const WelcomePage = {
    render() {
        return `
            <div id="page-welcome" class="page-layer" style="
                text-align: center; 
                cursor: pointer; 
                padding: 24px; 
                justify-content: center;
                background: linear-gradient(135deg, #1C0F0A 0%, #351C10 50%, #120905 100%);
                position: absolute;
                width: 100%;
                height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 10;
            ">
                
                <style>
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
                        width: 50px;
                        height: 50px;
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
                        width: 50px;
                        height: 50px;
                        background: rgba(197, 160, 89, 0.05);
                        border: 1px solid rgba(197, 160, 89, 0.22);
                        box-shadow: inset 0 0 10px rgba(197, 160, 89, 0.1);
                    }
                    
                    /* Structural geometric offsets mapping the 6 cube vertices */
                    .face-front  { transform: rotateY(0deg) translateZ(25px); }
                    .face-back   { transform: rotateY(180deg) translateZ(25px); }
                    .face-right  { transform: rotateY(90deg) translateZ(25px); }
                    .face-left   { transform: rotateY(-90deg) translateZ(25px); }
                    .face-top    { transform: rotateX(90deg) translateZ(25px); }
                    .face-bottom { transform: rotateX(-90deg) translateZ(25px); }
                    
                    /* Infinite Floating 3D Depth Travel Animations */
                    @keyframes travelBox1 {
                        0% { transform: translate3d(-15vw, 85vh, -300px) rotateX(0deg) rotateY(0deg); opacity: 0; }
                        15% { opacity: 1; }
                        85% { opacity: 1; }
                        100% { transform: translate3d(115vw, -15vh, 200px) rotateX(360deg) rotateY(720deg); opacity: 0; }
                    }
                    @keyframes travelBox2 {
                        0% { transform: translate3d(90vw, 110vh, -150px) rotateX(45deg) rotateY(0deg); opacity: 0; }
                        10% { opacity: 0.8; }
                        90% { opacity: 0.8; }
                        100% { transform: translate3d(-20vw, -20vh, 400px) rotateX(405deg) rotateY(360deg); opacity: 0; }
                    }
                    @keyframes travelBox3 {
                        0% { transform: translate3d(15vw, 110vh, -400px) rotateX(0deg) rotateY(30deg); opacity: 0; }
                        20% { opacity: 0.9; }
                        80% { opacity: 0.9; }
                        100% { transform: translate3d(80vw, -35vh, 100px) rotateX(720deg) rotateY(390deg); opacity: 0; }
                    }
                    @keyframes travelBox4 {
                        0% { transform: translate3d(110vw, 30vh, -200px) rotateX(120deg) rotateY(60deg); opacity: 0; }
                        15% { opacity: 0.75; }
                        85% { opacity: 0.75; }
                        100% { transform: translate3d(-15vw, 75vh, 300px) rotateX(480deg) rotateY(-300deg); opacity: 0; }
                    }

                    /* Speed and Timing Distribution Vectors */
                    .b1 { animation: travelBox1 15s linear infinite; top: 0; left: 0; }
                    .b2 { animation: travelBox2 22s linear infinite; top: 0; left: 0; }
                    .b3 { animation: travelBox3 18s linear infinite; top: 0; left: 0; }
                    .b4 { animation: travelBox4 26s linear infinite; top: 0; left: 0; }

                    /* Smooth Text Pulse Feedback loop */
                    @keyframes promptPulse {
                        0%, 100% { opacity: 0.3; transform: scale(1); }
                        50% { opacity: 0.85; transform: scale(1.02); }
                    }
                </style>

                <div class="matrix-scene3d">
                    <div class="box3d-wrapper b1"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                    <div class="box3d-wrapper b2"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                    <div class="box3d-wrapper b3"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                    <div class="box3d-wrapper b4"><div class="box3d-body"><div class="box3d-face face-front"></div><div class="box3d-face face-back"></div><div class="box3d-face face-right"></div><div class="box3d-face face-left"></div><div class="box3d-face face-top"></div><div class="box3d-face face-bottom"></div></div></div>
                </div>

                <div style="position: relative; z-index: 5; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    
                    <h1 style="
                        font-family: 'Viaoda Libre', serif; 
                        font-size: 2.75rem; 
                        font-weight: normal; 
                        color: #AA7C11; 
                        margin-bottom: 4px; 
                        letter-spacing: 0.05em; 
                        text-shadow: 0px 4px 12px rgba(0,0,0,0.8);
                    ">
                        Welcome to SILK
                    </h1>
                    
                    <h2 style="
                        font-family: 'Viaoda Libre', serif;
                        font-size: 1.35rem;
                        font-weight: normal;
                        color: #B5924B;
                        margin-bottom: 60px;
                        letter-spacing: 0.08em;
                        text-shadow: 0px 2px 8px rgba(0,0,0,0.8);
                    ">
                        Trading Center
                    </h2>
                    
                    <p style="
                        font-size: 0.85rem; 
                        color: #000000; 
                        letter-spacing: 0.15em; 
                        text-transform: uppercase;
                        animation: promptPulse 2.2s ease-in-out infinite;
                        font-weight: 900;
                    ">
                        Click anywhere to continue
                    </p>
                    
                </div>
            </div>
        `;
    },
    
    init() {
        const welcomeLayer = document.getElementById('page-welcome');
        
        welcomeLayer.addEventListener('click', function() {
            // Satisfy WebView user gestures to wake up track fade-in loops safely
            window.silkAudio.fadeInMusic();
            
            // Initiate exit opacity transition configurations
            welcomeLayer.classList.add('fade-out');
            
            setTimeout(() => {
                welcomeLayer.classList.add('hidden');
                
                // Mount the recalibrated pixel-perfect 16:9 main dashboard menu layout node
                const viewport = document.getElementById('app-viewport');
                viewport.innerHTML = MenuPage.render();
                MenuPage.init();
            }, 500);
        });
    }
};
