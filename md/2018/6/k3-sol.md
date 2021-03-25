2018/jun/SI, IR Kolokvijum 3 - Jun 2018 - Resenja.pdf
--------------------------------------------------------------------------------
io

```cpp
void readBlock (char* addr) {
  for (int i=0; i<BlockSize; i++)
    addr[i] = getchar();
}
```

--------------------------------------------------------------------------------
filesystem
```cpp
#include <unistd.h>
#include <fctl.h>

int fcopy (const char *filenamefrom, const char *filenameto) {
  static const int BufferSize = 1024;
  char buffer[BufferSize];

  int ffrom = open(filenamefrom,O_RDONLY);
  if (ffrom<0) return ffrom;

  int fto = open(filenameto,O_WRONLY|O_CREAT|O_APPEND|O_TRUNC);
  if (fto<0) {
    close(ffrom);
    return fto;
  }

  do {
    ssize_t numRead = read(ffrom,buffer,BufferSize);
    if (numRead<0) {
      close(ffrom);
      close(fto);
      return numRead;
    }
    ssize_t numWritten = 0;
    while (numWritten<numRead) {
      ssize_t nw = write(fto,&buffer[numWritten],numRead-numWritten);
      if (nw<0) {
        close(ffrom);
        close(fto);
        return nw;
      }
      numWritten += nw;
    }
  while (numRead!=0);

  close(ffrom);
  close(fto);
  return 0;
}
```

--------------------------------------------------------------------------------
filesystem

```cpp
unsigned long extend (FCB* fcb, unsigned extension) {
  if (fcb==0) return 0;

  unsigned long oldSize = fcb->size;
  unsigned oldNumOfBlocks = oldSize/BlockSize + oldSize%BlockSize?1:0;

  unsigned long newSize = oldSize + extension;
  if (newSize>MaxFileSize) newSize = MaxFileSize;
  unsigned newNumOfBlocks = newSize/BlockSize + newSize%BlockSize?1:0;

  unsigned i;
  for (i=oldNumOfBlocks; i<newNumOfBlocks; i++) {
    unsigned long block = allocateBlock();
    if (block==0) break;
    fcb->index[i] = block;
  }

  if (i<newNumOfBlocks)
    newSize = i*BlockSize;

  fcb->size = newSize;
  return newSize-oldSize;
``` 