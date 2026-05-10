2025/okt-2/Kolokvijum 2025 - 4 - Resenja.pdf
--------------------------------------------------------------------------------
semintr
```
class Event { 
public: 
  Event (int init=0) : val(init?1:0) {} 
  void wait(); 
  void signal(); 
private: 
  int val; 
  ThreadQueue blocked; 
}; 
void Event::wait () { 
  lock(); 
  Thread* oldRunning = Thread::runningThread; 
  if (--val<0) 
    this->blocked.put(oldRunning); 
  else 
    Scheduler::put(oldRunning); 
  Thread* newRunning = Thread::runningThread = Scheduler::get(); 
  if (oldRunning!=newRunning) 
    Thread::yield(oldRunning,newRunning); 
  unlock(); 
} 
void Semaphore::signal () { 
  lock(); 
  Thread* oldRunning = Thread::runningThread; 
  if (++val<=0) 
    Scheduler::put(this->blocked.get()); 
  else 
    val = 1; 
  Scheduler::put(oldRunning); 
  Thread* newRunning = Thread::runningThread = Scheduler::get(); 
  if (oldRunning!=newRunning) 
    Thread::yield(oldRunning,newRunning); 
  unlock(); 
}
```

