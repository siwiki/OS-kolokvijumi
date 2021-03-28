2012/septembar/SI, IR Kolokvijum 2 - Septembar 2012 - Resenja.pdf
--------------------------------------------------------------------------------
semaphore

```ada
shared var
  sa : Semaphore:=1,
  sb : Semaphore:=0;

process A;
begin
  loop
    wait(sa);
    <critical-section>
    signal(sb);
    <non-critical-section>
  end;
end;

process B;
begin
  loop
    wait(sb);
    <critical-section>
    signal(sa);
    <non-critical-section>
  end;
end;
```
--------------------------------------------------------------------------------
semaphore
```cpp
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
```
--------------------------------------------------------------------------------
cont

\begin{center}
\begin{tabular}{|l|l|l|}
\hline
Zapis broj & Adresa  početka & Veličina \\
\hline
1 & 2670 & 30 \\
\hline
2 & 2460 & 40 \\
\hline
3 & 2500 & 120 \\
\hline
\end{tabular}
\end{center}

--------------------------------------------------------------------------------
page

Sistem ne mora da kreira novu PMT za novokreirani proces prilikom izvršavanja sistemskog poziva fork,
jer oba procesa inicijalno dele sve stranice,  pa su njihove PMT inicijalno potpuno iste.  Isto važi i za
PMTP koji ukazuje na istu PMT, pa su i oni isti. Kada bilo koji od ovih procesa generiše izuzetak zbog
zabranjenog upisa u deljenu stranicu,  sistem mora da razdvoji stranice kopiranjem u različite fizičke
okvire (copy-on-write).  Kako sada procesi imaju razdvojenu stranicu preslikanu u različite fizičke
okvire,  njihove PMT postaju različite (različit je sadržaj deskriptora za razdvojenu stranicu),  pa je to
najkasniji trenutak kada sistem mora da formira sopstvenu PMT za novokreirani proces.  Kako sada
procesi imaju različite PMT, i njihovi PMTP postaju tada različiti.
