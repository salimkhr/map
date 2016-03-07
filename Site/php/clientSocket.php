<?php
class clientSocket {
  private $sock;
 
   function clientSocket($host, $port) {
      if(!($this->sock = socket_create(AF_INET, SOCK_STREAM, 0)))
      {
          $errorcode = socket_last_error();
          $errormsg = socket_strerror($errorcode);
           
          die("Couldn't create socket: [$errorcode] $errormsg \n");
      }

      //echo "Socket created \n";
       
      if(!socket_connect($this->sock , $host , $port))
      {
          $errorcode = socket_last_error();
          $errormsg = socket_strerror($errorcode);
           
          die("Could not connect: [$errorcode] $errormsg \n");
      }
  }

  function envoiMessage($xml) {

      //echo "Connection established \n";

      $message = "VRP#".$xml;
       
      //Send the message to the server
      if( ! socket_send ( $this->sock , $message , strlen($message) , 0))
      {
          $errorcode = socket_last_error();
          $errormsg = socket_strerror($errorcode);
           
          die("Could not send data: [$errorcode] $errormsg \n");
      } 
      //echo "Message sent successfully \n";
  }

  function receptionMessage()
  {
      $xml = "";

      socket_recv($this->sock, $xml, 2048, MSG_WAITALL);

      $xml = substr($xml,0,strpos($xml,"</VRPXMLResponse>")+strlen("</VRPXMLResponse>"));

      socket_close($this->sock);
      return $xml;
  }

}

function genereXML($infos,$bdd) {

    $xml = "<VRPXMLQuery>";
    $xml .= "<ProblemData>";
    $xml .= "<Vehicles>";
    $vehiclesloop = false;
    $i = 1;
    while (!$vehiclesloop) {
      $xml .= "<Vehicle>";
      $xml .= "<Capacity>".$infos['VehicleCapacity'.$i]."</Capacity>";
      $xml .= "<Speed>".$infos['VehicleSpeed'.$i]."</Speed>";
      $xml .= "<FixCost>".$infos['VehicleFixCost'.$i]."</FixCost>";
      $xml .= "<VarCost>".$infos['VehicleVarCost'.$i]."</VarCost>";
      $xml .= "</Vehicle>";
      $i++;
      if (!(isset($infos['VehicleCapacity'.$i])) || $infos['VehicleCapacity'.$i] == "") {
        $vehiclesloop = true;
      }
    }
    $xml .= "</Vehicles>";
    $xml .= "<Depots>";
    $depotsloop = false;
    $i = 1;
    while (!$depotsloop) {
      $xml .= "<Depot>";
      $xml .= "<ID>".$i."</ID>";
      $xml .= "<Address>".$infos['DepotAdress'.$i]."</Address>";
      $coor=$bdd->getLatLngByAdress($infos['DepotAdress'.$i]);
      $xml .= "<X>".$coor['longitude']."</X>";
      $xml .= "<Y>".$coor['latitude']."</Y>";
      $xml .= "</Depot>";
      $i++;
      if (!(isset($infos['DepotAdress'.$i])) || $infos['DepotAdress'.$i] == "") {
        $depotsloop = true;
      }
    }
    $xml .= "</Depots>";
    $xml .= "<Clients>";
    $clientsloop = false;
    $i = 1;
    while (!$clientsloop) {
      $xml .= "<Client>";
      $xml .= "<ID>".$i."</ID>";
      $xml .= "<Address>".$infos['ClientAdress'.$i]."</Address>";
      $coor=$bdd->getLatLngByAdress($infos['ClientAdress'.$i]);
      $xml .= "<X>".$coor['longitude']."</X>";
      $xml .= "<Y>".$coor['latitude']."</Y>";
      $xml .= "<Demand>".$infos['ClientDemand'.$i]."</Demand>";
      $xml .= "<TimeWindowMin>".$infos['ClientTimeWindowMin'.$i]."</TimeWindowMin>";
      $xml .= "<TimeWindowMax>".$infos['ClientTimeWindowMax'.$i]."</TimeWindowMax>";
      $xml .= "</Client>";
      $i++;
      if (!(isset($infos['ClientAdress'.$i])) || $infos['ClientAdress'.$i] == "") {
        $clientsloop = true;
      }
    }
    $xml .= "</Clients>";
    $xml .= "<Constraints>";
    $xml .= "<MaxTripDuration>".$infos['MaxTripDuration']."</MaxTripDuration>";
    $xml .= "<MaxTripWithoutRestDuration>".$infos['MaxTripWithoutRestDuration']."</MaxTripWithoutRestDuration>";
    $xml .= "</Constraints>";
    $xml .= "</ProblemData>";
    $xml .= "</VRPXMLQuery>";
    return $xml;
  }

  

?>