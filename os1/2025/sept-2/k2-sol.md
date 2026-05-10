2025/sept-2/Kolokvijum 2025 - sept2 - Resenja.pdf
--------------------------------------------------------------------------------
thread
```cpp
class PeriodicThread : public Thread { 
public: 
  PeriodicThread (Time period, Time start = 0) 
    : myPeriod(period), myStart(start), toStop(false) {} 
 
  void stop () { toStop = true; }; 
  virtual void activate () = 0; 
 
protected: 
  virtual void run (); 

private: 
  Time myPeriod, myStart; 
  bool toStop; 
}; 

void PeriodicThread::run () { 
  if (myStart!=0) Timing::sleep(myStart); 
  Time nextPeriod = Timing::now(); 
  while (!toStop) { 
    nextPeriod += myPeriod; 
    activate(); 
    Timing::sleep(nextPeriod); 
  } 
}
```

