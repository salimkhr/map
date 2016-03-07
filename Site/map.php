<?php
	include("config.php");
	include("php/clientSocket.php");
	include("php/bdd.php");
	
	$bdd = new Bdd($host_db,$name_db,$login_db,$mdp_db);
	$sock = new clientSocket($host_serv,$port_serv);
	
	$xmlEnvoi = genereXML($_POST,$bdd);
	$sock->envoiMessage($xmlEnvoi);
	
	$xmlReponse = $sock->receptionMessage();
?>
<!DOCTYPE html>
<html>

    <!-- En-Tete de la page -->
    <head>
        <meta charset="utf-8">
        <!-- Titre -->
        <title>VRP Application</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- CSS (liens) -->
        <link rel="stylesheet" href="./css/css_complet.css" type="text/css" media="screen" />
        <!-- Icones de navigateur -->
        <link rel="icon" type="image/png" href="./images/icone_bleue.png"/>
        <!-- Mise en place des Scripts (Objets,API Google Map,jQuery) -->
        <script type='text/javascript' src='./js/Objets.js'></script>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true"></script>
        <script src="js/jquery-2.1.3.min.js"></script>
        <script src="js/fonctions.js"></script>

    </head>
    <!-- Corps de la page -->
    <body>
      <section>
        <article id="info_tournee">
          <select id="select"></select>
          <p id="recap"><p>
        </article>
        <article id="map_canvas"></article>
      </section>
      <script>
          var xml=<?php echo '"'.$xmlReponse.'"'; ?>;
          var xmlEnv=<?php echo '"'.$xmlEnvoi.'"'; ?>;
          initialize();
      </script>
    </body>
</html>

	
		
		 