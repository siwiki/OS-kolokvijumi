---
title: OS1 kolokvijumi
author: pripremili Luka Simić i Aleksa Marković
subtitle: kategorisani zadaci sa kolokvijuma 2006-2023 sa stranice predmeta
date: Mart 2023
geometry: margin=2cm
output: pdf_document
classoption: twoside
header-includes: \usepackage[croatian]{babel}\usepackage{subfig}\usepackage{float}\usepackage{fancyhdr}\usepackage{imakeidx}\usepackage{listings}\usepackage{svg}\makeindex[intoc]\graphicspath{{./}}
urlcolor: blue
toc: true
toc-depth: 2
pdf-engine: pdflatex
---
\raggedbottom
\pagestyle{fancy}
\fancyhf{}
\fancyhead[LE,RO]{\leftmark}
\fancyhead[LO,RE]{\rightmark}
\fancyfoot[C]{\thepage}
\renewcommand\indexname{Indeks}
\lstset{basicstyle=\ttfamily}

\newcommand{\specialcell}[2][c]{%
  \begin{tabular}[#1]{@{}c@{}}#2\end{tabular}}

\newpage
# Predgovor
Svrha ove zbirke jeste da objedini sve do sada dostupne kolokvijume iz Operativnih sistema 1 iz nekoliko razloga:

- Na kolokvijumima iz OS1 je dozvoljena literatura, i studenti često pristupaju tome tako što odštampaju kolokvijume i njihova rešenja pa se na kolokvijumu snalaze kroz taj odštampani materijal ako vide neki sličan zadatak. Ovom zbirkom postiže se organizacija takvih materijala radi lakšeg snalaženja na kolokvijumu i ušteda u papirima potrebnim za štampanje svih tih rokova.
- Zadaci su kategorisani po oblastima i sličnosti kako bi se lakše vežbali određeni tipovi zadataka na kolokvijumu.

Poglavlja zbirke idu istim redom kao kolokvijumsko gradivo na predmetu, konkretno:

1. Kompajler/linker, stranična organizacija, kontinualna alokacija, segmentna organizacija, segmentno-stranična organizacija, dinamičko učitavanje, preklopi
2. Prekidi, sistemski pozivi, interfejs niti, promena konteksta, sinhronizacija procesa, baferi, proizvođač/potrošač
3. Ulaz/izlaz, komandna linija, fajl sistem

Raspored ovih oblasti po kolokvijumima se retko menja, ali se takva situacija može desiti (usled predviđenih ili nepredviđenih okolnosti). U tom slučaju, proverite koje oblasti dolaze na kolokvijumu sa predmetnim asistentima. Bitno je napomenuti da se ovaj redosled u prošlosti menjao, pa ako se neki zadatak ranije pojavljivao na prvom kolokvijumu to ne mora da znači da je ta oblast i tekuće godine na prvom kolokvijumu. U suštini, **da li neki zadatak može doći na kolokvijumu određujte prvenstveno na osnovu toga iz koje je oblasti, a ne na osnovu toga na kom se kolokvijumu pojavio u prošlosti**.

Greške u formatiranju i kategorizaciji su sigurno prisutne. Ukoliko ih uočite, možete se javiti jednom od autora ili poslati *pull request* na repozitorijum projekta: \url{https://github.com/KockaAdmiralac/OS-kolokvijumi}. Ispravljeni dokumenti će biti dostupni u [Releases](https://github.com/KockaAdmiralac/OS-kolokvijumi/releases/latest). Svaka pomoć je dobrodošla.

Srećno na kolokvijumu.

\begin{flushright}
Autori
\end{flushright}

\newpage
