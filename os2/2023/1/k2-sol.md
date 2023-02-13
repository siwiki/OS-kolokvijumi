2022/januar/SI, IR Kolokvijum 2 - Januar 2023 - Resenja.pdf
--------------------------------------------------------------------------------
deadlock
Tihi je u pravu sa tvrdnjom da prikazano rešenje ima opisani problem, ali rešenje koje on predlaže i dalje nije ispravno, jer i dalje ima potencijalnu mrtvu blokadu na sledeći način: proces $Y$ može prvi zauzeti resurs $A$, a zatim doći do sinhronog prijema poruke na kom se blokira. Proces $X$ ne može doći do tačke slanja jer pre toga mora da zauzme resurs $A$, što ne može, jer je resurs $A$ zauzet, pa se i on blokira i tako procesi ulaze u mrtvu blokadu.

--------------------------------------------------------------------------------
memory
```cpp
void FrameAllocator::allocFrame() {
    if (headFree >= 0) {
        int frame = headFree;
        headFree = next[frame];
        if (clockHead < 0)
            clockHead = frame;
        else {
            int i = clockHead;
            while (next[i] != clockHead) i = next[i];
            next[i] = frame;
        }
        next[frame] = clockHead;
        return frame;
    } else {
        for (; 1; clockHead = next[clockHead])
            if (pd[clockHead]->getRefBit())
                pd[clockHead]->clearRefBit();
            else {
                int frame = clockHead;
                clockHead = next[clockHead];
                return frame;
            }
    }
}
```

--------------------------------------------------------------------------------
buddy
```cpp
void* Buddy::free(void* addr, int size) {
    int block = ((char*)addr - mem) / (PAGE_SIZE << size);
    while (size < BUCKET_SIZE - 1) {
        int buddy = block % 1 ? block - 1 : block + 1;
        if (bucket[size][buddy] == ALLOC) {
            setBlock(size, block, FREE);
            return;
        }
        setBlock(size, buddy, ALLOC);
        block /= 2;
        size++;
    }
    setBlock(BUCKET_SIZE - 1, 0, FREE);
}
```
