2017/april/IR Kolokvijum 1 - April 2017 - Resenja.pdf
--------------------------------------------------------------------------------
io
```cpp
static unsigned *io1Ptr = 0, *io2Ptr = 0;
static int io1Count = 0, io2Count = 0;
static unsigned timeout = 50;
void transfer (unsigned* blk1, int count1, unsigned* blk2, int count2) {
  // I/O 1:
  io1Ptr = blk1;
  io1Count = count1;
  *io1Ctrl = 1; // Start I/O 1
  *io1Data = *io1Ptr++;
  *timer = timeout; // Start timer
  // I/O 2:
  io2Ptr = blk2;
  io2Count = count2;
  *io2Ctrl = 1; // Start I/O 2
  *io2Data = *io2Ptr++;

  // Busy wait for I/O completion:
  while (io1Count || io2Count);
}
interrupt void io2Interrupt() {
  if (--io2Count)
    *io2Data = *io1Ptr++; // New output request
  else
    *io2Ctrl = 0; // Stop I/O 2
}
interrupt void timerInterrupt () {
  if (--io1Count) {
    *io1Data = *io1Ptr++; // New output request
    *timer = timeout; // Restart timer
  } else
    *io1Ctrl = 0; // Stop I/O 1
}
```

--------------------------------------------------------------------------------
context
```cpp
void IOThread::suspend () {
  IOThread::running->isReady = 0;
  int newRunning = -1;
  while (newRunning==-1) {
    for (int i=0; i<IOThread::NumOfIOThreads; i++)
      if (IOThread::allThreads[i].isReady) {
        newRunning = i;
        break;
      }
  }
  IOThread* oldThread = IOThread::running;
  IOThread* newThread = &IOThread::allThreads[newRunning];
  IOThread::running = newThread;
  yield(oldThread,newThread);
}
```

--------------------------------------------------------------------------------
thread
2349, ili 2439, ili 3249, ili 3429, ili 4239, ili 4329 i ništa više osim toga.
