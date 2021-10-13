2018/novembar/SI Kolokvijum 1 - Novembar 2018 - Resenja.pdf
--------------------------------------------------------------------------------
schedule
HP5, MP3, HP3, MP1, HP1, HP7, MP5, LP1, MP3 

--------------------------------------------------------------------------------
sharedobj
```ada
monitor TickTuck; 
export tick, tuck; 
 
  var 
    bTick : boolean; 
    iTucks: integer; 
    canTick, canTuck : condition; 
 
procedure tick; 
begin 
  if not bTick then canTick.wait; 
  (* do tick *) 
  bTick := false; 
  iTucks := 2; 
  canTuck.signal;   
end; 
 
procedure tuck; 
begin 
  if iTucks=0 then canTuck.wait; 
  (* do tuck *) 
  iTucks := iTucks – 1; 
  if iTucks=0 then begin 
    bTick := true; 
    canTick.signal; 
  else 
    canTuck.signal; 
  end; 
end; 
 
begin 
  bTick := true; 
  iTucks := 0; 
end;
```

--------------------------------------------------------------------------------
network
```java
public class Server { 
 private static final int N = 10; 
 private static final int PORT = 5555; 
 private List<Service> clients = new ArrayList<Service>(); 
 private int activeClients = 0; 
  
 public void work() throws IOException { 
  ServerSocket server = new ServerSocket(PORT); 
   
  while (true) { 
   Socket socket = server.accept(); 
   Service client = new Service(socket); 
    
   addClient(client); 
  } 
 } 

public synchronized void addClient(Service client) throws IOException { 
  if (activeClients < N) { 
   activeClients++; 
   client.sendMessage("Go"); 
   new RequestHandler(this, client).start(); 
  } else { 
   client.sendMessage("WaitInQueue#" + clients.size()); 
   clients.add(client); 
  } 
 } 
  
 public synchronized void finishClient() { 
  if (clients.size() > 0) { 
   Service client = clients.remove(0); 
   client.sendMessage("Continue"); 
   new RequestHandler(this, client).start(); 
  } else { 
   activeClients--; 
  } 
 } 
} 
 
public class RequestHandler extends Thread { 
 private Service client; 
 private Server server; 
 
 public RequestHandler(Server server, Service client) { 
  this.server = server; 
  this.client = client; 
 } 
  
 public void run() { 
  // The work goes here 
   
  server.finishClient(); 
 } 
} 
```
Klasa `Service` (Usluga) data je na vežbama. 
