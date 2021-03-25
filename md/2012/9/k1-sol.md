2012/septembar/SI, IR Kolokvijum 1 - Septembar 2012 - Resenja.pdf
--------------------------------------------------------------------------------


1/2
Prvi kolokvijum iz Operativnih sistema 1
Septembar 2012.
1. (10 poena)
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

2/2
2. (10 poena)
VA: Page(8):Offset(16)
PA: Frame(8):Offset(16)
Sekvenca stranica koje se traže: 3, 3, 3, 8, 8, 3, 3, 3, 5, 5, 6, 6
PMT na kraju sekvence:
Entry Flag Frame
0 0
1 0
2 0
3 1 20h
4 0
5 1 22h
6 1 23h
7 0
8 1 21h
9 0
A 0
B 0
C 0
D 0
E 0
F 0
3. (10 poena)
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
4. (10 poena)
int create_thread (void (*fun)(void*), void* p) {
  int ret = fork();
  if (ret<0) return ret;  // Error
  if (ret>0) return ret;  // Parent thread context
  // Child context (ret==0):
  (*fun)(p);
  exit();
}
