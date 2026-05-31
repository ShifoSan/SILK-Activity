// pages/values.js
export const ValuesPage = {
    render() {
        return `
            <div id="page-values" class="page-layer" style="background-color: #000; width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center;">
                <h1 style="color: #AA7C11;">Values Page Placeholder</h1>
                <button id="back-btn" style="margin-left: 20px; padding: 10px;">Back to Menu</button>
            </div>
        `;
    },
    init() {
        // We will build this out later, but here is a temporary back button
        document.getElementById('back-btn').addEventListener('click', () => {
            // Re-render menu logic goes here later
            location.reload(); // Temporary hard reset just for testing
        });
    }
};
