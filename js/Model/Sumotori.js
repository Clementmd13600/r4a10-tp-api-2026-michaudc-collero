export class Sumotori {
    constructor(data) {
        this.name = data.shikonaEn || "Inconnu";
        this.weight = data.weight || "N/A";
        this.height = data.height || "N/A";
        this.rank = data.currentRank || "Non classé"; 
        this.origin = data.shusshin || "Origine inconnue";
        
        // On traite la date de naissance ici
        this.birthDate = this.formatDate(data.birthDate);
        this.age = this.calculateAge(data.birthDate);
    }

    // Formatage : YYYY-MM-DD -> DD/MM/YYYY
    formatDate(dateStr) {
        if (!dateStr) return "Inconnue";
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    // Calcul de l'âge exact
    calculateAge(dateStr) {
        if (!dateStr) return "N/A";
        const birthDate = new Date(dateStr);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}