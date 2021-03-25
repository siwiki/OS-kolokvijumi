2012/septembar/SI, IR Kolokvijum 2 - Septembar 2012 - Resenja.pdf
--------------------------------------------------------------------------------


1/1
Drugi kolokvijum iz Operativnih sistema 1
Septembar 2012.
1. (10 poena)
shared var
  sa : Semaphore:=1,
  sb : Semaphore:=0;

process A;              process B;
begin               begin
  loop                loop
    wait(sa);                          wait(sb);
    <critical-section>                <critical-section>
    signal(sb);                        signal(sa);
    <non-critical-section>          <non-critical-section>
  end;                end;
end;               end;
2. (10 poena)
class Semaphore {
public:
  Semaphore (int init=1) : v(init), lck(0) {}
  void wait ();
  void signal ();
private:
  int v, lck;
};

void Semaphore::wait () {
  int done = 0;
  while (!done) {
    lock(lck);
    if (v>0) v--, done=1;
    unlock(lck);
  }
}

void Semaphore::signal () {
  lock(lck);
  v++;
  unlock(lck);
}
3. (10 poena)
Zapis broj Adresa početka Veličina
1 2670 30
2 2460 40
3 2500 120
4. (10 poena)
Sistem ne mora da kreira novu PMT za novokreirani proces prilikom izvršavanja sistemskog poziva fork,
jer  oba  procesa inicijalno dele sve stranice,  pa  su  njihove  PMT  inicijalno  potpuno  iste.  Isto  važi  i  za
PMTP koji ukazuje na istu PMT, pa su i oni isti. Kada bilo koji od ovih procesa generiše izuzetak zbog
zabranjenog  upisa  u  deljenu  stranicu,  sistem  mora  da  razdvoji  stranice  kopiranjem  u  različite  fizičke
okvire  (copy-on-write).  Kako sada  procesi  imaju    razdvojenu  stranicu  preslikanu  u  različite  fizičke
okvire,  njihove  PMT  postaju  različite  (različit je sadržaj  deskriptora  za  razdvojenu  stranicu),  pa  je  to
najkasniji  trenutak  kada  sistem  mora  da  formira sopstvenu PMT  za  novokreirani  proces.  Kako  sada
procesi imaju različite PMT, i njihovi PMTP postaju tada različiti.
