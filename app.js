// Status display element
const statusElement = document.getElementById('sw-status');

// Function to update status display
function updateStatus() {
    if (navigator.onLine) {
        statusElement.textContent = 'You are online. Service worker is active.';
        statusElement.className = 'online';
    } else {
        statusElement.textContent = 'You are offline. Content is served from cache.';
        statusElement.className = 'offline';
    }
}

// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
                statusElement.textContent = 'Service Worker registered successfully!';
                statusElement.className = 'online';
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
                statusElement.textContent = 'Service Worker registration failed: ' + error;
                statusElement.className = 'offline';
            });
    });
} else {
    statusElement.textContent = 'Service Workers are not supported in this browser.';
    statusElement.className = 'offline';
}

// Listen for online/offline events
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

// Initial status check
updateStatus();

// Create a simple log function that displays in the console
console.log('Application initialized');