
function initialize()
{
    var tournees = [];
    var select = document.getElementById("select");
    var recap = document.getElementById("recap");

    var cptTrip=0;
    /*var cptClient=0;
    var cptDepot=0;*/

    var tabClient =[];
    var tabDepot = [];
   
    xmlDoc = $.parseXML( xml ),
        $xml = $( xmlDoc ),
        $titre = $xml.find( "rep" );

    xmlDocEnv = $.parseXML( xmlEnv ),
        $xmlEnv = $( xmlDocEnv ),
        $titre = $xmlEnv.find( "env" );

        var racine = xmlDoc.documentElement;

    /*var x=[2.3522219000,5.3697800000,4.8356590000,1.4442090000,-1.5536210000,7.2619532000,7.7521113000];
    var y=[48.8566140000,43.2964820000,45.7640430000,43.6046520000,47.2183710000,43.7101728000,48.5734053000];
    var titre_ville=["Paris","Marseille","Lyon","Toulouse","Nantes","Nice","Strasbourg"];*/

    /*var depotX=3.8767160000;
    var depotY=43.6107690000;
    var depotNom="Montpellier";*/

    
    var i=0;

    $($xmlEnv).each(function()
    {
        $(this).find("VRPXMLQuery>ProblemData>Clients").each(function()
        {    
            $(this).find("Client").each(function()
            {
                tabClient[i] = new Client(
                            $(this).find("ID").text(),
                            0,
                            $(this).find("X").text(),
                            $(this).find("Y").text(),
                            $(this).find("Address").text(),
                            $(this).find("Demand").text(),
                            $(this).find("TimeWindowMin").text(),
                            $(this).find("TimeWindowMax").text());
                i++;
            });
        });
    });


    i =0;
    $($xmlEnv).each(function()
    {
        $(this).find("VRPXMLQuery>ProblemData>Depots").each(function()
        {
            $(this).find("Depot").each(function()
           {
               tabDepot[i] = new Depot(
                       $(this).find("Id").text(),
                       $(this).find("X").text(),
                       $(this).find("Y").text(),
                       $(this).find("Address").text());
               i++;
           });
        });
    });
    
    $($xml).each(function()
    {
        $(this).find("VRPXMLResponse>Solution>Trips").each(function()
        {
            $(this).find("Trip").each(function()
            {
                var i=0;
				var idDepot = $(this).find("Depot").find("Id").text();
				console.log(idDepot);
                tournees[cptTrip] = new Tournee(cptTrip,
                    $(this).find("Cost").text(),
                    $(this).find("Duration").text(),
                    $(this).find("TotalCharge").text(),
                    tabDepot[idDepot-1].positionX,tabDepot[idDepot-1].positionY,tabDepot[idDepot-1].ville_depot);
                $(this).find("Client").each(function()
                {
                    var id = parseInt($(this).find("Id").text())-1;
									
					tabClient[id].ordre=$(this).find("Order").text();
                    tournees[cptTrip].ajouterClient(tabClient[id]);
                    i++;
                });
                cptTrip++;
            });

        });
    });

    recap.innerHTML=tournees[0].afficherTournee()+"<br/>"+tournees[0].afficherClientsTournee();
    for(var i=0;i<tournees.length;i++)
    {
        select.innerHTML+="<option value="+i+"> Tournée n° "+(i+1)+"</option>";
    }

    $("#select").change(function()
    {
        var t =tournees[$(this).val()];
        recap.innerHTML=t.afficherTournee()+"<br/>"+t.afficherClientsTournee();
        afficheMap(tournees[$(this).val()]);
    });

    afficheMap(tournees[0]);
}

