2016/septembar/SI, IR Kolokvijum 2 - Septembar 2016 - Resenja.pdf
--------------------------------------------------------------------------------
ipc
U klasu `Thread` treba dodati sledeće članove:
```cpp
char* Thread::message(0);
Semaphore msgEmpty(1), msgAvailable(0);
```
```cpp
void Thread::send (char* msg) {
  this->msgEmpty.wait();
  this->message = msg;
  this->msgAvailable.signal();
}

char* Thread::receive () {
  Thread::running->msgAvailable.wait();
  char* msg = Thread::running->message;
  Thread::running->msgEmpty.signal();
  return msg;
}
```

--------------------------------------------------------------------------------
linker
```cpp
typedef unsigned long ulong;
const ulong OffsBinaryStartOffset = 0,
         OffsNumOfImportedSymbols = OffsBinaryStartOffset + sizeof(ulong),
         OffsImportedSymbols = OffsNumOfImportedSymbols + sizeof(ulong);

int resolveSymbols (char* inputObj, char* output) {
  ulong binaryStartOffs = *(ulong*)(inputObj + OffsBinaryStartOffset);
  char* binaryStart = inputObj + binaryStartOffs;
  ulong numOfSymbols = *(ulong*)(inputObj + OffsNumOfImportedSymbols);
  char* symbol = inputObj + OffsImportedSymbols;
  for (ulong i=0; i<numOfSymbols; i++) {
     ulong addr = SymbolTable::resolveSymbol(symbol);
     if (addr==0) return errorSymbolUndefined(symbol);
     ulong symbolLen = strlen(symbol)+1;
     ulong fieldOffs = *(ulong*)(symbol+symbolLen);
     for (; fieldOffs>0; fieldOffs=*(ulong*)(binaryStart+fieldOffs))
       *(ulong*)(output+fieldOffs) = addr;
     symbol = symbol+symbolLen+sizeof(fieldOffs);
  }
  return 0;
}
```

--------------------------------------------------------------------------------
page
1. VA(64): Page1(24):Page2(24):Offset(16).
   
   PA(42): Frame(26):Offset(16).
2. 
```cpp
const unsigned short pg1w = 24, pg2w = 24, offsw = 16;
cont unsigned pmt1size = 1<<pg1w, pmt2size = 1<<pg2w;

void releasePMTEntry (unsigned* pmt1, unsigned long page) {
  unsigned pmt1entry = page>>(pg2w);
  unsigned* pmt2 = (unsigned*)(((unsigned long)pmt1[pmt1entry])<<offsw);
  unsigned pmt2entry = (page) & ~(-1L<<pg2w);
  pmt2[pmt2entry] = 0;
  for (pmt2entry=0; pmt2entry<pmt2size; pmt2entry++)
    if (pmt2[pmt2entry]!=0) return;
  // PMT2 empty, release it:
  dealloc_pmt(pmt2);
  pmt1[pmt1entry] = 0;
}
```
