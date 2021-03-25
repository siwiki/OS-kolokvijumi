2016/maj/SI, IR Kolokvijum 2 - Maj 2016 Resenja.pdf
--------------------------------------------------------------------------------


1/2 
Rešenja zadataka za 
drugi kolokvijum iz Operativnih sistema 1 
Maj 2016. 
1. (10 poena) 
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
2. (10 poena) 
void ensureOverlay (int procedureID) { 
  OverlayDescr* ovrl = procedureMap[procedureID]; 
  if (!ovrl->isLoaded) { 
    for (int i=0; i<numOfOverlays; i++) 
      if (overlays[i].addr==ovrl->addr) overlays[i].isLoaded = false; 
    sys_loadBinary(ovrl->filename,ovrl->addr); 
    ovrl->isLoaded = true; 
  } 
} 
 

2/2 
3. (10 poena) 
a)(2) 
Page#   Frame#    RWX 
00h 210h 001 
01h 211h 001 
A0h 212h 100 
A1h 213h 100 
A2h 214h 100 
A3h 215h 100 
C1h 216h 110 
C2h 217h 110 
C3h 218h 110 
b) PMT procesa-roditelja: c) PMT procesa-roditelja: c) PMT procesa-deteta: 
Page#   Frame#    RWX    Page#    Frame#    RWX
  Page#    Frame#   RWX 
00h 210h 001  00h 210h 001      00h 210h 001 
01h 211h 001  01h 211h 001      01h 211h 001 
A0h 212h 100  A0h 212h 100      A0h 212h 100 
A1h 213h 100  A1h 213h 100      A1h 213h 100 
A2h 214h 100  A2h 214h 100      A2h 214h 100 
A3h 215h 100  A3h 215h 100      A3h 215h 100 
C1h 216h 100  C1h 216h 100      C1h 216h 100 
C2h 217h 100  C2h 219h* 110      C2h 217h* 110 
C3h 218h 100  C3h 218h 100      C3h 218h 100 
 
*) Moguće je i da je OS alocirao nov okvir za proces-dete, pa je korektan odgovor i ako 217h 
i 219h zamene mesta. 