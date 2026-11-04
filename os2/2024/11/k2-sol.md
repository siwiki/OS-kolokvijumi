2024/novembar/SI, IR Kolokvijum 2 - Novembar 2024 - Resenja.pdf
--------------------------------------------------------------------------------
deadlock

1. Nakon zahteva P4: request(4, 2, 3):

\begin{figure}[H]
\subfloat[Allocation]{
\begin{tabular}{ |c|c|c|c| }
\hline
   & A & B & C \\
\hline
$P_1$ & 1 & 3 & 2 \\
\hline
$P_2$ & 2 & 3 & 3 \\
\hline
$P_3$ & 3 & 4 & 1 \\
\hline
$P_4$ & 2 & 2 & 3 \\
\hline
\end{tabular}
}
\subfloat[Request]{
\begin{tabular}{ |c|c|c|c| }
\hline
   & A & B & C \\
\hline
$P_1$ & 4 & 3 & 4 \\
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
4 & 3 & 5 \\
\hline
\end{tabular}
}
\end{figure}

2. Nakon zahteva P3: release(2, 3, 0):

\begin{figure}[H]
\subfloat[Allocation]{
\begin{tabular}{ |c|c|c|c| }
\hline
   & A & B & C \\
\hline
$P_1$ & 5 & 6 & 6 \\
\hline
$P_2$ & 2 & 3 & 3 \\
\hline
$P_3$ & 1 & 1 & 1 \\
\hline
$P_4$ & 2 & 2 & 3 \\
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
2 & 3 & 1 \\
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
$P_1$ & 1 & 3 & 2 \\
\hline
$P_2$ & 2 & 3 & 3 \\
\hline
$P_3$ & 1 & 1 & 1 \\
\hline
$P_4$ & 6 & 4 & 6 \\
\hline
\end{tabular}
}
\subfloat[Request]{
\begin{tabular}{ |c|c|c|c| }
\hline
   & A & B & C \\
\hline
$P_1$ & 4 & 3 & 4 \\
\hline
$P_2$ & 0 & 0 & 0 \\
\hline
$P_3$ & 0 & 0 & 0 \\
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
2 & 4 & 2 \\
\hline
\end{tabular}
}
\end{figure}

--------------------------------------------------------------------------------
memory

1. U oba slučaja ovaj deo programa pristupa višedimenzionalnim nizovima tako što su petlje ugnežđene redom po dimenzijama sleva nadesno, pa im zato pristupa tačno u redosledu u kom su elementi složeni u memoriju, odnosno redom svim lokacijama susednih stranica u koje su smešteni ti nizovi. Osim stranici sa instrukcijama i stranicama sa nizovima, ovaj deo programa ne pristupa nijednoj drugoj stranici, pošto ne pristupa statičkim niti automatskim podacima: brojači su u registrima procesora, a veličine nizova su konstante poznate u vreme prevođenja, pa će ih prevodilac smestiti kao neposredne konstante u same instrukcije i učitati u registre procesora radi poređenja.

   Prvi slučaj: u svakoj od tri trostruke petlje program pristupa po jednoj tekućoj stranici svakog od nizova `a` i `b`, `a` i `c`, odnosno `a` i `d`, plus što uvek pristupa i stranici sa instrukcijama. Prema tome, lokalitet u ovom slučaju obuhvata tri stranice.

   Drugi slučaj: u svakoj iteraciji jedine trostruke petlje program pristupa po jednoj tekućoj stranici svih nizova `a`, `b`, `c` i `d`, plus što uvek pristupa i stranici sa instrukcijama. Prema tome, lokalitet u ovom slučaju obuhvata pet stranica.
2. Prvi slučaj: u svakoj od tri trostruke petlje proces će izazvati po jednu straničnu grešku za pristup svakoj tekućoj stranici svakog od nizova `a` i `b`, `a` i `c`, odnosno `a` i `d`. Prema tome, ukupan broj straničnih grešaka je: $2n \cdot 3 = 6n$.

   Drugi slučaj: u jedinoj trostrukoj petlji proces će izazvati po jednu straničnu grešku za pristup svakoj tekućoj stranici svakog od nizova `a`, `b`, `c` i `d`. Prema tome, ukupan broj straničnih grešaka je: $4n$.

--------------------------------------------------------------------------------
slab

1. 
   ```cpp
   class CacheLocal {
   public:
       CacheLocal(Cache* globalCache);
       X* alloc();
       static void* operator new(size_t s) { return kernel_alloc(s); }
   private:
       Slab* slab;
       Cache* cache;
       void addSlabToCache(Slab* oldSlab);
   };

   CacheLocal::CacheLocal(Cache* globalCache) {
       if (!globalCache) {
           //Exception
       }
       cache = globalCache;
       slab = new Slab();
   }

   void CacheLocal::addSlabToCache(Slab* oldSlab) {
       if (oldSlab) {
           cache->lock();
           cache->addSlab(oldSlab);
           cache->unlock();
       }
   }

   X* CacheLocal::alloc() {
       X* ret = 0;
       if (slab) {
           slab->lock();
           ret = slab->alloc();
           slab->unlock();
       }
       if (!ret) {
           Slab* newSlab = new Slab();
           if (newSlab != 0) {
               ret = newSlab->alloc();
               addSlabToCache(slab);
               slab = newSlab;
           }
       }
       return ret;
   }
   ```
2. 
   ```cpp
   const int CPU_NUM = ...

   Cache *globalCache = new Cache();
   CacheLocal* localCaches[CPU_NUM];

   X* alloc() {
       CacheLocal *local = localCaches[getCpuId()];
       if (!local) {
           local = localCaches[getCpuId()] = new CacheLocal(globalCache);
           if (!local) {
               // Exception
           }
       }
       return local->alloc();
   }
   ```
