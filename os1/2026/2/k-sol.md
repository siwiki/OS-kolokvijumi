/Rešenja - februar 2026.pdf
--------------------------------------------------------------------------------

linker
```c
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/mman.h>
#include <unistd.h>

const int N = 256;
const int SIZE = N*sizeof(int);
const char* name = "/shared_mem";

int main () {
    int fd = shm_open(name, O_CREAT|O_RDWR, 0b110110110);
    ftruncate(fd,SIZE);
    int* arr = (int*)mmap(0, SIZE, PROT_WRITE, MAP_SHARED, fd, 0);
    for (int i=0; i<N; i++) arr[i]=i;
    shm_unlink(fd);
    return 0;
}
```

--------------------------------------------------------------------------------

context
```asm
fp_mask def 0b100

yield:  push r0
        push r1
        ...
        push r31
        load r0,fp_mask
        and r0,psw,r0
        jz skip0
        push fp0
        push fp1
        ...
        push fp7
skip0:  push psw
        load r0,oldRunning
        store sp,[r0+offsSP]
        load r0,newRunning
        load sp,[r0+offsSP]
        pop psw
        load r0,fp_mask
        and r0,psw,r0
        jz skip1
        pop fp7
        ...
        pop fp0
skip1:  pop r31
        ...
        pop r1
        pop r0
        pop sp
        ret
```

--------------------------------------------------------------------------------

ioblock
```cpp
int BlockIOCache::getFreeEntry () {
    if (numOfBlocks<CACHESIZE) {
        int hand = numOfBlocks++;
        entries[hand].lruPrev = -1;
        entries[hand].lruNext = lruHead;
        if (lruHead!=-1) entries[lruHead].prev = hand;
        else lruTail = hand;
        lruHead = hand;
        return hand;
    } else
        for (int hand = lruTail; hand != -1; hand = entries[hand].lruPrev) {
            if (entries[hand].refCounter == 0) {
                ioWrite(dev,entries[hand].blkNo,entries[hand].buf);
                return hand;
            }
        }
    return -1;
}
```

--------------------------------------------------------------------------------

fsimpl
| Nivo indeksa    | Broj alociranih blokova za indekse | Broj alociranih blokova za sadržaj |
|-----------------|------------------------------------|------------------------------------|
| Direct          | 1 (za sam FCB)                     | 120                                |
| Single indirect | 1                                  | $128 = 2^7$                        |
| Double indirect | $1+128 = 129$                      | $2^{14}$                           |
| Ukupno          | 131                                | $2^{14}+2^7+120$                   |

