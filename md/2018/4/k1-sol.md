2018/april/IR Kolokvijum 1 - April 2018 - Resenja.pdf
--------------------------------------------------------------------------------
io

```cpp
const REG ESC = 0;
bool complete = false;

void transfer () {
  REG data = ESC;

  *io1Ctrl = 1;
  *io2Ctrl = 1;
  *io3Ctrl = 1;
  *io4Ctrl = 1;

  while (!complete) {
    while (*io1Status&1==0);
    data = *io1Data;

  if (data==ESC) break;

    while (*io3Status&1==0);
    *io3Data = data;
  }

  complete = true;
  *io1Ctrl = 0;
  *io2Ctrl = 0;
  *io3Ctrl = 0;
  *io4Ctrl = 0;
}

interrupt void device2 () {
  if (complete) return;
  REG data = *io2Data;
  if (data!=ESC) {
    while (*io4Status&1==0);
    *io4Data = data;
  } else {
    complete = true;
    *io1Ctrl = 0;
    *io2Ctrl = 0;
    *io3Ctrl = 0;
    *io4Ctrl = 0;
  }
}
```

--------------------------------------------------------------------------------
interrupt 

```asm
sys_call: ; Save r0 and r1 on the (kernel) stack
          push r0
          push r1
          load r0, [running] ; the old running is in r0

          ; Perform the system call:
          call sys_call_proc

          ; Compare the old and the new running,
          load r1, [running] ; the new running is in r1
          cmp r0, r1
          jne switch

          ; and do not switch the context if they are equal,
          ; but restore r0 and r1, and return
          pop r1
          pop r0
          iret
switch:   ; Save the context of the old running
          store r2,#offsR2[r0] ; save other regs
          store r3,#offsR3[r0]
          ...
          store r31,#offsR31[r0]
          store sp,#offsSP[r0] ; save sp
          pop r1 ; save r1 through r1
          store r1,#offsR1[r0]
          pop r1 ; save r0 through r1
          store r1,#offsR0[r0]
          pop r1 ; save psw through r1
          store r1,#offsPSW[r0]
          pop r1 ; save pc through r1
          store r1,#offsPC[r0]

          ; Restore the context of the new running
          load r0,[running]
          load r1, #offsPC[r0] ; restore pc through the stack
          push r1
          load r1, #offsPSW[r0] ; restore psw through the stack
          push r1
          load sp,#offsSP[r0] ; restore sp
          load r31,#offsR31[r0] ; restore r31
          ... ; restore other regs
          load r1,#offsR1[r0]
          load r0,#offsR0[r0] ; restore r0
          ; and return
          iret
```

--------------------------------------------------------------------------------
syscall

```cpp
extern D fun (A a, B b, C c);
typedef void (*CallbackD)(D);

struct fun_params { A a; B b; C c; CallbackD cb; };

void fun_async (A a, B b, C c, CallbackD cb) {
  fun_params* params = new fun_params;
  params->a = a; params->b = b; params->c = c;
  params->cb = cb;
  pthread_t pid;
  pthread_create(&pid,&fun_wrapper,params);
}

void fun_wrapper (void* params) {
  fun_params* p = (fun_params*)params;
  D d = fun(p->a,p->b,p->c);
  CallbackD callback = p->cb;
  delete p;
  callback(d);
}
```
