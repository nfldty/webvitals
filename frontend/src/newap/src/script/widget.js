const currScript = document.currentScript;
const userId = currScript.getAttribute('data-user-id');

console.log("Widget loaded with user id: ", userId);
