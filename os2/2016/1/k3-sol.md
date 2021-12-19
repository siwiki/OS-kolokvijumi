2015/januar/SI, IR Kolokvijum 3 - Januar 2016 - Resenja.pdf
--------------------------------------------------------------------------------
disk
```cpp
class DiskScheduler { 
public:  
  DiskScheduler (); 
  DiskRequest* get (); 
  void put (DiskRequest*); 
private: 
  DiskRequest *head, *cursor; 
}; 
 
DiskScheduler::DiskScheduler () : head(0), cursor(0) {} 
 
void DiskScheduler::put (DiskRequest* req) { 
  if (req==0) return; // Exception! 
  for (DiskRequest *prv=0, *nxt=head; nxt && nxt->cyl<=req->cyl; 
       prv=nxt, nxt=nxt->next); 
  req->prev = prv; 
  req->next = nxt; 
  if (prv) prv->next = req; 
  else head = req; 
  if (nxt) nxt->prev = req; 
  if (!cursor) cursor = req; 
} 
 
DiskRequest* DiskScheduler::get () { 
  if (!cursor) return 0; 
  DiskRequest* req = cursor; 
  if (req->prev) req->prev->next = req->next; 
  else head = req->next; 
  if (req->next) req->next->prev = req->prev; 
  cursor = cursor->next; 
  if (!cursor) cursor = head; 
  req->prev = req->next = 0; 
  return req; 
}
```

--------------------------------------------------------------------------------
bash
```bash
#!/bin/bash 
if [ $# -ne 4 ]; then 
    echo "Nedovoljan broj parametara" 
    exit 1 
fi 
file=$1 
if [ ! -r $file ]; then 
    echo "Ulazni fajl ne moze da se cita" 
    exit 1 
fi 
voz=$2 
hh=$3 
mm=$4 
for i in $(cat $file | grep "^$voz\ " | sed "s/^$voz\ \(.*\)/\1/"); do 
    voz_hh=$(echo $i | sed "s/\([0-9][0-9]\).*/\1/") 
    voz_mm=$(echo $i | sed "s/.*\:\([0-9][0-9]\)/\1/") 
    if [ "$voz_hh" -gt "$hh" ]; then 
        echo $i 
        exit 0 
    fi 
    if [ "$voz_hh" -eq "$hh" -a "$voz_mm" -gt "$mm" ]; then 
       echo $i 
       exit 0 
    fi 
done
```
 
--------------------------------------------------------------------------------
linux
```cpp
struct msgbuf 
{ 
  long mtype; 
  int sender; 
}; 
 
void barrier(int id, int msg_box) 
{ 
  struct msgbuf msg; 
 
  for (int i = 0; i < NUM_PROCESS; i++) { 
    if (i == id) 
      continue; 
    msg.mtype = i + 1; 
    msg.sender = id; 
    msgsnd(msg_box, &msg, sizeof(int), 0); 
  } 
 
  for (int i = 0; i < NUM_PROCESS; i++) { 
    if (i == id) 
      continue; 
    msgrcv(msg_box, &msg, sizeof(int), id + 1, 0); 
  } 
}
```
