// pages/values.js
export const ValuesPage = {
    render() {
        return `
            <div id=\"page-values\" class=\"page-layer\" style=\"
                opacity: 0; 
                transition: opacity 0.5s ease-in-out; 
                width: 100%; 
                height: 100vh; 
                position: relative;\n                background-color: #000000;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
            \">
                
                <video autoplay loop muted playsinline style=\"
                    position: absolute;
                    top: 0; left: 0;
                    width: 100vw; height: 100vh;
                    object-fit: cover;
                    filter: blur(12px);
                    transform: scale(1.1);
                    z-index: 1;
                \">
                    <source src=\"./assets/vtc_bg.mp4\" type=\"video/mp4\" />
                </video>

                <div style=\"
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: radial-gradient(circle at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.82) 100%);
                    z-index: 2;
                    pointer-events: none;
                \"></div>

                <div id=\"values-content-wrapper\" style=\"
                    position: relative;
                    z-index: 3;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    pointer-events: auto;
                \">
                    </div>

            </div>
        `;
    },
    
    init() {
        const valuesLayer = document.getElementById('page-values');
        // Smoothly fade in scene once mounting processes settle
        setTimeout(() => { 
            if (valuesLayer) valuesLayer.style.opacity = "1"; 
        }, 50);
    }
};
