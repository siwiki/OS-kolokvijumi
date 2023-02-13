2022/januar/SI, IR Kolokvijum 3 - Januar 2023 - Resenja.pdf
--------------------------------------------------------------------------------
disk
```cpp
void getRAID5Addr(long lBlock, long* diskNo, long* blockNo) {
    long b = lBlock + lBlock / DATA_BLOCKS;
    *diskNo = b % TOTAL_DISKS;
    *blockNo = b / TOTAL_DISKS;
}
```

--------------------------------------------------------------------------------
bash
```bash
#/bin/bash
if [ $# -lt 1 ]; then
    echo "Nedovoljan broj parametara"
fi
for i in /home/*; do
    file="$i/.bash_history"
    if [ -f $file ]; then
        for j in $@; do
            if cat $file | grep ^$j &> /dev/null; then
                echo $i | sed 's:/home/\(.*\):\1:'
            fi
        done
    fi
done | sort | uniq
```

--------------------------------------------------------------------------------
linux
```c
#define KEY 5555
#define MAX_ITER 10
struct msgbuf {
    long mtype;
    int value;
};
int main() {
    int msg_box = msgget(KEY, IPC_CREAT | 0666);
    struct msgbuf message;
    if (fork() != 0) {
        for (int i = 0; i < MAX_ITER; i++) {
            message.mtype = 2;
            message.value = getX();
            msgsnd(msg_box, &message, sizeof(int), 0);
            msgrcv(msg_box, &message, sizeof(int), 1, 0);
            useY(message.value);
        }
        msgctl(msg_box, IPC_RMID, 0);
    } else {
        for (int i = 0; i < MAX_ITER; i++) {
            msgrcv(msg_box, &message, sizeof(int), 2, 0);
            message.mtype = 1;
            message.value = useXGetY(message.value);
            msgsnd(msg_box, &message, sizeof(int), 0);
        }
    }
    return 0;
}
```
