2009/novembar/SI Kolokvijum 1 - Oktobar 2009 - Resenja.doc
--------------------------------------------------------------------------------
schedule

\begin{center}
\begin{tabular}{|c|c|c|c|c|c|c|c|c|c|}
\hline
6 & 8 & 10 & 2 & 10 & 2 & 10 & 8 & 8 & 8 \\
\hline
4 & 5 & 6 & 8 & 5 & 7 & 4 & 7 & 7 & 7 \\
\hline
\end{tabular}
\end{center}

--------------------------------------------------------------------------------
sharedobj
```ada
monitor Agent; 
  export takeSaltAndPepper, 
         putSaltAndPepper, 
         takePepperAndKetchup, 
         putPepperAndKetchup, 
         takeKetchupAndSalt, 
         putKetchupAndSalt; 
  var 
    saltAvailable : boolean; 
    pepperAvailable : boolean; 
    ketchupAvailable : boolean; 
    waitSaltAndPepper : condition; 
    waitPepperAndKetchup : condition; 
    waitKetchupAndSalt : condition; 
  
  procedure takeSaltAndPepper (); 
  begin 
    while not (saltAvailable and pepperAvailable) do 
      wait(waitSaltAndPepper); 
    saltAvailable := false; 
    pepperAvailable := false; 
  end; 
 
  procedure putSaltAndPepper (); 
  begin 
    saltAvailable := true; 
    pepperAvailable := true; 
    signal(waitPepperAndKetchup); 
    signal(waitKetchupAndSalt); 
  end; 
 
  -- etc. 
 
begin 
  saltAvailable:=true; 
  pepperAvailable:=true; 
  ketchupAvailable:=true; 
end; 
 
 
process PhilisopherThatLikesSaltAndPepper; 
begin 
  loop 
    think; 
    Agent.takeSaltAndPepper(); 
    spiceItUp; 
    Agent.putSaltAndPepper(); 
    eat; 
  end 
end; 
```

--------------------------------------------------------------------------------
network
```java
//Beleznica
public class Beleznica { 
    private int redni_broj; 
    private int opsluzuje_se; 
    private int vozAB; 
    private int vozBA; 
 
    public Beleznica(){ 
        redni_broj = 0; 
        opsluzuje_se = 0; 
        vozAB = 0; 
        vozBA = 0; 
    } 
    public void kreniAB(){ 
        vozAB++; 
        opsluzuje_se++; 
    } 
     
    public boolean stigaoAB(){ 
        return --vozAB == 0; 
    } 
     
    public boolean zauzetaAB(){ 
        return vozAB>0; 
    } 
     
    public void kreniBA(){ 
        vozBA++; 
        opsluzuje_se++; 
    } 
     
    public boolean stigaoBA(){ 
        return --vozBA == 0; 
    } 
     
    public boolean zauzetaBA(){ 
        return vozBA>0; 
    } 
     
    public int uzmi_redni_broj(){ 
        return redni_broj++; 
    } 
     
    public boolean dosao_na_red(int i){ 
        return i == opsluzuje_se; 
    } 
} 
 
//Server_voz 
public class Server_voz extends Thread { 
    private Socket s; 
 
    public Server_voz(Socket soc) { 
        s = soc; 
    }     
 
    public void run(){ 
    BufferedReader r = null; 
    BufferedWriter w = null; 
        try { 
            r = new BufferedReader(new InputStreamReader(s.getInputStream())); 
            w = new BufferedWriter(new OutputStreamWriter(s.getOutputStream())); 
            String poruka = r.readLine(); 
            if (r.equals("startA")){ 
                synchronized(Dispecer.beleznica){ 
                    int redni_broj = Dispecer.beleznica.uzmi_redni_broj(); 
                    while(!Dispecer.beleznica.dosao_na_red(redni_broj) && Dispecer.beleznica.zauzetaBA()){ 
                        o.wait(); 
                    } 
                    Dispecer.beleznica.kreniAB(); 
                    Dispecer.beleznica.notifyAll(); 
                } 
                w.write("kreni"); 
                w.flush(); 
                poruka = r.readLine(); 
                synchronized(Dispecer.beleznica){ 
                    if (Dispecer.beleznica.stigaoAB() ){ 
                        Dispecer.beleznica.notifyAll(); 
                    } 
                } 
            }else if (r.equals("startB")){ 
                //analogno prethodnom, AB zameniti sa BA, BA zameniti sa AB 
            }else{ 
                //greska 
            } 
            r.close(); 
            w.close(); 
            s.close(); 
        } catch (Exception ex) { 
            ex.printStackTrace(); 
            try { 
                r.close(); 
                w.close(); 
                s.close(); 
            } catch (IOException e) { 
                e.printStackTrace(); 
            } 
        } 
    } 
} 
//Dispecer 
public class Dispecer { 
    public Dispecer() { 
    } 
 
    public static Beleznica beleznica = new Beleznica(); 
     
    private static ServerSocket s; 
    public static void main(String[] args) { 
        try { 
            s = new ServerSocket(1050); 
            while(true){ 
                Socket cs = s.accept(); 
                Server_voz w = new Server_voz(cs); 
                w.start(); 
            } 
        } catch (IOException ex) { 
            ex.printStackTrace(); 
            try { 
                s.close(); 
            } catch (IOException e) { 
                e.printStackTrace(); 
            } 
        } 
    } 
} 
//masinovodja koji krece iz mesta A 
salje poruku "startA" 
ceka da primi poruku "kreni" 
//putuje 
salje poruku "stigao" 
```

--------------------------------------------------------------------------------
deadlock
P2 - R3 - Da, P3-R1-Da (prelaz u bezbedno stanje), P3-R2-Ne (već zauzet), P3-R3-Ne (prelaz u nebezbedno stanje), P4-R3-Da (prelaz u bezbedno stanje). 

--------------------------------------------------------------------------------
allocator
Na primer, puštati naizmenično jednog pisca pa jednog ili nekoliko čitalaca u slučaju da postoje i jedni i drugi koji čekaju, ali ne insistirati na naizmeničnosti ukoliko ne postoje oni koji čekaju. 
