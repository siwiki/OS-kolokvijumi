2023/decembar/SI, IR Kolokvijum 2 - Decembar 2023 - Resenja.pdf
--------------------------------------------------------------------------------
deadlock

1. Suspendovani su procesi P1 i P2.
2. Suspendovan je proces P1.
3. Nema suspendovanih procesa.

\begin{figure}[H]
    \centering
    \subfloat[Rešenje prve stavke]{\includesvg[width=0.25\textwidth]{images/os2/2023-k2-graf-1}}
    \subfloat[Rešenje druge stavke]{\includesvg[width=0.25\textwidth]{images/os2/2023-k2-graf-2}}
    \subfloat[Rešenje treće stavke]{\includesvg[width=0.25\textwidth]{images/os2/2023-k2-graf-3}}
\end{figure}


--------------------------------------------------------------------------------
memory

```cpp
void updateRefBits() {
    for (int i = 0; i < PMT1_COUNT; i++) {
        if (pmt1[i][0] == FREE_PMT_SLOT) continue;
        for (int j = 0; j < PMT1_SIZE; j++) {
            refBits[i][j] >>= 1;
            refBits[i][j] |= (pmt1[i][j] & 1) << 31;
            pmt1[i][j] &= ~1U;
        }
    }
}
PMTEntry* getVictim() {
    uint32_t min = 0;
    PMTEntry* victim = 0;
    for (int i = 0; i < PMT1_COUNT; i++) {
        if (pmt1[i][0] == FREE_PMT_SLOT) continue;
        for (int j = 0; j < PMT1_SIZE; j++) {
            if (pmt1[i][j] == FREE_PMT_ENTRY) continue;
            if (refBits[i][j]) < min {
                min = refBits[i][j];
                victim = &pmt1[i][j];
            }
        }
    }
    return victim;
}
```

--------------------------------------------------------------------------------
thrashing

```cpp
int freeUnusedPages() {
    static const uint32_t refThreshold = 1 << 8;
    static const PMTEntry dirtyMask = 2;
    int count = 0;
    for (int i = 0; i < PMT1_COUNT; i++) {
        if (pmt1[i][0] == FREE_PMT_SLOT) continue;
        for (int j = 0; j < PMT1_SIZE; j++) {
            if (pmt1[i][j] == FREE_PMT_ENTRY) continue;
            if (refBits[i][j] < refThreshold && pmt1[i][j] & dirtyMask) {
                discardPage(i,j);
                count++;
            }
        }
    }
    return count;
}
```
