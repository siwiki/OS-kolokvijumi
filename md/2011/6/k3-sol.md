2011/jun/SI, IR Kolokvijum 3 - Jun 2011 - Resenja.doc
--------------------------------------------------------------------------------
semaphore
```cpp
class Data;

class DoubleBuffer {
public:
  DoubleBuffer (int size);
  void put (Data*);
  Data* get ();
private:
  Semaphore inputBufReady, outputBufReady;
  Data** buffer[2];
  int size, head, tail, slots, items, inputBuf, outputBuf;
};

DoubleBuffer::DoubleBuffer (int sz) : inputBufReady(1), outputBufReady(0) {
  buffer[0] = new (Data*)[sz];
  buffer[1] = new (Data*)[sz];
  size = sz;
  head=tail=0;
  slots=size; items=0;
  inputBuf=0; outputBuf=1;
}

void DoubleBuffer::put (Data* d) {
  if (slots==0) {
    inputBufReady.wait();
    outputBuf=!outputBuf;
    slots=size;
    tail=0;
  }
  buffer[outputBuf][tail++]=d;
  slots--;
  if (slots==0)
    outputBufReady.signal();
}

Data* DoubleBuffer::get () {
  if (items==0) {
    outputBufReady.wait();
    inputBuf=!inputBuf;
    items=size;
    head=0;
  }
  Data* d = buffer[inputBuf][head++];
  items--;
  if (items==0)
    inputBufReady.signal();
  return d;
}
```

--------------------------------------------------------------------------------
filesystem
```cpp
void check_access (PCB* p, FHANDLE f, int write) {
  return p->open_files[FHANDLE].access || !write;
}
```

--------------------------------------------------------------------------------
filesystem
```cpp
int check_consistency (FCB* file) {
  if (file==0) return 0;
  FID fid = file->id;
  int cur=file->head, prev=0;
  for (; cur!=0; prev=cur, cur=FAT[cur].next)
    if (FAT[cur].fid!=fid) {
      if (prev) FAT[prev].next=0;
      else file->head=0;
      return 0;
    }
  return 1;
}
```
