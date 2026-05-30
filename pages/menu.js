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
            ">
                
                <canvas id="menu-starfield-canvas" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    display: block;
                "></canvas>

                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10;
                    pointer-events: none; /* Allows canvas context clicks to slide through free viewport spaces */
                ">
                    
                    <div style="
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        gap: 32px; /* Precision gap spacing between your compact button shapes */
                        width: 100%;
                        max-width: 900px;
                        padding: 24px;
                        pointer-events: auto; /* Re-locks touch execution strictly over your custom images */
                    ">
                        
                        <div id="zone-values" class="menu-card-wrapper">
                            <img src="./assets/value.png" alt="Values" class="menu-card-img" />
                        </div>
                        
                        <div id="zone-compare" class="menu-card-wrapper">
                            <img src="./assets/compare.png" alt="Compare" class="menu-card-img" />
                        </div>
                        
                        <div id="zone-trading" class="menu-card-wrapper">
                            <img src="./assets/trade.png" alt="Trading" class="menu-card-img" />
                        </div>
                        
                    </div>
                </div>

                <style>
                    /* COMPACT ASPECT PROPORTIONS - Evaluated cleanly from your manual calibrations */
                    .menu-card-wrapper {
                        width: 11.5vw;
                        max-width: 120px;
                        height: auto;
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), filter 0.2s ease;
                        -webkit-tap-highlight-color: transparent;
                        filter: drop-shadow(0 15px 30px rgba(0,0,0,0.85));
                    }

                    .menu-card-img {
                        width: 100%;
                        height: auto;
                        object-fit: contain;
                        display: block;
                    }

                    /* Interactive tactile scaling physics applied on finger contact clicks */
                    .menu-card-wrapper:active {
                        transform: scale(0.92);
                        filter: brightness(0.75) drop-shadow(0 4px 8px rgba(0,0,0,0.9));
                    }
                </style>

            </div>
        `;
    },
    
    init() {
        const menuLayer = document.getElementById('page-menu');
        
        // Handle subtle display entrance opacity crossfade sequence
        setTimeout(() => { menuLayer.style.opacity = "1"; }, 50);

        // =====================================================================
        // 🚀 HIGH-DENSITY MULTI-COLOR STARFIELD SPACE ENGINE PIPELINE
        // =====================================================================
        const canvas = document.getElementById('menu-starfield-canvas');
        const ctx = canvas.getContext('2d');
        
        let starsArray = [];
        const maxStarsCount = 450; // Increased scale density for a spectacular cinematic travel grid
        const travelSpeed = 4.2;    // Balanced warp timeline speed index
        let animationFrameId = null;

        // Curated Palette Array representing a deep cosmic battle mesh environment
        const spacePalette = ['#B5924B', '#B5924B', '#38BDF8', '#F97316', '#E2E8F0'];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Build geometric coordinate properties matching mobile aspect scaling loops
        function createStarField() {
            starsArray = [];
            for (let i = 0; i < maxStarsCount; i++) {
                starsArray.push({
                    x: (Math.random() - 0.5) * canvas.width * 2,
                    y: (Math.random() - 0.5) * canvas.height * 2,
                    z: Math.random() * canvas.width,
                    size: Math.random() * 1.3 + 0.4,
                    // Assigns a persistent random color from our curated thematic space pool
                    color: spacePalette[Math.floor(Math.random() * spacePalette.length)]
                });
            }
        }

        // Draw interval frame rendering loops
        function updateAndDrawStars() {
            // Semi-translucent sweep redraw generates soft trailing speed line paths
            ctx.fillStyle = 'rgba(0, 0, 0, 0.18)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            for (let i = 0; i < starsArray.length; i++) {
                let star = starsArray[i];
                
                // Accelerate the node down along the perspective plane
                star.z -= travelSpeed;

                // Infinite boundary restart loop reset parameters
                if (star.z <= 0) {
                    star.x = (Math.random() - 0.5) * canvas.width * 2;
                    star.y = (Math.random() - 0.5) * canvas.height * 2;
                    star.z = canvas.width;
                }

                // 3D Perspective Matrix Conversion Math
                const screenX = (star.x / star.z) * centerX + centerX;
                const screenY = (star.y / star.z) * centerY + centerY;
                
                // Dynamically enlarge coordinate dots as they approach screen edges
                const starRadius = (1 - star.z / canvas.width) * star.size * 2.8;

                // Push vector parameters directly into hardware frame pipeline buffers
                if (screenX >= 0 && screenX <= canvas.width && screenY >= 0 && screenY <= canvas.height) {
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, Math.max(0.1, starRadius), 0, Math.PI * 2);
                    ctx.fillStyle = star.color;
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(updateAndDrawStars);
        }

        createStarField();
        updateAndDrawStars();

        // =====================================================================
        // 🔒 CSP COMPLIANT APP STEP CONTROL BUTTON CLICKS
        // =====================================================================
        // Note: Freezing animations on button clicks has been completely removed!
        // The stars will keep traveling smoothly in the background while audio clips fire.
        
        document.getElementById('zone-values').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation Pipeline Active -> Fetching local structures for: Value Page");
            // Next Phase Route Matrix Entry -> Fade layout and launch values.js viewport context here
        });

        document.getElementById('zone-compare').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation Pipeline Active -> Generating local structures for: Comparison Page");
            // Next Phase Route Matrix Entry -> Fade layout and launch compare.js calculation layers here
        });

        document.getElementById('zone-trading').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation Pipeline Active -> Activating cloud clusters for: Global Trade Bulletin Board");
            // Next Phase Route Matrix Entry -> Fade layout and sync shared instance MongoDB collections here
        });
    }
};
