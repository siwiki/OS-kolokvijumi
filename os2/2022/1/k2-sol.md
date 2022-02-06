2021/januar/SI, IR Kolokvijum 2 - Januar 2022.pdf
--------------------------------------------------------------------------------
deadlock

1. 

\begin{figure}[H]
\subfloat[Allocation]{
\begin{tabular}{ |c|c|c|c| }
\hline
   & A & B & C \\
\hline
$P_1$ & 2 & 3 & 0 \\
\hline
$P_2$ & 1 & 2 & 2 \\
\hline
$P_3$ & 0 & 2 & 1 \\
\hline
$P_4$ & 1 & 1 & 2 \\
\hline
\end{tabular}
}
\subfloat[Request]{
\begin{tabular}{ |c|c|c|c| }
\hline
   & A & B & C \\
\hline
$P_1$ & 0 & 0 & 0 \\
\hline
$P_2$ & 0 & 0 & 0 \\
\hline
$P_3$ & 5 & 3 & 4 \\
\hline
$P_4$ & 4 & 2 & 3 \\
\hline
\end{tabular}
}
\subfloat[Available]{
\begin{tabular}{ |c|c|c| }
\hline
A & B & C \\
\hline
6 & 2 & 5 \\
\hline
\end{tabular}
}
\end{figure}

2. 

\begin{figure}[H]
\subfloat[Allocation]{
\begin{tabular}{ |c|c|c|c| }
\hline
   & A & B & C \\
\hline
$P_1$ & 0 & 0 & 0 \\
\hline
$P_2$ & 1 & 2 & 2 \\
\hline
$P_3$ & 0 & 2 & 1 \\
\hline
$P_4$ & 5 & 3 & 5 \\
\hline
\end{tabular}
}
\subfloat[Request]{
\begin{tabular}{ |c|c|c|c| }
\hline
   & A & B & C \\
\hline
$P_1$ & 0 & 0 & 0 \\
\hline
$P_2$ & 0 & 0 & 0 \\
\hline
$P_3$ & 5 & 3 & 4 \\
\hline
$P_4$ & 0 & 0 & 0 \\
\hline
\end{tabular}
}
\subfloat[Available]{
\begin{tabular}{ |c|c|c| }
\hline
A & B & C \\
\hline
4 & 3 & 2 \\
\hline
\end{tabular}
}
\end{figure}

ili

\begin{figure}[H]
\subfloat[Allocation]{
\begin{tabular}{ |c|c|c|c| }
\hline
   & A & B & C \\
\hline
$P_1$ & 0 & 0 & 0 \\
\hline
$P_2$ & 1 & 2 & 2 \\
\hline
$P_3$ & 5 & 5 & 5 \\
\hline
$P_4$ & 1 & 1 & 2 \\
\hline
\end{tabular}
}
\subfloat[Request]{
\begin{tabular}{ |c|c|c|c| }
\hline
   & A & B & C \\
\hline
$P_1$ & 0 & 0 & 0 \\
\hline
$P_2$ & 0 & 0 & 0 \\
\hline
$P_3$ & 0 & 0 & 0 \\
\hline
$P_4$ & 4 & 2 & 3 \\
\hline
\end{tabular}
}
\subfloat[Available]{
\begin{tabular}{ |c|c|c| }
\hline
A & B & C \\
\hline
3 & 2 & 1 \\
\hline
\end{tabular}
}
\end{figure}

--------------------------------------------------------------------------------
memory
```cpp
inline ProcessFrames::ProcessFrames(PMT* p, size_t f) : pmt(p), cursor(f) {
    frames[cursor].prev = frames[cursor].next = cursor;
}
inline size_t ProcessFrames::getPage(size_t f) const {
    return frames[f].page;
}
inline void ProcessFrames::setPage(size_t f, size_t p) {
    if (f < NUM_FRAMES) frames[f].page = p;
}
inline size_t ProcessFrames::getVictim() const {
    while (true) {
        uint32* pgdsc = this->pmt->getPageDesc(frames[cursor].page);
        if ((*pgdsc & 1) == 0)
            return cursor;
        else {
            *pgdsc &= ~(uint32)1;
            cursor = frames[cursor].next;
        }
    }
}
inline void ProcessFrames::replaceVictim() {
    cursor = frames[cursor].next;
}
inline void ProcessFrames::addFrame (size_t f) {
    frames[f].prev = frames[cursor].prev;
    frames[f].next = cursor;
    frames[frames[cursor].prev].next = f;
    frames[cursor].prev = f;
}
```

--------------------------------------------------------------------------------
thrashing
Za svaki proces broje se stranične greške u svakoj periodi i pamte se ti brojevi za ukupno `PFLTCOUNTERS` poslednjih perioda. U PCB svakog procesa postoji niz `pageFaultCounters` sa `PFLTCOUNTERS` elemenata tipa `unsigned` koji predstavlja kružni bafer brojača straničnih grešaka po periodama. Na brojač koji odgovara tekućoj periodi ukazuje polje `pageFaultCursor` tipa `int` u opsegu od `0` do `PFLTCOUNTERS-1`. Kada istekne data perioda, sistem pomera kurzor na sledeću poziciju u kružnom baferu, tako da elementi ovog bafera uvek čuvaju brojeve straničnih grešaka poslednjih `PFLTCOUNTERS` perioda. Brojanje je preciznije što je veći ovaj broj i kraća perioda.

```cpp
void incPageFaultCounter(PCB* pcb) {
    pcb->pageFaultCounters[pcb->pageFaultCursor]++;
}
void shiftPageFaultCounters(PCB* pcb) {
    pcb->pageFaultCursor++;
    if (pcb->pageFaultCursor >= PFLTCOUNTERS)
    pcb->pageFaultCursor = 0;
    pcb->pageFaultCounters[pcb->pageFaultCursor] = 0;
}
unsigned getNumberOfPageFaults (PCB* pcb) {
    unsigned sum = 0;
    for (int i = 0; i < PFLTCOUNTERS; i++)
    sum += pcb->pageFaultCounters[i];
    return sum;
}
```
