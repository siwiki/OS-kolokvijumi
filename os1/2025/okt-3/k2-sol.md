2025/okt-3/Kolokvijum 2025 - okt3 - Resenja.pdf
--------------------------------------------------------------------------------
```
semintr
class Event { 
public: 
  Event (); 
  int wait(); 
  void signal(); 
private: 
  Thread* owner; 
  short val; 
}; 
```
 
```
inline Event::Event () : val(0) { 
  this->owner = Thread::runningThread; 
} 
```
 
```
int Event::wait () { 
  if (this->owner != Thread::runningThread) return -1; 
  lock(); 
  Thread* oldRunning = Thread::runningThread; 
  if (val-- == 1) 
    Scheduler::put(oldRunning); 
  Thread* newRunning = Thread::runningThread = Scheduler::get(); 
  if (oldRunning!=newRunning) 
    Thread::yield(oldRunning,newRunning); 
  unlock();   
  return 0; 
} 
void Semaphore::signal () { 
  lock(); 
  Thread* oldRunning = Thread::runningThread; 
  if (val++ == -1) 
    Scheduler::put(this->owner); 
  else 
    val = 1; 
  Scheduler::put(oldRunning); 
  Thread* newRunning = Thread::runningThread = Scheduler::get(); 
  if (oldRunning!=newRunning) 
    Thread::yield(oldRunning,newRunning); 
  unlock(); 
}
```

