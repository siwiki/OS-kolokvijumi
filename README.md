# OS1-kolokvijumi
Cilj projekta je izvoženje teksta sa [OS1](http://os.etf.bg.ac.rs/OS1/) kolokvijuma kako bi se formatirali u Markdown a zatim kategorisali po oblasti i spojili u jedan PDF spreman za štampu.

## Instalacija
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
