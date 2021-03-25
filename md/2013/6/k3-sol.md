2013/jun/SI, IR Kolokvijum 3 - Jun 2013 - Resenja.pdf
--------------------------------------------------------------------------------


1/1
Treći kolokvijum iz Operativnih sistema 1
Jun 2013.
1. (10 poena)
Byte* getDiskBlock (BlkNo blk) {
  // Find the requested block in the cache and return it if present:
  int hash = blk%CACHESIZE;
  if (diskCacheMap[hash]==blk) return diskCache[hash];
  // The block is not in the cache.
  // If there is a block to evict, write it to the disk:
  if (diskCacheMap[hash]!=0)
    diskWrite(diskCacheMap[hash],diskCache[hash]);
  // Load the requested block:
  diskCacheMap[hash] = blk;
  diskRead(blk,diskCache[hash]);
  return diskCache[hash];
}
2. (10 poena) Na  standardni  izlaz  ispisuje  sadržaj  tekućeg  direktorijuma,  tačnije,
nazive ulaza u tekućem direktorijumu (po jedan u redu).
3. (10 poena)
int fread (FCB* f, Byte* buf, int n) {
  if (f==0) return 0;
  if (f->cur+n>f->size) n = f->size – f->cur;
  int read = 0; // Number of bytes read
  while (n>0) {
    BlkNo blkNo = f->cur/BLKSIZE;
    int byte = f->cur%BLKSIZE;
    Byte* block = readFileBlock(f,blkNo);
    if (block==0) return read; // Exception
    while (byte<BLKSIZE && n>0) {
      buf[read++]=block[byte++];
      n--; f->cur++;
    }
  }
  return read;
}
