2012/jun/SI, IR Kolokvijum 3 - Jun 2012 - Resenja.pdf
--------------------------------------------------------------------------------
io
```cpp
Byte* getDiskBlock (BlkNo blk) {
  // Search for the requested block in the cache and return it if found:
  int hash = blk%CACHESIZE;
  int cursor = hash;
  for (int i=0; i<CACHESIZE; i++) {
    cursor = (hash+i)%CACHESIZE;
    if (diskCacheMap[cursor]==blk) return diskCache[cursor];
    if (diskCacheMap[cursor]==0) break;
  }
  // Not found.
  if (diskCacheMap[cursor]!=0) cursor=hash; // Cache full
  // If there is a block to evict, write it to the disk:
  if (diskCacheMap[cursor]!=0)
    diskWrite(diskCacheMap[cursor],diskCache[cursor]);
  // Load the requested block:
  diskCacheMap[cursor] = blk;
  diskRead(blk,diskCache[cursor]);
  return diskCache[cursor];
}
```
--------------------------------------------------------------------------------
filesystem

Neuspešna je operacija 2), ostale su uspešne.

--------------------------------------------------------------------------------
filesystem

1. 1001 

2. 4601

3. Jedan indeksni blok sadrži najviše 1024B:4B = 256 ulaza.
   Maksimalna veličina fajla je: 2·1KB + 2·256·1KB = 514KB.
