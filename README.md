# OS-kolokvijumi
Cilj projekta je izvoženje teksta sa [OS1](http://os.etf.bg.ac.rs/OS1/) i [OS2](http://os.etf.bg.ac.rs/OS2/) kolokvijuma kako bi se formatirali u Markdown a zatim kategorisali po oblasti i spojili u jedan PDF spreman za štampu.

Poslednju PDF i Markdown verziju dokumenta možete preuzeti iz [Releases](https://github.com/siwiki/OS-kolokvijumi/releases/latest).

## Kompajliranje
Prvo je potrebno da imate:
- [Node.js](https://nodejs.org/)
- [Pandoc](https://pandoc.org/)
- [PDFLaTeX](https://www.tug.org/applications/pdftex/)
- [Git](https://git-scm.com/)
- [librsvg](https://wiki.gnome.org/Projects/LibRsvg) ili [Inkscape](https://inkscape.org/)
- [Pygments](https://pygments.org/)

Zatim pokrenite sledeće komande:
```console
$ git clone https://github.com/siwiki/OS-kolokvijumi.git
$ cd OS-kolokvijumi
$ npm install
$ ./combine.sh os1
```
(Za OS2 zameniti argument u poslednjoj linija sa `os2`, OS1 se podrazumeva.)
i dobijate PDF (`os1-web.pdf` odnosno `os2-web.pdf`) i Markdown (`os1-web.md` odnosno `os2-web.md`) dokumente sa svim OS1 odnosno OS2 kolokvijumima. Ukoliko vam treba za štampu, pokrenite umesto poslednje komande:
```console
$ ./combine.sh -p os1
```
i dobijate PDF (`os1-print.pdf`) i Markdown (`os1-print.md`) dokumente sa malo manjim brojem strana.

## Razvijanje
Ukoliko planirate da doprinosite projektu, mogu vam biti korisne sledeće informacije:
- `combine.sh` prima argument godine (`-y YEAR`) za kompilaciju kao prvi argument, kada hoćete da kompajlirate jednu godinu a ne ceo dokument
    - Na primer: `./combine.sh -y 2017`
- U Markdown fajlove rešenja je takođe potrebno navoditi kategorije zbog toga što se kategorizacija dešava pre spajanja postavki i rešenja u `combine.js`
    - Ovo je bag koji možete da ispravite ukoliko želite
- Ukoliko je neka sekcija u rešenju loše formatirana, `combine.js` će javiti kako za taj zadatak ne postoji rešenje
- Pre Markdown uređenih i neuređenih lista je potrebno da stoji novi red, inače se neće dobro prepoznati kao liste
- GitHub-flavored Markdown (GFM) nije podržan, pa je potrebno koristiti LaTeX tabele
- Bilo kakav LaTeX je dozvoljen, ali ako je nešto lakše izraziti u Markdown tako i treba da stoji
