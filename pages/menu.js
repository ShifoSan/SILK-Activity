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
                
                <canvas id="menu-coalesce-canvas" style="
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
                    background: radial-gradient(circle at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 100%);
                    z-index: 2;
                    pointer-events: none;
                "></div>

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
                    pointer-events: none; /* Passes taps through screen empty spaces seamlessly */
                ">
                    
                    <div style="
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        gap: 32px; /* Fixed precision button column spacing */
                        width: 100%;
                        max-width: 900px;
                        padding: 24px;
                        pointer-events: auto; /* Re-enables touch listeners strictly for your cards */
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
                    /* COMPACT ASPECT PROPORTIONS - Preserving your 11% responsive width look */
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
                        filter: drop-shadow(0 15px 35px rgba(0,0,0,0.9));
                    }

                    .menu-card-img {
                        width: 100%;
                        height: auto;
                        object-fit: contain;
                        display: block;
                    }

                    /* Interactive tactile scale compression physics on finger touch actions */
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
        
        // Handle subtle container element entry crossfade sequence
        setTimeout(() => { menuLayer.style.opacity = "1"; }, 50);

        // =====================================================================
        // 🌌 COALESCE ORGANIC FLUID BACKGROUND MATH PIPELINE
        // =====================================================================
        const canvas = document.getElementById('menu-coalesce-canvas');
        const ctx = canvas.getContext('2d');
        
        let blobsArray = [];
        const blobCeilingCount = 14; // Low object count + massive radii = optimal physics performance on mobile
        let animationFrameId = null;

        // Curated Palette mapping your antique golds, path cyans, and dark browns
        const coalesceColors = [
            'rgba(181, 146, 75, 0.15)',  // Muted Antique Gold
            'rgba(165, 124, 50, 0.12)',  // Darker Warm Gold
            '56, 189, 248',              // Raw Cyan components for structural blending
            'rgba(34, 20, 14, 0.25)'     // Deep Scout Cloak Brown
        ];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Build floating vector coordinates tracking fluid canvas parameters
        function generateAmbientBlobs() {
            blobsArray = [];
            for (let i = 0; i < blobCeilingCount; i++) {
                // Large scale circles floating together programmatically
                const baseRadius = Math.random() * (canvas.width * 0.22) + (canvas.width * 0.12);
                
                blobsArray.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.45, // Micro adjustments create slow fluid motion
                    vy: (Math.random() - 0.5) * 0.45,
                    radius: baseRadius,
                    // Handle complex fluid composite blending rules color assignments
                    color: coalesceColors[i % coalesceColors.length],
                    isCyan: (i % coalesceColors.length === 2)
                });
            }
        }

        // Continual rendering sequence handling drawing frames to device screens
        function animateCoalesceField() {
            // Render full background clear sweep over each processing tick
            ctx.fillStyle = '#020407';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Establish standard color injection composites mirroring the template layout
            ctx.globalCompositeOperation = 'screen';

            for (let i = 0; i < blobsArray.length; i++) {
                let blob = blobsArray[i];

                // Transition node vectors along fluid positions
                blob.x += blob.vx;
                blob.y += blob.vy;

                // Handle canvas extreme margin collision rebound buffers
                if (blob.x - blob.radius > canvas.width) blob.x = -blob.radius;
                if (blob.x + blob.radius < 0) blob.x = canvas.width + blob.radius;
                if (blob.y - blob.radius > canvas.height) blob.y = -blob.radius;
                if (blob.y + blob.radius < 0) blob.y = canvas.height + blob.radius;

                // Create organic glowing gradients mimicking Coalesce fluid transitions
                const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
                
                if (blob.isCyan) {
                    gradient.addColorStop(0, 'rgba(' + blob.color + ', 0.08)');
                    gradient.addColorStop(0.5, 'rgba(' + blob.color + ', 0.03)');
                    gradient.addColorStop(1, 'rgba(' + blob.color + ', 0)');
                } else {
                    gradient.addColorStop(0, blob.color);
                    gradient.addColorStop(1, 'rgba(0,0,0,0)');
                }

                ctx.beginPath();
                ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // Reset operational context layer properties to baseline standard values
            ctx.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(animateCoalesceField);
        }

        generateAmbientBlobs();
        animateCoalesceField();

        // =====================================================================
        // 🔒 SECURE APPLICATION PROGRAMMATIC LINK LISTENERS
        // =====================================================================
        document.getElementById('zone-values').addEventListener('click', function() {
            window.silkAudio.playClick();
            cancelAnimationFrame(animationFrameId); // Prevents performance leaks after exiting
            window.removeEventListener('resize', resizeCanvas);
            console.log("Navigation Triggered -> Initializing Value Page view frame matrix...");
        });

        document.getElementById('zone-compare').addEventListener('click', function() {
            window.silkAudio.playClick();
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            console.log("Navigation Triggered -> Initializing Compare Page view frame matrix...");
        });

        document.getElementById('zone-trading').addEventListener('click', function() {
            window.silkAudio.playClick();
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            console.log("Navigation Triggered -> Syncing global database clusters for Advertising Board...");
        });
    }
};
