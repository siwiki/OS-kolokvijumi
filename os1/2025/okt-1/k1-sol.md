2025/okt-1/Kolokvijum 2025 - okt1 - Resenja.pdf
--------------------------------------------------------------------------------
segment
```
void* createRegion (RegionDesc* phead, size_t sz) {
  if (!phead || !sz) return nullptr;
  RegionDesc* bestPrev = nullptr;
  size_t bestSize = 0;
  for (RegionDesc* prev = phead; prev; prev = prev->next) {
    size_t freeSz;
    if (prev->next) freeSz = prev->next->addr – (prev->addr+prev->size);
    else freeSz = MAX_VADDR+1 – (prev->addr+prev->size);
    if ((freeSz>=sz) && (!bestPrev || freeSz<bestSize)) {
      bestPrev = prev;
      bestSize = freeSz;
    }
  }
```
 
```
  if (!bestPrev) return nullptr;
  RegionDesc* dsc = (RegionDesc*)kmalloc(sizeof(RegionDesc));
  if (!dsc) return nullptr;
  size_t addr = bestPrev->addr+bestPrev->size;
  dsc->addr = addr; dsc->size=sz; dsc->next = bestPrev->next;
  bestPrev->next = dsc;
  return addr;
}
```

