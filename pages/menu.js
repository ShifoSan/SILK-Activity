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
                    pointer-events: none; /* Passes taps through empty space smoothly */
                ">
                    
                    <div style="
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        gap: 32px; /* Precision spacing between your custom button elements */
                        width: 100%;
                        max-width: 900px;
                        padding: 24px;
                        pointer-events: auto; /* Re-enables touch tracking strictly over your cards */
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
                    /* DOWNSCALED BUTTON LAYOUT PROFILE - Spaced to match your exact calibration canvas lines */
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

                    /* Tactical physical scale compression response metrics on finger contact clicks */
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
        
        // Trigger subtle structural display entry fade script crossfade layout bounds
        setTimeout(() => { menuLayer.style.opacity = "1"; }, 50);

        // =====================================================================
        // 🚀 PROGRAMMATIC 3D STARFIELD DEEP SPACE WARP VELOCITY CORE ENGINE
        // =====================================================================
        const canvas = document.getElementById('menu-starfield-canvas');
        const ctx = canvas.getContext('2d');
        
        let starsArray = [];
        const maxStarsCount = 150; // Optimized load cluster matching high-performance phone requirements
        const travelSpeed = 4.5;    // Velocity rate index controlling speed through depth lines
        let animationFrameId = null;

        // Auto-scaling calculation handler balancing coordinate dimensions on mobile resizing metrics
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // High-precision particle generation state tracking mapping geometric depth
        function createStarField() {
            starsArray = [];
            for (let i = 0; i < maxStarsCount; i++) {
                starsArray.push({
                    x: (Math.random() - 0.5) * canvas.width * 2,
                    y: (Math.random() - 0.5) * canvas.height * 2,
                    z: Math.random() * canvas.width,
                    size: Math.random() * 1.5 + 0.5
                });
            }
        }

        // Loop execution matrix running direct drawing ticks to browser intervals
        function updateAndDrawStars() {
            // Partial fade over drawing step creates beautiful motion trails
            ctx.fillStyle = 'rgba(0, 0, 0, 0.18)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            for (let i = 0; i < starsArray.length; i++) {
                let star = starsArray[i];
                
                // Advance particle forward along the Z depth vector plane
                star.z -= travelSpeed;

                // Reset position loop anchor if particle travels past user viewport camera field boundaries
                if (star.z <= 0) {
                    star.x = (Math.random() - 0.5) * canvas.width * 2;
                    star.y = (Math.random() - 0.5) * canvas.height * 2;
                    star.z = canvas.width;
                }

                // 3D Perspective Projection Math (Converts spatial matrices into screen pixels)
                const screenX = (star.x / star.z) * centerX + centerX;
                const screenY = (star.y / star.z) * centerY + centerY;
                
                // Dynamically expand element bounds as coordinates approach screen edges
                const starRadius = (1 - star.z / canvas.width) * star.size * 2.5;

                // Render vector draw channels if points sit safely inside screen dimensions
                if (screenX >= 0 && screenX <= canvas.width && screenY >= 0 && screenY <= canvas.height) {
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, Math.max(0.1, starRadius), 0, Math.PI * 2);
                    
                    // Styled with your thematic antique dark gold highlights to anchor the visual weight
                    ctx.fillStyle = '#B5924B';
                    ctx.shadowBlur = starRadius * 2;
                    ctx.shadowColor = 'rgba(181, 146, 75, 0.4)';
                    
                    ctx.fill();
                }
            }
            
            // Clean up drawing constraints to avoid slowing down card rendering steps
            ctx.shadowBlur = 0;

            animationFrameId = requestAnimationFrame(updateAndDrawStars);
        }

        // Launch canvas systems
        createStarField();
        updateAndDrawStars();

        // =====================================================================
        // 🔒 SECURE APPLICATION PROGRAMMATIC LINK BOUND LISTENERS
        // =====================================================================
        document.getElementById('zone-values').addEventListener('click', function() {
            window.silkAudio.playClick();
            cancelAnimationFrame(animationFrameId); // Closes looping threads to save browser battery
            window.removeEventListener('resize', resizeCanvas);
            console.log("Navigation Execution -> Transitioning context path arrays into Value Engine Panel...");
        });

        document.getElementById('zone-compare').addEventListener('click', function() {
            window.silkAudio.playClick();
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            console.log("Navigation Execution -> Transitioning context path arrays into Trade Calculator Space...");
        });

        document.getElementById('zone-trading').addEventListener('click', function() {
            window.silkAudio.playClick();
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            console.log("Navigation Execution -> Streaming shared cluster parameters into Live Trade Bulletin Board...");
        });
    }
};
