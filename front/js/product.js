// Opérateur ternaire pour vérification des valeurs du LocalStorage
let cartValues = localStorage.getItem("cartValues") ? JSON.parse(localStorage.getItem("cartValues")) : [];
console.log("values", cartValues);

// Récupération de l'URL
let productURL = new URL(window.location.href);
// console.log("URL", productURL);

// Récupération de l'ID du produit
let searchParams = new URLSearchParams(productURL.search);
let productID = searchParams.get("id");
// console.log("Id", productID);

// Récupération du produit
let serverURL = "http://localhost:3000/api/products/" + productID;

fetch(serverURL)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(productValues) {
        console.log("values", productValues);
    //   Affichage des données du produit
      let imgContainer = document.getElementsByClassName("item__img")[0];

      const imgTag = document.createElement("img");
            imgTag.src = productValues.imageUrl;
            imgTag.alt = productValues.altTxt;


        imgContainer.appendChild(imgTag);

        let titleContainer = document.getElementById("title");
        titleContainer.textContent = productValues.name;

        let priceContainer = document.getElementById("price");
        priceContainer.textContent = productValues.price;

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
    let quantity = document.getElementById("quantity").value;

    let color = document.getElementById("colors").value;
    // console.log("value", color, quantity, productID);

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
            cartValues.splice(i, 1);
            productToAdd = value;
            // Ajout de quantité
            productToAdd.quantity = parseInt(value.quantity) + parseInt(quantity);
        }
    })
    console.log('productToAdd', productToAdd);

    // Ajout dans le panier
    cartValues.push(productToAdd);
    // Sauvegarde du panier dans le LocalStorage
    localStorage.setItem("cartValues", JSON.stringify(cartValues));
  }

  