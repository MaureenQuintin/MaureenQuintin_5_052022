// Récupération de l'URL
let confirmationUrl = new URL(window.location.href);

// Récupération de l'ID de la commande
let searchParams = new URLSearchParams(confirmationUrl.search);
let orderId = searchParams.get("orderId");

// Affichage de l'ID commande
let orderContainer = document.getElementById('orderId');
orderContainer.textContent = orderId;

// Suppression du panier dans le localStorage
localStorage.removeItem('cartValues');