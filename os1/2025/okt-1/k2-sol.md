2025/okt-1/Kolokvijum 2025 - okt1 - Resenja.pdf
--------------------------------------------------------------------------------
buffer
```
template<typename T, int PackageSize, int NumOfPkgs>
class BoundedBuffer {
public:
  BoundedBuffer () {}
  void append (T pkg[]);
  T take ();
```
  
```
private:
  static const int size = PackageSize*NumOfPkgs;
  T buffer[size];
  int head = 0, tail = 0;
  Semaphore mxProd=1, mxCons=1, spaceAvailable=size, itemAvailabe=0;
};
template<typename T, int P, int N>
void BoundedBuffer<T,P,N>::append (T p[]) {
  for (int i=0; i<P; i++) spaceAvailable.wait();
  mxProd.wait();
    for (int i=0; i<P; i++) {
      buffer[tail] = p[i];
      tail = (tail+1) % size;
    }
  mxProd.signal();
  for (int i=0; i<P; i++) itemAvailable.signal();
}
```

```
template<typename T, int P, int N>
T BoundedBuffer<T,P,N>::take () {
  itemAvailable.wait();
  mxCons.wait();
    T t = buffer[head];
    head = (head+1) % size;
  mxCons.signal();
  spaceAvailable.signal();
  return t;
}
```

