// Vérification de l'existence du localStorage
let storedDatas = []
if (localStorage.getItem('cartValues')) {
    storedDatas = JSON.parse(localStorage.getItem('cartValues'));
}

const totalQtyContainer = document.getElementById('totalQuantity');

const totalPriceContainer = document.getElementById('totalPrice');

let sectionID = document.getElementById('cart__items');

let totalQty = 0;
let totalPrice = 0;

let datasFromServer = [];

let canSendOrder = true;

storedDatas.forEach(data => {
        // Demande de données au serveur (appel au serveur)
    let serverURL = "http://localhost:3000/api/products/" + data.id;

    fetch(serverURL)
        .then(function(res) {
            if (res.ok) {
                return res.json();
        }
    })

    // Données retournées par le serveur (réponse du serveur)
        .then(function(values) {
            datasFromServer.push(values);
            totalQty = totalQty + data.quantity;

            let productPrice = values.price * data.quantity;

            totalPrice = totalPrice + productPrice;

        // Affichage des produits dans la page Panier
            const articleTag = document.createElement("article");
            articleTag.setAttribute('class', 'cart__item');
            articleTag.dataset.id = data.id
            articleTag.dataset.color = data.color

            const imgContainer = document.createElement("div");
            imgContainer.setAttribute('class', 'cart__item__img');

            const imgTag = document.createElement("img");
            imgTag.src = values.imageUrl;
            imgTag.alt = values.altTxt;

            const itemContainer = document.createElement("div");
            itemContainer.setAttribute('class', 'cart__item__content');

            const descriptionContainer = document.createElement("div");
            descriptionContainer.setAttribute('class', 'cart__item__content__description');

            const titleTag = document.createElement("h2");
            titleTag.textContent = values.name;

            const paragraphColor = document.createElement("p");
            paragraphColor.textContent = data.color;

            const paragraphPrice = document.createElement("p");
            paragraphPrice.textContent = getFormatedPrice(productPrice) + ' €';

            const settingsContainer = document.createElement("div");
            settingsContainer.setAttribute('class', 'cart__item__content__settings');

            const quantityContainer = document.createElement("div");
            quantityContainer.setAttribute('class', 'cart__item__content__settings__quantity');

            const paragraphQuantityTxt = document.createElement("p");
            paragraphQuantityTxt.textContent = 'Qté : ';

            const inputQuantity = document.createElement("input");
            inputQuantity.type = 'number';
            inputQuantity.setAttribute('class', 'itemQuantity');
            inputQuantity.name = 'itemQuantity';
            inputQuantity.min = '1';
            inputQuantity.max = '100';
            inputQuantity.value = data.quantity;
            inputQuantity.addEventListener('change', updateQuantity);

            const deleteContainer = document.createElement("div");
            deleteContainer.setAttribute('class', 'cart__item__content__settings__delete');

            const paragraphDeleteTxt = document.createElement("p");
            paragraphDeleteTxt.setAttribute('class', 'deleteItem');
            paragraphDeleteTxt.textContent = 'Supprimer';
            paragraphDeleteTxt.addEventListener('click', deleteProduct);

            imgContainer.appendChild(imgTag);
            articleTag.appendChild(imgContainer);

            descriptionContainer.appendChild(titleTag);
            descriptionContainer.appendChild(paragraphColor);
            descriptionContainer.appendChild(paragraphPrice);
            itemContainer.appendChild(descriptionContainer);

            quantityContainer.appendChild(paragraphQuantityTxt);
            quantityContainer.appendChild(inputQuantity);
            settingsContainer.appendChild(quantityContainer);

            deleteContainer.appendChild(paragraphDeleteTxt);
            settingsContainer.appendChild(deleteContainer);

            itemContainer.appendChild(settingsContainer);
            articleTag.appendChild(itemContainer);

            sectionID.appendChild(articleTag);

            const totalQtyContainer = document.getElementById('totalQuantity');
            totalQtyContainer.textContent = totalQty;

            const totalPriceContainer = document.getElementById('totalPrice');
            totalPriceContainer.textContent = getFormatedPrice(totalPrice);
    });
});

function getFormatedPrice(price) {
    return Intl.NumberFormat().format(price);
}

// Supression d'un produit
function deleteProduct(deleteButton) {
    const path = deleteButton.path || (deleteButton.composedPath && deleteButton.composedPath());
    const cartItem = path.find(element => element.classList.contains('cart__item'));
    const id = cartItem.dataset.id;
    const color = cartItem.dataset.color;

    if(window.confirm('Êtes-vous sûr(e) de vouloir supprimer ce produit ?')) {
        cartItem.parentNode.removeChild(cartItem);
        storedDatas.splice(storedDatas.indexOf(storedDatas.find(item => item.id === id && item.color === color)), 1);
        localStorage.setItem('cartValues', JSON.stringify(storedDatas));
        window.alert('Suppression effectuée.');
        updateTotal();
    }
}

