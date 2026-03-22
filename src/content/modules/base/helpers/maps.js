const LANG_KEYWORDS = {
        it: /ciao|per favore|grazie|salve|buongiorno|buonasera|prego|scusa|sì|no|aiuto/i,
        en: /hello|please|thank|hi|thanks|welcome|goodbye|sorry|yes|no|help/i,
        es: /hola|por favor|gracias|buenos días|de nada|adiós|lo siento|sí|no|ayuda/i,
        fr: /bonjour|s'il vous plaît|merci|salut|de rien|au revoir|pardon|oui|non|aide/i,
        de: /hallo|bitte|danke|guten tag|gern geschehen|tschüss|entschuldigung|ja|nein|hilfe/i,};

const PROMPT_KEYWORDS = {
  creative_writing: {
    ita: ["scrittura creativa", "racconto", "storia", "narrazione"],
    eng: ["creative writing", "story", "narrative", "tale"],
    spa: ["escritura creativa", "historia", "narrativa", "cuento"],
    fra: ["écriture créative", "histoire", "récit", "conte"],
    deu: ["kreatives Schreiben", "Geschichte", "Erzählung", "Narrativ"]
  },
  summarization: {
    ita: ["riassunto", "sintesi", "abstract", "riepilogo"],
    eng: ["summary", "overview", "abstract", "recap"],
    spa: ["resumen", "síntesis", "resumen breve", "recapitulación"],
    fra: ["résumé", "synthèse", "abrégé", "récapitulatif"],
    deu: ["Zusammenfassung", "Synthese", "Abstract", "Rückblick"]
  },
  explanation: {
    ita: ["spiegazione", "descrizione", "chiarimento", "definizione"],
    eng: ["explanation", "description", "clarification", "definition"],
    spa: ["explicación", "descripción", "aclaración", "definición"],
    fra: ["explication", "description", "clarification", "définition"],
    deu: ["Erklärung", "Beschreibung", "Klärung", "Definition"]
  },
  coding: {
    ita: ["programmazione", "codice", "algoritmo", "debug"],
    eng: ["coding", "code", "algorithm", "debugging"],
    spa: ["programación", "código", "algoritmo", "depuración"],
    fra: ["programmation", "code", "algorithme", "débogage"],
    deu: ["Programmierung", "Code", "Algorithmus", "Debugging"]
  },
  data_analysis: {
    ita: ["analisi dati", "statistica", "grafico", "modello"],
    eng: ["data analysis", "statistics", "chart", "model"],
    spa: ["análisis de datos", "estadística", "gráfico", "modelo"],
    fra: ["analyse de données", "statistiques", "graphique", "modèle"],
    deu: ["Datenanalyse", "Statistik", "Diagramm", "Modell"]
  },
  planning: {
    ita: ["pianificazione", "strategia", "obiettivo", "agenda"],
    eng: ["planning", "strategy", "goal", "agenda"],
    spa: ["planificación", "estrategia", "objetivo", "agenda"],
    fra: ["planification", "stratégie", "objectif", "agenda"],
    deu: ["Planung", "Strategie", "Ziel", "Agenda"]
  },
  editing: {
    ita: ["modifica", "revisione", "correzione", "miglioramento"],
    eng: ["editing", "revision", "correction", "improvement"],
    spa: ["edición", "revisión", "corrección", "mejora"],
    fra: ["édition", "révision", "correction", "amélioration"],
    deu: ["Bearbeitung", "Überarbeitung", "Korrektur", "Verbesserung"]
  },
  communication: {
    ita: ["comunicazione", "messaggio", "conversazione", "dialogo"],
    eng: ["communication", "message", "conversation", "dialogue"],
    spa: ["comunicación", "mensaje", "conversación", "diálogo"],
    fra: ["communication", "message", "conversation", "dialogue"],
    deu: ["Kommunikation", "Nachricht", "Gespräch", "Dialog"]
  },
  weather: {
    ita: ["tempo", "pioggia", "sole", "vento"],
    eng: ["weather", "rain", "sun", "wind"],
    spa: ["clima", "lluvia", "sol", "viento"],
    fra: ["temps", "pluie", "soleil", "vent"],
    deu: ["Wetter", "Regen", "Sonne", "Wind"]
  },
  clothing: {
    ita: ["vestiti", "maglietta", "pantaloni", "scarpe"],
    eng: ["clothing", "t-shirt", "pants", "shoes"],
    spa: ["ropa", "camiseta", "pantalones", "zapatos"],
    fra: ["vêtements", "t-shirt", "pantalon", "chaussures"],
    deu: ["Kleidung", "T-Shirt", "Hose", "Schuhe"]
  },
  family: {
    ita: ["famiglia", "madre", "padre", "figlio"],
    eng: ["family", "mother", "father", "son"],
    spa: ["familia", "madre", "padre", "hijo"],
    fra: ["famille", "mère", "père", "fils"],
    deu: ["Familie", "Mutter", "Vater", "Sohn"]
  },
  time: {
    ita: ["tempo", "giorno", "notte", "ora"],
    eng: ["time", "day", "night", "hour"],
    spa: ["tiempo", "día", "noche", "hora"],
    fra: ["temps", "jour", "nuit", "heure"],
    deu: ["Zeit", "Tag", "Nacht", "Stunde"]
  },
  directions: {
    ita: ["direzione", "sinistra", "destra", "dritto"],
    eng: ["direction", "left", "right", "straight"],
    spa: ["dirección", "izquierda", "derecha", "recto"],
    fra: ["direction", "gauche", "droite", "tout droit"],
    deu: ["Richtung", "links", "rechts", "geradeaus"]
  },
  shopping: {
    ita: ["negozio", "prezzo", "acquisto", "vendita"],
    eng: ["shop", "price", "purchase", "sale"],
    spa: ["tienda", "precio", "compra", "venta"],
    fra: ["magasin", "prix", "achat", "vente"],
    deu: ["Geschäft", "Preis", "Kauf", "Verkauf"]
  },
  hobbies: {
    ita: ["hobby", "lettura", "musica", "gioco"],
    eng: ["hobby", "reading", "music", "game"],
    spa: ["pasatiempo", "lectura", "música", "juego"],
    fra: ["loisir", "lecture", "musique", "jeu"],
    deu: ["Hobby", "Lesen", "Musik", "Spiel"]
  },
  transportation: {
    ita: ["trasporto", "auto", "treno", "bicicletta"],
    eng: ["transport", "car", "train", "bicycle"],
    spa: ["transporte", "coche", "tren", "bicicleta"],
    fra: ["transport", "voiture", "train", "vélo"],
    deu: ["Transport", "Auto", "Zug", "Fahrrad"]
  },
  materials: {
    ita: ["materiale", "legno", "metallo", "plastica"],
    eng: ["material", "wood", "metal", "plastic"],
    spa: ["material", "madera", "metal", "plástico"],
    fra: ["matériau", "bois", "métal", "plastique"],
    deu: ["Material", "Holz", "Metall", "Plastik"]
  },
  shapes: {
    ita: ["forma", "cerchio", "quadrato", "triangolo"],
    eng: ["shape", "circle", "square", "triangle"],
    spa: ["forma", "círculo", "cuadrado", "triángulo"],
    fra: ["forme", "cercle", "carré", "triangle"],
    deu: ["Form", "Kreis", "Quadrat", "Dreieck"]
  },
  professions: {
    ita: ["professione", "medico", "ingegnere", "insegnante"],
    eng: ["profession", "doctor", "engineer", "teacher"],
    spa: ["profesión", "médico", "ingeniero", "profesor"],
    fra: ["profession", "médecin", "ingénieur", "professeur"],
    deu: ["Beruf", "Arzt", "Ingenieur", "Lehrer"]
  },
  personality: {
    ita: ["personalità", "gentile", "timido", "coraggioso"],
    eng: ["personality", "kind", "shy", "brave"],
    spa: ["personalidad", "amable", "tímido", "valiente"],
    fra: ["personnalité", "gentil", "timide", "courageux"],
    deu: ["Persönlichkeit", "freundlich", "schüchtern", "mutig"]
  },
  riassunto: {
    ita: ["riassunto", "sintesi", "riepilogo", "compendio", "abstract"],
    eng: ["summary", "overview", "recap", "digest", "abstract"],
    spa: ["resumen", "síntesis", "recapitulación", "compendio", "extracto"],
    fra: ["résumé", "synthèse", "récapitulatif", "compendium", "abrégé"],
    deu: ["Zusammenfassung", "Synthese", "Rückblick", "Kompendium", "Abstract"]
  },
  spiegazione: {
    ita: ["spiegazione", "chiarimento", "illustrazione", "analisi", "descrizione"],
    eng: ["explanation", "clarification", "illustration", "analysis", "description"],
    spa: ["explicación", "aclaración", "ilustración", "análisis", "descripción"],
    fra: ["explication", "clarification", "illustration", "analyse", "description"],
    deu: ["Erklärung", "Klärung", "Illustration", "Analyse", "Beschreibung"]
  },
   pianificazione: {
    ita: ["piano", "strategia", "obiettivo", "agenda", "priorità"],
    eng: ["plan", "strategy", "goal", "schedule", "priority"],
    spa: ["plan", "estrategia", "objetivo", "agenda", "prioridad"],
    fra: ["plan", "stratégie", "objectif", "agenda", "priorité"],
    deu: ["Plan", "Strategie", "Ziel", "Zeitplan", "Priorität"]
  }
};


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

    education: {
        it: ["Istruzione", "Scuola", "Apprendimento", "Università", "Studio", "Conoscenza", "Insegnamento", "Pedagogia", "Ricerca", "Esame"],
        en: ["Education", "School", "Learning", "University", "Study", "Knowledge", "Teaching", "Pedagogy", "Research", "Exam"],
        es: ["Educación", "Escuela", "Aprendizaje", "Universidad", "Estudio", "Conocimiento", "Enseñanza", "Pedagogía", "Investigación", "Examen"],
        fr: ["Éducation", "École", "Apprentissage", "Université", "Étude", "Connaissance", "Enseignement", "Pédagogie", "Recherche", "Examen"],
        de: ["Bildung", "Schule", "Lernen", "Universität", "Studium", "Wissen", "Lehre", "Pädagogik", "Forschung", "Prüfung"]
    },
    science: {
        it: ["Scienza", "Laboratorio", "Esperimento", "Fisica", "Chimica", "Biologia", "Teoria", "Metodo", "Invenzione", "Natura"],
        en: ["Science", "Laboratory", "Experiment", "Physics", "Chemistry", "Biology", "Theory", "Method", "Invention", "Nature"],
        es: ["Ciencia", "Laboratorio", "Experimento", "Física", "Química", "Biología", "Teoría", "Método", "Invención", "Naturaleza"],
        fr: ["Science", "Laboratoire", "Expérience", "Physique", "Chimie", "Biologie", "Théorie", "Méthode", "Invention", "Nature"],
        de: ["Wissenschaft", "Labor", "Experiment", "Physik", "Chemie", "Biologie", "Theorie", "Methode", "Erfindung", "Natur"]
    },
    history: {
        it: ["Storia", "Passato", "Archivio", "Civiltà", "Archeologia", "Epoca", "Antichità", "Guerra", "Rivoluzione", "Documento"],
        en: ["History", "Past", "Archive", "Civilization", "Archaeology", "Era", "Antiquity", "War", "Revolution", "Document"],
        es: ["Historia", "Pasado", "Archivo", "Civilización", "Arqueología", "Época", "Antigüedad", "Guerra", "Revolución", "Documento"],
        fr: ["Histoire", "Passé", "Archive", "Civilisation", "Archéologie", "Époque", "Antiquité", "Guerre", "Révolution", "Document"],
        de: ["Geschichte", "Vergangenheit", "Archiv", "Zivilisation", "Archäologie", "Ära", "Antike", "Krieg", "Revolution", "Dokument"]
    },
    philosophy: {
        it: ["Filosofia", "Pensiero", "Etica", "Logica", "Esistenza", "Mente", "Metafisica", "Saggezza", "Concetto", "Dialettica"],
        en: ["Philosophy", "Thought", "Ethics", "Logic", "Existence", "Mind", "Metaphysics", "Wisdom", "Concept", "Dialectic"],
        es: ["Filosofía", "Pensamiento", "Ética", "Lógica", "Existencia", "Mente", "Metafísica", "Sabiduría", "Concepto", "Dialéctica"],
        fr: ["Philosophie", "Pensée", "Éthique", "Logique", "Existence", "Esprit", "Métaphysique", "Sagesse", "Concept", "Dialectique"],
        de: ["Philosophie", "Denken", "Ethik", "Logik", "Existenz", "Geist", "Metaphysik", "Weisheit", "Konzept", "Dialektik"]
    },
    psychology: {
        it: ["Psicologia", "Comportamento", "Inconscio", "Terapia", "Emozione", "Personalità", "Cognizione", "Percezione", "Analisi", "Sogno"],
        en: ["Psychology", "Behavior", "Unconscious", "Therapy", "Emotion", "Personality", "Cognition", "Perception", "Analysis", "Dream"],
        es: ["Psicología", "Comportamiento", "Inconsciente", "Terapia", "Emoción", "Personalidad", "Cognición", "Percepción", "Análisis", "Sueño"],
        fr: ["Psychologie", "Comportement", "Inconscient", "Thérapie", "Émotion", "Personnalité", "Cognition", "Perception", "Analyse", "Rêve"],
        de: ["Psychologie", "Verhalten", "Unbewusstes", "Therapie", "Emotion", "Persönlichkeit", "Kognition", "Wahrnehmung", "Analyse", "Traum"]
    },
    travel: {
        it: ["Viaggio", "Destinazione", "Avventura", "Turismo", "Esplorazione", "Bagaglio", "Itinerario", "Mappa", "Vacanze", "Volo"],
        en: ["Travel", "Destination", "Adventure", "Tourism", "Exploration", "Baggage", "Itinerary", "Map", "Holidays", "Flight"],
        es: ["Viaje", "Destino", "Aventura", "Turismo", "Exploración", "Equipaje", "Itinerario", "Mapa", "Vacaciones", "Vuelo"],
        fr: ["Voyage", "Destination", "Aventure", "Tourisme", "Exploration", "Bagages", "Itinéraire", "Carte", "Vacances", "Vol"],
        de: ["Reise", "Ziel", "Abenteuer", "Tourismus", "Erkundung", "Gepäck", "Reiseroute", "Karte", "Urlaub", "Flug"]
    },
    food: {
        it: ["Cucina", "Ricetta", "Gastronomia", "Sapore", "Ingredienti", "Ristorante", "Nutrizione", "Cena", "Degustazione", "Tradizione"],
        en: ["Dish", "Recipe", "Cuisine", "Gourmet", "Flavor", "Organic", "Fine Dining", "Snack", "Menu", "Sustainable Food"],
        es: ["Cocina", "Receta", "Sabor", "Ingredientes", "Restaurante", "Nutrición", "Cena", "Gourmet", "Menú", "Desayuno"],
        fr: ["Cuisine", "Recette", "Saveur", "Ingrédients", "Restaurant", "Nutrition", "Dîner", "Gourmet", "Menu", "Petit-déjeuner"],
        de: ["Küche", "Rezept", "Geschmack", "Zutaten", "Restaurant", "Ernährung", "Abendessen", "Gourmet", "Menü", "Frühstück"]
    },
    fashion: {
        it: ["Moda", "Stile", "Tendenza", "Abbigliamento", "Accessori", "Passerella", "Design", "Eleganza", "Tessuto", "Sfilata"],
        en: ["Fashion", "Style", "Trend", "Clothing", "Accessories", "Runway", "Design", "Elegance", "Fabric", "Show"],
        es: ["Moda", "Estilo", "Tendencia", "Ropa", "Accesorios", "Pasarela", "Diseño", "Elegancia", "Tejido", "Desfile"],
        fr: ["Mode", "Style", "Tendance", "Vêtements", "Accessoires", "Podium", "Design", "Élégance", "Tissu", "Défilé"],
        de: ["Mode", "Stil", "Trend", "Kleidung", "Zubehör", "Laufsteg", "Design", "Eleganz", "Stoff", "Schau"]
    },
    relationships: {
        it: ["Relazioni", "Amore", "Amicizia", "Famiglia", "Comunicazione", "Empatia", "Coppia", "Fiducia", "Rispetto", "Legame"],
        en: ["Relationships", "Love", "Friendship", "Family", "Communication", "Empathy", "Couple", "Trust", "Respect", "Bond"],
        es: ["Relaciones", "Amor", "Amistad", "Familia", "Comunicación", "Empatía", "Pareja", "Confianza", "Respeto", "Vínculo"],
        fr: ["Relations", "Amour", "Amitié", "Famille", "Communication", "Empathie", "Couple", "Confiance", "Respect", "Lien"],
        de: ["Beziehungen", "Liebe", "Freundschaft", "Familie", "Kommunikation", "Empathie", "Paar", "Vertrauen", "Respekt", "Bindung"]
    },
    self_improvement: {
        it: ["Crescita", "Motivazione", "Disciplina", "Obiettivo", "Abitudine", "Consapevolezza", "Produttività", "Successo", "Miglioramento", "Resilienza"],
        en: ["Growth", "Motivation", "Discipline", "Goal", "Habit", "Mindfulness", "Productivity", "Success", "Improvement", "Resilience"],
        es: ["Crecimiento", "Motivación", "Disciplina", "Meta", "Hábito", "Conciencia", "Productividad", "Éxito", "Mejora", "Resiliencia"],
        fr: ["Croissance", "Motivation", "Discipline", "Objectif", "Habitude", "Pleine conscience", "Productivité", "Succès", "Amélioration", "Résilience"],
        de: ["Wachstum", "Motivation", "Disziplin", "Ziel", "Gewohnheit", "Achtsamkeit", "Produktivität", "Erfolg", "Verbesserung", "Resilienz"]
    },
    art: {
        it: ["Arte", "Pittura", "Scultura", "Museo", "Creatività", "Opera", "Espressione", "Estetica", "Galleria", "Artista"],
        en: ["Art", "Painting", "Sculpture", "Museum", "Creativity", "Masterpiece", "Expression", "Aesthetics", "Gallery", "Artist"],
        es: ["Arte", "Pintura", "Escultura", "Museo", "Creatividad", "Obra", "Expresión", "Estética", "Galería", "Artista"],
        fr: ["Art", "Peinture", "Sculpture", "Musée", "Créativité", "Chef-d'œuvre", "Expression", "Esthétique", "Galerie", "Artiste"],
        de: ["Kunst", "Malerei", "Skulptur", "Museum", "Kreativität", "Meisterwerk", "Ausdruck", "Ästhetik", "Galerie", "Künstler"]
    },
    music: {
        it: ["Musica", "Ritmo", "Melodia", "Concerto", "Strumento", "Composizione", "Genere", "Canto", "Armonia", "Suono"],
        en: ["Music", "Rhythm", "Melody", "Concert", "Instrument", "Composition", "Genre", "Singing", "Harmony", "Sound"],
        es: ["Música", "Ritmo", "Melodía", "Concierto", "Instrumento", "Composición", "Género", "Canto", "Armonía", "Sonido"],
        fr: ["Musique", "Rythme", "Mélodie", "Concert", "Instrument", "Composition", "Genre", "Chant", "Harmonie", "Son"],
        de: ["Musik", "Rhythmus", "Melodie", "Konzert", "Instrument", "Komposition", "Genre", "Gesang", "Harmonie", "Klang"]
    },
    writing: {
        it: ["Scrittura", "Libro", "Autore", "Narrazione", "Poesia", "Editing", "Stile", "Capitolo", "Trama", "Letteratura"],
        en: ["Writing", "Book", "Author", "Narrative", "Poetry", "Editing", "Style", "Chapter", "Plot", "Literature"],
        es: ["Escritura", "Libro", "Autor", "Narrativa", "Poesía", "Edición", "Estilo", "Capítulo", "Trama", "Literatura"],
        fr: ["Écriture", "Livre", "Auteur", "Récit", "Poésie", "Édition", "Style", "Chapitre", "Intrigue", "Littérature"],
        de: ["Schreiben", "Buch", "Autor", "Erzählung", "Poesie", "Lektorat", "Stil", "Kapitel", "Handlung", "Literatur"]
    },
    film: {
        it: ["Cinema", "Regista", "Attore", "Sceneggiatura", "Produzione", "Genere", "Festival", "Critica", "Montaggio", "Trama"],
        en: ["Film", "Director", "Actor", "Screenplay", "Production", "Genre", "Festival", "Review", "Editing", "Plot"],
        es: ["Cine", "Director", "Actor", "Guion", "Producción", "Género", "Festival", "Crítica", "Montaje", "Trama"],
        fr: ["Cinéma", "Réalisateur", "Acteur", "Scénario", "Production", "Genre", "Festival", "Critique", "Montage", "Intrigue"],
        de: ["Film", "Regisseur", "Schauspieler", "Drehbuch", "Produktion", "Genre", "Festival", "Kritik", "Schnitt", "Handlung"]
    },
    law: {
        it: ["Diritto", "Legge", "Giustizia", "Codice", "Avvocato", "Tribunale", "Norma", "Sentenza", "Diritti", "Contratto"],
        en: ["Law", "Legislation", "Justice", "Code", "Lawyer", "Court", "Norm", "Verdict", "Rights", "Contract"],
        es: ["Derecho", "Ley", "Justicia", "Código", "Abogado", "Tribunal", "Norma", "Sentencia", "Derechos", "Contrato"],
        fr: ["Droit", "Loi", "Justice", "Code", "Avocat", "Tribunal", "Norme", "Verdict", "Droits", "Contrat"],
        de: ["Recht", "Gesetz", "Justiz", "Kodex", "Anwalt", "Gericht", "Norm", "Urteil", "Rechte", "Vertrag"]
    },
    sustainability: {
        it: ["Sostenibilità", "Ambiente", "Ecologia", "Riciclo", "Energia", "Clima", "Responsabilità", "Risorse", "Futuro", "Conservazione"],
        en: ["Sustainability", "Environment", "Ecology", "Recycling", "Energy", "Climate", "Responsibility", "Resources", "Future", "Conservation"],
        es: ["Sostenibilidad", "Ambiente", "Ecología", "Reciclaje", "Energía", "Clima", "Responsabilidad", "Recursos", "Futuro", "Conservación"],
        fr: ["Durabilité", "Environnement", "Écologie", "Recyclage", "Énergie", "Climat", "Responsabilité", "Ressources", "Futur", "Conservation"],
        de: ["Nachhaltigkeit", "Umwelt", "Ökologie", "Recycling", "Energie", "Klima", "Verantwortung", "Ressourcen", "Zukunft", "Erhaltung"]
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