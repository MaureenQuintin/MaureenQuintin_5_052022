// Opérateur ternaire pour vérification des valeurs du LocalStorage
let cartValues = localStorage.getItem("cartValues") ? JSON.parse(localStorage.getItem("cartValues")) : [];

// Récupération de l'URL
let productURL = new URL(window.location.href);

// Récupération de l'ID du produit
let searchParams = new URLSearchParams(productURL.search);
let productID = searchParams.get("id");

// Récupération du produit
let serverURL = "http://localhost:3000/api/products/" + productID;

fetch(serverURL)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(productValues) {
        
    //   Affichage des données du produit
      let imgContainer = document.getElementsByClassName("item__img")[0];

      const imgTag = document.createElement("img");
            imgTag.setAttribute('id', 'img');
            imgTag.src = productValues.imageUrl;
            imgTag.alt = productValues.altTxt;

        imgContainer.appendChild(imgTag);

        let titleContainer = document.getElementById("title");
        titleContainer.textContent = productValues.name;

        let priceContainer = document.getElementById("price");
        priceContainer.textContent = getFormatedPrice(productValues.price);

        let descriptionContainer = document.getElementById("description");
        descriptionContainer.textContent = productValues.description;

        let colorsContainer = document.getElementById("colors");
        productValues.colors.forEach(color => {
            let colorOption = document.createElement("option");
            colorOption.value = color;
            colorOption.text = color;
            
            colorsContainer.add(colorOption);
        });
  });

// Création event 'clic' pour ajout au panier
  let button = document.getElementById("addToCart");
  button.addEventListener("click", addToCart);

  function addToCart() {
    // Boolean pour ajout au panier
    let canAddToCart = true;

    let quantity = parseInt(document.getElementById("quantity").value);
    if (isNaN(quantity) || quantity <= 0 || quantity > 100){
        console.log('t');
        window.alert('Sélectionnez une quantité entre 1 et 100');
        canAddToCart = false;
    }

    let color = document.getElementById("colors").value;
    if (color === ''){
        window.alert('Sélectionnez une couleur SVP');
        canAddToCart = false;
    }

    // Données d'un produit à stocker
    let productToAdd = {
        id: productID,
        quantity, 
        color
    }

    // Contrôle quantité + Ajout dans le panier + Sauvegarde du panier dans le LocalStorage
    cartValues.forEach(value => {
        // Vérification si doublon produit
        if((value.id === productID) && (value.color === color)) {
            // Si doublon = supression
            let i = cartValues.findIndex((v) => (v.id === value.id && v.color === value.color));
            productToAdd = value;
            // Ajout de quantité
            productToAdd.quantity = parseInt(value.quantity) + parseInt(quantity);
            if(productToAdd.quantity > 100){
                window.alert('Vous avez atteint la quantité maximum de ce produit');
                canAddToCart = false;
            } else {
                cartValues[i].quantity = productToAdd.quantity;
            }
        }
    })

    // Ajout dans le panier
    if (canAddToCart){
        let i = cartValues.findIndex((v) => (v.id === productToAdd.id && v.color === productToAdd.color));
        if (i !== -1) {
            cartValues.splice(i, 1);
        }
        cartValues.push(productToAdd);
        // Sauvegarde du panier dans le LocalStorage
        localStorage.setItem("cartValues", JSON.stringify(cartValues));
    }
  }

function getFormatedPrice(price) {
    return Intl.NumberFormat().format(price);
}

  