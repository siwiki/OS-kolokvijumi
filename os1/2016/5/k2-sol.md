2016/maj/SI, IR Kolokvijum 2 - Maj 2016 Resenja.pdf
--------------------------------------------------------------------------------
semimpl
```cpp
class Mutex {
public:
  Mutex () : val(1), lck(0), holder(0) {}
  int wait();
  int signal();

protected:
  void block (); // Implementacija ista kao i za Semaphore
  void deblock (); // Implementacija ista kao i za Semaphore
private:
  int val, lck;
  ThreadQueue blocked;
  Thread* holder;
};

int Mutex::wait () {
  if (holder==Thread::running) return -1; // Error
  lock(&lck);
  if (--val<0) block();
  holder = Thread::running;
  unlock(&lck);
  return 0;
}

int Mutex::signal () {
  if (holder!=Thread::running) return -1; // Error
  lock(&lck);
  holder = 0;
  if (val<0) {
    val++;
    deblock();
  } else // No blocked threads, val>=0
    val = 1;
  unlock(&lck);
  return 0;
}
```
--------------------------------------------------------------------------------
overlay
```cpp
void ensureOverlay (int procedureID) {
  OverlayDescr* ovrl = procedureMap[procedureID];
  if (!ovrl->isLoaded) {
    for (int i=0; i<numOfOverlays; i++)
      if (overlays[i].addr==ovrl->addr) overlays[i].isLoaded = false;
    sys_loadBinary(ovrl->filename,ovrl->addr);
    ovrl->isLoaded = true;
  }
}
```

--------------------------------------------------------------------------------
page
\begin{figure}[H]
\subfloat[Rešenje pod a]{
\begin{tabular}{ |c|c|c| }
\hline
Page\# & Frame\# & RWX \\
\hline
00h & 210h & 001 \\
\hline
01h & 211h & 001 \\
\hline
A0h & 212h & 100 \\
\hline
A1h & 213h & 100 \\
\hline
A2h & 214h & 100 \\
\hline
A3h & 215h & 100 \\
\hline
C1h & 216h & 110 \\
\hline
C2h & 217h & 110 \\
\hline
C3h & 218h & 110 \\
\hline
\end{tabular}
}
\subfloat[PMT procesa-roditelja]{
\begin{tabular}{ |c|c|c| }
\hline
Page\# & Frame\# & RWX \\
\hline
00h & 210h & 001 \\
\hline
01h & 211h & 001 \\
\hline
A0h & 212h & 100 \\
\hline
A1h & 213h & 100 \\
\hline
A2h & 214h & 100 \\
\hline
A3h & 215h & 100 \\
\hline
C1h & 216h & 100 \\
\hline
C2h & 217h & 100 \\
\hline
C3h & 218h & 100 \\
\hline
\end{tabular}
}
\subfloat[PMT procesa-roditelja]{
\begin{tabular}{ |c|c|c| }
\hline
Page\# & Frame\# & RWX \\
\hline
00h & 210h & 001 \\
\hline
01h & 211h & 001 \\
\hline
A0h & 212h & 100 \\
\hline
A1h & 213h & 100 \\
\hline
A2h & 214h & 100 \\
\hline
A3h & 215h & 100 \\
\hline
C1h & 216h & 100 \\
\hline
C2h & 219h* & 110 \\
\hline
C3h & 218h & 100 \\
\hline
\end{tabular}
}
\subfloat[PMT procesa-deteta]{
\begin{tabular}{ |c|c|c| }
\hline
Page\# & Frame\# & RWX \\
\hline
00h & 210h & 001 \\
\hline
01h & 211h & 001 \\
\hline
A0h & 212h & 100 \\
\hline
A1h & 213h & 100 \\
\hline
A2h & 214h & 100 \\
\hline
A3h & 215h & 100 \\
\hline
C1h & 216h & 100 \\
\hline
C2h & 217h* & 110 \\
\hline
C3h & 218h & 100 \\
\hline
\end{tabular}
}
\end{figure}

*) Moguće je i da je OS alocirao nov okvir za proces-dete, pa je korektan odgovor i ako 217h i 219h zamene mesta.
