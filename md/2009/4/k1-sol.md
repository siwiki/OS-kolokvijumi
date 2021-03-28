2009/april/SI Kolokvijum 1 - Mart 2009 - Resenja.doc
--------------------------------------------------------------------------------
os

1. Netačno.
2. Netačno.
3. Tačno.
4. Netačno.

--------------------------------------------------------------------------------
io

```cpp
void main () {
  int i12=0, i3=0;
  *ioCtrl1=1; *ioCtrl2=1; *ioCtrl3=1;  // Start
  while (i3<N) {
    if (i12<N && *ioStatus1&1) buf[i12++]=*ioData1;
    if (i12<N && *ioStatus2&1) buf[i12++]=*ioData2;
    if (i3<i12 && *ioStatus3&1) *ioData3=buf[i3++];
  }
  *ioCtrl1=0; *ioCtrl2=0;  *ioCtrl3=0; // Stop them all
}
```
--------------------------------------------------------------------------------
segment

\begin{center}
\begin{tabular}{|c|c|c|c|c|c|}
\hline
Virtuelna adresa & 80013A & EB28C32 & 3F80028D & 303001E2 & F0A001E4 \\
\hline
Rezultat adresiranja & PF & MAV & DC4 (28D+B37) & T & MAV  \\
\hline
\end{tabular}
\end{center}

--------------------------------------------------------------------------------
syscall

```cpp
#define saveAll ... //sve registre osim pc i sp čuva na vrhu steka
#define restoreAll ... //sve registre osim pc i sp restaurira sa steka
#define getSP ... //vraća vrednost sp registra
#define setSP(expr) ... //izračunava izraz i upisuje ga u registar sp
void copy(int* dst, int* src, int n); //kopira niz od n reči sa src
                                      //na dst
struct PCB {
  int* sp; // sačuvana vrednost sp registra
  ...     // NIJE DOZVOLJENO PRAVITI PRETPOSTAVKE U VEZI SA OSTALIM POLJIMA
          //PCB STRUKTURE
};
PCB* running; // The running process

int setjump(){ // R0 is used to access fields of PCB pointed by running,
// since its content will be overwritten
// with the return result at the end(return 0)
// compiler will not save it on the stack
  saveAll;
  running->sp = getSP;
  setSP(running->sp-1);
  copy((int*)running->sp-1, (int*)running->sp+16, 1);
  return 0;
}

int longjump(){
  setSP(running->sp);
  restoreAll;
  return 1;
}

```

--------------------------------------------------------------------------------
concurrency

```cpp
#include <stdio.h>
#define N 3

void main () {
  int i, f = 0, s = 0;
  for (i=0; i<N; i++) {
    f = f || fork();
    s += i;
  }
  if (f) exit(0);
  printf(“%d ”,s);
}
```

U tri prolaza petlje kreira se 8 procesa: u prvom prolazu od 1 nastaju 2, u drugom od
svakog od ovih nastaju po 2, što je ukupno 4 i u trećem prolazu od svakog od ova 4 nastaju po
2, što je ukupno 8. Svaki od njih će računati sumu s u svom adresnom prostoru, koja će imati
vrednost 0+1+2 = 3.

Međutim, kako pri pozivu `fork()` samo jedan proces dobije povratnu vrednost 0,
jedan od prva dva procesa će u f izračunati 1,  a drugi 0.  Zbog logičke funkcije „ili“,  svi
procesi koji nastanu od procesa u kojem je `f = 1` će takođe imati `f = 1` i zbog toga nikada neće
stići do ispisa. Onaj koji ima vrednost `f = 0` se na isti način deli na dva procesa, gde f u
jednom procesu ima vrednost 1, a u drugom 0. Kao i u prethodnom slučaju, jedini procesi koji
imaju šansu da dođu do ispisa su oni koji nastaju od onog koji u f ima vrednost 0. Dalje
posmatramo proces koji u f ima vrednost 0. Taj proces se još jednom deli na dva od kojih
samo jedan u f ima vrednost 0 i samo taj proces će pri izvršavanju doći do ispisa, što znači da
će biti ispisana samo jedna suma, 3.

Rezonovanje bi se moglo nastaviti na isti način dalje, i upotrebom indukcije bi se
moglo pokazati da će za proizvoljnu vrednost N biti ispisana samo jedna suma brojeva od 1
do N.
