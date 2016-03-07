package serveur;

import java.io.ByteArrayInputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

public class Traitement {
	
	private String reponse;
	
	public Traitement(String xml)
	{
		try
		{
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(new InputSource(new ByteArrayInputStream(xml.getBytes("utf-8"))));
			NodeList listClient = doc.getDocumentElement().getFirstChild().getChildNodes();
			
			int nbVehicles = listClient.item(0).getChildNodes().getLength();
			int nbDepots = listClient.item(1).getChildNodes().getLength();
			int nbClients = listClient.item(2).getChildNodes().getLength();
	
			
			reponse="<VRPXMLResponse><Solution><General><Status>ok</Status><TotalCost>5000</TotalCost></General><Trips>";
			reponse+="<Trip><Cost>1000</Cost><Duration>12</Duration><TotalCharge>10</TotalCharge><Depot><ID>1</ID></Depot>";
			for(int  j = 0;j<nbClients;j++)
			{
				reponse+="<Client><Id>"+(j+1)+"</Id><Order>"+(j+1)+"</Order></Client>";
			}
			reponse+="</Trip>";
			reponse+="<Trip><Cost>1000</Cost><Duration>12</Duration><TotalCharge>10</TotalCharge><Depot><Id>"+(nbDepots)+"</Id></Depot>";
			for(int  j = 0;j<nbClients-1;j++)
			{
				reponse+="<Client><Id>"+(j+1)+"</Id><Order>"+(nbClients-j-1)+"</Order></Client>";
			}
			reponse+="</Trip>";
			reponse +="</Trips></Solution></VRPXMLResponse>";
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
	public static void main(String args[])
	{
		Traitement t = new Traitement("<VRPXMLQuery><ProblemData><Vehicles><Vehicle><Capacity>1000</Capacity><Speed>90</Speed><FixCost>300</FixCost><VarCost>50</VarCost>"
				+ "</Vehicle></Vehicles><Depots><Depot><ID>1</ID><Adress>Le Havre</Adress><X></X><Y></Y></Depot></Depots><Clients>"
				+ "<Client><ID>1</ID><Adress>Rouen</Adress><X></X><Y></Y><Demand>2000</Demand><TimeWindowMin>07:00</TimeWindowMin><TimeWindowMax>18:00</TimeWindowMax></Client>"
				+ "<Client><ID>2</ID><Adress>Paris</Adress><X></X><Y></Y><Demand>2000</Demand><TimeWindowMin>07:00</TimeWindowMin><TimeWindowMax>18:00</TimeWindowMax></Client>"
				+ "<Client><ID>3</ID><Adress>Le Havre</Adress><X></X><Y></Y><Demand>2000</Demand><TimeWindowMin>07:00</TimeWindowMin><TimeWindowMax>18:00</TimeWindowMax></Client>"
				+ "</Clients><Constraints><MaxTripDuration>8</MaxTripDuration><MaxTripWithoutRestDuration>5</MaxTripWithoutRestDuration></Constraints></ProblemData></VRPXMLQuery>");
		System.out.println(t.getReponse());
	}

	public String getReponse() {
		return reponse;
		
	}
}
