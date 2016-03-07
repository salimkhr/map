package serveur;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;
import java.io.PrintWriter;

public class Serveur {
	
	public static void main(String[] zero) {
		
		while(true)
		{
			ServerSocket socketserver  ;
			Socket socket ;
			InputStream in;
			PrintWriter out;
			
			try {
			
				socketserver = new ServerSocket(61234);
				System.out.println("Le serveur est à l'écoute du port "+socketserver.getLocalPort());
				socket = socketserver.accept(); 
			        System.out.println("nouvelle connection");
			        
			        in = socket.getInputStream();
			        
			        String s=(char)in.read()+"";
			        while(in.available()!=0)
			        {
			        	
			        	s+=(char)in.read();
			        	System.out.println();
			        }
			        s=s.substring(4);
			        System.out.println("recu :"+s);
			        Traitement t = new Traitement(s);
			        out = new PrintWriter(socket.getOutputStream());
			        System.out.println("envoi :"+t.getReponse());
			        out.println(t.getReponse());
			        out.flush();
			                
			        socket.close();
			        socketserver.close();
			        
			}catch (IOException e) {
				
				e.printStackTrace();
			}
		}
		
	}

}