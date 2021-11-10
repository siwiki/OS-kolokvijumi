2006/novembar/SI Kolokvijum 1 - Novembar 2006 - Resenja.doc
--------------------------------------------------------------------------------
schedule

1. P1, P2, P3, P1, P2, P3, P1, P4, P2, P4, P2 
2. P3, P3, P1, P1, P1, P4, P4, P2, P2, P2, P2 

--------------------------------------------------------------------------------
sharedobj
```ada
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
```

--------------------------------------------------------------------------------
network
```java
public class CoderProxy extends Usluga { 
 public CoderProxy (String host, int port){ 
  super(host, port); 
 } 
 public String code(String op1, String op2){ 
  String message = "#code1#" + op1 +  "#" + op2 + "#"; 
  sendMessage(message); 
   
  return receiveMessage();   
 } 
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
```

--------------------------------------------------------------------------------
deadlock
```ada
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
```

--------------------------------------------------------------------------------
deadlock

1. Jeste, jer postoji sigurna sekvenca (po bankarevom algoritmu): $P_5$, $P_4$, $P_2$, $P_3$, $P_1$, $P_0$, $P_6$. 
2. Ne  treba,  jer  bi  tada  sistem  ušao  u  nebezbedno  stanje,  za  koje  ne  bi  postojala  sigurna  sekvenca (trivijalno, pošto nema slobodnih resursa, a svi procesi drže zauzeto manje od svoje maksimalne potražnje). 
