2022/mart/SI Kolokvijum 1 - Mart 2022 - Resenja.pdf
--------------------------------------------------------------------------------
segment
```cpp
int createRegion(RegionDesc** phead, byte* addr, size_t sz) {
    if (!phead || !sz || addr + sz - 1 > MAX_VADDR) {
        return -1;
    }
    RegionDesc *prev = nullptr, *next = *phead;
    while (next && addr >= next->addr) {
        prev = next;
        next = next->next;
    }
    if (prev && prev->addr + prev->size > addr) {
        return -1;
    }
    if (next && addr + sz > next->addr) {
        return -1;
    }
    RegionDesc* dsc = (RegionDesc*) kmalloc(sizeof(RegionDesc));
    if (!dsc) {
        return -2;
    }
    dsc->addr = addr;
    dsc->size=sz;
    dsg->next = next;
    if (prev) {
        prev->next = dsc;
    } else {
        *phead = desc;
    }
    return 0;
}
```

--------------------------------------------------------------------------------
page
```cpp
const uint32 offsetw = 12;
const uint32 page1w = 10;
const uint32 PMT0_size = 1024;
const uint32 PMT1_size = 1024;

typedef uint32 PMT1[PMT1_SIZE];
typedef uint32 PMT0[PMT0_SIZE];

void* v2pAddr(PMT0 pmt, void* vaddr) {
    uint32 page = (uint32)vaddr >> offsetw;
    uint32 offset = (uint32)vaddr & ~((uint32)-1 << offsetw);
    uint32 page0 = page >> page1w;
    uint32 page1 = page & ~((uint32)-1 << page1w);
    uint32* pmt1 = (uint32*)pmt[page0];
    if (!pmt1) {
        return nullptr;
    }
    uint32 dsc = pmt1[page1];
    uint32 frame = dsc >> 3;
    if (!frame) {
        return nullptr;
    }
    uint32 paddr = (frame << offsetw) + offset;
    return (void*)paddr;
}
```

--------------------------------------------------------------------------------
segment

1. VA: Segment(16):Offset(16)
2. ```cpp
int shareSeg(SMT smt1, unsigned seg1, SMT smt2, unsigned seg2) {
    if (smt1[seg1] || !smt2[seg2]) {
        return -1;
    }
    smt1[seg1] = smt2[seg2];
    return 0;
}
```
