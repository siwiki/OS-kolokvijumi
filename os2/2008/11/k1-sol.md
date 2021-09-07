--------------------------------------------------------------------------------


1/  3 
Rešenja prvog kolokvijuma iz Operativnih sistema 2 
Novembar 2008. 
1. (10 poena)  Odgovor: HP, MP, LP, HP, MP, HP, MP, LP, HP, HP, MP 
2. (10 poena) 
monitor forksAgent; 
  exports takeForks, releaseForks; 
 
  var forks : array[PhilosopherID] of 0..2; 
      barriers : array[PhilosopherID] of condition; 
 
  procedure takeForks (id : PhilosopherID); 
  var left, right : PhilospherID; 
  begin 
    if id==0 then left:=4 else left:=id-1; 
    if id==4 then right:=0 else right:=id+1; 
    if forks[id]  <2 then  
 barriers[id].wait; 
    end if 
    forks[id]:=0; 
    forks[left]:=forks[left]-1; 
    forks[right]:=forks[right]-1; 
  end; 
 
  procedure releaseForks (id : PhilosopherID); 
  var left, right : PhilospherID; 
  begin 
    if id==0 then left:=4 else left:=id-1; 
    if id==4 then right:=0 else right:=id+1; 
    forks[id]:=2; 
    forks[left]:=forks[left]+1; 
    forks[right]:=forks[right]+1; 
    if forks[left]==2 barriers[left].signal; 
    if forks[right]==2 barriers[right].signal; 
  end; 
 
begin 
  var i : PhilosopherID; 
  for i:=0 to 4 do forks[i]:=2; 
end; 
3. (10 poena) 

2/  3 
import java.net.*; 
import java.io.*; 
 
public class MainServer { 
  private final static int port0 = 1050; 
   
  public static void main (String[] args) { 
    try { 
      ServerSocket sock = new ServerSocket(port0); 
      while (true) { 
        Socket client = sock.accept(); 
        PrintWriter pout = new PrintWriter(client.getOutputStream(),true); 
        BufferedReader pin = new BufferedReader(new InputStreamReader( 
                                             sock.getInputStream())); 
        pout.println(“ack“); 
        while (!pin.readLine().equals(“ping“)) pout.println(“repeat“); 
        pout.println(“ok“); 
        pin.close; 
        pout.close(); 
        client.close(); 
      } 
    } 
    catch (Exception e) { 
      System.err.println(e); 
    } 
  }   
} 
Napomena:  Dato  rešenje  nije  najefikasnije  i  ima  mana,  ali  odgovara  postavci  
zadatka. 
4. (10 poena) 
Postoji  problem potencijalnog izgladnjivanja  (starvation)  koji  nastaje  kada  neki  proces  mora  
neograničeno da ponavlja navedeni postupak, pošto se uvek dešava da neki drugi proces učita 
istu  vrednost,  ali  neposredno  pre  posmatranog  procesa  izmeni  deljeni  podatak,  posmatrani 
proces se povuče i prilikom ponovnog pokušaja dogodi se isto. 
Treba primetiti da problem žive blokade (livelock)  ne  postoji,  pošto  od  više  procesa  koji  
pročitaju istu početnu vrednost, uvek će jedan, zbog sekvencijalnosti (odnosno atomičnosti) 
operacije  provere  i  upisa  nove  vrednosti,   uspešno  završiti  postupak (prvi koji  je  ušao  u  tu  
operaciju, pošto zatiče pročitanu vrednost), dok će ga ostali ponoviti. 
5. (10 poena) 
Ako bi sistem dozvolio zauzeće traženih resursa, prešao bi u stanje: 
 Allocation Max Available 
 A B C A B C A B C 
P
1
 1 1 2 1 2 4 3 3 2 
P
2
 1 3 2 5 4 3 
P
3
 0 2 1 3 7 5 
P
4
 0 2 0 0 5 3 
Treba ispitati da li je ovo stanje sigurno pronalaženjem sigurne sekvence: 
P
1
, 
 Allocation Max Available 
 A B C A B C A B C 
       4 4 4 

3/  3 
P
2
 1 3 2 5 4 3 
P
3
 0 2 1 3 7 5 
P
4
 0 2 0 0 5 3 
P
1
, P
4
,  
 Allocation Max Available 
 A B C A B C A B C 
       4 6 4 
P
2
 1 3 2 5 4 3 
P
3
 0 2 1 3 7 5 
       
P
1
, P
4
, P
3
, 
 Allocation Max Available 
 A B C A B C A B C 
       4 8 5 
P
2
 1 3 2 5 4 3 
       
       
P
1
, P
4
, P
3
, P
2
 
Pošto je sigurna sekvenca pronađena, odredišno stanje je sigurno, pa sistem može da dozvoli 
traženo zauzeće resursa. 