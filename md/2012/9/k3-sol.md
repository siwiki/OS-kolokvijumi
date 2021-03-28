2012/septembar/SI, IR Kolokvijum 3 - Septembar 2012 - Resenja.pdf
--------------------------------------------------------------------------------
buffer
```cpp
class DoubleBuffer {
public:
  DoubleBuffer (int size, int chunkSize);
  void put (char);
  void get (char* buffer);
private:
  Semaphore inputBufReady, outputBufReady;
  char* buffer[2];
  int size, chunk, head, tail, slots, items, inputBuf, outputBuf;
};

DoubleBuffer::DoubleBuffer (int sz, int cs)
  : inputBufReady(1), outputBufReady(0) {
  buffer[0] = new char[sz];
  buffer[1] = new char[sz];
  size = sz;
  chunk = ((cs>0)?cs:1);
  head=tail=0;
  slots=size; items=0;
  inputBuf=0; outputBuf=1;
}

void DoubleBuffer::put (char c) {
  if (slots==0) {
    inputBufReady.wait();
    outputBuf=!outputBuf;
    slots=size;
    tail=0;
  }
  buffer[outputBuf][tail++]=c;
  slots--;
  if (slots==0)
    outputBufReady.signal();
}

void DoubleBuffer::get (char* buf) {
  if (items==0) {
    outputBufReady.wait();
    inputBuf=!inputBuf;
    items=size;
    head=0;
  }
  for (int i=0; i<chunk; i++) {
    buf[i++] = buffer[inputBuf][head++];
    items--;
  }
  if (items==0)
    inputBufReady.signal();
}
```
--------------------------------------------------------------------------------
cmd

1. ```
  jane <file>
  chld <dir>
  foo <file>
  ```
2. ```
  foo <file>
  txt <dir>
  ```

--------------------------------------------------------------------------------
fsimpl

```cpp
Byte* getFileBlock (FCB* file, unsigned int block) {
  if (file==0 || file->index==0) return 0;
  BlkNo* index = (BlkNo*)getDiskBlock(file->index);
  if (index==0) return 0;
  while (block>=NumOfEntries) {
    block -= NumOfEntries;
    if (index[NumOfEntries]==0) return 0;
    index = (BlkNo*)getDiskBlock(index[NumOfEntries]);
    if (index==0) return 0;
  }
  if (index[block]==0) return 0;
  return getDiskBlock(index[block]);
}
```
