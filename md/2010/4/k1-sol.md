2010/prvi/SI Kolokvijum 1 - Mart 2010 - Resenja.doc
--------------------------------------------------------------------------------


1/  2
Prvi kolokvijum iz Operativnih sistema 1
Odsek za softversko inženjerstvo
Mart 2010.
1. (10 poena)
void DMADriver() {
  while (1){
    DMAReq* req;
    // Busy wait for a request:
    while (head==0);
    // Take a request:
    req = head;
    head=head->next;
    if (head==0) tail==0;
    req->next=0;
    // Busy wait for a free DMA:
    while ((*dma1Status&1)==0 && (*dma2Status&1)==0);
    // Start DMA:
    if (*dma1Status&1) {
      *dma1Addr=req->addr;
      *dma1Count=req->size;
      *dma1Ctrl=1;
    } else
    if (*dma2Status&1) {
      *dma2Addr=req->addr;
      *dma2Count=req->size;
      *dma2Ctrl=1;
    }
    free(req);
  }
}
2. (10 poena)
Proces A:
Ulaz 0 1 2 3 ... FE FF 100 ... FE03 ...
Vrednost FE12 FEFF 12 0 0 0 0 FE 0 2314 0
Proces B:
Ulaz 0 1 2 3 ... FE FF 100 ...
Vrednost 0 12 14 01AD 0 22 01AE 0 0

3. (10 poena)
Operacija Promena
konteksta procesa
Promena
konteksta niti
Restauracija programski dostupnih registara procesora
za podatke
Da Da
Invalidacija TLB-a čiji ključevi ne sadrže identifikaciju
procesa
Da Ne
Invalidacija TLB-a čiji ključevi sadrže identifikaciju
procesa
Ne Ne
Restauracija registra koji čuva identifikaciju korisničkog
procesa
Da Ne

2/  2
Restauracija pokazivača na tabelu preslikavanja stranica
(PMTP)
Da Ne
Restauracija procesorske statusne reči (PSW) Da Da
Invalidacija procesorskog keša koji kao ključeve čuva
virtuelne adrese
Da Ne
Invalidacija procesorskog keša koji kao ključeve čuva
fizičke adrese
Ne Ne
Zatvaranje otvorenih fajlova Ne Ne
Restauracija pokazivača steka (SP) Da Da
4. (10 poena)
sys_call: load r0, [runningUserProcess]
store sp, offsSP[r0]
load r0, [runningKernelThread]
load sp, offsSP[r0]
iret
5. (10 poena)
a)(4) Svaka  nit  napreduje  kroz  hodnike  lavirinta  i  u  svakom  koraku,  na  datom  polju  u
kvadratnom koordinatnom sistemu, radi sledeće. Najpre  pogleda  da  li  je  pronašla  izlaz  i  ako
jeste, ispisuje to i završava se. Zatim od lavirinta dobije najviše tri susedna slobodna polja u
koja može da pređe (osim onoga iz koga je stigla). Ako ni jedno od takvih ne postoji, ta nit je
udarila u slepi hodnik, pa ispisuje rečenicu „I have reached a dead end and I am giving up“ i
gasi se. Inače, ta nit nastavlja da ide prvom dobijenom opcijom, tako da joj je sledeće polje to
susedno polje dobijeno kao prva opcija, u tom smeru. Ako postoje druga i treća opcija, onda
ova nit kreira nove niti, po jednu za svaku od tih raspoloživih opcija (drugu i treću), tako da te
niti nastavljaju od tih susednih polja, u odgovarajućim smerovima.
b)(3) Četiri niti. Na slici je prikazan jedan mogući raspored puteva kojim tragaju te niti, uz
pretpostavku da roditeljska nit nastavlja desnim od mogućih puteva, a potomci ostalim.
c)(3) Tri puta.
entry
