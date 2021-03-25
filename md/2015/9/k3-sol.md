2015/septembar/SI, IR Kolokvijum 3 - Septembar 2015 - Resenja.pdf
--------------------------------------------------------------------------------


1/1
Rešenja zadataka za treći kolokvijum iz
Operativnih sistema 1, septembar 2015.
1. (10 poena)
void putchar (IOHandle handle, char c) {
 static char buffer[BlockSize];
 static int cursor = 0;
 buffer[cursor++] = c;
 if (cursor==BlockSize) {
   writeBlock(handle,buffer);
   cursor = 0;
 }
}

2. (10 poena)
int append (int fhandle, byte* buffer, unsigned long sz) {
  int ret = 0;
  unsigned long oldSize = 0;
  ret = fgetsize(fhandle,oldSize);
  if (ret<0) return ret;
  unsigned long newSize = oldSize + sz;
  ret = fresize(fhandle,newSize);
  if (ret<0) return ret;
  ret = fmoveto(fhandle,oldSize);
  if (ret<0) return ret;
  ret = fwrite(fhandle,buffer,sz);
  return ret;
}
3. (10 poena)
unsigned extendFile (FCB* fcb, unsigned by) {
  if (fcb==0) return 0; // Exception
  // Find the first free block:
  for (unsigned free = 1; free<FATSIZE && (fat[free]!=~0U); free++);
  if (free==FATSIZE) return 0; // No free space
  // Find the file's tail block:
  unsigned tail = fcb->head;
  if (tail)
    while (fat[tail]) tail = fat[tail];
  // Extend the file:
  unsigned extendedBy = 0;
  while (1) {
    if (tail)
      fat[tail] = free;
    else
      fcb->head = free;
    tail = free;
    fat[tail] = 0;
    extendedBy++;
    if (extendedBy==by) return extendedBy;
    // Find the next free block:
    for (free++; free<FATSIZE && (fat[free]!=~0U); free++);
    if (free==FATSIZE) return extendedBy; // No more free space
  }
  return extendedBy;
}
