2012/decembar/SI, IR Kolokvijum 2 - Novembar 2012 - Resenja.pdf
--------------------------------------------------------------------------------


1/1 
Rešenja drugog kolokvijuma iz  
Operativnih sistema 2, Novembar 2012. 
1. (10 poena)  
int allocate (unsigned int pid, unsigned int rid) { 
  if (pid>=numOfProc || rid>=numOfRes) return -1; // Exception! 
  // Is this resource free? 
  for (unsigned int i=0; i<numOfProc; i++) 
    if (i!=pid && resourceAlloc[i][rid]==-1) {  // The resource is occupied 
      resourceAlloc[pid][rid]==1; 
      return 0; 
    }  
  // The resource can be allocated: 
  resourceAlloc[pid][rid] = -1; 
  return 1; 
} 
 
int release (unsigned int pid, unsigned int rid) { 
  if (pid>=numOfProc || rid>=numOfRes) return -2; // Exception! 
  resourceAlloc[pid][rid] = 0; 
  // Find a waiting process: 
  for (unsigned int i=0; i<numOfProc; i++) 
    if (resourceAlloc[i][rid]==1) {  
      resourceAlloc[i][rid]==-1; 
      return i; 
    }  
  return -1; 
} 
2. (10 poena)  
double soldQuantity () { 
  void* storage = mmapfile(“log.bin”); 
  if (storage==0) return -1; // Exception! 
  int n = *(int*)storage; 
  DailySales* log = (DailySales*)((int*)storage+1); 
  double sum = 0.0; 
  for (int i=0; i<n; i++) 
    sum+=log[i].quantity; 
  return sum; 
} 
3. (10 poena) 
a)(5) 43, 41, 51, 62, 70, 95, 130 
b)(5) 51, 62, 70, 95, 130, 41, 43 