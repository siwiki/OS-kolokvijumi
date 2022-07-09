2022/maj/IR Kolokvijum 1 - Maj 2022 - Resenja.pdf
--------------------------------------------------------------------------------
segment
```cpp
void* createRegion(RegionDesc* phead, size_t sz) {
    if (!phead || !sz) {
        return nullptr;
    }
    RegionDesc* prev = phead;
    while (prev->next && prev->addr + prev->size + sz > prev->next->addr) {
        prev = prev->next;
    }
    byte* addr = prev->addr + prev->size;
    if (!prev->next && addr + sz - 1 > MAX_VADDR) {
        return nullptr;
    }
    RegionDesc* dsc = (RegionDesc*)kmalloc(sizeof(RegionDesc));
    if (!dsc) {
        return nullptr;
    }
    dsc->addr = addr;
    dsc->size=sz;
    dsg->next = prev->next;
    prev->next = dsc;
    return addr;
}
```

--------------------------------------------------------------------------------
page
```cpp
const uint32 offsetw = 10;
const uint32 pagew = 12;
const uint32 PMT_size = 4096;
const uint32 SMT_size = 1024;

typedef uint32 PMT[PMT_SIZE];
typedef uint32 SMT[SMT_SIZE][2];

void* v2pAddr(SMT smt, void* vaddr) {
    uint32 seg = (uint32)vaddr >> (pagew + offsetw);
    uint32 page = ((uint32)vaddr >> offsetw)) & ~((uint32)-1<<pagew);
    uint32 offset = (uint32)vaddr & ~((uint32)-1 << offsetw);
    uint32* pmt = (uint32*)smt[seg][0];
    if (!pmt) {
        return nullptr;
    }
    uint32 limit = smt[seg][1] >> 3;
    if (page > limit) {
        return nullptr;
    }
    uint32 frame = pmt[page];
    if (!frame) {
        return nullptr;
    }
    uint32 paddr = (frame << offsetw) + offset;
    return (void*)paddr;
}
```

--------------------------------------------------------------------------------
segment

1. VA: Page(16):Offset(16); PA: Frame(14):Offset(16)
2. ```cpp
ushort MAXPAGE = -1;
int sharePages(PMT pmt1, ushort pg1, PMT pmt2, ushort pg2, ushort cnt) {
    if (MAXPAGE-cnt <= pg1 || MAXPAGE-cnt <= pg2) {
        return -1; // Overflow
    }
    for (ushort i = 0; i < cnt; i++) {
        if (pmt1[pg1 + i] != 0 || pmt2[pg2 + i] == 0) {
            return -1;
        }
    }
    for (ushort i = 0; i < cnt; i++) {
        pmt1[pg1 + i] = pmt2[pg2 + i];
    }
    return 0;
}
```
