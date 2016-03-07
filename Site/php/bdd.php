	<?php
	class Bdd
	{
		private $pdo;

		function Bdd($host_db,$name_db,$login_db,$mdp_db)
		{	
			$this->pdo = new PDO('mysql:host='.$host_db.';dbname='.$name_db.';charset=utf8',$login_db,$mdp_db);
		}
	  
		function getAdressByLatLng($lat,$lng)
		{
			$req = $this->pdo->prepare('SELECT ville_nom FROM ville where latitude = ? and longitude = ?');
			$req->execute(array($lat,$lng));

			$res = $req->fetchAll();
			
			if(isset($res[0][0]))
				return $res[0][0];
			
			else
			{	
				$address = getAdressFromLatLng($lat,$lng);
				$this->insert($address,$lat,$lng);
				return $address;
			}
		}

		function getLatLngByAdress($address)
		{
			$req = $this->pdo->prepare('SELECT latitude , longitude FROM ville where ville_nom = ?');
			$req->execute(array($address));

			$res = $req->fetchAll();
		
			if(isset($res[0]))
				return $res[0];
			else
			{
				$coord = getLatLngFromAdress($address);
				$this->insert($address,$coord["latitude"],$coord["longitude"]);
				return $coord;
			}	
		}

		function insert($address,$lat,$lng)
		{
			$req = $this->pdo->prepare('Insert INTO ville (ville_nom,latitude,longitude) Values(?,?,?)');
			$req->execute(array($address,$lat,$lng));
		}
	}
	function getAdressFromLatLng($lat,$lng)
	{
		$coords=array();
		$base_url="http://maps.googleapis.com/maps/api/geocode/xml?";
		// ajouter &region=FR si ambiguité (lieu de la requete pris par défaut)
		$request_url = $base_url . "latlng=" . urlencode($lat).','.urlencode($lng).'&sensor=false';
		$xml = simplexml_load_file($request_url) or die("url not loading");
		$coords['status'] = $xml->status ;
		$coords['adress']=$xml->result->formatted_address;
		
		$deb=strpos ($coords['adress'],',')+8;// 8 code postale
		$fin=strrpos ($coords['adress'],',');
		
		$coords['adress'] = substr($coords['adress'],$deb,$fin-$deb);
		//var_dump(strrpos ($coords['adress'],',',));
		if($coords['status']=='OK')
		{
			return $coords['adress'];
		}
		else
			return null;
	}
  
	function getLatLngFromAdress($address)
	{
		$coords=array();
		$base_url="http://maps.googleapis.com/maps/api/geocode/xml?";
		// ajouter &region=FR si ambiguité (lieu de la requete pris par défaut)
		$request_url = $base_url . "address=" . urlencode($address).',france&sensor=false';
		$xml = simplexml_load_file($request_url) or die("url not loading");
		//print_r($xml);
		$coords['lat']=$coords['lon']='';
		$coords['status'] = $xml->status ;
		
		if($coords['status']=='OK')
		{
			$coords['latitude'] = $xml->result->geometry->location->lat ;
			$coords['longitude'] = $xml->result->geometry->location->lng ;
			return $coords;
		}
		else
			return null;
	}
?>