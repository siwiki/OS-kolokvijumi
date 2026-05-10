2025/sept-1/Kolokvijum 2025 - sept1 - Resenja.pdf
--------------------------------------------------------------------------------
context
```
const short THR_STACK = 5; 
const short THR_PRIV_DATA = 6; 
```
 
```
void switchMemContext (Thread* toRun) { 
  MPU::setRegion(THR_STACK, toRun->getStackStart(), toRun->getStackSize(), 
                 O_URW|O_KRW); 
  void* dataStart = toRun->getPrivDataStart(); 
  if (dataStart) 
    MPU::setRegion(THR_PRIV_DATA, dataStart, toRun->getPrivDataSize(), 
                   O_URW|O_KRW); 
  else 
    MPU::invalidateRegion(THR_PRIV_DATA); 
}
```

