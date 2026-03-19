export class Sumotori {
    constructor(data) {
        this.name = data.shikonaEn || "Inconnu";
        this.weight = data.weight || "N/A";
        this.height = data.height || "N/A";
        this.rank = data.currentRank || "Non classé"; 
        this.origin = data.shusshin || "Origine inconnue";
    }
}