export const MenuPage = {
    render() {
        return `
            <div id="page-menu" class="page-layer" style="opacity: 0; transition: opacity 0.5s ease-in-out; width: 100%; height: 100vh; justify-content: center; align-items: center; background-color: #03060c;">
                
                <div style="position: relative; width: 100%; max-width: 100vw; height: auto; aspect-ratio: 16 / 9; max-height: 100vh; display: flex; justify-content: center; align-items: center;">
                    
                    <img src="./assets/main_menu_background.png" alt="S.I.L.K. Hub" style="width: 100%; height: 100%; object-fit: contain; display: block;" />
                    
                    <div id="zone-values" style="position: absolute; left: 8%; width: 24%; top: 20%; height: 60%; cursor: pointer; border-radius: 12px; background-color: rgba(255,255,255,0); transition: background-color 0.2s;"></div>
                    
                    <div id="zone-compare" style="position: absolute; left: 38%; width: 24%; top: 20%; height: 60%; cursor: pointer; border-radius: 12px; background-color: rgba(255,255,255,0); transition: background-color 0.2s;"></div>
                    
                    <div id="zone-trading" style="position: absolute; left: 68%; width: 24%; top: 20%; height: 60%; cursor: pointer; border-radius: 12px; background-color: rgba(255,255,255,0); transition: background-color 0.2s;"></div>
                    
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
