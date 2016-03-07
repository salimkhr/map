/* -------------------------------------------- */
/*  	        	  Client		            */       
/* -------------------------------------------- */

// Prototype pour le stockage des données d'un Client
function Client(id,ordre,positionX,positionY,ville_client,demande,horaires_min,horaires_max)
{
	// Définition des variables du prototype Client
	this.id = id;
	this.ordre = ordre;
	this.positionX = positionX;
	this.positionY = positionY;
	this.ville_client=ville_client;
	this.demande=demande;
	this.horaires_min=horaires_min;
	this.horaires_max=horaires_max;

	// Fonction message qui retourne une chaine texte
	this.afficherClient = function()
	{
		var texte = "";
		// Affichage de notre récapitulatif Client
		texte += "id = " + this.id + "<br/>" +
		         "ordre = " + this.ordre + "<br/>" +
		         /*"position X = " + this.positionX + "<br/>" +
		         "position Y = " + this.positionY + "<br/>" +*/
		         "ville du client = " + this.ville_client + "<br/>" + 
		         "demande = " + this.demande + "<br/>" +
		         "horaires_min = " + this.horaires_min + "<br/>" +
		         "horaires_max = " + this.horaires_max + "<br/><br/>";

		return (texte);
	};
}

/* -------------------------------------------- */
/*  	        	  Dépôt 		            */       
/* -------------------------------------------- */

// Prototype pour le stockage des données d'un Dépôt
function Depot(id,positionX,positionY,ville_depot)
{
	// Définition des variables du prototype Dépôt
	this.id = id;
	this.positionX = positionX;
	this.positionY = positionY;
	this.ville_depot=ville_depot;

	// Fonction message qui retourne une chaine texte
	this.afficherDepot = function()
	{
		var texte = "";
		// Affichage de notre récapitulatif Client
		texte += "&nbsp;&nbsp;&nbsp;id = " + this.id + "<br/>" +
		         /*"&nbsp;&nbsp;&nbsp;position X = " + this.positionX + "<br/>" +
		         "&nbsp;&nbsp;&nbsp;position Y = " + this.positionY + "<br/>" +*/
		         "&nbsp;&nbsp;&nbsp;ville du dépôt = " + this.ville_depot + "<br/><br/>";

		return (texte);
	};
}

/* -------------------------------------------- */
/*  	        	  Tournée 		            */       
/* -------------------------------------------- */

// Prototype pour le stockage des données d'une Tournée
function Tournee(id,cout,duree,charge,depotX,depotY,nom_depot)
{
	// Définition des variables du prototype Tournée
	this.id=id;
	this.cout = cout;
	this.duree = duree;
	this.charge = charge;

	// Liste des clients de notre tournée
	this.listeClients = [];

	// On indique le dépot
	this.depotX = depotX;
	this.depotY = depotY;
	this.nom_depot = nom_depot;

    this.nbClients=function()
    {
        return this.listeClients.length;
    };

	// Fonction qui montre le trajet
	this.afficherTournee = function()
	{
		var chaine = "Récaptulatif de la Tournée :<br/>" +
					 "&nbsp;&nbsp;&nbsp;Cout : " + this.cout + "<br/>" +
					 "&nbsp;&nbsp;&nbsp;Durée : " + this.duree + "<br/>" +
					 "&nbsp;&nbsp;&nbsp;Charge : " + this.charge + "<br/>" +
					 "&nbsp;&nbsp;&nbsp;Ville Dépot : " + this.nom_depot + "<br/>" /*+
					 "&nbsp;&nbsp;&nbsp;Pos X dépot : " + this.depotX + "<br/>" +
					 "&nbsp;&nbsp;&nbsp;Pos Y dépot : " + this.depotY + "<br/><br/>";*/

		return (chaine);

	};

	// Fonction message qui retourne une chaine texte
	this.afficherClientsTournee = function()
	{
		var chaine = "Récaptulatif des Clients :<br/><br/>";
		for(var i=1;i<this.listeClients.length;i++)
		{
			chaine += "<h4>Etape n° " + i + "</h4>";
			chaine += this.listeClients[i].afficherClient();
		}
		return (chaine);	
	};

	//Fonction pour récupérer un client
	this.getClient = function(ordre)
	{
		for(var i=1;i<this.listeClients.length;i++)
		{
			if(this.listeClients[i].ordre == ordre )
			{
				return this.listeClients[i];
			}
		}

		/*for( values in this.listeClients[0])
		{
			alert(values + " " + this.listeClients[0][values]);
		}*/
	};

	//Fonction pour récupérer un client
	this.ajouterClient = function(client)
	{
		this.listeClients[client.ordre] = client;
	};
}