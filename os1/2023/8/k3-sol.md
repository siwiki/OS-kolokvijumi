2023/avgust/IR, SI Kolokvijum 3 - Avgust 2023 - Resenja.pdf
--------------------------------------------------------------------------------
ioblock
U klasu `BlockIOCache` treba uvesti privatne podatke članove numOfBlocks i hand, oba tipa int i inicijalizovana na 0.
```cpp
int BlockIOCache::getFreeEntry() {
    if (numOfBlocks < CACHESIZE) return numOfBlocks++;
    int oldHand = hand;
    do {
        if (entries[hand].refCounter == 0) {
            ioWrite(dev, entries[hand].blkNo, entries[hand].buf);
            int ret = hand;
            hand = (hand + 1) % CACHESIZE;
            return ret;
        }
        hand = (hand + 1) % CACHESIZE;
    } while (hand != oldHand);
    return -1; // Cannot find a block to evict
}
```

--------------------------------------------------------------------------------
cmd

1. `cat > a/doc`
2. `ln a/doc b/hdoc`
3. `ln -s b/hdoc c/sdoc`
4. `rm a/doc`
5. Komanda `cat b/hdoc` će ispisati uneti sadržaj učitan sa tastature i upisan u fajl u prvoj komandi.
6. Nakon komande `rm b/hdoc`, komanda `cat c/sdoc` će ispisati grešku (fajl ne postoji).

--------------------------------------------------------------------------------
fsimpl
```cpp
Node* Node::getNodeAbs(const char* pStart, const char* pEnd) {
    const char *pE = pEnd;
    while (pE > pStart) {
        Node* node = DentryCache::getNode(pStart, pE);
        if (node) {
            if (pE < pEnd) node = Node::getNodeRel(pE + 1, pEnd, node);
            if (node) DentryCache::store(pStart, pEnd, node);
            return node;
        }
        do { pE--; } while (pE > pStart && *pE != delimiter);
    }
    Node* node = Node::getNodeRel(pStart + 1, pEnd, Node::root);
    if (node) DentryCache::store(pStart, pEnd, node);
    return node;
}
```
