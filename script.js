// ===============================
// 1. RÉCUPÉRER LES LIVRES
// ===============================

let livres = JSON.parse(localStorage.getItem("livres")) || [

    {
        id: 1,
        titre: "L'Alchimiste",
        auteur: "Paulo Coelho",
        categorie: "Roman",
        image: "images/alchimiste.jpg"
    },

    {
        id: 2,
        titre: "Le Petit Prince",
        auteur: "Antoine de Saint-Exupéry",
        categorie: "Conte",
        image: "images/petit-prince.jpg"
    },

    {
        id: 3,
        titre: "Les Misérables",
        auteur: "Victor Hugo",
        categorie: "Roman",
        image: "images/miserables.jpg"
    }

];


// ===============================
// 2. RÉCUPÉRER LES ÉLÉMENTS HTML
// ===============================

const listeLivres = document.getElementById("liste-livres");

const formulaire = document.getElementById("formulaire-livre");

const champRecherche = document.getElementById("recherche");
const champTitre = document.getElementById("titre");
const champAuteur = document.getElementById("auteur");
const champCategorie = document.getElementById("categorie");

const nombreLivres = document.getElementById("nombre-livres");

const filtreCategorie = document.getElementById("filtre-categorie");
function mettreAJourCategories() {
 const categorieActuelle = filtreCategorie.value;
    filtreCategorie.innerHTML =
        '<option value="">Toutes les catégories</option>';

    const categories = [];

    livres.forEach(function(livre) {

        if (!categories.includes(livre.categorie)) {

            categories.push(livre.categorie);

        }

    });

    categories.forEach(function(categorie) {

        const option = document.createElement("option");

        option.value = categorie;

        option.textContent = categorie;

        filtreCategorie.appendChild(option);

    });
if (categories.includes(categorieActuelle)) {
    filtreCategorie.value = categorieActuelle;
}
}

const boutonFormulaire = document.getElementById("bouton-formulaire");

const aperçuImage = document.getElementById("aperçu-image");

const champImage = document.getElementById("image");

const boutonAnnuler = document.getElementById("bouton-annuler");

const message = document.getElementById("message");

champImage.addEventListener("change", function() {

    const fichierImage = champImage.files[0];

    if (fichierImage) {

        const lecteur = new FileReader();

        lecteur.onload = function(event) {

            aperçuImage.src = event.target.result;

        };

        lecteur.readAsDataURL(fichierImage);
    }

});

let livreEnModification = null;


// ===============================
// 3. SAUVEGARDER LES LIVRES
// ===============================

function sauvegarderLivres() {

    localStorage.setItem("livres", JSON.stringify(livres));

}

function afficherMessage(texte) {

    message.textContent = texte;

    setTimeout(function() {

        message.textContent = "";

    }, 3000);

}

// ===============================
// 4. AFFICHER LES LIVRES
// ===============================

function afficherLivres( texteRecherche = "", categorieRecherche = "") {

    listeLivres.innerHTML = "";

    const livresFiltres = livres.filter(function(livre) {

        return (
    (
        livre.titre.toLowerCase().includes(texteRecherche) ||
        livre.auteur.toLowerCase().includes(texteRecherche) ||
        livre.categorie.toLowerCase().includes(texteRecherche)
    )
    &&
    (
        categorieRecherche === "" ||
        livre.categorie === categorieRecherche
    )
);

    });

     if (livresFiltres.length === 0) {

    listeLivres.innerHTML =
        "<p>Aucun livre trouvé.</p>";}

    livresFiltres.forEach(function(livre) {

        const carte = document.createElement("div");

        carte.classList.add("carte-livre");


        
carte.innerHTML = `
    <img src="${livre.image || "images/livre-sans-image.jpg"}" alt="Couverture de ${livre.titre}" class="couverture-livre">
    <h2>${livre.titre}</h2>
    <p>Auteur : ${livre.auteur}</p>
    <p>Catégorie : ${livre.categorie}</p>

   ${livre.titre.trim().toLowerCase() === "les misérables"
        ? '<a class="bouton-lire" href="lecteur.html">Lire le livre</a>'
        : ''}

    <button class="bouton-modifier">Modifier</button>
    <button class="bouton-supprimer">Supprimer</button>
`;



        // ===============================
        // 5. BOUTON MODIFIER
        // ===============================

        const boutonModifier =
            carte.querySelector(".bouton-modifier");


        boutonModifier.addEventListener("click", function() {

            livreEnModification = livre;

            document.getElementById("titre").value =
                livre.titre;

            document.getElementById("auteur").value =
                livre.auteur;

            document.getElementById("categorie").value =
                livre.categorie;

                if (livre.image) {
    aperçuImage.src = livre.image;
}
             else {
    aperçuImage.src = "";
}
    boutonAnnuler.style.display = "inline-block";
            boutonFormulaire.textContent =
                "Modifier le livre";

        });

        boutonAnnuler.addEventListener("click", function() {

    formulaire.reset();

    aperçuImage.src = "";

    livreEnModification = null;

    boutonFormulaire.textContent = "Ajouter le livre";

    boutonAnnuler.style.display = "none";

});

        // ===============================
        // 6. BOUTON SUPPRIMER
        // ===============================

        const boutonSupprimer =
            carte.querySelector(".bouton-supprimer");


        boutonSupprimer.addEventListener("click", function() {

            const confirmation = confirm(
                `Voulez-vous vraiment supprimer "${livre.titre}" ?`
            );


            if (confirmation) {

                const index = livres.findIndex(
    function(livreOriginal) {

        return livreOriginal.id === livre.id;

    }
);

                livres.splice(index, 1);

                sauvegarderLivres();
               
                mettreAJourCategories();
               
                afficherMessage("Livre supprimé avec succès !");

                afficherLivres(champRecherche.value.toLowerCase(),filtreCategorie.value
);

            }

        });


        // Ajouter la carte à la liste

        listeLivres.appendChild(carte);

    });


    // ===============================
    // 7. COMPTEUR
    // ===============================

    nombreLivres.textContent =
    `Nombre de livres affichés : ${livresFiltres.length}`;

}


