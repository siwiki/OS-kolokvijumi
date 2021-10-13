2015/decembar/SI, IR Kolokvijum 2 - Decembar 2015 - Resenja.pdf
--------------------------------------------------------------------------------
deadlock
```cpp
int ResourceAllocator::release (int p, int r) { 
  if (p<0 || p>=np || r<0 || r>=nr) return -1; // Exception 
  if (alloc[p][r]!=acquired) return -2;// Resource not used by this process 
  alloc[p][r] = announced;  // Restore the announcement edge 
  for (int i=0; i<np; i++){ // See if other processes can now get resources 
    deblock[i]=0; 
    for (int j=0; i<nr; j++) 
      if ((alloc[i][j]==requested) && (request(i,j)==1)) 
        deblock[i]=1; 
  } 
  return 1; 
}
```

--------------------------------------------------------------------------------
memory
```cpp
unsigned int getVictimPage (PCB* pcb) { 
  if (pcb==0) return; // Exception! 
  while (1) { 
    if (pcb->pageCounters[pcb->clockHand]==0) return pcb->clockHand; 
    pcb->pageCounters[pcb->clockHand]--; 
    pcb->clockHand = pcb->pageFifo[pcb->clockHand]; 
  } 
}
```

--------------------------------------------------------------------------------
buddy

\begin{figure}[H]
\centering
\begin{tabular}{|c|c|}
\hline
n & \textit{Početne adrese (hex) slobodnih blokova veličine $2^n$} \\
\hline
4 & - \\
\hline
3 & - \\
\hline
2 & A C0 00 \\
\hline
1 & A A0 00 \\
\hline
0 & - \\
\hline
\end{tabular}
\caption{Rešenje stavke pod a}
\end{figure}

\begin{figure}[H]
\centering
\begin{tabular}{|c|c|}
\hline
n & \textit{Početne adrese (hex) slobodnih blokova veličine $2^n$} \\
\hline
4 & - \\
\hline
3 & A 00 00 \\
\hline
2 & A C0 00 \\
\hline
1 & A A0 00 \\
\hline
0 & - \\
\hline
\end{tabular}
\caption{Rešenje stavke pod b}
\end{figure}
