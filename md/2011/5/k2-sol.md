2011/maj/SI, IR Kolokvijum 2 - Maj 2011 - Resenja.doc
--------------------------------------------------------------------------------
semintr
```ada
shared var
  a, b : integer := 0;
  sa, sb : semaphore := 0;

process a;
begin
  loop
    compute_a(b);
    sa.signal();
    sb.wait();
  end;
end;

process b;
begin
  loop
    sa.wait();
    compute_b(a);
    sb.signal();
  end;
end;
```

--------------------------------------------------------------------------------
semimpl
```cpp
void Semaphore::lock () {
  for (int acquired = 0; !acquired;) {
    while (this->isLocked);
    acquired = !test_and_set(this->isLocked);
  }
}
```

--------------------------------------------------------------------------------
overlay
```cpp
class DLArray {
public:
  inline DLArray (int size, int blockSize, FHANDLE fromFile);

  inline double get (int i);  // Get element [i]
  inline void set (int i, double x); // Set element [i]

protected:
  inline void save();
  inline void load(int blockNo);
  inline void fetch(int blockNo);

private:
  FHANDLE file;
  int size, blockSize;
  int curBlock;
  int dirty;
  double* block;
};


DLArray::DLArray (int s, int bs, FHANDLE f) :
  file(f), size(s), blockSize(bs), curBlock(0), dirty(0) {
  block = new double[bs];
  if (block) load(curBlock);
}

void DLArray::save () {
  fwrite(file,curBlock*blockSize,block,blockSize);

  dirty=0;
}


void DLArray::load (int b) {
  curBlock = b;
  fread(file,curBlock*blockSize,block,blockSize);
  dirty = 0;
}

void DLArray::fetch(int b) {
  if (curBlock!=b) {
    if (dirty) save();
    load(b);
  }
}

double DLArray::get (int i) {
  if (block==0 || i<0 || i>=size) return 0; // Exception
  fetch(i/blockSize);
  return block[i%blockSize];
}

void DLArray::set (int i, double x) {
  if (block==0 || i<0 || i>=size) return; // Exception
  fetch(i/blockSize);
  if (block[i%blockSize]!=x) {
    block[i%blockSize]=x;
    dirty=1;
  }
}
```

--------------------------------------------------------------------------------
page
*Proces Parent:*

\begin{figure}[H]
\subfloat[PMT]{
\begin{tabular}{ |c|c|c| }
\hline
Page\# & Frame\# & RWE \\
\hline
A04h & 23h & 001 \\
\hline
BF0h & 14h & 100 \\
\hline
C0Ah & 7Ah & 100 \\
\hline
\end{tabular}
}
\subfloat[VMStruct]{
\begin{tabular}{ |c|c|c|c| }
\hline
StartPage\# & Region Length & RWE-Copy-On-Write & Opis \\
\hline
A00h & 50h & 001-0 & Code Region \\
\hline
B00h & FFh & 110-0 & Data Region \\
\hline
C00h & 70h & 100-0 & Input Buffer Region \\
\hline
\end{tabular}
}
\end{figure}

*Proces Child:* Sve isto.

Napomena: Primetiti da se u opisanom sistemu bit Copy-On-Write (u daljem tekstu CoW)
odnosi na čitav set stranica. Zbog toga ovaj bit nije dovoljan da bi se odredilo da li pri upisu u
neku stranicu iz seta, tu stranicu treba kopirati. Stranice koje pri upisu stvarno treba kopirati
su one koje pripadaju regionu za koji je postavljen bit CoW i kojima je u trnutku upisa bitom
W u PMT zabranjen upis. Kada jednom dođe do upisa i samim tim i do kopiranja stranice, za
novu kopiju se setuje bit W u PMT i pri kasnijim upisima u tu stranicu ne treba vršiti
kopiranje te stranice bez obzira što stranica pripada regionu za koji je setovan CoW bit. Stoga
bi se sistem mogao implementirati tako da se u CoW bit jednom upiše vrednost pri pokretanju
procesa i više nikada ne menja. U takvoj varijanti, CoW bit bi čak bio suvišan jer bi uvek
imao istu vrednost kao i W bit u VMStruct strukturi.
