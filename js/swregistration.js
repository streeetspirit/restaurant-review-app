// let's register a service worker if it's supported by the browser
// according to best practices it's better to postpone it until the load event fires

if ('serviceWorker' in navigator) {
    window.addEventListener ('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
        .then (function(registration){
            console.log("SW registration successful with scope: ", registration.scope);
        }, function (error){
            console.log("SW registration failed: ", error);
        });
    });
}