2017/mart/SI Kolokvijum 1 - Mart 2017 - Resenja.pdf
--------------------------------------------------------------------------------
io
```cpp
void performIO () {
  while (ioHead!=0) {

    IORequest* ioPending = ioHead; // Take the first request,
    ioHead = ioHead->next; // remove it from the list,
    if (ioHead==0) ioTail = 0;


 *ioCtrl = START_SENDING; // and send it to I/O
    for (int i=0; i<BLOCK_SIZE; i++)
      *ioData = ioPending->buffer[i];
    *ioCtrl = END_SENDING;

    while (*ioStatus&1 == 0);  // Wait for completion

    if (*ioStatus&2) // Error in I/O
      ioPending->status = -1;
    else
      ioPending->status = 0;
  }
}

void transfer (IORequest* req) {
  req->next = 0;
  if (!ioHead) {
    ioHead = ioTail = req;
    performIO();
  } else
    ioTail = ioTail->next = req;
}
```

--------------------------------------------------------------------------------
interrupt
```asm
dispatch:   ; Save the current context
            push r0 ; save regs
            push r1
            ...
            push r31
            load r0, running
            store ssp, #offsSSP[r0] ; save ssp

            ; Select the next running process
            call scheduler

            ; Restore the new context
            load r0, running
            load ssp, #offsSSP[r0] ; restore ssp
            pop r31
            pop r30 ; restore regs
            ...
            pop r0
            ; Return
            iret
```

--------------------------------------------------------------------------------
syscall
```cpp
#include <stdio.h>
const int N = ..., M = ...;
FILE* streams[N];
char text[N][M];

void read_line (void* ptr) {
  int i = (FILE**)ptr-streams;
  FILE* stream = streams[i];

  char c = getc(stream);
  int j = 0;
  while ((c!=EOF) && (j<M)) {
    text[i][j] = c;
    j++;
    c = getc(stream);
  }

  if (j<M)
    text[i][j] = '\0';
  else
    text[i][M-1] = '\0';
}

void read_text () {
  int i;
  for (i=0; i<N; i++) {
    text[i][0] = '\0';
    thread_create(read_line,&streams[i]);
  }

  wait(0);

  for (i=0; i<N; i++)
    printf(“%s\n”,text[i]);
}
```
