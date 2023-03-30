2023/mart/SI Kolokvijum 1 - Mart 2023 - Resenja.pdf
--------------------------------------------------------------------------------
linker
1. ```asm
   seg bss
       a dd 256 dup 0
       n dd 0
   endseg
   seg text
       max_a:  load r1, [sp+8]     ; r1 := n
               load r2, #1         ; if (n<=1)
               cmp r1, r2
               jg L0001
               load r0, a          ; return a[0]
               ret
       L0001:  sub r1, r1, r2      ; r1 := n-1
               push r1             ; r0 := max_a(n-1)
               call max_a
               pop r1
               load r2, #2         ; r1:= a[n-1]
               shl r1, r1, r2
               load r1, a[r1]
               cmp r1, r0          ; (a[n-1]>m)?
               jle L0002
               load r0, r1
       L0002:  ret
   endseg
   ```
2. Instrukcije koje u sebi sadrže zapis neposrednog operanda, pomeraja ili apsolutne adrese zauzimaju dve 32-bitne reči (8 bajtova), ostale zauzimaju po jednu (4 bajta).
   ```
   L0001 = max_a + 4*8 + 2*4 = max_a + 40
   L0002 = L0001 + 4*8 + 6*4 = L0001 + 56 = max_a + 96
   ```
3. ```
   a = 0
   n = a+256*4 = 1024
   max_a = 4*1024 = 4096
   L0001 = max_a + 40 = 4136
   L0002 = max_a + 96 = 4192
   ```

--------------------------------------------------------------------------------
segment

1. \begin{tabular}{|c|c|c|}
\hline
Segment \# (hex) & Limit (hex) & RWX (bin) \\
\hline
0                & FFF         & 001 \\
\hline
1                & FFF         & 001 \\
\hline
2                & 88F         & 001 \\
\hline
3                & FEF         & 100 \\
\hline
4                & FFF         & 001 \\
\hline
5                & FFF         & 001 \\
\hline
6                & FFF         & 001 \\
\hline
7                & E67         & 001 \\
\hline
28               & FFF         & 110 \\
\hline
29               & 899         & 110 \\
\hline
FE               & FFF         & 110 \\
\hline
FF               & FFF         & 110 \\
\hline
\end{tabular}
2. Adresa FDFFFh pripada segmentu broj FDh.

--------------------------------------------------------------------------------
page
```cpp
typedef PgDsc uint32;
typedef Frame uint16;
inline void setPgRW(PgDsc* pd) {
    *pd |= ((PgDsc)3) << 30;
}
int copyOnWrite(PgDsc* pd) {
    Frame oldFrame = (Frame)(*pd);
    if (frames[oldFrame] > 1) {
        Frame newFrame = getFreeFrame();
        if (newFrame == 0) return -1;
        frames[newFrame] = 1;
        frames[oldFrame]--;
        *pd = newFrame;
        copyFrame(oldFrame, newFrame);
    }
    setPgRW(pd);
    return 0;
}
```
