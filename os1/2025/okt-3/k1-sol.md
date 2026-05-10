2025/okt-3/Kolokvijum 2025 - okt3 - Resenja.pdf
--------------------------------------------------------------------------------
page
Svaki PMT zauzima tačno jednu stranicu veličine 4 KB = 2
12
 B sa ulazima veličine 8 B = 
2
3
 B, pa poseduje 2
12
/2
3
= 2
9
 ulaza za čije adresiranje je potrebno 9 bita. Polje za pomeraj 
unutar virtuelne adrese je 12 bita, pa preostalih 48-12 = 36 bita adresira stranicu. Adresiranje 
najnižeg 1 GB virtuelnog adresnog prostora zahteva 30 bita, od kojih je 12 za pomeraj unutar 
stranice, a preostalih 18 za adresiranje stranice. 

a)(5) Za 36 bita za broj stranice i po 9 bita za svako polje za adresiranje ulaza unutar PMT-a 
svakog nivoa, potrebno je 36/9 = 4 nivoa PMT-a. Za adresiranje 1 GB kernel prostora koji se 
deli između procesa potrebno je i dovoljna jedna stranica za PMT 3. nivoa i 2
9
 = 512 stranica 
za PMT-ove 4. nivoa, što je ukupno 513 stranica. Za adresiranje tog prostora i još jedne 
stranice iznad njega, za svaki proces potrebno je alocirati po jedan PMT sva 4 nivoa. Prema 
tome, ukupno je za sve PMT-ove n procesa potrebno 4n + 513 stranica. 

b)(5) Za PMT-ove za adresiranje kernel prostora potrebno je istih 513 stranica za PMT-ove 
u dva nivoa koje svi procesi dele kao pod a). Za adresiranje ostatka virtuelnog adresnog 
prostora potrebna je ista organizacija PMT u 4 nivoa kao pod a), samo što se ulazi 0 u 
PMT-ovima 1. i 2. nivoa praktično ne koriste (ne može se iskoristiti za smanjenje broja nivoa 
PMT-a). Kada bi svi procesi adresirali samo kernel prostor, ukupno bi bilo potrebno 515 
stranica za PMT-ove koji se svi dele za proizvoljan broj procesa. Međutim, ako proces alocira 
još jednu stranicu iznad tog prostora, za svaki proces potrebna je po jedna stranica za sva 4 
nivoa PMT-a, pa je odgovor isti kao pod a). 
Zaključak: od ovakve organizacije opisane pod b) nema nikakve posebne dobiti u smislu 
zauzeća memorije za PMT-ove. Ona se praktično svodi na to da su ulazi 0 u PMT-u 1. i 2. 
nivoa svih procesa praktično keširani u PMTPX i deljeni, dok bi kod organizacije pod a) TLB 
morao da kešira sve pojedinačne deskriptore za različite procese iako ukazuju na iste stranice, 
pa bi se mogao očekivati bolji učinak u smislu performansi i korišćenja TLB-a.

