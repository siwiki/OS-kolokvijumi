2022/decembar/SI, IR Kolokvijum 2 - Novembar 2022 - Resenja.pdf
--------------------------------------------------------------------------------
deadlock
1. Početno stanje je bezbedno ako i samo ako je maksimalna najavljena potražnja svakog procesa zadovoljiva ukupnom količinom svih resursa (za svako $P_i$ je $Max_i \leq Available$). Ako je zadovoljen navedeni uslov za svaki proces, onda je sigurna sekvenca za početno stanje bilo koja permutacija svih procesa, jer će svaki moći da zadovolji svoju maksimalnu potražnju sa raspoloživim (svim) resursima, pošto nijedan ne drži resurse ($Allocation_i=(0,...,0)$).
   
   U suprotnom, ako ovaj uslov nije zadovoljen za neki proces $P_i$, taj proces $P_i$ nikako ne može zadovoljiti svoju potražnju čak ni da je sam, odnosno za bilo koju permutaciju, pa sigurna sekvenca svakako ne postoji.
2. Ako je stanje $S$ bezbedno, onda za njega postoji neka sigurna sekvenca $\sigma = (P_1, P_2, ..., P_n)$. Ako u tom stanju neki proces $P_i$ oslobodi vektor resursa $Free$, onda će u novom stanju $S'$ zauzeće resursa od strane $P_i$ biti $Allocation_i' = Allocation_i - Free$, a broj slobodnih resursa u obradi sekvence $\sigma$ na svakoj poziciji biti za $Free$ resursa više. Tako će ih na mestu procesa $P_i$ u sekvenci biti $Available_{[i]}' = Available_{[i]} + Free$, pa će za ovaj proces važiti:
   
   $Max_i - Allocation_i' = Max_i - Allocation_i + Free \leq Available_{[i]} + Free = Available'_{[i]}$
   
   jer je za stanje $S$ važilo
   
   $Max_i - Allocation_i \leq Available_{[i]}$
   
   Zbog toga u sekvenci $\sigma$ proces $P_i$ i dalje zadovoljava uslov. Za sve ostale procese $P_j$ u sekvenci stanje zauzeća resursa se nije izmenilo, pa i dalje važi:
   
   $Max_j - Allocation_j' = Max_i - Allocation_j < Available_{[j]} + Free = Available_{[j]}'$.
   
   Zato je $\sigma$ i dalje sigurna sekvenca za stanje $S'$, pa je i $S'$ bezbedno stanje.

--------------------------------------------------------------------------------
memory
1. Broj straničnih grešaka: 15
\begin{tabular}{|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|}
\hline
\textbf{1} & \textbf{2} & \textbf{3} & \textbf{4} & \textbf{5} & \textbf{6} & 3 & 4 & \textbf{2} & \textbf{5} & \textbf{6} & \textbf{1} & 2 & \textbf{3} & \textbf{5} & \textbf{6} & 5 & 6 & \textbf{4} & \textbf{2} \\
\hline
1 & 1 & 1 & 1 & 5 & 5 & 5 & 5 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 4 & 4 \\
\hline
  & 2 & 2 & 2 & 2 & 6 & 6 & 6 & 6 & 5 & 5 & 5 & 5 & 3 & 3 & 3 & 3 & 3 & 3 & 2 \\
\hline
  &   & 3 & 3 & 3 & 3 & 3 & 3 & 3 & 3 & 6 & 6 & 6 & 6 & 5 & 5 & 5 & 5 & 5 & 5 \\
\hline
  &   &   & 4 & 4 & 4 & 4 & 4 & 4 & 4 & 4 & 1 & 1 & 1 & 1 & 6 & 6 & 6 & 6 & 6 \\
\hline
\end{tabular}
2. Broj straničnih grešaka: 13

\begin{tabular}{|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|}
\hline
\textbf{1} & \textbf{2} & \textbf{3} & \textbf{4} & \textbf{5} & \textbf{6} & 3 & 4 & \textbf{2} & 5 & 6 & \textbf{1} & 2 & \textbf{3} & \textbf{5} & \textbf{6} & 5 & 6 & \textbf{4} & \textbf{2} \\
\hline
1. & 1. & 1. & ↑1. & 5. & 5. & 5. & 5. & 5 & 5. & 5. & ↑5. & ↑5. & 3. & 3. & 3. & 3. & 3. & ↑3. & 2. \\
\hline
↑  & 2. & 2. & 2. & ↑2 & 6. & 6. & 6. & 6 & 6 & 6. & 6. & 6. & ↑6 & 5. & 5. & 5. & 5. & 5. & ↑5 \\
\hline
   & ↑ & 3. & 3. & 3 & ↑3 & ↑3. & ↑3. & 2. & 2. & 2. & 2. & 2. & 2 & ↑2 & 6. & 6. & 6. & 6. & 6 \\
\hline
   &   & ↑ & 4. & 4 & 4 & 4 & 4. & ↑4 & ↑4 & ↑4 & 1. & 1. & 1 & 1 & ↑1 & ↑1 & ↑1 & 4. & 4 \\
\hline
\end{tabular}

--------------------------------------------------------------------------------
buddy
```cpp
void* Buddy::alloc (int size) {
    if (size < 0 || size >= BUCKET_SIZE) return 0; // Exception

    int block = -1, current = size;
    for (; block < 0 && current < BUCKET_SIZE; current++)
        block = getFreeBlock(current);
    if (block < 0) return 0; // No available memory
    setBlock(--current, block, ALLOC);
    while (--current >= size) {
        block *= 2;
        setBlock(current, block + 1, FREE);
    }
    return getBlockAddr(size, block);
}
```
