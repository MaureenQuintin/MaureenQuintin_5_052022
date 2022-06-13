let storedDatas = JSON.parse(localStorage.getItem('cartValues'));
console.log('panier', storedDatas);

let sectionID = document.getElementById('cart__items');

let totalQty = 0;
let totalPrice = 0;

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
            totalQty = totalQty + data.quantity;

            let productPrice = values.price * data.quantity;

            totalPrice = totalPrice + productPrice;

        
            console.log('it', totalPrice, totalQty);
        
        // Affichage des produits dans la page Panier
            const articleTag = document.createElement("article");
            articleTag.setAttribute('class', 'cart__item');
        
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
        
            const deleteContainer = document.createElement("div");
            deleteContainer.setAttribute('class', 'cart__item__content__settings__delete');
        
            const paragraphDeleteTxt = document.createElement("p");
            paragraphDeleteTxt.setAttribute('class', 'deleteItem');
            paragraphDeleteTxt.textContent = 'Supprimer';
        
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
    // return price;
    return Intl.NumberFormat().format(price);
}