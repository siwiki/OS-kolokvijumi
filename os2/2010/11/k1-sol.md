2010/novembar/SI Kolokvijum 1 - Oktobar 2010 - Resenja.doc
--------------------------------------------------------------------------------
schedule

\begin{figure}[H]
\centering
\begin{tabular}{|c|c|c|c|}
\hline
Proces & Trenutak prvog izvršavanja & Trenutak završetka & Vreme odziva \\
\hline
A & 2 & 4 & 2 \\
\hline
B & 4 & 6 & 3 \\
\hline
C & 0 & 8 & 8 \\
\hline
D & 8 & 9 & 8 \\
\hline
\multicolumn{4}{|c|}{Srednje vreme odziva: 5.25} \\
\hline
\end{tabular}
\caption{Rešenje stavke pod a.}
\end{figure}

\begin{figure}[H]
\centering
\begin{tabular}{|c|c|c|c|}
\hline
Proces & Trenutak prvog izvršavanja & Trenutak završetka & Vreme odziva \\
\hline
A & 2 & 4 & 2 \\
\hline
B & 4 & 6 & 3 \\
\hline
C & 0 & 9 & 9 \\
\hline
D & 1 & 2 & 1 \\
\hline
\multicolumn{4}{|c|}{Srednje vreme odziva: 3.75} \\
\hline
\end{tabular}
\caption{Rešenje stavke pod b.}
\end{figure}

--------------------------------------------------------------------------------
sharedobj
```ada
monitor buffer; 
  export append, take; 
  var 
    buf : array[0..size-1] of integer; 
    top, base : 0..size-1;  
    numberInBuffer : integer; 
 
  procedure append (i : integer); 
  begin 
    while numberInBuffer = size do 
      wait(); 
    end while; 
    buf[top] := i; 
    numberInBuffer := numberInBuffer+1; 
    top := (top+1) mod size; 
    notifyAll(); 
  end append; 
 
  procedure take (var i : integer); 
  begin 
    while numberInBuffer = 0 do 
      wait(); 
    end while; 
    i := buf[base]; 
    base := (base+1) mod size; 
    numberInBuffer := numberInBuffer-1; 
    notifyAll(); 
  end take; 
 
begin (* Initialization *) 
  numberInBuffer := 0; 
  top := 0; base := 0 
end;  
```

--------------------------------------------------------------------------------
network
```java
public class Main { 
    public Main() { 
    } 
     
    public static void main(String[] args) { 
        ServerSocket ss; 
        try{ 
            ss = new ServerSocket(5000); 
            while(true){ 
                Socket s = ss.accept(); 
                (new RequestHandler(s)).start(); 
            } 
        }catch(Exception e){ 
            //greska 
        } 
    } 
} 
 
public class RequestHandler extends Thread { 
    private PrintWriter out; 
    private BufferedReader in; 
    private Socket s; 
     
    public RequestHandler(Socket s) { 
        this.s = s; 
        try { 
            out = new PrintWriter(s.getOutputStream(),true); 
            in = new BufferedReader(new InputStreamReader(s.getInputStream())); 
        } catch (Exception e) { 
            //greska 
        } 
    } 
     
    public void run(){ 
        try { 
            while(!s.isInputShutdown()){ 
                String s = in.readLine(); 
                System.out.println(s); 
                if (s.equals("#fetch_and_increment#")){ 
                    int i = fetch_and_increment(); 
                    out.println(i); 
                } 
            } 
        }catch(Exception e){ 
            //greska 
        } 
    } 
     
    private static int deljena_promenljiva = 0; 
    private static Semaphore mutex = new Semaphore(1); 
    private static int fetch_and_increment() { 
        int i; 
        try { 
            mutex.acquire(); 
        } catch (InterruptedException ex) { 
            ex.printStackTrace(); 
            return -1; 
        } 
        i = deljena_promenljiva++; 
        mutex.release(); 
        return i; 
    } 
     
}
```
Klijent: 
```java
public class fetch_and_increment { 
    Socket s; 
    PrintWriter out; 
    BufferedReader in; 
     
    public fetch_and_increment(String host, int port) { 
        try { 
            s = new Socket(host,port); 
            out = new PrintWriter(s.getOutputStream(),true); 
            in = new BufferedReader(new InputStreamReader(s.getInputStream())); 
        } catch (Exception e) { 
            //greska 
        } 
         
    } 
     
    public int fetch_and_increment1(){ 
        try{ 
            out.println("#fetch_and_increment#"); 
            return Integer.parseInt(in.readLine()); 
        }catch (Exception e){ 
            //greska 
        } 
        return -1; 
    } 
     
} 
```

--------------------------------------------------------------------------------
deadlock

\begin{figure}
\subfloat[]{\includesvg[width=0.25\textwidth]{images/os2/2010/k1-graf-a}}
\subfloat[]{\includesvg[width=0.25\textwidth]{images/os2/2010/k1-graf-b}}
\subfloat[]{\includesvg[width=0.25\textwidth]{images/os2/2010/k1-graf-c}}
\subfloat[]{\includesvg[width=0.25\textwidth]{images/os2/2010/k1-graf-d}}
\end{figure}

--------------------------------------------------------------------------------
deadlock

1. Dokaz kontradikcijom. Pretpostavimo da može nastati mrtva blokada, što znači da postoji  zatvoren  krug  procesa  $P_{i1}$, $P_{i2}$,  ...,  $P_{in}$ ($n \geq 1$) koji su međusobno blokirani. Prema uslovima algoritma, odatle bi sledilo da je: $i_1 < i_2 < ... < i_n < i_1$, što ne može biti, pa mrtva blokada ne može nastati.
2. Prema uslovima algoritma, ako mlađi proces zatraži resurs koga drži neki stariji proces, mlađi   proces se poništava i pokreće ponovo. Kada se  poništeni  proces  ponovo  pokrene,  ako  bi  mu  se  dodelio  novi  ID  koji  odgovara  vremenu  njegovom  ponovnog pokretanja, on bi bio još mlađi u sistemu, pa bi trpeo još više poništavanja, što može dovesti do njegovog izgladnjivanja. Zato mu treba dodeliti isti ID koji je imao pri prvom pokretanju. Ako bi on bio dalje ponovo poništavan, vremenom bi taj proces postajao sve stariji i konačno postao najstariji, kada više neće doživeti poništavanje, odnosno neće trpeti izgladnjivanje. 
 