2014/januar/SI, IR Kolokvijum 3 - Januar 2015 - Resenja.pdf
--------------------------------------------------------------------------------
syscall
```cpp
int fopen(const char* fname, int mode) { 
  if(fname==0) return -1; 
  int ret = 0; 
  int pid = getPID(); 
  if (pid<0) return -1;  // Exception 
  // Prepare the ”command line”: 
  const int buffersz = 1024; 
  char buffer[buffersz]; 
  ret = snprintf(buffer,buffersz,”open %d,%s,%d”,pid,fname,mode); 
  if (ret<0 || ret>=buffersz) return -1; // Exception 
  // Send the request and get the reply: 
  ret = send(FILE_LISTENER,buffer,strlen(buffer)+1); 
  if (ret<0) return -1; // Exception 
  ret = receive(FILE_LISTENER,buffer,buffersz); 
  if (ret<0) return -1; // Exception 
  if (sscanf(buffer,”%d”,&ret)<=0) return -1; 
  return ret; 
}
```

--------------------------------------------------------------------------------
bash
```bash
!/bin/bash 
 
if [ $# -ne 1 ];then 
    echo "Nedovoljan broj argumenata." 
    exit 1 
fi 
 
file=$1 
cat $file | sed 's/^.\{5\}\([0-9]\).*$/\1 &/' | sort |  
sed 's/^[^\ ]*\ \(.*\)$/\1/'
```

--------------------------------------------------------------------------------
linux
```cpp
int main(int argc, const char **argv) { 
 if (argc > 2) { 
  M = atoi(argv[1]); 
  N = atoi(argv[2]); 
 } else 
  return -1; 
 
 int requestMsgQueueId = msgget(MESSAGE_Q_KEY, IPC_CREAT | 0666); 
 int responseMsgQueueId = msgget(MESSAGE_Q_KEY + 1, IPC_CREAT | 0666); 
 size_t len = sizeof(char); 
 
 int cars = 0; 
 struct requestMsg msg_buf; 
 while (1) { 
 
  if (cars < N) { // let one vehicle enter 
 
   // msgtyp<0 – primiti prvu poruku sa najnižom vrednošću tipa koja je  
   // manja ili jednaka apsolutnoj vrednosti msgtyp; 
   msgrcv(requestMsgQueueId, &msg_buf, len, -M, 0); 
 
   cars++; 
   // msg_buf.mtype je isti 
   msgsnd(responseMsgQueueId, &msg_buf, sizeof(char), 0);  
  } else { //wait for a car to leave 
   msgrcv(requestMsgQueueId, &msg_buf, len, M + 1, 0); 
   cars--; 
  } 
 } 
} 
```
