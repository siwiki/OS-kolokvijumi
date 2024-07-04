2024/jun/SI, IR Kolokvijum 3 - Jun 2024 - Resenja.pdf
--------------------------------------------------------------------------------
fsintr

```cpp
int redirect(const char* exe) {
    FILE* out = popen(exe,"w");
    if (!out) return -1;
    int fd = fileno(out);
    dup2(fd, 1);
    return 0;
}
```

--------------------------------------------------------------------------------
cmd

```bash
mkdir a
cat > b
mkdir c
ln b a/d
cat > a/e
ln a/e c/f
```

--------------------------------------------------------------------------------
fsimpl
U strukturu `FCBEntry` treba dodati sledeće članove za ulančavanje u dvostruko ulančanu LRU listu ulaza koji se ne koriste:
```cpp
FCBEntry *lruPrev = 0, *lruNext = 0; // For the LRU double-linked list
```
U  klasu `FCBCache` treba  dodati  sledeće  članove  koji  predstavljaju  glavu  i  rep  LRU  liste nekorišćenih ulaza; lista je uređena po hronologiji korišćenja:
```cpp
FCBEntry *lruHead = 0, *lruTail = 0; // LRU double-linked list
```
Pomoćna nestatička funkcija članica koja izbacuje dati ulaz iz LRU liste (ako je on u listi):
```cpp
inline void FCBCache::removeFromLRU(FCBEntry* f) {
    // If not in the LRU list, return:
    if (!f->lruPrev && !f->lruTail && this->lruHead != f) return;
    // Else, remove it from the LRU list:
    if (f->lruNext) f->lruNext->lruPrev = f->lruPrev;
    else this->lruTail = f->lruPrev;
    if (f->lruPrev) f->lruPrev->lruNext = f->lruNext;
    else this->lruHead = f->lruNext;
    f->lruNext = f->lruTail = 0;
}
inline void FCBCache::updateLRUonRequest(FCBEntry* f) {
    if (f && f->refCnt == 1) this->removeFromLRU(f);
}
inline void FCBCache::updateLRUonRelease(FCBEntry* f) {
    if (f && f->refCnt == 0) {
        // Insert it at the head of the LRU list
        f->lruNext = this->head;
        f->lruPrev = 0;
        if (this->lruHead) this->lruHead->lruPrev = f;
        else this->lruTail = f;
        this->lruHead = f;
    }
}
FCBEntry* getLRUVictim () {
    FCBEntry* f = this->lruTail; // Get it from the tail of the LRU list
    if (f) this->removeFromLRU(f);
    return f;
}
```
