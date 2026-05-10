2025/okt-2/Kolokvijum 2025 - 4 - Resenja.pdf
--------------------------------------------------------------------------------
buffer
```
#include <fcntl.h> 
#include <stdio.h> 
#include <stdlib.h> 
#include <unistd.h> 
#include <sys/mman.h> 
#include <sys/types.h> 
#include <sys/wait.h> 
#include <string.h> 
```
 
#include "bbuffer.h" 
 
typedef BoundedBuffer<const char, 32> Buffer; 
 
```
#define handle_error(msg) \ 
  do { perror(msg); exit(EXIT_FAILURE); } while (0) 
```
 
```
int main() { 
  void* shmem = mmap(NULL, sizeof(Buffer), PROT_READ|PROT_WRITE, 
                     MAP_SHARED|MAP_ANONYMOUS, -1, 0); 
  if (shmem == MAP_FAILED) handle_error("mmap failed"); 
```
 
  Buffer* buffer = new (shmem) Buffer; 
 
```
  pid_t pid = fork(); 
  if (pid < 0) { 
    hande_error("fork failed"); 
  } else if (pid == 0) { 
      static const char str[] = "Hello world!"; 
      for (int i=0; i<=strlen(str); i++) 
        buffer->append(str[i]); 
  } else { 
      do { 
        const char c = buffer->take(); 
        putchar(c); 
      } while (c); 
      wait(NULL); 
      buffer->~Buffer(); 
  } 
```
 
```
  munmap(shmem, size); 
  return 0; 
}
```

