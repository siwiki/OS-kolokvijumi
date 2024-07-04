2023/januar/SI, IR Kolokvijum 3 - Januar 2024 - Resenja.pdf
--------------------------------------------------------------------------------
disk

```cpp
void getRAID6Addr(long lBlock, long* diskNo, long* blockNo) {
    long b = lBlock + ECC_BLOCKS * (lBlock / DATA_BLOCKS);
    *diskNo = b % TOTAL_DISKS;
    *blockNo = b / TOTAL_DISKS;
}
```

--------------------------------------------------------------------------------
bash

```bash
#!/bin/bash
if [ $# -ne 1 ]; then
    echo "Error: script accepts only one parameter"
    exit 1
fi
file_name=$1
ifs_old=$IFS
IFS=$'\n'
for i in $(find . -name "$file_name" 2> /dev/null); do
    if [ -x "$i" -a -f "$i" ]; then
        echo "$i" | sed 's:\(.*\)/[^/]*:\1:'
    fi
done
IFS=$ifs_old
```

--------------------------------------------------------------------------------
linux

```cpp
#include <stdio.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/stat.h>

#define KEY 5555
#define M 5
#define N 30

struct mat {
    int abc[3][M][N];
};

void init_mat(struct mat* mat_shr, int index) {
    for (int i = 0; i < M; i++) {
        for (int j = 0; j < N; j++) {
            mat_shr->abc[index][i][j] = rand() % 100;
        }
    }
}
void print_mat(struct mat* mat_shr, int index) {
    printf("\nMatrix %d\n", index);
    for (int i = 0; i < M; i++) {
        for (int j = 0; j < N; j++) {
            printf("%d ", mat_shr->abc[index][i][j]);
        }
        putchar('\n');
    }
}
void sum_row(struct mat* mat_shr, int row) {
    for (int i = 0; i < N; i++) {
        mat_shr->abc[2][row][i] = mat_shr->abc[0][row][i] + mat_shr->abc[1][row][i];
    }
}
int main() {
    int shmid = shmget(KEY, sizeof(struct mat), IPC_CREAT | IPC_EXCL | S_IRUSR | S_IWUSR);
    struct mat *mat_shr = shmat(shmid, 0, 0);
    for (int i = 0; i < 2; i++) {
        init_mat(mat_shr, i);
        print_mat(mat_shr, i);
    }
    for (int i = 0; i < M; i++) {
        int pid = fork();
        if (pid == 0) {
            sum_row(mat_shr, i);
            shmdt(mat_shr);
            exit(0);
        }
    }
    wait(0);
    print_mat(mat_shr, 2);
    shmdt(mat_shr);
    shmctl(shmid, IPC_RMID, 0);
    return 0;
}
```