// Mise à jour de la quantité d'un produit
function updateQuantity(quantityInput){
    let canUpdate = true;
    const path = quantityInput.path || (quantityInput.composedPath && quantityInput.composedPath());
    const cartItem = path.find(element => element.classList.contains('cart__item'));
    const id = cartItem.dataset.id;
    const color = cartItem.dataset.color;

    let value = Math.round(+quantityInput.target.value);

    if (isNaN(value) || value <= 0 || value > 100){
        window.alert('Sélectionnez une quantité entre 1 et 100');
        canUpdate = false;
    }

    // Vérification du prix du produit par rapport à la nouvelle quantité
    if (canUpdate) {
        const productToUpdate = storedDatas.find(item => item.id === id && item.color === color);
        productToUpdate.quantity = value;
        localStorage.setItem('cartValues', JSON.stringify(storedDatas))
        let productData = datasFromServer.find((dataProductFromServer => dataProductFromServer._id === productToUpdate.id));
        let newPrice = productData.price * productToUpdate.quantity;
        updatePrice(quantityInput, newPrice);
    }

}

// Mise à jour du prix d'un produit
function updatePrice(htmlEl, newPrice) {
    const path = htmlEl.path || (htmlEl.composedPath && htmlEl.composedPath())
    const cartItem = path.find(element => element.classList.contains('cart__item__content'))
    const cartItemDesc = cartItem.children[0]
    const cartItemDescPrice = cartItemDesc.children[2]
    cartItemDescPrice.innerHTML = `${newPrice} €`
    updateTotal()
}

// Mise à jour du prix et de la quantité total
function updateTotal() {
    totalQuantity = 0
    totalPrice = 0

    for (const item of storedDatas) {
        // Récupération du prix du produit pour mise à jour du prix et de la qté total
        let productData = datasFromServer.find((dataProductFromServer => dataProductFromServer._id === item.id));
        // Mise à jour du prix et de la quantité
        totalQuantity += item.quantity
        totalPrice += item.quantity * productData.price
    }

    // Affichage du prix et de la quantié à jour
    totalPriceContainer.textContent = getFormatedPrice(totalPrice);
    totalQtyContainer.textContent = totalQuantity;
}

// Récupération et vérification des champs du fomulaire
let firstNameInput = document.getElementById('firstName');
firstNameInput.addEventListener('keyup', checkError);

let lastNameInput = document.getElementById('lastName');
lastNameInput.addEventListener('keyup', checkError);

let addressInput = document.getElementById('address');
addressInput.addEventListener('keyup', checkError);

let cityInput = document.getElementById('city');
cityInput.addEventListener('keyup', checkError);

let emailInput = document.getElementById('email');
emailInput.addEventListener('keyup', checkError);

// Fonction dynamique de vérification des champs
function checkError(element) {
    // Regex vérification erreur string avec chiffre
    let stringContainsNumber = /\d/;
    let err = '';

    // Regex pour validation email
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if ((element.target.value === '' || stringContainsNumber.test(element.target.value)) && element.target.id !== 'email' && element.target.id !== 'address') {
        err = 'Ce champs n\'est pas valide';
        canSendOrder = false;
    } else if (element.target.id === 'email'  && (element.target.value === '' || !element.target.value.match(validRegex))) {
        err = 'L\'email n\'est pas valide'
        canSendOrder = false;
    } else if (element.target.value === '' && element.target.id === 'address') {
        err = 'L\'adresse n\'est pas valide'
        canSendOrder = false;
    } else {
        canSendOrder = true;
    }
    let errElement = document.getElementById(element.target.id + 'ErrorMsg');
    errElement.innerText = err;
}

// Récupération du bouton de commande pour envoi de la commande
let orderBtn = document.getElementById('order');
orderBtn.addEventListener('click', sendOrder);

// Fonction d'envoi de la commande
function sendOrder(event) {
    // Empêche le rechargeemnt auto de la page au clic (btn type submit)
    event.preventDefault();

    // Construction de l'objet contact
    let contact = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        address: addressInput.value,
        city: cityInput.value,
        email: emailInput.value
    }

    // Construction du tableau des products ID
    let productIds = [];
    if (storedDatas.length === 0) {
        window.alert('Votre panier ne peut pas être vide');
        canSendOrder = false;
    }
    storedDatas.forEach((data) => {
        productIds.push(data.id);
    })

    // Vérification d'erreur. Si pas d'erreur = envoi de la commande
    if (canSendOrder) {
        // Construction de l'objet commande
        let order = {
            contact,
            products: productIds
        }

        // Envoi de la commande au serveur
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(order)
        }).then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })

        // Récupération de la réponse du serveur + redirection vers confirmation
        .then(function(response) {
           window.location.replace("./confirmation.html?orderId=" + response.orderId);
        });
    }
}