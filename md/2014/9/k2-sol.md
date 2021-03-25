2014/septembar%20-%20nadoknade/SI, IR Kolokvijum 2 - Septembar 2014 - Resenja.pdf
--------------------------------------------------------------------------------


1/2 
Rešenja zadataka za 
drugi kolokvijum iz Operativnih sistema 1 
Septembar 2014. 
1. (10 poena) 
class Event { 
public: 
  Event () : mySem(0), mutex(1) {} 
  void wait() { mySem.wait(); } 
  void signal(); 
  int val () { return mySem.val(); } 
private: 
  Semaphore mySem, mutex; 
}; 
 
inline void Event::signal () { 
  mutex.wait(); 
  if (mySem.val()<1) mySem.signal(); 
  mutex.signal(); 
} 
2. (10 poena) 
void Linker::firstPass () { 
  this.status = OK; 
  this.binarySize = 0; 
  for (FileReader::reset(); !FileReader::isDone(); FileReader::next()) { 
    ObjectFile* objFile = FileReader::currentObjectFile(); 
    if (objFile==0) { 
      Output::error(“Fatal internal error: null pointer exception.“); 
      exit(-1); 
    } 
    for (objFile.reset(); !objFile.isDone(); objFile.nextSymbol()) { 
      Symbol* sym = objFile->getCurrentSymbol(); 
      if (sym==0) { 
        Output::error(“Fatal internal error: null pointer exception.“); 
        exit(-1); 
      } 
      if (sym->getKind() == Symbol::export) { 
        int offset = sym->getOffset(); 
        offset += this.binarySize; 
        int status =  
          SymbolTable::addSymDef(sym->getName(),offset,objFile->getName()); 
        if (status==-1) { 
          Output::errorMsg(“Symbol %d already defined.“, sym->getName()); 
          this.status = ERROR; 
        } 
      } 
    } 
    int size = objFile->getBinarySize(); 
    this.binarySize += size; 
  }  
} 
4. (10 poena) 
a)(3)    VA(64): Page1(25):Page2(25):Offset(14). 
PA(40): Frame(26):Offset(14). 
b)(7) 

2/2 
const unsigned short pg1w = 25, pg2w = 25, offsw = 14; 
 
void setPMTEntry (unsigned* pmt1, unsigned long vaddr, unsigned fr, 
      short r, short w, short x) { 
  unsigned pmt1entry = vaddr>>(pg2w+offsw); 
  if (pmt1[pmt1entry]==0) 
    pmt1[pmt1entry] = alloc_pmt(); 
  unsigned* pmt2 = (unsigned*)(pmt1[pmt1entry] << offsw); 
  unsigned pmt2entry = (vaddr>>offsw) & ~(-1L<<pg2w); 
  pmt2[pmt2entry] = (fr<<2) | ((r||w)<<1) | (x||w); 
} 