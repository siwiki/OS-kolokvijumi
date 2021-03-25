2006/maj/SI Kolokvijum 2 - Maj 2006 - Resenja.doc
--------------------------------------------------------------------------------
io

```cpp
// ExternalEvent.h
void int_mask();
void int_unmask();

const int NumOfInterruptEntries = ... ; // Number of interrupt entries

class ExternalEvent {
public:
  ExternalEvent(int interruptNo);
  void wait();

  static void interruptOccurrence(int interruptNo);

protected:
  void signal ();

  void block ();
  void deblock ();

  ~ExternalEvent();
  static ExternalEvent* events[NumOfInterruptEntries];

private:
  int val, intNo;
  Queue blocked;
};

// ExternalEvent.cpp

ExternalEvent::ExternalEvent(int interruptNo) : val(0),
intNo(interruptNo){
   if (intNo>=0 &&   intNo<NumOfInterruptEntries) {
      int_mask();
        // add the event to the event list
        events[intNo]=this;
        int_unmask();
   }
}

ExternalEvent::~ExternalEvent(){
   int_mask();
   events[intNo]=0;
   int_unmask();
}

void ExternalEvent::interruptOccurrence(int interruptNo){
   if (interruptNo intNo>=0 && interruptNo intNo<NumOfInterruptEntries
  && events[interruptNo])
     events[interruptNo]->signal();
}
```
Komentar [DM1]: Razmisliti zašto je ovo neophodno. 

Uputstvo: šta ako je pokazivač veličine više reči koje se upisuju neatomično u
narednoj naredbi?
Komentar [DM2]: Isto kao i gore!

```cpp
void ExternalEvent::block () {
  if (setjmp(Thread::runningThread->context)==0) {
    // Blocking:
    blocked->put(Thread::runningThread);
    Thread::runningThread = Scheduler::get();
    longjmp(Thread::runningThread->context);
  } else return;
}

void ExternalEvent::deblock () {
  // Deblocking:
  Thread* t = blocked->get();
  Scheduler::put(t);
}

void ExternalEvent::wait () {
  int_mask();
  if (--val<0) block();
  int_unmask();
}

void ExternalEvent::signal () {
  if (val++<0) deblock();
}
```
--------------------------------------------------------------------------------
concurrency
```cpp
ExternalEvent dmaEvent(N);

while (1) {
  requestQueSize.wait();
  mutex.wait();
  IORequest* r = requestQueue;
  requestQueue = requestQueue->next;
  mutex.signal();

  startDMA(r->buffer, r->size);
  dmaEvent.wait();

  r ->isCompleted = 1;
  r ->toSignal->signal();
}
```

--------------------------------------------------------------------------------
linker

Statička biblioteka sadrži zaglavlje sa spiskom simbola koje izvozi i uvozi, i samo
telo biblioteke (kod), drugim rečima, proizvod je istog oblika kao i proizvod prevođenja,
dok izvršni fajl sadrži telo (kod) i zaglavlje u kome se nalazi adresa prve instrukcije koja
treba da se izvrši. Zbog ove razlike u proizvodima, linkeru je potrebna informacija šta da
napravi. Osim toga,  u samom postupku razrešavanja simbola,  prilikom pravljenja
izvršnog fajla,  postojanje nedefinisanog a referisanog simbola se nakon prvog prolaza
prijavljuje kao greška. U slučaju pravljenja biblioteke, ovakav slučaj je dozvoljen.

--------------------------------------------------------------------------------
segment
Virtuelna adresa (VA), 30 bita: Segment (6) :  Offset(24)
Fizička adresa (PA), 29 bita

Swap 1GB => Disk adr. (30)
Deskriptor stranice: 
Da li je u memoriji (1) : RWE(3) : Size(24) : Segment
adr.  (29) ili Disk Adr. (30)

Odatle sledi da je deskriptor segmenta veličine 58 bita, SMT ima po jedan ulaz za
svaki segment, što znači 64 ulaza. Tako da je veličina SMTa 58*64/8 B = 464B

Napomena: Nije logično da se descriptori pakuju tako “gusto”,  tako da se jedan
descriptor rasprostire u više bajtova/reči,  jer se njima pristupa prilikom
preslikavanja adresa,  što bi bilo neefikasno.  Nije nemoguće,  ali nije baa ni
logično.  Tako da je rešenje u kome se jedan descriptor zaokruže na cveo broj
bajtova/reči takođe prihvatljivo.  Odnosno velivina deskriptora 64b=8B =>
veličina SMT 8*64B = 512B. Na ovaj način je SMT veća za 10%, ali su zato
performanse drastično bolje.

--------------------------------------------------------------------------------
linker

\begin{center}
\begin{tabular}{|c|c|c|c|c|c|c|}
\hline
Strana & 0 & 1 & 2 & 3 & 4 & 5 \\
\hline
Proces  A & F & T  1 & T  4 & F & F & F \\
\hline
Proces  B & F & F & T  6 & T  2 & F & T  4 \\
\hline
Proces  C & T  5 & T  3 & F & F & F & T  4 \\
\hline
\end{tabular}
\end{center}


