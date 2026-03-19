
export class SumoView {
    constructor() {
        this.cardContainer = document.getElementById('sumoCard');
        this.favBtn = document.getElementById('favBtn');
        this.favList = document.getElementById('favList');
        this.loader = document.getElementById('loader');
        this.noFavMsg = document.getElementById('noFav');
    }

    chargement(show) {
        if (show) {
            this.loader.classList.remove('hidden');
            this.cardContainer.innerHTML = "";
        } else {
            this.loader.classList.add('hidden');
        }
    }

    // La méthode mise à jour avec l'âge et la naissance
    afficherSumo(sumo) {
        this.cardContainer.innerHTML = `
            <div class="sumo-display-card">
                <h2>${sumo.name}</h2>
                <div class="stats-box">
                    <p><strong>🏆 Rang :</strong> ${sumo.rank}</p>
                    <p><strong>🎂 Âge :</strong> ${sumo.age} ans</p>
                    <p><strong>📅 Naissance :</strong> ${sumo.birthDate}</p>
                    <p><strong>📍 Origine :</strong> ${sumo.origin}</p>
                    <p><strong>⚖️ Poids :</strong> ${sumo.weight} kg</p>
                    <p><strong>📏 Taille :</strong> ${sumo.height} cm</p>
                </div>
            </div>
        `;
    }

    changementetoile(isFav) {
        if (isFav) {
            this.favBtn.textContent = "★";    
            this.favBtn.style.color = "#ffcb05"; 
        } else {
            this.favBtn.textContent = "☆";    
            this.favBtn.style.color = "white";  
        }
    }

    afficherFavoris(favorites) {
        this.noFavMsg.classList.toggle('hidden', favorites.length > 0);
        this.favList.innerHTML = favorites.map(name => `
            <li class="fav-item">
                <button class="btn-select-sumo" data-name="${name}">${name}</button>
                <span class="delete-fav" data-name="${name}">⨷</span>
            </li>
        `).join('');
    }
}