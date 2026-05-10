2025/sept-1/Kolokvijum 2025 - sept1 - Resenja.pdf
--------------------------------------------------------------------------------
`interrupt`
```asm
sys_call: push sp 
  push r0 
  push r1 
  ... 
  push r31 
  load r0,running 
  store ssp,[r0+offsSP] 
 
  load ssp,kernelSP 
  call handle_sys_call 
 
  load r0,running 
  load ssp,[r0+offsSP] 
  pop r31 
  ... 
  pop r1 
  pop r0 
  pop sp 
  rti
```
