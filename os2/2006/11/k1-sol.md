2006/novembar/SI Kolokvijum 1 - Novembar 2006 - Resenja.doc
--------------------------------------------------------------------------------


1/  3 
Rešenja prvog kolokvijuma iz Operativnih sistema 2 
Novembar 2006. 
1. (10 poena) 
a) P1, P2, P3, P1, P2, P3, P1, P4, P2, P4, P2 
b) P3, P3, P1, P1, P1, P4, P4, P2, P2, P2, P2 
2. (10 poena) 
monitor server; 
export acquireToken, returnToken; 
 
var numOfTokens : integer; 
    tokenAvailable : condition; 
 
procedure acquireToken (); 
begin 
  if (numOfTokens<=0) tokenAvailable.wait; 
  numOfTokens := numOfTokens - 1; 
end; 
 
procedure returnToken (); 
begin 
  numOfTokens := numOfTokens + 1; 
  tokenAvailable.signal; 
end; 
 
begin 
  numOfTokens := N; 
end; (* server *) 
 
 
task type client; 
begin 
  loop 
    server.acquireToken; 
    do_some_activity; 
    server.returnToken; 
  end; 
end; (* client *) 
3. (10 poena) 
public class CoderProxy extends Usluga { 
 
 public CoderProxy (String host, int port){ 
  super(host, port); 
 } 
  
 public String code(String op1, String op2){ 
  String message = "#code1#" + op1 +  
"#" + op2 + "#"; 
  sendMessage(message); 
   
  return receiveMessage();   
 } 
 

2/  3 
 public String code(String op){ 
  String message = "#code2#" + op + "#"; 
  sendMessage(message); 
   
  return receiveMessage();   
 } 
} 
 
public class RequestHandler extends Thread{ 
protected Coder coder; 
... 
public RequestHandler(...,Coder k){ 
 ... 
coder = k; 
} 
protected void processRequest(String request){ 
 StringTokenizer tokenizer = new StringTokenizer(request, "#"); 
 String functionName = tokenizer.next(); 
 ... 
  } else if (functionName.equals("code1")){ 
   String op1 = tokenizer.next(); 
   String op2 = tokenizer.next(); 
   String result = coder.code(op1,op2); 
   sendMessage(result); 
  } else if (functionName.equals("code2")){ 
   String op = tokenizer.next(); 
   String rezultat = coder.code(op); 
   sendMessage(result); 
  } 
 
 } 
 ... 
}
 
4. (10 poena) 
var forks : array [0..4  ] of semaphore = 1; 
 
task type Philosopher(i:int) 
var left, right : 0..4  ; 
begin 
  left := i; right:=(i+1) mod 5; 
  loop 
    think; 
    forks[left].wait; 
    while not forks[right].waitNonBlocking do 
      begin 
        forks[left].signal; 
        forks[left].wait; 
      end; 
    eat; 
    forks[left].signal; 
    forks[right].signal; 
  end; 
end; 
5. (10 poena) 
a)(5) Jeste, jer postoji sigurna sekvenca (po bankarevom algoritmu): P
5
, P
4
, P
2
, P
3
, P
1
, P
0
, P
6
. 

3/  3 
b)(5) Ne  treba,  jer  bi  tada  sistem  ušao  u  nebezbedno  stanje,  za  koje  ne  bi  postojala  sigurna  
sekvenca (trivijalno, pošto nema slobodnih resursa, a svi procesi drže zauzeto manje od svoje 
maksimalne potražnje). 