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

                /* --- Responsive Design Core Architecture --- */
                .premium-designed-panel {
                    position: relative;
                    width: 55vw;
                    max-width: 750px;
                    height: 88vh; /* Keeps panel borders perfectly and consistently below screen top/bottom lines */
                    min-width: 320px;
                    padding: 30px;
                    background: linear-gradient(135deg, rgba(5, 4, 4, 0.96) 0%, rgba(0, 0, 0, 0.99) 100%);
                    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.95), 
                                inset 0 0 30px rgba(0, 0, 0, 0.9);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    backdrop-filter: blur(4px);
                    transition: all 0.3s ease-in-out;
                }

                /* Table / Medium display scalings */
                @media (max-width: 1024px) {
                    .premium-designed-panel { width: 75vw; }
                }
                /* Mobile Portrait display scalings */
                @media (max-width: 768px) {
                    .premium-designed-panel { width: 92vw; padding: 20px; }
                }

                /* Mobile Landscape Optimization (Enforced safely for micro-height Discord Viewports) */
                @media (max-height: 580px) {
                    .premium-designed-panel {
                        height: 92vh; /* Adjusts beautifully for constrained landscape heights */
                        padding: 15px 20px;
                    }
                    #registry-header-container {
                        padding-bottom: 8px !important;
                        margin-bottom: 12px !important;
                    }
                    #registry-title {
                        font-size: 1.3rem !important;
                        letter-spacing: 1px !important;
                    }
                    .search-container {
                        margin-bottom: 12px !important;
                    }
                    #vector-search-input {
                        padding: 8px 12px !important;
                        font-size: 0.85rem !important;
                    }
                    #vector-search-btn {
                        padding: 8px 16px !important;
                        font-size: 0.85rem !important;
                    }
                    #asset-image-card {
                        width: 110px !important;
                        height: 110px !important;
                    }
                    #asset-meta-details {
                        margin-top: 8px !important;
                    }
                    #meta-item-name {
                        font-size: 1.05rem !important;
                    }
                    #meta-item-desc {
                        font-size: 0.75rem !important;
                        line-height: 1.3 !important;
                    }
                    /* Fail-safe internal scrolling block so bounds never overflow out of panel box */
                    #registry-panel-body {
                        overflow-y: auto !important;
                        padding-right: 4px;
                    }
                    /* Seamless gold-themed tracking scrollbar element */
                    #registry-panel-body::-webkit-scrollbar {
                        width: 4px;
                    }
                    #registry-panel-body::-webkit-scrollbar-thumb {
                        background: rgba(212, 175, 55, 0.4);
                        border-radius: 2px;
                    }
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
                    
                    <div class="premium-designed-panel">

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

                        <div id="registry-header-container" style="z-index: 3; position: relative; border-bottom: 1px solid rgba(214, 175, 55, 0.2); padding-bottom: 14px; margin-bottom: 20px;">
                            <h2 id="registry-title" style="
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
                            
                            <div class="search-container" style="width: 100%; max-width: 500px; display: flex; gap: 10px; margin-bottom: 25px;">
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
                                    flex-shrink: 0;
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
                    
                    // Secret sauce: Swap the blocked external domain for your new safe Discord proxy prefix!
                    // Added a check to ensure it still works cleanly on direct browser Vercel hits too[span_2](start_span)[span_2](end_span)
                    const isDiscordEmbed = window.location.host.includes('discordsays.com') || window.location.host.includes('discord');[span_3](start_span)[span_3](end_span)
                    const safeProxyUrl = isDiscordEmbed 
                        ? data.image_link.replace("https://res.cloudinary.com", "/cloudinary") 
                        : data.image_link;[span_4](start_span)[span_4](end_span)
                    
                    // Assign the proxy image link and handle image onload fading cycle safely[span_5](start_span)[span_5](end_span)
                    displayImg.src = safeProxyUrl;[span_6](start_span)[span_6](end_span)
                    displayImg.onload = () => {[span_7](start_span)[span_7](end_span)
                        spinnerLoader.style.display = 'none';[span_8](start_span)[span_8](end_span)
                        displayImg.style.display = 'block';[span_9](start_span)[span_9](end_span)
                        setTimeout(() => { displayImg.style.opacity = '1'; }, 20);[span_10](start_span)[span_10](end_span)
                    };
                } else {
                    // Item not found or doesn't have an image_link mapped[span_11](start_span)[span_11](end_span)
                    spinnerLoader.style.display = 'none';[span_12](start_span)[span_12](end_span)
                    placeholderText.style.display = 'block';[span_13](start_span)[span_13](end_span)
                    placeholderText.innerHTML = "NO MATCH FOUND<br><span style='font-size: 0.7rem; opacity: 0.6;'>Try alternate terms</span>";[span_14](start_span)[span_14](end_span)
                    metaName.innerText = "No Results";[span_15](start_span)[span_15](end_span)
                    metaDesc.innerText = "The neural vector search couldn't locate a precise asset document.";[span_16](start_span)[span_16](end_span)
                }

            } catch (error) {
                console.error("Vector query error:", error);[span_17](start_span)[span_17](end_span)
                spinnerLoader.style.display = 'none';[span_18](start_span)[span_18](end_span)
                placeholderText.style.display = 'block';[span_19](start_span)[span_19](end_span)
                placeholderText.innerHTML = "ERROR<br><span style='font-size: 0.7rem; opacity: 0.6;'>Registry Offline</span>";[span_20](start_span)[span_20](end_span)
                metaName.innerText = "Connection Failed";[span_21](start_span)[span_21](end_span)
                metaDesc.innerText = "Could not fetch data from database. Ensure backend server is responsive.";[span_22](start_span)[span_22](end_span)
            }
        };

        // Wire event triggers up[span_23](start_span)[span_23](end_span)
        searchBtn.addEventListener('click', performVectorSearch);[span_24](start_span)[span_24](end_span)
        searchInput.addEventListener('keydown', (e) => {[span_25](start_span)[span_25](end_span)
            if (e.key === 'Enter') performVectorSearch();[span_26](start_span)[span_26](end_span)
        });
    }
};
