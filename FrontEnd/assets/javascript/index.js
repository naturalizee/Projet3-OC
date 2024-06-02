

// Récupération des catégories et travaux avec l'API
async function fetchTravauxEtCategories() {
    const reponseTravaux = await fetch("http://localhost:5678/api/works");
    const travaux = await reponseTravaux.json();
    const reponseCategories = await fetch("http://localhost:5678/api/categories");
    const categories = await reponseCategories.json();

    return { travaux, categories };
}


// Afficher dynamiquement les travaux avec la possibilité de filtrer par catégorie
export async function afficherTravaux() {
    try {
    const { travaux, categories } = await fetchTravauxEtCategories();

    // Création d'une div d'affichage des projets
    const gallery = document.createElement('div');
    gallery.classList.add('gallery');
    portfolio.appendChild(gallery);

    // Création des boutons de filtre par catégorie
    const filtres = document.createElement('div');
    filtres.classList.add('filtres');
    filtres.id = "filtres-categories";

    // Création du bouton "Tous" pour afficher toutes les catégories
    const tous = document.createElement("button");
    tous.textContent = "Tous";
    tous.id = "bouton-tous";
    tous.classList = "btnTous"
    tous.name = "Tous";
    // Ajout du gestionnaire d'événements pour afficher tous les travaux
    tous.addEventListener('click', () => {
        afficherTravauxParCategorie(travaux);
    });
    filtresCategories.appendChild(tous);

    // Création des boutons pour chaque catégorie
    categories.forEach(cat => {
        const boutonCat = document.createElement("button");
        boutonCat.textContent = cat.name;
        boutonCat.id = "bouton-" + cat.id;
        boutonCat.classList = "btnCat"
        boutonCat.name = cat.id;
        // Ajout du gestionnaire d'événements pour afficher les travaux de la catégorie sélectionnée
        boutonCat.addEventListener('click', () => {
            const travauxFiltres = travaux.filter(travail => travail.category.id === cat.id);
            afficherTravauxParCategorie(travauxFiltres);
        });
        const filtresCategories = document.getElementById("filtres-categories")
        filtresCategories.appendChild(boutonCat);
    });


    // Ajout des boutons de filtre à la galerie
    portfolio.insertBefore(filtres, gallery);

    // Afficher tous les travaux par défaut
    afficherTravauxParCategorie(travaux);
} catch (error) {
    afficherMessage("Une erreur est survenue avec l'hôte distant")
            console.error("Une erreur est survenue:", error);
}}

// Fonction pour afficher les travaux d'une catégorie spécifique
function afficherTravauxParCategorie(travaux) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    travaux.forEach(travail => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = travail.imageUrl;
        img.alt = travail.title;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = travail.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Appel de la fonction pour afficher les travaux avec les filtres par catégorie
afficherTravaux();


// Message d'erreur connexion
const portfolio = document.getElementById("portfolio")
export function afficherMessage(message) {
    const erreurPrecedente = document.querySelector(".message-erreur")
    if (erreurPrecedente) {
        erreurPrecedente.remove()
    }
    const erreurMessage = document.createElement("p");
    erreurMessage.classList.add("message-erreur")
    erreurMessage.textContent = message;
    erreurMessage.style.color = "red";
    erreurMessage.style.marginBottom = "10px";
    portfolio.appendChild(erreurMessage)
}
