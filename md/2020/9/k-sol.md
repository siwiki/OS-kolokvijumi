2020/septembar/Kolokvijum - Septembar 2020 - Resenja.pdf
--------------------------------------------------------------------------------
concurrency
```cpp
Thread* t_fork () {
  lock();
  if (setjmp(Thread::running->context)==0) {

    // Parent thread:
    // Allocate a new stack:
    void* stck = malloc(STACK_SIZE);
    if (!stck) throw ThreadCreationException();
    // and copy its contents from the parent's stack:
    memcpy(stck,Thread::running->stack,STACK_SIZE);

    // Create a new Thread object:
    Thread* newThr = new Thread();
    if (!newThr) { free(stck);  throw ThreadCreationException(); }
    newThr->stack = stck;
    // and set its stack pointer to the top of the stack space:
    newThr->context->sp = (int*)((char*)stck + STACK_SIZE) – 1;

    // Put the new thread to the ready list and return:
    Scheduler::put(newThr);
    unlock();
    return newThr;

  } else {
    // Child thread:
    unlock();
    return 0;
  }
}
```

--------------------------------------------------------------------------------
syscall
```cpp
typedef void (*PF)(void*);

void cobegin (PF f[], void* af[], int n) {
  int* ids = new int[n];
  for (int i=0; i<n; i++)
    if ((ids[i]=fork())==0) {
      pf[i](af[i]);
      exit();
    }
  for (int i=0; i<n; i++)
    wait(ids[i]);
  delete ids;
}
```

--------------------------------------------------------------------------------
segment
```cpp
SegDesc* findSegDesc (SegDesc* root, size_t size) {
  SegDesc* sd = root;
  while (sd != nullptr) {
    if (sd->sz >= size) return sd;
    else sd = sd->right;
  }
  return nullptr;
}
```

--------------------------------------------------------------------------------
filesystem
```cpp
void truncateFile (FCB* fcb) {
  for (size_t i=0; i<SingleIndexSize; i++)
    if (fcb->singleIndex[i]) {
      freeBlock(fcb->singleIndex[i]);
      fcb->singleIndex[i] = 0;
    }

  if (fcb->dblIndex) {
    PBlock* dblIx = (PBlock*)getBlock(fcb->dblIndex);
    for (size_t i=0; i<DblIndexSize; i++)
      if (dblIx[i]) freeBlock(dblIx[i]);
    freeBlock(fcb->dblIndex);
    fcb->dblIndex = 0;
  }

  fcb->size = 0;
```
