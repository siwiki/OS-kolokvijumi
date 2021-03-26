2013/septembar-nadoknade/SI, IR Kolokvijum 3 - Septembar 2013 - Resenja.pdf
--------------------------------------------------------------------------------
io
```cpp
class DoubleBuffer {
public:
  DoubleBuffer (int size, int chunkSize);
  void put (char* buffer);
  char get ();
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
  head = tail = 0;
  slots = size; items = 0;
  inputBuf = 0; outputBuf = 1;
}

void DoubleBuffer::put (char* buf) {
  if (slots==0) {
    inputBufReady.wait();
    outputBuf = !outputBuf;
    slots = size;
    tail = 0;
  }
  for (int i=0; i<chunk; i++) {
    buffer[outputBuf][tail++] = buf[i++];
    slots--;
  }
  if (slots==0)
    outputBufReady.signal();
}

char DoubleBuffer::get () {
  if (items==0) {
    outputBufReady.wait();
    inputBuf = !inputBuf;
    items = size;
    head = 0;
  }
  char ret = buffer[inputBuf][head++];
  items--;
  if (items==0)
    inputBufReady.signal();
  return ret;
}
```

--------------------------------------------------------------------------------
filesystem
1. `open(”./test.txt”, O_CREAT|O_RDWR, S_IRUSR|S_IWUSR|S_IRGRP);`
2. Neće. Taj korisnik (u čije ime se izvršava drugi proces) je pripadnik „ostalih“, pošto nije
ni vlasnik fajla niti pripadnik iste grupe, pa nema nikakva prava nad fajlom, a traži otvaranje
tog (sada postojećeg) fajla sa mogućnošću čitanja i upisa.

--------------------------------------------------------------------------------
filesystem
1. 1401
2. 2503
3. Jedan indeksni blok sadrži najviše 512B:4B = 128 ulaza. Maksimalna veličina fajla je: $2 \cdot 512$B + $4 \cdot 128 \cdot 512$B = 257KB.