function afficheMap(t)
{
    // Initialisation de la Map + Paramètres (Zoom,...)
    var mapOptions = { zoom: 6, center: new google.maps.LatLng(47.0810120000,2.3987820000)};
    var map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);

    // On place la ville de Paris
    var ville= [];
    var marker = [];

    // On place le dépot en premier point de rendez-vous
    //ville[0]=new google.maps.LatLng(t.depotY,t.depotX);
       

  var i;
   for(i=0 ;i<t.nbClients()-1;i++)
   {
        ville[i]={
            location: new google.maps.LatLng(t.getClient(i+1).positionY,t.getClient(i+1).positionX),
            stopover:true
        }

        marker[i] = new google.maps.Marker({
            position:new google.maps.LatLng(t.getClient(i+1).positionY,t.getClient(i+1).positionX),
            map: map,
            title:"étape "+(i+1),
            icon:'./images/marker_base.png'
        });

        google.maps.event.addListener( marker[i], "click", (function(marker,i)
        {
            return function()
            {
                new google.maps.InfoWindow({content: "<h1>etape "+(i+1)+"</h1>"+t.getClient(i+1).afficherClient()}).open(map, marker);
            }
        })(marker[i],i));
    }

    marker[i] = new google.maps.Marker({
            position:new google.maps.LatLng(t.depotY,t.depotX),
            map: map,
            title:"depot",
            icon:'./images/marker_depot.png'
        });

        google.maps.event.addListener( marker[i], "click",(function(marker,i)
        {
            return function()
            {
                new google.maps.InfoWindow({content: "Depot <br\> ville du dêpots : "+t.nom_depot}).open(map, marker);
            }
        })(marker[i],i));
       
	var listeVille = [];	
	
	listeVille[0]=[];
	//listeVille[0][0]=new google.maps.LatLng(t.depotY,t.depotX);
	
	var cptwaypoints=0;
	var cptListeVille=-1;// ++ juste apres
	
	for(var cpt=0; cpt < ville.length;cpt++)
	{
		if(cptwaypoints == 0)
		{
			cptListeVille++;
			listeVille[cptListeVille]=[];
		}
		//console.log(cptListeVille,cptwaypoints,cpt,listeVille);
		
		listeVille[cptListeVille][cptwaypoints]=ville[cpt];	
		
		if(cptwaypoints == 7)
			cptwaypoints =0;
		else
			cptwaypoints++;
		
		
		
	}
	
	var service;
	var display;
	var origin;
	var destination;
	var waypoints;
	
    for(var cpt = 0; cpt< listeVille.length;cpt++)
    {
		service = new google.maps.DirectionsService();
		display = new google.maps.DirectionsRenderer({'map': map});
		
		
		if(cpt == 0)
			origin = new google.maps.LatLng(t.depotY,t.depotX);
		else
		{
			origin = listeVille[cpt-1][listeVille[cpt-1].length-1].location;
		}
		
		if(cpt == listeVille.length-1)
		{
			destination = new google.maps.LatLng(t.depotY,t.depotX);
			waypoints=listeVille[cpt];
		}
		else
		{
			waypoints=[];
			
			for(var i =0; i < listeVille[cpt].length-1;i++)
			{
				waypoints[i]=listeVille[cpt][i];
			}
			
			destination = listeVille[cpt][listeVille[cpt].length-1].location;
		}		
		
		itineraire(service,display,origin,listeVille[cpt],destination);
	}
    // On place le dépot en premier point de rendez-vous
    //ville[i]=new google.maps.LatLng(t.depotY,t.depotX);


    //On créer les trajets

    
}

function itineraire(service,display,origin,waypoints,destination)
{
	var request = 
	{
		origin: origin,
		destination: destination,
		waypoints: waypoints,
		travelMode: google.maps.DirectionsTravelMode.DRIVING,
		unitSystem: google.maps.DirectionsUnitSystem.METRIC
	};
	service.route(request, function (response, status) 
	{
		if (status == google.maps.DirectionsStatus.OK) {
			display.setDirections(response);
			display.setOptions({'suppressMarkers':true});
		}
		else
		{
			alert(status);
		}
	});
}
// Lorsque la page est chargée, on initialise la map