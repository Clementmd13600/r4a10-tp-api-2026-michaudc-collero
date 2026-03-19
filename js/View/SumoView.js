export class SumoView {
    constructor() {
        // Sélection des éléments du DOM pour la vue
        this.cardContainer = document.getElementById('sumoCard');
        this.favBtn = document.getElementById('favBtn');
        this.favList = document.getElementById('favList');
        this.loader = document.getElementById('loader');
        this.noFavMsg = document.getElementById('noFav');
    }

    /**
     * Gère l'affichage de l'état de chargement
     * @param {boolean} show - État du chargement
     */
    chargement(show) {
        if (show) {
            // On affiche le loader en retirant la classe qui le cache
            this.loader.classList.remove('hidden');
            
            // On vide la carte actuelle pour que l'utilisateur comprenne qu'une recherche est en cours
            this.cardContainer.innerHTML = "";
        } else {
            // On cache le loader une fois que les données sont arrivées
            this.loader.classList.add('hidden');
        }
    }

    /**
     * Injecte les données du sumo dans le conteneur principal
     * @param {Object} sumo - Objet contenant les infos du lutteur
     */
    afficherSumo(sumo) {
        // On construis le HTML 
        this.cardContainer.innerHTML = `
            <div class="sumo-display-card">
                <h2>${sumo.name}</h2>
                <div class="stats-box">
                    <p><strong>🏆 Rang :</strong> ${sumo.rank}</p>
                    <p><strong>📍 Origine :</strong> ${sumo.origin}</p>
                    <p><strong>⚖️ Poids :</strong> ${sumo.weight} kg</p>
                    <p><strong>📏 Taille :</strong> ${sumo.height} cm</p>
                </div>
            </div>
        `;
    }

    /**
     * Met à jour l'aspect visuel du bouton favoris 
     * @param {boolean} isFav - Indique si le sumo actuel est en favori
     */
    changementetoile(isFav) {
        if (isFav) {
            this.favBtn.textContent = "★";    
            this.favBtn.style.color = "#ffcb05"; 
        } else {
            this.favBtn.textContent = "☆";    
            this.favBtn.style.color = "white";  
        }
    }

    /**
     * Rafraîchit la liste des favoris dans la barre latérale
     * @param {string[]} favorites - Tableau des noms des sumos favoris
     */
    afficherFavoris(favorites) {
        // Affichage du message "Liste vide"
        this.noFavMsg.classList.toggle('hidden', favorites.length > 0);

        // On transforme du tableau de chaînes en HTML avec map pour créer le tableau et join pour en faire une seule chaine
        this.favList.innerHTML = favorites.map(name => `
        <li class="fav-item">
            <button class="btn-select-sumo" data-name="${name}">
                ${name}
            </button>
            <span class="delete-fav" data-name="${name}">⨷</span>
        </li>
    `).join('');
    }
}