2024/jul/SI, IR Kolokvijum 3 - Jul 2025 - Resenja.pdf
--------------------------------------------------------------------------------
syscall

```cpp
void* init_dma_transfer(uint64_t transfer_size) {
    void* buffer = alloc_page();
    struct dma_init_in_transfer arg;
    arg.virtual_address = buffer;
    arg.size = transfer_size;
    int fd = open("/dev/os2_device", O_RDWR);
    ioctl(fd, DMA_INIT_OP, &arg);
    return buffer;
}
```

--------------------------------------------------------------------------------
bash

```bash
#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 <test_script>"
    exit 1
fi

test_script="$1"

old_IFS=$IFS
IFS=$'\n'
pass=1
for i in $(cat "$test_script" | sed "s:[^a-zA-Z0-9_]*\([a-zA-Z0-9_]*\).*:\1:"); do
    if ! which $i > /dev/null; then
        echo "$i"
        pass=0
    fi
done
IFS=$old_IFS

if [ $pass -eq 1 ]; then
    echo "All tests passed"
else
    echo "Some tests failed"
fi
```

--------------------------------------------------------------------------------
linux

```cpp
void transfer(int fd, uint64_t size, uint64_t offset, void *buffer) {
    void *mapped_file = mmap(0, size, PROT_READ | PROT_WRITE, MAP_PRIVATE, fd, offset);

    copy512(buffer, mapped_file, size);
    munmap(mapped_file, size);
}
```
