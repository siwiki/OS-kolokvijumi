2019/jun/SI, IR Kolokvijum 3 - Jun 2019 - Resenja.pdf
--------------------------------------------------------------------------------
io
U klasi `BlockIOCache` potreban je još sledeći nestatički podatak član:
```cpp
int BlockIOCache::toReplace = 0;
```
```cpp
void BlockIOCache::read(BlkNo blk, byte* buffer, size_t offset, size_t sz)
{
  // Search for the requested block in the cache:
  int entry = -1;
  for (int i=0; i<this->numOfBlocks && entry<0; i++)
    if (this->cacheMap[i]==blk) entry = i; // Block found
  if (entry<0) {
    // The block is not in the cache, load it to the cache:
    if (this->numOfBlocks<CACHESIZE)
      entry = this->numOfBlocks++;  // Load it to a free slot
    else {
      entry = this->toReplace++; // Replace the least recently loaded block
      this->toReplace %= CACHESIZE;
    }
    this->cacheMap[entry] = blk;
    ioRead(this->dev,blk,this->cache[entry]);
  }
  // Copy the extract to the buffer and return:
  for (size_t j=0; j<sz && offset+j<BLKSIZE; j++)
    buffer[j] = this->cache[entry][offset+j];
}
```

--------------------------------------------------------------------------------
filesystem
```cpp
#include <cstdio>
using namespace std;

int binary_search (const char* filename, unsigned n, int x) {
  FILE* f = fopen(filename, "rb");
  long nodeIndex = 0;
  int nodeValue;
  for (unsigned i=0; i<n; i++) {
    fseek(f,nodeIndex*sizeof(nodeValue),SEEK_SET);
    fread(&nodeValue,sizeof(nodeValue),1,f);
    if (x==nodeValue) { fclose(f); return 1; }
    if (x<nodeValue)
      nodeIndex = 2*nodeIndex + 1;
    else
      nodeIndex = 2*nodeIndex + 2;
  }
  fclose(f);
  return 0;
}
```

--------------------------------------------------------------------------------
filesystem
Za dati slučaj, program pristupa elementima niza sa sledećim indeksima ($ni:=2ni+2$):

0, 2, 6, 14, 30, 62, 126, 254, 510, 1022, 2046, 4094.

Svaki  element  niza  zauzima  4=$2^2$ bajta, a blok je veličine 512B=$2^9$B, pa jedan blok sadrži
$2^7$=128  elemenata  niza.  Zato  prvih  7  adresiranih  elemenata  niza  pripada  istom  bloku  sa
sadržajem fajla (bloku broj 0), dok su svi ostali elementi u različitim blokovima.
Navedeni elementi pripadaju redom sledećim logičkim blokovima sadržaja fajla:

0, 0, 0, 0, 0, 0, 0, 1, 3, 7, 15, 31.

1.  Za  slučaj  indeksa  u  jednom  nivou,  dohvata  se  ukupno  1+5=6  blokova  sa  sadržajem
(indeksni blok je već učitan).
2. Za slučaj indeksa u dva nivoa, jedan ulaz u indeksu prvog nivoa, odnosno jedan indeksni
blok  drugog  nivoa,  pokriva  $2^6$=64  blokova  sa  sadržajem,  pa  su  svi  adresirani  elementi
pokriveni  jednim  indeksnim  blokom  drugog  nivoa.  Zato  se  ukupno  dohvata  jedan  indeksni
blok drugog nivoa i 6 blokova sa sadržajem, ukupno 7.
