2024/mart/SI Kolokvijum 1 - Mart 2024 - Resenja.pdf
--------------------------------------------------------------------------------
linker

1. Sva tri logička segmenta su vrlo mala, očigledno manja od jedne stranice (videti odgovor pod c). Sva tri navedena simbola se preslikavaju u relativne pomeraje 0 svojih segmenta, tako da se simboli preslikavaju u sledeće virtuelne adrese:
   
   `a`: 0, `main`: 0x1000 (4K), `max`: 0x2000 (8K)
2. Pri pozivu potprograma `max`, pozivalac (`main`) na vrh steka stavlja sadržaj prva dva 32- bitna elementa niza `a`, tj. 1 i 2, a potom vrednost PC-a tokom izvršavanja instrukcije `call`. Tako se na vrhu steka nalaze redom vrednosti: 1, 2, 0x1020 (adresa prve instrukcije iza instrukcije `call` je 4K+32, jer instrukcije zaključno sa instrukcijom `call` zauzimaju 8 32- bitnih reči).
3. Prvi segment (`data`) koristi pet 32-bitnih reči (20 bajtova). Drugi segment (`text`) koristi 11 32-bitnih reči (44 bajta). Treći segment takođe koristi 11 reči (44 bajta). Ukupno je iskorišćeno 108 bajtova od tri cele stranice (12KB). Interna fragmentacija uključuje sav ovaj neiskorišćen prostor veličine 12KB - 108B.

--------------------------------------------------------------------------------
cont

```cpp
int alloc(int size) {
    if (size <= 0 || size > NumOfBlocks) return -1; // Exception
    for (int i = 0; i < NumOfBlocks; i++)
        if (memMap[i] >= size) {
            if (memMap[i] > size)
                memMap[i+size] = memMap[i]-size;
            memMap[i] = -size;
            return i;
        }
    return -1; // No free mem
}
```
Moguće je učiniti ovu implementaciju efikasnijom, tako da preskače sve blokove koji pripadaju istom zauzetom ili slobodnom segmentu čim detektuje prvi – ostavlja se čitaocu.

--------------------------------------------------------------------------------
page

```cpp
int SegDesc::allocPage(Page page) {
    Frame frame = 0;
    if (this->sharedSeg) {
        Page otherPage = page – this->startPage + this->sharedSeg->startPage;
        frame = this->sharedSeg->pmt->getFrame(otherPage);
    }
    int status = 0;
    if (!frame) {
        frame = getFreeFrame();
        status = this->initPage(page, frame);
        if (!status) return status;
    }
    this->pmt->setFrame(page, frame);
    return status;
}
```
