2012/septembar/SI, IR Kolokvijum 1 - Septembar 2012 - Resenja.pdf
--------------------------------------------------------------------------------
io

```cpp
static unsigned* io2Ptr = 0;
static int io2Count = 0;
static int io2Completed = 0;

int transfer (unsigned* blk1, int count1, unsigned* blk2, int count2) {
  // I/O 2:
  io2Ptr = blk2;
  io2Count = count2;
  io2Completed = 0;
  int status = 0;
  *io2Ctrl = 1; // Start I/O 2

  // I/O 1
  *io1Ctrl = 1; // Start I/O 1
  while (count1>0) {
    while (!(*io1Status&1)); // Busy wait
    if (*io1Status&2) { // Error in I/O 1
      status |= 1;
      break;
    }
    *blk1++ = *io1Data;
    count1--;
  }
  *io1Ctrl = 0; // Stop I/O 1

  // Wait for I/O 2 completion:
  while (!io2Completed);
  if(io2Completed<0)status |= 2;
  return status;
}

interrupt void io2Interrupt() {
  if (*io2Status&2) { // Error in I/O 2
    io2Completed = -1;
    *io2Ctrl = 0; // Stop I/O 2
    return;
  }
  *io2Ptr++ = *io2Data;
  if (--io2Count == 0) {
    io2Completed = 1;
    *io2Ctrl = 0; // Stop I/O 2
  }
}

```
--------------------------------------------------------------------------------
page

VA: Page(8):Offset(16)

PA: Frame(8):Offset(16)

Sekvenca stranica koje se traže: $3, 3, 3, 8, 8, 3, 3, 3, 5, 5, 6, 6$

PMT na kraju sekvence:
\begin{tabular}{|l|l|l|}
\hline
Entry & Flag & Frame \\
\hline
0 & 0 & \\
\hline
1 & 0 & \\
\hline
2 & 0 & \\
\hline
3 & 1 & 20h \\
\hline
4 & 0 & \\
\hline
5 & 1 & 22h \\
\hline
6 & 1 & 23h \\
\hline
7 & 0 & \\
\hline
8 & 1 & 21h \\
\hline
9 & 0 & \\
\hline
A & 0 & \\
\hline
B & 0 & \\
\hline
C & 0 & \\
\hline
D & 0 & \\
\hline
E & 0 & \\
\hline
F & 0 & \\
\hline
\end{tabular}

--------------------------------------------------------------------------------
concurrency
```cpp

void Thread::suspend () {
  lock();
  jmp_buf old = Thread::running->context;
  Thread::running = Scheduler::get();
  jmp_buf new = Thread::running->context;
  yield(old,new);
  unlock();
}

void Thread::resume () {
  lock();
  Scheduler::put(this);
  jmp_buf old = Thread::running->context;
  Scheduler::put(Thread::running);
  Thread::running = Scheduler::get();
  jmp_buf new = Thread::running->context;
  yield(old,new);
  unlock();
}
```

--------------------------------------------------------------------------------
concurrency
```cpp
int create_thread (void (*fun)(void*), void* p) {
  int ret = fork();
  if (ret<0) return ret;  // Error
  if (ret>0) return ret;  // Parent thread context
  // Child context (ret==0):
  (*fun)(p);
  exit();
}
```