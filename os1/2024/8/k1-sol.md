2024/avgust/IR, SI Kolokvijum 1 - Avgust 2024 - Resenja.pdf
--------------------------------------------------------------------------------
linker

```cpp
void fillIn (uint32_t importTblOffset) {
  uint32_t offs = importTblOffset;
  uint32_t size = readUint32(offs);
  offs += 4;
  for (uint32_t i = 0; i < size; i++) {
    uint32_t addr = getSymbolAddr(offs);
    if (addr == 0) error(SYM_UNDEF, offs);
    while (readChar(offs)) offs++;
    offs++;
    for (uint32_t gapOffs = readUint32(offs); gapOffs;
         gapOffs = readUint32(offs))
      writeUint32(gapOffs, addr);
    offs += 4;
  }
}
```

--------------------------------------------------------------------------------

cont

```cpp
inline void mergeWithNextFree (int blk) {
  int size = -mmap[blk];
  if (size < 0 || blk + size >= MAX_BLK - 1 || mmap[blk + size] >= 0) return;
  int newSize = size - mmap[blk + size];
  mmap[blk + size - 1] = mmap[blk + size] = 0; // Not necessary
  mmap[blk] = mmap[blk + newSize - 1] = -newSize;
}

void freeSeg (int blk) {
  int size = mmap[blk];
  if (size < 0) return; // Already free
  mmap[blk] = mmap[blk + size - 1] = -size;  // Free this segment
  mergeWithNextFree(blk);
  if (blk > 1 && mmap[blk - 1] < 0)
    mergeWithNextFree(blk + mmap[blk - 1]); // Merge with previous
}
```

--------------------------------------------------------------------------------

dynload

Ova dva procesa dele sve stranice segmenta za programski kod, ukupno njih 140 (560 KB). Od stranica u kojima je segment za statičke podatke, kojih ukupno ima 269 (1076 KB), procesi su ukupno promenili 16+8-2 = 22 stranice, pa im je zajedničkih ostalo 269-22 = 247 stranica koje dele jer ih ne menjaju. Zato ta dva procesa, nakon svih navedenih izmena stranica za podatke, za te podatke zauzimaju ukupno 247+2*22 = 291 okvir.

Od stranica koje zauzima stek, procesi dele (bez izmena) 32 stranice (128 KB) dna steka, dok proces roditelj koristi najviše 140 stranica (560 KB), a proces dete najviše 160 stranica (640 KB). Zato oni ukupno zauzimaju 32 + (140-32) + (160-32) = 268 okvira za svoje stekove.

Tako procesi ukupno zauzimaju 140 + 291 + 268 = 699 okvira, odnosno 2716 KB fizičke memorije.
