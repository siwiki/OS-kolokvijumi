2015/septembar/SI, IR Kolokvijum 1 - Septembar 2015 - Resenja.pdf
--------------------------------------------------------------------------------


1/2
Prvi kolokvijum iz Operativnih sistema 1
Septembar 2015.
1. (10 poena)
void transfer () {
  int curBuffer = 0;
  // Start input controller:
  *ioCtrl = 1;

  while () {

    // Perform input transfer:
    for (int i=0; i<BUFSIZE; i++) {
      while (!(*ioStatus&1)); // Busy wait
      buffer[curBuffer][i] = *ioData; // Read data
    }

    // Start DMA output:
    *dmaAddr = buffer[curBuffer];
    *dmaCount = BUFSIZE;
    *dmaCtrl = 1;
    // Swap the buffers:
    curBuffer = 1-curBuffer;

  }
}

interrupt void dmaInterrupt () {
  *dmaCtrl = 0;
}
2. (10 poena) a)(7)
void yield (jmp_buf old, jmp_buf new) {
  if (setjmp(old)==0)
    longjmp(new,1);
}

void dispatch () {
  lock();
  jmp_buf old = Thread::running->context;
  Scheduler::put(Thread::running);
  Thread::running = Scheduler::get();
  jmp_buf new = Thread::running->context;
  yield(old,new);
  unlock();
  if (Thread::running->signal) {
    Thread::running->sigHandlers[Thread::running->signal]();
    Thread::running->signal = 0;
  }
}

2/2
3. (10 poena)
void cobegin (void (*f)(), void (*g)()) {
  int id1 = 0, id2 = 0;
  if (id1 = fork())
    if (id2 = fork()) {
      wait(id1);
      wait(id2);
      return;
    } else {
      g();
      exit(0);
    }
  else {
    f();
    exit(0);
  }
}

