export const MenuPage = {
    render() {
        return `
            <div id="page-menu" class="page-layer" style="opacity: 0; transition: opacity 0.5s ease-in-out; width: 100%; height: 100vh; justify-content: center; align-items: center; background-color: #050811;">
                
                <div id="menu-aspect-container" style="position: relative; width: min(100vw, calc(100vh * 16 / 9)); height: min(100vh, calc(100vw * 9 / 16)); aspect-ratio: 16 / 9; display: block;">
                    
                    <img src="./assets/main_menu_background.png" alt="S.I.L.K. Hub" style="width: 100%; height: 100%; object-fit: fill; display: block;" />
                    
                    <div id="zone-values" style="position: absolute; left: 11.5%; width: 21.5%; top: 23.5%; height: 53%; cursor: pointer; border-radius: 16px; background-color: rgba(56, 189, 248, 0.2); border: 2px dashed #38BDF8; transition: background-color 0.2s;"></div>
                    
                    <div id="zone-compare" style="position: absolute; left: 39.2%; width: 21.5%; top: 23.5%; height: 53%; cursor: pointer; border-radius: 16px; background-color: rgba(249, 115, 22, 0.2); border: 2px dashed #F97316; transition: background-color 0.2s;"></div>
                    
                    <div id="zone-trading" style="position: absolute; left: 67%; width: 21.5%; top: 23.5%; height: 53%; cursor: pointer; border-radius: 16px; background-color: rgba(16, 185, 129, 0.2); border: 2px dashed #10B981; transition: background-color 0.2s;"></div>
                    
                </div>
            </div>
        `;
    },
    
    init() {
        const menuLayer = document.getElementById('page-menu');
        const innerContainer = document.getElementById('menu-aspect-container');
        
        // Trigger entrance display opacity animation smoothly
        setTimeout(() => { menuLayer.style.opacity = "1"; }, 50);

        // Standard Navigation Tap Listeners (Safe for Content Security Policy)
        document.getElementById('zone-values').addEventListener('click', function(e) {
            e.stopPropagation(); // Prevents diagnostic trigger from running at the same time
            window.silkAudio.playClick();
            console.log("Routing initiated -> Sourcing Item Value database module...");
        });

        document.getElementById('zone-compare').addEventListener('click', function(e) {
            e.stopPropagation(); 
            window.silkAudio.playClick();
            console.log("Routing initiated -> Loading Trade Comparison state configurations...");
        });

        document.getElementById('zone-trading').addEventListener('click', function(e) {
            e.stopPropagation();
            window.silkAudio.playClick();
            console.log("Routing initiated -> Pulling live global cloud board data from database...");
        });

        // 🛠️ LIVE COORDINATE GRID TRACKER (Taps outside your active buttons will run this)
        innerContainer.addEventListener('click', function(e) {
            // Calculate absolute tap values relative ONLY to the borders of your image
            const rect = innerContainer.getBoundingClientRect();
            const touchX = e.clientX - rect.left;
            const touchY = e.clientY - rect.top;
            
            // Convert pixels into crisp scaling layout percentages
            const pctX = ((touchX / rect.width) * 100).toFixed(1);
            const pctY = ((touchY / rect.height) * 100).toFixed(1);
            
            // Sends coordinate message straight to your mobile screen inside Discord
            alert(`📍 Edge Coordinates Captured:\nleft: ${pctX}%;\ntop: ${pctY}%;`);
            console.log(`left: ${pctX}%; top: ${pctY}%;`);
        });
    }
};
