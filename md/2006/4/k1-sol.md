2006/april/resenja.doc
--------------------------------------------------------------------------------


Kolokvijum, April 2006.
Rešenja

Zad 1.

a)  NE  - Objašnjenje: kod multiprogramskog okruženja POJEDINAČNI posao će trajati
duže  zbog  konkurentnog  izvršavanja  i  režijskih  operacija  koje  se  događaju  u  toku
izvršenja posla.

b) DA - Odjašnjenje: Dok jedan posao čeka na I/O, drugi se izvršava, tj. koristi processor,
tako da se iskorišćenje procesora povećava.

c) DA - Objašnjenje: Pošto se poslovi izvrsavaju u paraleli (dok jedan ceka na I/O, a
drugi  se  izvrsava),  onda  se  ukupno  vreme  odziva  skraćuje,  pa  se  samim  tim  broj
završenih poslova u jedinici vremena (throughput) povećava.

d) NE - Objašnjenje: Jedino reijsko vreme kod paketnog OSa je dovlačenje posla u radnu
memoriju, dok kod multiprogramskog OSa postoje režijske operacije i  prilikom  svake
zamene poslova.

Zad 2. Operativni sistem treba da nudi uslugu da neki proces može da se uspava i da se
probuti   posle   tačno   odredjenog   vremena   (ili   malo   kasnije   od   tog   vremena).   Npr
operativni   sistem   treba   da   obezbedi   primitivu   void  sleep(int  time),  koja
obezbedjuje da se proces uspava time milisekunti (odnosno stavi u red uspavanih, engl.
Sleep), a da se posle toga može probuditi (odnosno proces vrati u red spremnih, engl.
Ready). Proces za obradu ulazno/izlazne operacije treba da radi sledeće:

 const int maxTime = ...; // response time (worst case)

 While (!end){
  initialize_IO_operation();
  sleep(maxTime);
  process_IO_result();
 }

Zad 3.

VA(16): seg(2), page(6), offset(8)
PA(32): block(24), offset(8)

Zad 4. Ne treba, pošto je identifikator procesa ujedno i ulaz u opisani niz. Nije potrebno
dodatno čuvati tu informaciju.





Zad 5. Potrebno je dodati sledeću deklaraciju, koja će predstavljati pokazivač na listu
suspendovanih (blokiranih) procesa.

PCB* blocked;

Implementacije traženih funkcija:

void suspend () {
  lock ();
  if (setjmp(running->context)==0) {
 // stavlja running proces u listu blokiranih
running->next = blocked;
blocked = running;

// uzima prvi spreman proces i dodeljuje mu procesor
running = ready;
ready = ready->next;

     longjmp(running->context,1);
  } else {
     unlock ();
return;
}

void resume(PID pid){
if (blocked == 0) return;

 lock();

 // pronalazi PCB procesa koji treba deblokirati
 PCB *prev = 0, *curr = blocked;
 while (curr != 0 && curr->pid != pid){
  prev = curr;
  curr = curr->next;
 }

 if (curr == 0) { unlock(); return; }

 // vraća nađeni PCB u listu spremnih
 if (prev == 0) blocked = blocked->next;
 else prev->next = curr->next;

 curr->next = ready;
 ready = curr;

 unlock();
}

Zad 6.

U protected sekciju klase Thread potrebno je dodati sledeći metod:

Class Thread{
   ...
Protected:
 Static void starter(void*);
   ...
}

protected:
void Thread::starter(void* toStart){
 Thread* t = (Thread*)toStart;
 if (t) t->run();
}

U tom slučaju implementacija metoda start izgleda:

void Thread::start(){
 pid = create_thread(&starter, this);
}

