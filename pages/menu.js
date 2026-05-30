export const MenuPage = {
    render() {
        return `
            <div id="page-menu" class="page-layer" style="
                opacity: 0; 
                transition: opacity 0.5s ease-in-out; 
                width: 100%; 
                height: 100vh; 
                justify-content: center; 
                align-items: center; 
                background-color: #000000;
                display: flex;
            ">
                
                <div style="
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    gap: 32px; /* Uniform spacing between the compact buttons */
                    width: 100%;
                    max-width: 900px;
                    padding: 24px;
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

                <style>
                    /* DOWNSCALED COMPACT PROFILE - Matches your 11% calibration metrics */
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
                    }

                    /* Image preservation styling context */
                    .menu-card-img {
                        width: 100%;
                        height: auto;
                        object-fit: contain;
                        display: block;
                    }

                    /* Tactical physical button feedback profile */
                    .menu-card-wrapper:active {
                        transform: scale(0.92);
                        filter: brightness(0.75);
                    }
                </style>

            </div>
        `;
    },
    
    init() {
        const menuLayer = document.getElementById('page-menu');
        
        // Trigger smooth entrance transition fade
        setTimeout(() => { menuLayer.style.opacity = "1"; }, 50);

        // Programmatic Event Handling Listeners (Bypasses Iframe Sandbox CSP Blocks)
        document.getElementById('zone-values').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation Pipeline Triggered -> Sourcing Item Value Engine Template...");
            // Next Phase Route Entry -> Mount values panel interface here
        });

        document.getElementById('zone-compare').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation Pipeline Triggered -> Initializing Local Trade Comparison Workspace...");
            // Next Phase Route Entry -> Mount trade calculator view components here
        });

        document.getElementById('zone-trading').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Navigation Pipeline Triggered -> Initializing Live Synchronized Bulletin Board...");
            // Next Phase Route Entry -> Build shared instance MongoDB channels here
        });
    }
};
