const LANG_KEYWORDS = {

};

const PROMPT_KEYWORDS = {

}


const CATEGORY_KEYWORDS = {
    marketing: {
        it: ["Mercato", "Prodotto", "Prezzo", "Promozione", "Strategico", "Aziendale", "Consumatore", "Ricerca di mercato", "Pubblicità", "Fidelizzazione"],
        en: ["Target", "Branding", "Social Media", "Market", "Internet", "Leads", "Funnel", "Engagement", "Conversion Rate", "Copywriting"],
        es: ["Mercado", "Producto", "Precio", "Promoción", "Estrategia", "Consumidor", "Publicidad", "Ventas", "Marca", "Fidelización"],
        fr: ["Marché", "Produit", "Prix", "Promotion", "Stratégie", "Consommateur", "Publicité", "Ventes", "Marque", "Fidélisation"],
        de: ["Markt", "Produkt", "Preis", "Promotion", "Strategie", "Verbraucher", "Werbung", "Vertrieb", "Marke", "Kundenbindung"]
    },
    finance: {
        it: ["Analisi", "Economia", "Azioni", "Obbligazioni", "Derivati", "Portafoglio", "Tassi", "Liquidità", "Rischio", "Rendimento"],
        en: ["Trading", "Rating", "Cash Flow", "Asset Management", "Equity", "Bankruptcy", "Dividend", "Inflation", "Bull Market", "Volatility"],
        es: ["Análisis", "Economía", "Acciones", "Bonos", "Derivados", "Cartera", "Tasas", "Liquidez", "Riesgo", "Rentabilidad"],
        fr: ["Analyse", "Économie", "Actions", "Obligations", "Dérivés", "Portefeuille", "Taux", "Liquidité", "Risque", "Rendement"],
        de: ["Analyse", "Wirtschaft", "Aktien", "Anleihen", "Derivate", "Portfolio", "Zinsen", "Liquidität", "Risiko", "Rendite"]
    },
    health: {
        it: ["Salute", "Benessere", "Buona Salute", "Condizioni", "Sanità", "Educazione sanitaria", "Prevenzione", "Medicina", "Terapia", "Diagnosi"],
        en: ["Well-being", "Healthiness", "Healthcare", "Benefit", "Cost", "Nurse", "Doctor", "Check-up", "Surgery", "Wellness"],
        es: ["Salud", "Bienestar", "Sanidad", "Prevención", "Medicina", "Terapia", "Diagnóstico", "Enfermero", "Médico", "Cirugía"],
        fr: ["Santé", "Bien-être", "Soins", "Prévention", "Médecine", "Thérapie", "Diagnostic", "Infirmier", "Médecin", "Chirurgie"],
        de: ["Gesundheit", "Wohlbefinden", "Vorsorge", "Medizin", "Therapie", "Diagnose", "Pflege", "Arzt", "Krankenhaus", "Chirurgie"]
    },
    sports: {
        it: ["Attività di squadra", "Individuali", "Giocare", "Attrezzature", "Luoghi", "Calcio", "Allenamento", "Gara", "Campionato", "Atleta"],
        en: ["Stretching", "Fair play", "Cricket", "Hockey", "Tennis", "Pallavolo", "Ping-pong", "Baseball", "Rugby", "Football americano"],
        es: ["Deportes", "Equipo", "Entrenamiento", "Fútbol", "Baloncesto", "Tenis", "Atleta", "Competición", "Gimnasio", "Victoria"],
        fr: ["Sports", "Équipe", "Entraînement", "Football", "Basket", "Tennis", "Athlète", "Compétition", "Gymnase", "Victoire"],
        de: ["Sport", "Mannschaft", "Training", "Fußball", "Basketball", "Tennis", "Athlet", "Wettbewerb", "Turnhalle", "Sieg"]
    },
    politics: {
        it: ["Stato", "Senato", "Governo", "Politologo", "Movimento politico", "Sindacato", "Cittadinanza", "Democrazia", "Ideologie", "Partiti"],
        en: ["President", "Prime Minister", "Member of Parliament", "Politics", "Politician", "Coalition", "Alliance", "Election", "Vote", "Ballot"],
        es: ["Estado", "Senado", "Gobierno", "Democracia", "Elecciones", "Partido", "Voto", "Ciudadanía", "Ministro", "Política"],
        fr: ["État", "Sénat", "Gouvernement", "Démocratie", "Élections", "Parti", "Vote", "Citoyenneté", "Ministre", "Politique"],
        de: ["Staat", "Senat", "Regierung", "Demokratie", "Wahlen", "Partei", "Stimme", "Bürgerschaft", "Minister", "Politik"]
    },
    coding: {
        it: ["Sviluppo", "Programmazione", "Codice", "Algoritmo", "Sorgente", "Variabile", "Funzione", "Compilazione", "Debug", "Database"],
        en: ["Framework", "Backend", "Frontend", "Fullstack", "Scripting", "Deployment", "Version Control", "Repository", "Bug", "Syntax"],
        es: ["Desarrollo", "Programación", "Código", "Algoritmo", "Función", "Variable", "Base de datos", "Depuración", "Servidor", "Interfaz"],
        fr: ["Développement", "Programmation", "Code", "Algorithme", "Fonction", "Variable", "Base de données", "Débogage", "Serveur", "Interface"],
        de: ["Entwicklung", "Programmierung", "Code", "Algorithmus", "Funktion", "Variable", "Datenbank", "Debugging", "Server", "Schnittstelle"]
    },
    ai: {
        it: ["Intelligenza Artificiale", "Reti Neurali", "Apprendimento Automatico", "Dati", "Automazione", "Robotica", "Algoritmo Generativo", "Etica", "Modelli", "Predizione"],
        en: ["Machine Learning", "Deep Learning", "Neural Networks", "Chatbot", "Natural Language Processing", "Big Data", "Data Science", "Algorithm", "Prompt", "Inference"],
        es: ["Inteligencia Artificial", "Redes Neuronales", "Aprendizaje Automático", "Robótica", "Automatización", "Modelos", "Algoritmo", "Ética", "Datos", "Predicción"],
        fr: ["Intelligence Artificielle", "Réseaux Neuronaux", "Apprentissage Automatique", "Robotique", "Automatisation", "Modèles", "Algorithme", "Éthique", "Données", "Prédiction"],
        de: ["Künstliche Intelligenz", "Neuronale Netze", "Maschinelles Lernen", "Robotik", "Automatisierung", "Modelle", "Algorithmus", "Ethik", "Daten", "Vorhersage"]
    },
    cybersecurity: {
        it: ["Sicurezza Informatica", "Protezione", "Crittografia", "Vulnerabilità", "Attacco", "Difesa", "Riservatezza", "Accesso", "Identità", "Prevenzione"],
        en: ["Firewall", "Malware", "Phishing", "Encryption", "Hacker", "Data Breach", "Authentication", "Password", "Security", "Endpoint"],
        es: ["Seguridad Informática", "Cortafuegos", "Cifrado", "Hacker", "Vulnerabilidad", "Contraseña", "Ataque", "Protección", "Privacidad", "Autenticación"],
        fr: ["Sécurité Informatique", "Pare-feu", "Chiffrement", "Pirate", "Vulnérabilité", "Mot de passe", "Attaque", "Protection", "Confidentialité", "Authentification"],
        de: ["IT-Sicherheit", "Firewall", "Verschlüsselung", "Hacker", "Schwachstelle", "Passwort", "Angriff", "Schutz", "Datenschutz", "Authentifizierung"]
    },
    gaming: {
        it: ["Videogiochi", "Giocatore", "Console", "Multiplayer", "Esperienza di gioco", "Livello", "Missione", "Personaggio", "Grafica", "Interattività"],
        en: ["Gameplay", "Streamer", "Cloud Gaming", "Ray Tracing", "Battle Royale", "Esports", "Controller", "Sandbox", "Achievement", "Sandbox"],
        es: ["Videojuegos", "Jugador", "Consola", "Multijugador", "Nivel", "Misión", "Personaje", "Gráficos", "Mando", "Logro"],
        fr: ["Jeux vidéo", "Joueur", "Console", "Multijoueur", "Niveau", "Mission", "Personnage", "Graphismes", "Manette", "Succès"],
        de: ["Videospiele", "Spieler", "Konsole", "Mehrspieler", "Level", "Mission", "Charakter", "Grafik", "Controller", "Erfolg"]
    },
    food: {
        it: ["Cucina", "Ricetta", "Gastronomia", "Sapore", "Ingredienti", "Ristorante", "Nutrizione", "Cena", "Degustazione", "Tradizione"],
        en: ["Dish", "Recipe", "Cuisine", "Gourmet", "Flavor", "Organic", "Fine Dining", "Snack", "Menu", "Sustainable Food"],
        es: ["Cocina", "Receta", "Sabor", "Ingredientes", "Restaurante", "Nutrición", "Cena", "Gourmet", "Menú", "Desayuno"],
        fr: ["Cuisine", "Recette", "Saveur", "Ingrédients", "Restaurant", "Nutrition", "Dîner", "Gourmet", "Menu", "Petit-déjeuner"],
        de: ["Küche", "Rezept", "Geschmack", "Zutaten", "Restaurant", "Ernährung", "Abendessen", "Gourmet", "Menü", "Frühstück"]
    }
};
    // education
    // science
    // history
    // philosophy
    // psychology
    // travel
    // food
    // fashion
    // relationships
    // self_improvement
    // art
    // music
    // writing
    // film
    // gaming
    // ai
    // cybersecurity
    // law
    // sustainability    


const SAFETY_KEYWORDS = {}

export { PROMPT_KEYWORDS, CATEGORY_KEYWORDS, LANG_KEYWORDS, SAFETY_KEYWORDS }