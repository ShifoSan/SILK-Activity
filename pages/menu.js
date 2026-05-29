export const MenuPage = {
    render() {
        return `
            <div id="page-menu" class="page-layer" style="opacity: 0; transition: opacity 0.5s ease-in-out; width: 100%; height: 100vh; justify-content: center; align-items: center; background-color: #050811;">
                
                <div id="menu-aspect-container" style="position: relative; width: min(100vw, calc(100vh * 16 / 9)); height: min(100vh, calc(100vw * 9 / 16)); aspect-ratio: 16 / 9; display: block;">
                    
                    <img src="./assets/main_menu_background.png" alt="S.I.L.K. Hub" style="width: 100%; height: 100%; object-fit: fill; display: block;" />
                    
                </div>
            </div>
        `;
    },
    
    init() {
        const menuLayer = document.getElementById('page-menu');
        const innerContainer = document.getElementById('menu-aspect-container');
        
        // Trigger entrance display opacity animation smoothly
        setTimeout(() => { menuLayer.style.opacity = "1"; }, 50);

        // 🛠️ LIVE COORDINATE GRID TRACKER (Captures 100% of taps across the full canvas)
        innerContainer.addEventListener('click', function(e) {
            // Calculate absolute tap values relative ONLY to the borders of your image
            const rect = innerContainer.getBoundingClientRect();
            const touchX = e.clientX - rect.left;
            const touchY = e.clientY - rect.top;
            
            // Convert pixels into crisp scaling layout percentages
            const pctX = ((touchX / rect.width) * 100).toFixed(1);
            const pctY = ((touchY / rect.height) * 100).toFixed(1);
            
            // Sends coordinate message straight to your mobile screen inside Discord
            alert(`📍 Coordinate Captured:\nX: ${pctX}%\nY: ${pctY}%`);
            console.log(`X: ${pctX}%, Y: ${pctY}%`);
        });
    }
};
