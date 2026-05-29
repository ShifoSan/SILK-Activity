export const MenuPage = {
    render() {
        return `
            <div id="page-menu" class="page-layer" style="opacity: 0; transition: opacity 0.5s ease-in-out; width: 100%; height: 100vh; justify-content: center; align-items: center; background-color: #050811;">
                
                <div style="position: relative; width: min(100vw, calc(100vh * 16 / 9)); height: min(100vh, calc(100vw * 9 / 16)); aspect-ratio: 16 / 9; display: block; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.55);">
                    
                    <img src="./assets/main_menu_background.png" alt="S.I.L.K. Hub" style="width: 100%; height: 100%; object-fit: fill; display: block;" />
                    
                    <div id="zone-values" style="position: absolute; left: 5%; width: 26%; top: 12%; height: 76%; cursor: pointer; border-radius: 20px; background-color: rgba(56, 189, 248, 0.35); border: 2px dashed #38BDF8; transition: background-color 0.2s;"></div>
                    
                    <div id="zone-compare" style="position: absolute; left: 37%; width: 26%; top: 12%; height: 76%; cursor: pointer; border-radius: 20px; background-color: rgba(249, 115, 22, 0.35); border: 2px dashed #F97316; transition: background-color 0.2s;"></div>
                    
                    <div id="zone-trading" style="position: absolute; left: 69%; width: 26%; top: 12%; height: 76%; cursor: pointer; border-radius: 20px; background-color: rgba(16, 185, 129, 0.35); border: 2px dashed #10B981; transition: background-color 0.2s;"></div>
                    
                </div>
            </div>
        `;
    },
    
    init() {
        const menuLayer = document.getElementById('page-menu');
        
        // Trigger entrance display opacity animation smoothly
        setTimeout(() => { menuLayer.style.opacity = "1"; }, 50);

        // Bind Tap Events programmatically to stay safely within Content Security Policy parameters
        document.getElementById('zone-values').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Routing initiated -> Sourcing Item Value database module...");
            // Next Phase: Mount values interface here
        });

        document.getElementById('zone-compare').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Routing initiated -> Loading Trade Comparison state configurations...");
            // Next Phase: Mount structural trade calculator view here
        });

        document.getElementById('zone-trading').addEventListener('click', function() {
            window.silkAudio.playClick();
            console.log("Routing initiated -> Pulling live global cloud board data from database...");
            // Next Phase: Connect MongoDB Atlas streaming queries here
        });
    }
};
