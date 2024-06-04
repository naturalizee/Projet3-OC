// =====================================================
//     API Calls
// =====================================================

/**
 * Récupération des catégories et travaux avec l'API.
 * @returns {Object} Contient les travaux et les catégories.
 */
async function fetchTravauxEtCategories() {
    try {
        const reponseTravaux = await fetch("http://localhost:5678/api/works");
        if (!reponseTravaux.ok) {
            throw new Error("Erreur lors de la récupération des travaux");
        }
        const travaux = await reponseTravaux.json();

        const reponseCategories = await fetch("http://localhost:5678/api/categories");
        if (!reponseCategories.ok) {
            throw new Error("Erreur lors de la récupération des catégories");
        }
        const categories = await reponseCategories.json();

        return { travaux, categories };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// =====================================================
//     Gestion des messages d'erreur
// =====================================================

/**
 * Affiche un message d'erreur.
 * @param {string} message - Le message à afficher.
 */
const portfolio = document.getElementById("portfolio");
export function afficherMessage(message) {
    const erreurPrecedente = document.querySelector(".message-erreur");
    if (erreurPrecedente) {
        erreurPrecedente.remove();
    }

    const erreurMessage = document.createElement("p");
    erreurMessage.classList.add("message-erreur");
    erreurMessage.textContent = message;
    erreurMessage.style.color = "red";
    erreurMessage.style.marginBottom = "10px";

    portfolio.appendChild(erreurMessage);
}

// =====================================================
//     Affichage des travaux
// =====================================================

/**
 * Affiche dynamiquement les travaux avec la possibilité de filtrer par catégorie.
 */
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
        tous.classList = "btnTous";
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
            boutonCat.classList = "btnCat";
            boutonCat.name = cat.id;

            // Ajout du gestionnaire d'événements pour afficher les travaux de la catégorie sélectionnée
            boutonCat.addEventListener('click', () => {
                const travauxFiltres = travaux.filter(travail => travail.category.id === cat.id);
                afficherTravauxParCategorie(travauxFiltres);
            });

            const filtresCategories = document.getElementById("filtres-categories");
            filtresCategories.appendChild(boutonCat);
        });

        // Ajout des boutons de filtre à la galerie
        portfolio.insertBefore(filtres, gallery);

        // Afficher tous les travaux par défaut
        afficherTravauxParCategorie(travaux);
    } catch (error) {
        afficherMessage("Une erreur est survenue avec l'hôte distant");
        console.error("Une erreur est survenue:", error);
    }
}

/**
 * Affiche les travaux d'une catégorie spécifique.
 * @param {Array} travaux - Liste des travaux à afficher.
 */
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
