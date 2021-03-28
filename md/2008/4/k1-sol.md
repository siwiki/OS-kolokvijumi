2008/april/SI Kolokvijum 1 - April 2008 - Resenja.doc
--------------------------------------------------------------------------------
os

1. Netačno.
2. Tačno.
3. Tačno.
4. Netačno.

--------------------------------------------------------------------------------
io

```cpp
void main () {
  int i1=0, i2=0;
  *ioCtrl1=1; *ioCtrl2=1;  // Start them both
  while (i1<N || i2<N) {
    if (i1<N && *ioStatus1&1) buf1[i1++]=*ioData1;
    if (i2<N && *ioStatus2&1) *ioData2=buf2[i2++];
  }
  *ioCtrl1=0; *ioCtrl2=0;  // Stop them both
}
```

--------------------------------------------------------------------------------
page

\begin{center}
\begin{tabular}{|c|c|c|c|c|c|}
\hline
Virtuelna adresa & FFC2673 & D385A & FF7FB32 & FFFA8C4 & 10012EB8 \\
\hline
Rezultat adresiranja & PF & 3FC1385A & MAV & PF & 512EB8  \\
\hline
\end{tabular}
\end{center}

--------------------------------------------------------------------------------
syscall

Odgovor: 4

Početni proces kreira tri procesa-potomka, za svaku iteraciju (spoljne) `for` petlje `(i=0, 1, 2)`
. U svakoj od tih iteracija, naredba `if` označena sa `if1` izvršava svoju *then* granu, jer je
`pid[i]` uvek 0 (tako je inicijalizovan). U tom procesu *then* grana naredbe if2 se ne izvršava,
jer je `pid[i]` tada različit od 0 (pošto je `fork()` vratio ID kreiranog procesa). U svakom od
kreiranih procesa-potomaka, `fork()` vraća 0, pa je u naredbi `if2 pid[i]==0`, odnosno
izvršava se ugneđžena `for` petlja (po `j`) koja u sve elemente niza `pid` iza `i`-tog upisuje 1.
Zbog toga se u ovim procesima-potomcima, u svim narednim iteracijama glavne `for` petlje
(po `i`), neće izvršiti `fork()` u naredbi `if1`, pa oni više neće kreirati svoje potomke.

--------------------------------------------------------------------------------
interrupt

```cpp
// Auxiliary list operations:

void put(Thread* t, Thread*& head, Thread*& tail) {
  if (t==0) return; // Error
  t ->next=0;
  if (tail) tail->next=t;
  else head=t;
  tail=t;
};
Thread* get(Thread*& head, Thread*& tail) {
  Thread* t = head;
  if (t==0) return;
  t ->next=0;
  head=head->next;
  if (head==0) tail=0;
}

class InterruptWaitingQueue {
public:
  static InterruptWaitingQueue* Instance();
  void put(InterruptID,Thread*);
  Thread* get(InterruptID);
private:
  struct InterruptWaitingQueueEntry {
    Thread* head;
    Thread* tail;
    InterruptWaitingQueueEntry():head(0),tail(0) {}
  };
  InterruptWaitingQueueEntry queue[IVTSize];
};

InterruptWaitingQueue* InterruptWaitingQueue::Instance() {
  static InterruptWaitingQueue instance;
  return &instance;
}
void InterruptWaitingQueue::put(InterruptID intID, Thread* t) {
  put(t,queue[intID].head,queue[intID].tail);
}

Thread* InterruptWaitingQueue::get(InterruptID intID) {
  return get(queue[intID].head,queue[intID].tail);
}

void suspend (InterruptID intID) {
  if (intID>=IVTSize) return; // Error;
  lock();
  if (setjmp(running->context)==0) {
    // Suspend the running thread:
    InterruptWaitingQueue::Instance()->put(running);
    // Get a new running thread:
    running=get(readyFirst,readyLast);
    longjmp(running->context);
  };
  unlock();
}

void resume (InterruptID intID) {
  if (intID>=IVTSize) return; // Error;
  Thread* t = InterruptWaitingQueue::Instance()->get(intID);
  if (t==0) return; // No effect
  put(t,readyFirst,readyLast);
}
```
