2017/decembar/SI, IR Kolokvijum 2 - Decembar 2017 - Resenja.pdf
--------------------------------------------------------------------------------
sharedobj
```ada
var forks : array 0..4 of semaphore = 1; 
 
task type Philosopher(i:int) 
  var left, right, first, second : 0..4; 
begin 
  left := i; right := (i+1) mod 5; 
  if left<right then 
    begin first:=left; second:=right end 
  else 
    begin first:=right; second:=left end; 
  loop 
    think; 
    forks[first].wait; 
    forks[second].wait; 
    eat; 
    forks[first].signal; 
    forks[second].signal; 
  end; 
end;
```

--------------------------------------------------------------------------------
memory
```cpp
uint64* getVictim () { 
  while (clockHand) { 
    uint16* pCnt = ((uint16*)clockHand) + 3; 
    if (*pCnt == 0) // Found the victim! 
      return clockHand-1; 
    (*pCnt)--; // Decrement the counter 
    // Move the clock hand to the next: 
    uint64 next = *clockHand; 
    next |= ~(uint64)0xffffffUL; 
    clockHand = (uint64*)next; 
  }   
  return 0; // No pages or another exception 
}
```

--------------------------------------------------------------------------------
buddy

\begin{figure}[H]
\centering
\begin{tabular}{|c|c|}
\hline
0 & \\
\hline
1 & A06000, A08000 \\
\hline
2 & A0C000 \\
\hline
3 & \\
\hline
4 & \\
\hline
\end{tabular}
\caption{Rešenje stavke pod a}
\end{figure}

\begin{figure}[H]
\centering
\begin{tabular}{|c|c|}
\hline
0 & A07000 \\
\hline
1 & A08000 \\
\hline
2 & A0C000 \\
\hline
3 & \\
\hline
4 & \\
\hline
\end{tabular}
\caption{Rešenje stavke pod b}
\end{figure}

\begin{figure}[H]
\centering
\begin{tabular}{|c|c|}
\hline
0 & A07000 \\
\hline
1 & \\
\hline
2 & \\
\hline
3 & A08000 \\
\hline
4 & \\
\hline
\end{tabular}
\caption{Rešenje stavke pod c}
\end{figure}