// ===============================
// 8. AJOUTER OU MODIFIER UN LIVRE
// ===============================

formulaire.addEventListener("submit", function(event) {

    event.preventDefault();

    const titre = champTitre.value;

const auteur = champAuteur.value;

const categorie = champCategorie.value;

    const fichierImage =
        champImage.files[0];


    // ==================================
    // MODIFICATION D'UN LIVRE
    // ==================================

    if (livreEnModification !== null) {

        livreEnModification.titre = titre;

        livreEnModification.auteur = auteur;

        livreEnModification.categorie = categorie;
        mettreAJourCategories();

        // Une nouvelle image a été choisie
        if (fichierImage) {

            const lecteur = new FileReader();

            lecteur.onload = function(event) {

                livreEnModification.image =
                    event.target.result;

                sauvegarderLivres();

                afficherLivres(
    champRecherche.value.toLowerCase(),
    filtreCategorie.value);

                formulaire.reset();

                livreEnModification = null;

                boutonFormulaire.textContent =
                    "Ajouter le livre";

                    boutonAnnuler.style.display = "none";

                afficherMessage(
                    "Livre modifié avec succès !"
                );
            };

            lecteur.readAsDataURL(fichierImage);

        }

        // Aucune nouvelle image
        else {

            sauvegarderLivres();

            afficherLivres();

            formulaire.reset();

            livreEnModification = null;

            boutonFormulaire.textContent =
                "Ajouter le livre";

            afficherMessage(
                "Livre modifié avec succès !"
            );
        }

    }


    // ==================================
    // AJOUT D'UN NOUVEAU LIVRE
    // ==================================

    else {

        if (fichierImage) {

            const lecteur = new FileReader();

            lecteur.onload = function(event) {

                const imageBase64 =
                    event.target.result;

                const nouveauLivre = {

                    id: Date.now(),

                    titre: titre,

                    auteur: auteur,

                    categorie: categorie,

                    image: imageBase64
                };

                livres.push(nouveauLivre);

                sauvegarderLivres();
                mettreAJourCategories();
                afficherLivres(champRecherche.value.toLowerCase(),filtreCategorie.value
);

                formulaire.reset();

aperçuImage.src = "";

afficherMessage(
    "Livre ajouté avec succès !"
);
            };

            lecteur.readAsDataURL(fichierImage);

        }

        else {

            const nouveauLivre = {

                id: Date.now(),

                titre: titre,

                auteur: auteur,

                categorie: categorie,

                image: ""
            };

            livres.push(nouveauLivre);

            sauvegarderLivres();
            mettreAJourCategories();
            afficherLivres(champRecherche.value.toLowerCase(),filtreCategorie.value
);

            formulaire.reset();

            afficherMessage(
                "Livre ajouté avec succès !"
            );
        }
    }

});

// ===============================
// 9. RECHERCHE
// ===============================

champRecherche.addEventListener("input", function() {

    const texteRecherche =
        champRecherche.value.toLowerCase();

   afficherLivres(texteRecherche,
    filtreCategorie.value);

});

filtreCategorie.addEventListener("change", function() {

    const categorieRecherche =
        filtreCategorie.value;

    const texteRecherche =
        champRecherche.value.toLowerCase();

    afficherLivres(
        texteRecherche,
        categorieRecherche
    );

});

// ===============================
// 10. AFFICHAGE INITIAL npx live-server cd "C:\Users\CHRIST\Desktop\bibliotheque-en-ligne"
// ===============================
mettreAJourCategories();
afficherLivres();
