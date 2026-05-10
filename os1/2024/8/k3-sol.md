2024/avgust/IR, SI Kolokvijum 3 - Avg 2024 - Resenja.pdf
--------------------------------------------------------------------------------
io

```cpp
IORequest* pending_req;
size_t pending_cur;
REG* pending_buf = 0;
Event sleep(0);

void transfer (IORequest* req) {
  pending_req = req;
  pending_cur = 0;
  pending_buf = (REG*)(pending_req->buffer);

  mask_intr();
  *r_control = C_START;

  while (pending_cur < pending_req->len;) {
    unsigned long cnt = 0;
    bool ready = false;
    for (; !ready && cnt < MAX_POLL_CNT; cnt++)
      ready = (*r_status) & C_READY;
    if (ready)
      pending_buf[pending_cur++] = *r_data;
    else {
      unmask_intr();
      sleep.wait();
    }
  }

  *r_control = C_STOP;
  pending_req->signal();
}

interrupt void device_ready () {
  pending_buf[pending_cur++] = *r_data;
  mask_intr();
  sleep.signal();
}
```

--------------------------------------------------------------------------------

fsimpl

```text
mkdir a
ls
 a
cat >b
ls
 a  b
cat b
 xyz
mkdir c
ls
 a  b  c
ln b a/d
ls
 a  b  c
cat b>a/e
ls a
 d  e
ln a/e c/f
cat c/f
 xyz
rm b
cat a/d
 xyz
ls
 a  c

rm  c/f
ls a
 d  e
cat a/e
 xyz
```

--------------------------------------------------------------------------------
fsimpl

```cpp
void truncateFile (FCB* fcb, size_t newSize) {
  fcb->size = newSize;
  size_t blk = (newSize > 0) ? ((newSize - 1) / BlockSize + 1) : 0;
  for (; blk < SingleIndexSize; blk++)
    if (fcb->singleIndex[blk]) {
      freeBlock(fcb->singleIndex[blk]);
      fcb->singleIndex[blk] = 0;
    }

  if (fcb->dblIndex) {
    PBlock* dblIx = (Pblock*)getBlock(fcb->dblIndex);
    bool dblIxEmpty = false;
    for (blk -= SingleIndexSize, dblIxEmpty = (blk == 0); blk < DblIndexSize; blk++)
      if (dblIx[blk]) freeBlock(dblIx[blk]);
    if (dblIxEmpty) {
      freeBlock(fcb->dblIndex);
      fcb->dblIndex = 0;
    }
  }
}
```
