// Récupération des données depuis le serveur
fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(values) {
    let sectionID = document.getElementById("items");
        // console.log('id', sectionID);

        // Parcours de la réponse du serveur
        values.forEach(element => {

            // Insertion des produits dans la homepage
            const linkTag = document.createElement("a");
            linkTag.href = "./product.html?id=" + element._id;

            const articleTag = document.createElement("article");

            const imgTag = document.createElement("img");
            imgTag.src = element.imageUrl;
            imgTag.alt = element.altTxt;

            const titleTag = document.createElement("h3");
            titleTag.textContent = element.name;
            titleTag.classList.add("productName");

            const paragraphTag = document.createElement("p");
            paragraphTag.textContent = element.description;
            paragraphTag.classList.add("productDescription");

            articleTag.appendChild(imgTag);
            articleTag.appendChild(titleTag);
            articleTag.appendChild(paragraphTag);

            linkTag.appendChild(articleTag);

            sectionID.appendChild(linkTag);

            // console.log("mon élément", element);
      });
    // console.log(value);
  })
  .catch(function(err) {
    // Une erreur est survenue
  });