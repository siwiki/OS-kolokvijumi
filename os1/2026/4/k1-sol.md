2026/april/Kolokvijum 2026 - april.pdf
--------------------------------------------------------------------------------
linker
**a)(3) Virtuelni adresni prostor - završne adrese:**

Niz ima 0x100 = 256 elemenata po 4 bajta, što znači 0x400 = 1024 bajta po nizu.
Instrukcije: 0x40 bajta (od 20EFFFFC do 20F0002F, 34 bajta → zaokružili na 0x34 bajta)

| Deo virtuelnog adresnog prostora | Početna adresa (hex) | Završna adresa (hex) |
|---|---|---|
| Instrukcije | 20EFFFFC | 20F0002F |
| Niz a | 34CFFFF0 | 34D003EF |
| Niz b | 12000FF0 | 120013EF |

**b)(3) Kontinualna organizacija memorije:**

Sa kontinualnom organizacijom i baznom fizičkom adresom 30000000h, svi virtuelni adresni prostori se preslikavaju tako što se čuva relativna pozicija segmenata. Offset između virtuelnih segmenata je sačuvan i u fizičkom adresnom prostoru.

Virtuelna pozicija koda: 20EFFFFC
Fizička baza: 30000000h
Relativna pozicija niza a: 34CFFFF0 - 20EFFFFC = 13E01FF4
Relativna pozicija niza b: 12000FF0 - 20EFFFFC = F1FF0F4

| Deo virtuelnog adresnog prostora | Početna adresa (hex) | Završna adresa (hex) |
|---|---|---|
| Instrukcije | 30000000 | 3000002F |
| Niz a | 50CFFFF0 | 50D003EF |
| Niz b | 42000FF0 | 420013EF |

**c)(4) Segmentna organizacija memorije:**

Sa segmentnom organizacijom, fizička adresa se dobija tako što se offset unutar segmenta (niži biti virtuelne adrese) dodaje baznoj adresi segmenta.

Offset unutar svakog segmenta:
- Za kod: 20EFFFFC & 0xFFFFFF = EFFFFC
- Za niz a: 34CFFFF0 & 0xFFFFFF = CFFFF0
- Za niz b: 12000FF0 & 0xFFFFFF = 000FF0

| Deo virtuelnog adresnog prostora | Početna adresa (hex) | Završna adresa (hex) |
|---|---|---|
| Instrukcije | 30EFFFFC | 30F0002F |
| Niz a | 40CFFFF0 | 40D003EF |
| Niz b | 20000FF0 | 200013EF |

--------------------------------------------------------------------------------

page


```c
SCStatus extendRegion (RegionDesc* head, size_t startPage, size_t by) {
    for (; head; head = head->next) {
        if (head->startPage != startPage) continue;
        
        size_t maxPage = MAX_PAGE_NUM;
        if (head->next)
            maxPage = head->next->startPage - 1;
        
        if (startPage + head->size + by > maxPage) 
            return noMemory;
        
        head->size += by;
        return ok;
    }
    return illegalArg;
}
```

**Objašnjenje:**


- Prolazimo kroz ulančanu listu dok ne nađemo region koji počinje na traženoj stranici `startPage`
- Ako nema takvog regiona, vraćamo `illegalArg` (nevalidna vrednost parametra)
- Određujemo maksimalnu stranicu koju region može dosegnuti:
  - Ako postoji sledeći region, to je `head->next->startPage - 1`
  - Ako nema sledećeg, maksimalna stranica je `MAX_PAGE_NUM`
- Proveravamo da li proširenje ne bi prekoračilo maksimalnu granicu: `startPage + head->size + by <= maxPage`
- Ako ima dovoljno mesta, povećavamo veličinu regiona za `by` i vraćamo `ok`
- Ako nema mesta, vraćamo `noMemory`

--------------------------------------------------------------------------------

segpage

```c
int BSSSegment::loadPage (Process* pr, Page pg, Frame fr) {
    PageDesc* pd = pr->getPageDesc(pg);
    if (!pd->isAccessed()) {
        pd->setAccessed();
        if (this->isZeroInit) 
            writeZeros(fr);
        return 0;
    } else
        return pr->loadDataPage(pg, fr);
}

int DataSegment::loadPage (Process* pr, Page pg, Frame fr) {
    PageDesc* pd = pr->getPageDesc(pg);
    if (!pd->isAccessed()) {
        pd->setAccessed();
        return pr->loadExePage(pg, fr);
    } else
        return pr->loadDataPage(pg, fr);
}

int TextSegment::loadPage (Process* pr, Page pg, Frame fr) {
    return pr->loadExePage(pg, fr);
}
```

**Objašnjenje:**

**BSSSegment::loadPage:**


- Za BSS segment (inicijalizovan nulama ili neinicijalizovan), pri prvom pristupu stranici (isAccessed() vraća false):
  - Označavamo da je stranica pristupana pomoću setAccessed()
  - Ako je segment inicijalizovan nulama (isZeroInit == true), popunjavamo okvir nulama pomoću writeZeros()
  - Ako nije inicijalizovan (isZeroInit == false), ne učitavamo ništa sa diska
  - Vraćamo 0 (uspeh)
- Pri drugim pristupima stranici (isAccessed() vraća true), stranica je možda izbačena iz memorije, pa je učitavamo iz prostora za zamenu pomoću loadDataPage()

**DataSegment::loadPage:**


- Za segment sa inicijalizovanim podacima, pri prvom pristupu:
  - Označavamo da je stranica pristupana
  - Učitavamo stranicu iz exe fajla pomoću loadExePage() jer je podatak inicijalizovan u programu
  - Vraćamo status učitavanja
- Pri drugim pristupima, stranica može biti izbačena, pa je učitavamo iz prostora za zamenu

**TextSegment::loadPage:**


- Za segment sa kodom (instrukcijama), svaki put učitavamo stranicu iz exe fajla
- Kod se nikada ne menja tokom izvršavanja, pa se uvek učitava iz izvršnog fajla


