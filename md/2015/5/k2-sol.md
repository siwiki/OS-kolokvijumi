2015/maj/SI, IR Kolokvijum 2 - Maj 2015 - Resenja.pdf
--------------------------------------------------------------------------------
semaphore
Deo koda oba procesa izgleda isto:
```cpp
#include <fcntl.h>
#include <sys/stat.h>
#include <semaphore.h>

// Initialization:
const char* mutexName = “/myprogram_mutex“;
sem_t* mutex = sem_open(mutexName,O_CREAT,1);

...
// Use for mutual exlusion
sem_wait(mutex);
// Critical section
sem_post(mutex);
...

// Release the semaphore when it is no longer needed:
sem_close(mutex);
```

--------------------------------------------------------------------------------
cont
```cpp
void proc_relocate (PCB* pcb, char* to) {
  if (pcb->mem_base_addr==to) return;
  memcpy(to,pcb->mem_base_addr,pcb->mem_size);
  pcb->mem_base_addr = to;
}

void mem_compact () {
  if (mem_free_head==0) return; // No free memory, no need for compaction
  char* to = user_proc_mem_start;
  for (PCB* pcb=proc_mem_head; pcb!=0; pcb=pcb->mem_next) {
    proc_relocate(pcb,to);
    to+=pcb->mem_size;
  }
  size_t free_mem = user_proc_mem_end–to+1;
  if (free_mem>=sizeof(FreeSegment)) {
    mem_free_head = (FreeSegment*)to;
    mem_free_head->size = free_mem;
    mem_free_head->next = 0;
  }
  else mem_free_head = 0; // No more free memory (should not ever happen)
}
```

--------------------------------------------------------------------------------
page
\begin{figure}[H]
\subfloat[Rešenje pod a]{
\begin{tabular}{ |c|c|c| }
\hline
Page\# & Frame\# & RWX \\
\hline
00h & 10h & 001 \\
\hline
01h & 11h & 001 \\
\hline
02h & 12h & 001 \\
\hline
03h & 13h & 001 \\
\hline
12h & 14h & 100 \\
\hline
13h & 15h & 100 \\
\hline
14h & 16h & 100 \\
\hline
1Ah & 17h & 110 \\
\hline
1Bh & 18h & 110 \\
\hline
\end{tabular}
}
\subfloat[PMT procesa-roditelja]{
\begin{tabular}{ |c|c|c| }
\hline
Page\# & Frame\# & RWX \\
\hline
00h & 10h & 001 \\
\hline
01h & 11h & 001 \\
\hline
02h & 12h & 001 \\
\hline
03h & 13h & 001 \\
\hline
12h & 14h & 100 \\
\hline
13h & 15h & 100 \\
\hline
14h & 16h & 100 \\
\hline
1Ah & 17h & 100 \\
\hline
1Bh & 18h & 100 \\
\hline
\end{tabular}
}
\subfloat[PMT procesa-deteta]{
\begin{tabular}{ |c|c|c| }
\hline
Page\# & Frame\# & RWX \\
\hline
00h & 10h & 001 \\
\hline
01h & 11h & 001 \\
\hline
02h & 12h & 001 \\
\hline
03h & 13h & 001 \\
\hline
12h & 14h & 100 \\
\hline
13h & 15h & 100 \\
\hline
14h & 16h & 100 \\
\hline
1Ah & 17h & 100 \\
\hline
1Bh & 18h & 100 \\
\hline
\end{tabular}
}
\subfloat[PMT procesa-deteta]{
\begin{tabular}{ |c|c|c| }
\hline
Page\# & Frame\# & RWX \\
\hline
00h & 10h & 001 \\
\hline
01h & 11h & 001 \\
\hline
02h & 12h & 001 \\
\hline
03h & 13h & 001 \\
\hline
12h & 14h & 100 \\
\hline
13h & 15h & 100 \\
\hline
14h & 16h & 100 \\
\hline
1Ah & 19h & 110 \\
\hline
1Bh & 18h & 100 \\
\hline
\end{tabular}
}
\end{figure}
