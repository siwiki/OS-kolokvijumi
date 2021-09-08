2019/januar/SI, IR Kolokvijum 3 - Januar 2020 - Resenja.pdf
--------------------------------------------------------------------------------


1/  2 
Rešenja zadataka sa trećeg kolokvijuma iz  
Operativnih sistema 2, januar 2020. 
1. (10 poena)   
class DiskScheduler { 
public: 
  DiskScheduler () : in(0), out(0) {} 
 
  Req* get (); 
  void put (Req* r); 
  void period (); 
 
private: 
  static const int NumReqQueues; 
  ReqList queue[NumReqQueues]; 
  int in, out; 
}; 
 
inline void DiskScheduler::put (Req* r) { queue[in].put(r); } 
 
inline void DiskScheduler::period () { in = (in+1)%NumReqQueues; } 
 
Req* DiskScheduler::get () { 
  int oldOut = out; 
  do { 
    Req* r = queue[out].get(); 
    if (r) return r; 
    out = (out+1)%NumReqQueues; 
  } while (out!=oldOut); 
  return 0; // No requests, the entire queue is empty 
} 
2. (10 poena) 
#!/bin/bash 
 
if [ $# -ne 1 ]; then 
    echo "Nedovoljan broj parametara" 
    exit 1 
fi 
 
#old_IFS=$IFS 
#IFS=$'\n' 
 
count=0 
 
for i in $(find / -iname '*.txt'); do 
  if [ -r $i ]; then 
    if grep "$1" $i; then 
      let count++ 
    fi 
  fi  
done 
 
#IFS=$old_IFS 
 
echo "Broj pronadjenih fajlova je $count" 
 

2/  2 
3. (10 poena) 
#include <stdio.h> 
#include <stdlib.h> 
#include <unistd.h> 
int main(void) { 
  int nnpd[2]; 
  pipe(nnpd); 
  if (!fork()) { 
    close(1); /* close stdout */ 
    dup(nnpd[1]); /* make stdout same as pipe input*/ 
    close(nnpd[0]); 
    execl ("/bin/ls", "/bin/ls", NULL); 
 } else { 
    close(0); /* close stdin */ 
    dup(nnpd[0]); /* make stdin same as pipe output*/ 
    close(nnpd[1]); 
    execl("/usr/bin/sort", "/usr/bin/sort", NULL); 
 } 
 return 0; 
} 
 
 