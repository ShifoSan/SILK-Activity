// pages/values.js
export const ValuesPage = {
    render() {
        return `
            <style>
                /* Focus ring and smooth transitions for the premium search bar */
                #vector-search-input:focus {
                    border-color: #E5C158 !important;
                    box-shadow: 0 0 10px rgba(229, 193, 88, 0.25);
                }
                /* CSS Spinner animation for image loading */
                @keyframes goldSpinner {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .gold-loader {
                    animation: goldSpinner 1s linear infinite;
                }
            </style>

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
                        min-height: 480px; /* Slightly heightened to accommodate new controls */
                        padding: 30px;
                        background: linear-gradient(135deg, rgba(5, 4, 4, 0.96) 0%, rgba(0, 0, 0, 0.99) 100%);
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

                        <div id="registry-panel-body" style="z-index: 3; position: relative; flex: 1; color: #F7FAFC; font-family: system-ui, sans-serif; font-size: 1rem; display: flex; flex-direction: column; align-items: center;">
                            
                            <div style="width: 100%; max-width: 500px; display: flex; gap: 10px; margin-bottom: 25px;">
                                <input type="text" id="vector-search-input" placeholder="Search registry item via neural query..." style="
                                    flex: 1;
                                    padding: 12px 16px;
                                    background: rgba(0, 0, 0, 0.6);
                                    border: 1px solid rgba(212, 175, 55, 0.3);
                                    border-radius: 6px;
                                    color: #FFF;
                                    font-size: 0.95rem;
                                    outline: none;
                                    transition: all 0.3s ease;
                                " />
                                <button id="vector-search-btn" style="
                                    padding: 12px 24px;
                                    background: linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%);
                                    border: none;
                                    border-radius: 6px;
                                    color: #050404;
                                    font-weight: 700;
                                    font-size: 0.9rem;
                                    letter-spacing: 1px;
                                    cursor: pointer;
                                    box-shadow: 0 4px 15px rgba(170, 124, 17, 0.3);
                                    transition: transform 0.2s, opacity 0.2s;
                                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                                    QUERY
                                </button>
                            </div>

                            <div style="
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                flex: 1;
                                width: 100%;
                            ">
                                <div id="asset-image-card" style="
                                    position: relative;
                                    width: 180px;
                                    height: 180px;
                                    background: rgba(5, 4, 4, 0.7);
                                    border: 1px solid rgba(212, 175, 55, 0.2);
                                    border-radius: 8px;
                                    box-shadow: 0 16px 35px rgba(0, 0, 0, 0.7), inset 0 0 15px rgba(212, 175, 55, 0.05);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    overflow: hidden;
                                ">
                                    <div id="card-placeholder-text" style="color: rgba(212, 175, 55, 0.4); font-size: 0.85rem; text-align: center; padding: 15px; font-weight: 300; letter-spacing: 1px;">
                                        SYSTEM IDLE<br><span style="font-size: 0.7rem; opacity: 0.6;">Awaiting input...</span>
                                    </div>

                                    <img id="card-display-img" src="" alt="Asset Link Result" style="
                                        width: 100%;
                                        height: 100%;
                                        object-fit: cover;
                                        display: none;
                                        opacity: 0;
                                        transition: opacity 0.4s ease-in-out;
                                    " />

                                    <div id="card-spinner-loader" class="gold-loader" style="
                                        display: none;
                                        position: absolute;
                                        width: 32px;
                                        height: 32px;
                                        border: 3px solid rgba(212, 175, 55, 0.1);
                                        border-top: 3px solid #D4AF37;
                                        border-radius: 50%;
                                    "></div>
                                </div>

                                <div id="asset-meta-details" style="margin-top: 20px; text-align: center; min-height: 50px;">
                                    <div id="meta-item-name" style="font-family: 'Viaoda Libre', serif; color: #E5C158; font-size: 1.25rem; letter-spacing: 1px;"></div>
                                    <div id="meta-item-desc" style="color: rgba(247, 250, 252, 0.6); font-size: 0.85rem; margin-top: 4px; max-width: 400px; line-height: 1.4;"></div>
                                </div>
                            </div>

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

        // Fetch functional DOM UI hooks
        const searchInput = document.getElementById('vector-search-input');
        const searchBtn = document.getElementById('vector-search-btn');
        const placeholderText = document.getElementById('card-placeholder-text');
        const displayImg = document.getElementById('card-display-img');
        const spinnerLoader = document.getElementById('card-spinner-loader');
        const metaName = document.getElementById('meta-item-name');
        const metaDesc = document.getElementById('meta-item-desc');

        // Main Query Trigger Function
        const performVectorSearch = async () => {
            const queryText = searchInput.value.trim();
            if (!queryText) return;

            // Trigger visual Loading State
            placeholderText.style.display = 'none';
            displayImg.style.display = 'none';
            displayImg.style.opacity = '0';
            spinnerLoader.style.display = 'block';
            metaName.innerText = "Searching Registry...";
            metaDesc.innerText = "";

            try {
                // Adjust this endpoint to match your app's vector backend handler setup
                const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: queryText })
                });

                if (!response.ok) throw new Error('Query failed');
                
                const data = await response.json(); // Expects schema matching: { item_name, image_link, content }

                if (data && data.image_link) {
                    // Update visual metadata
                    metaName.innerText = data.item_name || "Unknown Asset";
                    metaDesc.innerText = data.content || "No details provided.";
                    
                    // Assign image link and handle image onload fading cycle safely
                    displayImg.src = data.image_link;
                    displayImg.onload = () => {
                        spinnerLoader.style.display = 'none';
                        displayImg.style.display = 'block';
                        setTimeout(() => { displayImg.style.opacity = '1'; }, 20);
                    };
                } else {
                    // Item not found or doesn't have an image_link mapped
                    spinnerLoader.style.display = 'none';
                    placeholderText.style.display = 'block';
                    placeholderText.innerHTML = "NO MATCH FOUND<br><span style='font-size: 0.7rem; opacity: 0.6;'>Try alternate terms</span>";
                    metaName.innerText = "No Results";
                    metaDesc.innerText = "The neural vector search couldn't locate a precise asset document.";
                }

            } catch (error) {
                console.error("Vector query error:", error);
                spinnerLoader.style.display = 'none';
                placeholderText.style.display = 'block';
                placeholderText.innerHTML = "ERROR<br><span style='font-size: 0.7rem; opacity: 0.6;'>Registry Offline</span>";
                metaName.innerText = "Connection Failed";
                metaDesc.innerText = "Could not fetch data from database. Ensure backend server is responsive.";
            }
        };

        // Wire event triggers up
        searchBtn.addEventListener('click', performVectorSearch);
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') performVectorSearch();
        });
    }
};
