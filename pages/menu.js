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
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    object-fit: cover; /* Eliminates side letterboxing completely */
                    filter: blur(12px); /* Delivers premium 30-40% out-of-focus depth backdrop layer */
                    transform: scale(1.1); /* Over-scrapes edges to hide blurring edge distortions */
                    z-index: 1;
                ">
                    <source src="./assets/menu_bg_video.mp4" type="video/mp4" />
                </video>

                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.82) 100%);
                    z-index: 2;
                    pointer-events: none; /* Passes touches cleanly through the dimmer layer */
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
                    pointer-events: none; /* Passes taps through empty grid spaces */
                ">
                    
                    <div style="
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        gap: 32px;
                        width: 100%;
                        max-width: 900px;
                        padding: 24px;
                        pointer-events: auto; /* Re-engages touch trackers strictly on the card nodes */
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

                    /* Interactive tactile push compression on button card tap events */
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
        
        // Handle subtle entry viewport crossfade animation transition
        setTimeout(() => { menuLayer.style.opacity = "1"; }, 50);

        // Programmatic Event Binding Matrix (csp safe implementation standards)
        document.getElementById('zone-values').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation System -> Executing routing switch parameters to: Values Page");
        });

        document.getElementById('zone-compare').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation System -> Executing routing switch parameters to: Trade Calculator Workspace");
        });

        document.getElementById('zone-trading').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation System -> Executing routing switch parameters to: Shared Instance Bulletin Ads");
        });
    }
};
