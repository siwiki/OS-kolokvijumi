2011/septembar/SI, IR Kolokvijum 3 - Septembar 2011 - Resenja.doc
--------------------------------------------------------------------------------
ioblock
```cpp
class CharDevice {
public:
  CharDevice (BlockDevice* bd) : myDev(bd), cursor(BlockSize) {
    if (myDev) myDev->open();
  }

 ~CharDevice () { if (myDev) myDev->close(); }

  char getChar ();

protected:
  void load ();

private:
  BlockDevice* myDev;
  char buffer[BlockSize];
  int cursor;
};

void CharDevice::load () {
  if (myDev && cursor==BlockSize) {
    myDev->loadBlock(buffer);
    cursor=0;
  }
}

char CharDevice::getChar () {
  load();
  if (cursor<BlockSize) return buffer[cursor++];
  else return ’\0’; // Exception;
}

void main () {
  BlockDevice bd = ...;
  CharDevice input(bd);
  for (char c=input.getchar(); c!=’\0’; c=input.getchar())
    ...
}
```
--------------------------------------------------------------------------------
fsintr
```cpp
class File {
public:
  File (char* fname, int accessFlags);
 ~File ();
  int read (void* buffer, int size);
  int write (void* buffer, int size);
  int seek (unsigned int offset); // Move the cursor to the given offset
private:
  FHANDLE fh;
  unsigned int cursor;
};

File::File (char* fname, int af) : cursor(0) {
  fh=fopen(fname,af);
}

File::~File () { fclose(fh); }

int File::read (void* buffer, unsigned int size) {
  int ret = fread(fh,cursor,size,buffer);
  seek(cursor+size);
  return ret;
}

int File::write (void* buffer, unsigned int size) {
  int ret = fwrite(fh,cursor,size,buffer);
  seek(cursor+size);
  return ret;
}

int File::seek (unsigned int offset) {
  unsigned int size = fsize(fh);
  if (offset>=size) cursor=size;
  else cursor=offset;
  return 1;
}
```

--------------------------------------------------------------------------------
fsimpl
```cpp
void* f_getblk(FCB* file, BLKNO lb) {
  if (file==0) return 0; // Exception: null FCB

  unsigned long int entry = lb/INDEXSIZE;
  if (entry>=INDEXSIZE) return 0; // Exception: lb too large!

  BLKNO* index = (BLKNO*)f_getblk(file->index);
  if (index==0) return 0; // Exception: error accessing index!

  BLKNO index2blk = index[entry];
  if (index2blk==0) return 0;  // Access over the file’s boundary

  index = (BLKNO*)f_getblk(index2blk);
  if (index==0) return 0; // Exception: error accessing index!

  entry = lb%INDEXSIZE;
  return f_getblk(index[entry]);
}
```
