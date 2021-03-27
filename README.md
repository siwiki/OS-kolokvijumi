# OS1-kolokvijumi
Cilj projekta je izvoženje teksta sa [OS1](http://os.etf.bg.ac.rs/OS1/) kolokvijuma kako bi se formatirali u Markdown a zatim kategorisali po oblasti i spojili u jedan PDF spreman za štampu.

Poslednju PDF i Markdown verziju dokumenta možete preuzeti iz [Releases](https://github.com/KockaAdmiralac/OS1-kolokvijumi/releases/latest).

## Kompilacija
Prvo je potrebno da imate:
- [Node.js](https://nodejs.org/)
- [Pandoc](https://pandoc.org/)
- [XeTeX](http://xetex.sourceforge.net/)
- [Git](https://git-scm.com/)

Zatim pokrenite sledeće komande:
```console
$ git clone https://github.com/KockaAdmiralac/OS1-kolokvijumi.git
$ cd OS1-kolokvijumi
$ npm install
$ ./combine.sh
```
i dobijate PDF (`combined.pdf`) i Markdown (`combined.md`) dokument sa svim OS1 kolokvijumima.

## Razvijanje
Ukoliko planirate da doprinosite projektu, mogu vam biti korisne sledeće informacije:
- `combine.sh` prima broj godine za kompilaciju kao prvi argument, kada hoćete da kompajlirate jednu godinu a ne ceo dokument
    - Na primer: `./combine.sh 2017`
- U Markdown fajlove rešenja je takođe potrebno navoditi kategorija zbog toga što se kategorizacija dešava pre spajanja postavki i rešenja u `combine.js`
- Ukoliko je neka sekcija u rešenju loše formatirana, `combine.js` će javiti kako za taj zadatak ne postoji rešenje
- Pre Markdown uređenih i neuređenih lista je potrebno da stoji novi red, inače se neće dobro prepoznati kao liste
- GitHub-flavored Markdown (GFM) nije podržan, pa je potrebno koristiti LaTeX tabele
- Bilo kakav LaTeX je dozvoljen, ali ako je nešto lakše izraziti u Markdown tako i treba da stoji
