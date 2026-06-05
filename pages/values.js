// pages/values.js
export const ValuesPage = {
    render() {
        return `
            <div id="page-values" class="page-layer" style="
                opacity: 0; 
                transition: opacity 0.5s ease-in-out; 
                width: 100%; 
                height: 100vh; 
                position: relative;
                background-color: #000000;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
            ">
                
                <video autoplay loop muted playsinline style="
                    position: absolute;
                    top: 0; left: 0;
                    width: 100vw; height: 100vh;
                    object-fit: cover;
                    filter: blur(12px);
                    transform: scale(1.1);
                    z-index: 1;
                ">
                    <source src="./assets/vtc_bg.mp4" type="video/mp4" />
                </video>

                <div style="
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: radial-gradient(circle at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.85) 100%);
                    z-index: 2;
                    pointer-events: none;
                "></div>

                <div id="values-content-wrapper" style="
                    position: relative;
                    z-index: 3;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    pointer-events: auto;
                ">
                    
                    <div class="premium-designed-panel" style="
                        position: relative;
                        width: 65vw;
                        height: 65vh;
                        min-width: 320px;
                        min-height: 400px;
                        padding: 30px;
                        background: linear-gradient(135deg, rgba(31, 9, 2, 0.96) 0%, rgba(13, 3, 1, 0.99) 100%);
                        box-shadow: 0 24px 50px rgba(0, 0, 0, 0.95), 
                                    inset 0 0 30px rgba(0, 0, 0, 0.9);
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        backdrop-filter: blur(4px);
                    ">

                        <div style="
                            position: absolute;
                            top: 0; left: 0; right: 0; bottom: 0;
                            border-radius: 12px;
                            border: 2px solid transparent;
                            background: linear-gradient(135deg, #FFF176 0%, #D4AF37 25%, #5D4037 50%, #AA7C11 75%, #FFFDE7 100%) border-box;
                            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
                            -webkit-mask-composite: destination-out;
                            mask-composite: exclude;
                            pointer-events: none;
                            z-index: 1;
                        "></div>

                        <div style="
                            position: absolute;
                            top: 8px; left: 8px; right: 8px; bottom: 8px;
                            border: 1px dashed rgba(212, 175, 55, 0.25);
                            border-radius: 8px;
                            pointer-events: none;
                            z-index: 1;
                        "></div>

                        <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; border-top: 3px solid #FFE082; border-left: 3px solid #FFE082; border-top-left-radius: 4px; z-index: 2; pointer-events: none;"></div>
                        <div style="position: absolute; top: 4px; right: 4px; width: 16px; height: 16px; border-top: 3px solid #D4AF37; border-right: 3px solid #D4AF37; border-top-right-radius: 4px; z-index: 2; pointer-events: none;"></div>
                        <div style="position: absolute; bottom: 4px; left: 4px; width: 16px; height: 16px; border-bottom: 3px solid #AA7C11; border-left: 3px solid #AA7C11; border-bottom-left-radius: 4px; z-index: 2; pointer-events: none;"></div>
                        <div style="position: absolute; bottom: 4px; right: 4px; width: 16px; height: 16px; border-bottom: 3px solid #FFE082; border-right: 3px solid #FFE082; border-bottom-right-radius: 4px; z-index: 2; pointer-events: none;"></div>

                        <div style="z-index: 3; position: relative; border-bottom: 1px solid rgba(214, 175, 55, 0.2); padding-bottom: 14px; margin-bottom: 20px;">
                            <h2 style="
                                font-family: 'Viaoda Libre', serif; 
                                color: #E5C158; 
                                margin: 0; 
                                font-size: 1.7rem;
                                letter-spacing: 2px;
                                text-align: center;
                                text-shadow: 0 3px 6px rgba(0,0,0,0.8), 0 0 10px rgba(229,193,88,0.2);
                            ">
                                ASSET VALUATION REGISTRY
                            </h2>
                        </div>

                        <div id="registry-panel-body" style="z-index: 3; position: relative; flex: 1; color: #F7FAFC; font-family: system-ui, sans-serif; font-size: 1rem;">
                            </div>

                    </div>

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
