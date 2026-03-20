export class SumoView {
    constructor() {
        this.cardContainer = document.getElementById('sumoCard');
        this.favBtn = document.getElementById('favBtn');
        this.favList = document.getElementById('favList');
        this.loader = document.getElementById('loader');
        this.noFavMsg = document.getElementById('noFav');
    }

    /**
     * Gère l'état visuel de l'application pendant les appels API 
     * @param {boolean} show - Définit si on affiche le spinner de chargement
     */
    chargement(show) {
        if (show) {
            this.loader.classList.remove('hidden');
            // On vide le container pour éviter l'affichage de données obsolètes pendant l'attente
            this.cardContainer.innerHTML = "";
        } else {
            this.loader.classList.add('hidden');
        }
    }

    /**
     * Injection dynamique du contenu HTML pour la fiche d'un sumo
     * @param {Object} sumo - L'objet de données formaté par le modèle.
     */
    afficherSumo(sumo) {
        this.cardContainer.innerHTML = `
            <div class="sumo-display-card">
                <h2>${sumo.name}</h2>
                <div class="stats-box">
                    <p><strong>🎂 Âge :</strong> ${sumo.age} ans</p>
                    <p><strong>📅 Naissance :</strong> ${sumo.birthDate}</p>
                    <p><strong>📏 Taille :</strong> ${sumo.height} cm</p>
                    <p><strong>⚖️ Poids :</strong> ${sumo.weight} kg</p>
                    <p><strong>📍 Origine :</strong> ${sumo.origin}</p>
                    <p><strong>🏆 Rang :</strong> ${sumo.rank}</p>
                </div>
            </div>
        `;
    }

    /**
     * Met à jour l'état "Favori".
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
     * Rendu de la liste des favoris.
     * @param {Array} favorites - Tableau d'objets [{name, rank}, ...]
     */
    afficherFavoris(favorites) {
        // Utilisation de .map() pour transformer le tableau d'objets en tableau de chaînes HTML
        // .join('') permet de supprimer les virgules par défaut lors de l'insertion dans le DOM
        this.favList.innerHTML = favorites.map(sumo => `
            <li class="fav-item">
                <button class="btn-select-sumo" data-name="${sumo.name}">
                    ${sumo.name} <small>(${sumo.rank})</small> 
                </button>
                <span class="delete-fav" data-name="${sumo.name}">⨷</span>
            </li>
        `).join('');
    }
}