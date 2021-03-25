2012/maj/SI, IR Kolokvijum 2 - Maj 2012 - Resenja.pdf
--------------------------------------------------------------------------------


1/1 
Drugi kolokvijum iz Operativnih sistema 1 
Maj 2012. 
1. (10 poena) 
shared var 
  a, b : integer := 0; 
  sa, sb : boolean := 0; 
 
process a;                  process b; 
begin                   begin 
  loop                    loop 
    compute_a(b);                     while (sa==0) do null; sa:=0; 
    sa:=1;                           compute_b(a); 
    while (sb==0) do null; sb:=0;          sb:=1; 
  end;                    end; 
end;                   end; 
2. (10 poena) 
void insert (Record** head, Record* e) { 
  do { 
    Record* oldHead = *head; 
    Record* newHead = oldHead; 
    e->next = newHead; 
    newHead = e; 
  } while (cmpxchg(head,oldHead,newHead)==0); 
} 
3. (10 poena) 
Dovoljno je, na primer, da se samo jedna vrsta (i) matrice A smesti u jedan preklop. U drugi 
preklop smeštena je jedna kolona (j) matrice B. Tako se iz njih može izračunati C[i,j]. Ako se 
u unutrašnjoj petlji varira j (j:=1..n), u jednoj iteraciji spoljašnje petlje dobija se jedna vrsta i 
matrice C. Ova vrsta je u svom, trećem preklopu. U narednoj iteraciji spoljašnje petlje po i, u 
prvi preklop biće učitana nova vrsta matrice A, u drugom preklopu biće učitavana jedna po 
jedna  kolona (j:=1..n) matrice  B u unutrašnjoj petlji, a u trećem preklopu biće izračunavana 
nova vrsta matrice C. 
4. (10 poena) 
a)(3) VA(64): Page1(26):Page2(26):Offset(12). 
PA(42): Frame(30):Offset(12). 
b)(3) Širina PMT2 je 30+2=32 bita. Ista je i širina PMT1. 
 PMT1 ima 2
26
 ulaza širine 32 bita (4B), što je ukupno: 2
28
B=256MB. 
c)(4) Ovaj proces koristio je 2
39
 svojih najnižih adresa, što je 2
39-12
=2
27
 stranica. Jedna PMT 
drugog nivoa pokriva 2
26
 stranica, pa je ovaj proces alocirao PMT prvog nivoa i dve PMT 
drugog nivoa. Zato ukupna veličina PMT iznosi: 3256MB=768MB. 