2007/novembar/SI Kolokvijum 1 - Novembar 2007 - Resenja.doc
--------------------------------------------------------------------------------
schedule

1. P2, P3, P2, P1, P3, P2, P4, P1, P3, P2, P4, P1, P3, P2, P3, P2, P3 
2. P2, P2, P1, P1, P1, P4, P4, P2, P2, P2, P2, P3, P3, P3, P3, P3, P3 

--------------------------------------------------------------------------------
sharedobj
```ada
monitor semaphore; 
export wait, signal; 
 
var value : integer; 
    queue : condition; 
 
procedure wait (); 
begin 
  if (value=0) queue.wait; 
  value := value - 1; 
end; 
 
procedure signal (); 
begin 
  value := value + 1; 
  queue.signal; 
end; 
 
begin 
  value := N; 
end; (* semaphore *) 
```

--------------------------------------------------------------------------------
network
```java
import java.net.*; 
import java.io.*; 
private class ChannelServer extends Thread { 
  private ServerSocket mySocket; 
  private int myPort; 
  public ChannelServer (int port) { 
    myPort = port; 
    mySocket = new ServerSocket(port); 
  }   
  public void run () { 
    try { 
      Socket client = mySocket.accept(); 
      PrintWriter pout = new PrintWriter(client.getOutputStream(),true); 
      pout.println("0"); 
      pout.close(); 
      client.close(); 
      MainServer.freePort(myPort); 
    } 
    catch (Exception e) { 
      System.err.println(e); 
    } 
  }   
} 
public class MainServer { 
  private final static int N = 10; 
  private final static int port0 = 1050; 
  private static bool[] allocatedPorts = new bool[N]; 
  private static int getFreePort () { 
    for (int i=0; i<N; i++) { 
      if (allocatedPorts[i]) continue; 
      allocatedPorts[i]=true; 
      return port0+i-1; 
    } 
    return 0; 
  }   
  public static void freePort (int i) { 
    i = i – port0 - 1; 
    if (i>=0 && i < N) 
      allocatedPorts[i]=false; 
  }   
  public static void main (String[] args) { 
    try { 
      ServerSocket sock = new ServerSocket(port0); 
      while (true) { 
        Socket client = sock.accept(); 
        int newPort = getFreePort(); 
        if (newPort > 0) 
          new ChannelServer(newPort).start(); 
        PrintWriter pout = new PrintWriter(client.getOutputStream(),true); 
        pout.println(new Integer(newPort).toString()); 
        pout.close(); 
        client.close(); 
      } 
    } 
    catch (Exception e) { 
      System.err.println(e); 
    } 
  }   
} 
```

--------------------------------------------------------------------------------
deadlock
Ne obezbeđuje živost, jer je moguće izgladnjivanje (*starvation*) procesa koji čeka na semaforu (odnosno na pristup deljenom resursu). Proces nižeg prioriteta koji čeka na pristup resursu može da bude pretican od strane procesa višeg prioriteta koji zahtevaju isti resurs i zato pre do resursa dolaze, pošto se u red čekanja na semaforu smeštaju ispred pa se i deblokiraju ranije. Na taj način proces nižeg prioriteta može neograničeno da čeka na pristup resursu. Drugim rečima, ovakav semafor ne obezbeđuje „poštenost“ (*fairness*). 

--------------------------------------------------------------------------------
deadlock

1. Graf je dat ispod.
2. Jeste, jer nema petlje u grafu, odnosno postoji sigurna sekvenca, npr. $P_3$, $P_2$, $P_1$. 
3. Treba, jer bi novonastalo stanje i dalje bilo bezbedno: ne postoji petlja u grafu, odnosno postoji sigurna sekvenca, npr. $P_2$, $P_3$, $P_1$. 

\begin{figure}[H]
    \centering
    \includesvg{images/os2/2007/k1-graf-resenje}
    \caption{Graf iz rešenja stavke pod a.}
\end{figure}
