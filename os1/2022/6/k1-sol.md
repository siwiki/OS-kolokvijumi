2022/jun/IR, SI Kolokvijum 1 - Jun 2022 - Resenja.pdf
--------------------------------------------------------------------------------
linker

1. Greška u povezivanju jer simbol `f` nije definisan.
2. Nema grešaka.
3. Greška u prevođenju `a.c` zbog višestruke definicije identifikatora `x`.
4. Greška u povezivanju jer je simbol `x` višestruko definisan (u fajlu `a.o` i `b.o`).

--------------------------------------------------------------------------------
page
```cpp
class FreeFrames {
public:
    FreeFrames(void* mem, size_t size);
    void* alloc();
    void free(void* frame);
private:
    char* head;
};

void FreeFrames::FreeFrames (void* mem, size_t size) {
    char* frame = head = (char*)mem;
    for (int i = 0; i < size - 1; i++) {
        frame = (*(char**)frame) = frame + PAGE_SIZE;
    }
    *(char**)frame = 0;
}

inline void* FreeFrames::alloc () {
    void* ret = head;
    if (head) {
        head = *(char**)head;
    }
    return ret;
}

inline void FreeFrames::free (void* frame) {
    *(char**)frame = head;
    head = (char*)frame;
}
```

--------------------------------------------------------------------------------
segpage
- VA(32): Segment(8).Page(8).Offset(16);
- PA: Frame(16).Offset(16)

```cpp
const unsigned SEG_WIDTH = 8, PAGE_WIDTH = 8, OFFS_WIDTH = 16,
               MAX_SEG_SIZE = 1U << PAGE_WIDTH << OFFS_WIDTH,
               PAGE_SIZE = 1U << OFFS_WIDTH;

inline void setSMTEntry(unsigned smt[][2], unsigned seg, unsigned limit,
    unsigned short* pmt, unsigned short rwx) {
    smt[seg][0] = ((unsigned)rwx << 29) | limit;
    smt[seg][1] = (unsigned)pmt;
}
int initSegment(SegDesc* sd, unsigned smt[][2]) {
    unsigned size = sd->size;
    unsigned saddr = sd->startAddr;
    unsigned segs = (size + MAX_SEG_SIZE - 1) / MAX_SEG_SIZE;
    if (PMT::reserve(segs) < 0) {
        return -1;
    }
    while (size > 0) {
        unsigned short* pmt = PMT::alloc();
        unsigned limit = size > MAX_SEG_SIZE ? MAX_SEG_SIZE-1 : size-1;
        limit >>= OFFS_WIDTH;
        unsigned seg = saddr >> (PAGE_WIDTH + OFFS_WIDTH);
        setSMTEntry(smt, seg, limit, pmt, sd->rwx);
        if (size < MAX_SEG_SIZE) {
            break;
        }
        size -= MAX_SEG_SIZE;
        saddr += MAX_SEG_SIZE;
    }
    return 0;
}
```
