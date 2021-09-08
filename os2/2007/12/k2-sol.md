2007/decembar/SI Kolokvijum 2 - Decembar 2007 - Resenja.doc
--------------------------------------------------------------------------------


1/  2 
Rešenja drugog kolokvijuma iz  
Operativnih sistema 2 
Decembar 2007. 
1. (10 poena) 
void update_lru_regs (PMT pmt, LRU_regs_table lru) { 
  static int first_call = 1; 
  static page_descr pd_mask = 0; // pd_mask == 000...00 
  if (first_call) { 
    pd_mask = ~pd_mask;  // pd_mask == 111...11 
    pd_mask >>= 1;  // pd_mask == 011...11 
    first_call = 0; 
  }   
 
  for (int i=0; i<num_of_pages; i++) { 
    if (!is_in_mem(pmt[i])) continue; 
    lru[i]>>1;  // shift right LRU reg 
    lru[i] |= (pmt[i] & (~pd_mask)); // set MSB of LRU reg to the ref. bit 
    pmt[i] &= pd_mask;  // reset reference bit 
  }   
} 
 
 
int get_victim(PMT pmt, LRU_regs_table lru) { 
  int victim = -1; 
  lru_reg min = ~0; 
  for (int i=0; i<num_of_pages; i++) 
    if (!is_in_mem(pmt[i])) continue; 
    if (lru[i]<=min) { 
      victim = i; 
      min = lru[i]; 
    } 
  return victim; 
} 
2. (10 poena) 
#include <stdio.h> 
int N = ...; 
char* filename = ...; 
 
#pragma align 
int array[N]; 
#pragma align 
 
void main () { 
  if (mem_map_file(array,N*sizeof(int),filename)==0) { 
    int sum = 0; 
    for (int i=0; i<N; i++) sum+=array[i]; 
    printf("Sum: %d\n“,sum); 
  }   
} 
3. (10 poena) 
a)(5) 45, 56, 64, 89, 124, 27, 25 
b)  (5) 27, 25, 45, 56, 64, 89, 124 

2/  2 
4. (10 poena) 
U   zavisnosti   od   toga   da   li   se   predefinisano   mesto   na   kome   postojeći interpreter 
podrazumevano traži programe za komande može menjati dinamički ili ne (tj. da li postojeći 
interpreter  očitava  taj  parametar  prilikom  interpretacije  svake  komande  ili  samo  prilikom 
inicijalizacije), kao i u zavisnosti od toga da li nova školjka koristi isti stil (format) komandne 
linije  (komanda  u  jednoj  reči,  iza  nje  parametri)  ili  sasvim  drugačiji format,  ovo  se  može 
realizovati  na  nekoliko  različitih  načina.  U  svakom  od  njih,  nova  školjka  aktivira  se 
jednostavno  pokretanjem  odgovarajućeg  programa  (koji  se  u  postojećoj  školjki  vidi  kao 
komanda). U zavisnosti od varijante, ona radi sledeće: 
• Ukoliko  nova  školjka  koristi  isti  format  komandne  linije,  a  predefinisano  mesto  na  
kome  se  komande  (kao  programi)  traže  u  fajl  sistemu  se  može  izmeniti  dinamički, 
ovaj program može prosto samo da preusmeri to mesto na direktorijum sa komandama 
nove  školjke. Povratak  u  staru  školjku  je  komanda  nove  školjke  koja  vraća  ovaj 
parametar na staru vrednost. 
• U  suprotnom,  ovaj  program  je  novi  interpreter  komandne  linije  koji  sam  učitava  i 
parsira  komandnu  liniju sa  standardnog  ulaza,  a  onda  izvršava  komande  i  ispisuje  
rezultate  na  standardni  izlaz. Povratak  na  staru  školjku  je  izlaz  iz  ovog  programa  
(gašenje procesa novog interpretera). 