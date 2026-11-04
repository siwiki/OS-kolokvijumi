2024/novembar/IR Kolokvijum 1 - Novembar 2024 - Resenja.pdf
--------------------------------------------------------------------------------
schedule

```cpp
void Scheduler::aging() {
    Time t = Timing::getTime();
    for (int i = 1; i <= MAX_PRI; i++)
        for (PCB* p = ready[i].first();
             p && t - p->getTimestamp() > TIME_THRESHOLD;
             p = ready[i].first()) {
            p = ready[i].get();
            p->setTimestamp(t);
            ready[i-1].put(p);
        }
}
```

--------------------------------------------------------------------------------
sharedobj

```cpp
class ReadCtrl {
public:
    ReadCtrl(ReadersWriters* rw) : myRW(rw) { if (myRW) myRW->startRead(); }
    ~ReadCtrl(ReadersWriters* rw) { if (myRW) myRW->stopRead(); }
private:
    ReadersWriters* myRW;
};

class WriteCtrl {
public:
    WriteCtrl(ReadersWriters* rw) : myRW(rw) { if (myRW) myRW->startWrite(); }
    ~WriteCtrl(ReadersWriters* rw) { if (myRW) myRW->stopWrite(); }
private:
    ReadersWriters* myRW;
};


class Resource {
public:
    Resource();
    void opRead(...);
    void opWrite(...);
private:
    ReadersWriters rw;
    ...
};

void Resource::opRead(...) {
    ReadCtrl dummy(&rm);
    ...
}

void Resource::opWrite(...) {
    WriteCtrl dummy(&rm);
    ...
}
```

--------------------------------------------------------------------------------
network

```java
public class Client extends Thread {
    private final Service service;
    private final boolean sending;

    public Client(Service service, boolean sending) {
        this.service = service;
        this.sending = sending;
    }

    public void run() {
        if (sending) {
            sends();
        } else {
            receive();
        }
    }

    private void receive() {
        String msg;
        do {
            try {
                msg = service.receiveMsg();
                System.out.println(msg.replace("#", " "));
            } catch (IOException e) {
                break;
            }
        } while (msg != null);
    }

    private void sends() {
        BufferedReader reader = new BufferedReader(
                                         new InputStreamReader(System.in));
        String line;
        do {
            try {
                line = reader.readLine();
                service.sendMsg(line.replaceFirst(" ", "#"));
            } catch (IOException e) {
                break;
            }
        } while(line != null);
    }

    public static void main(String[] args) throws Exception {
        Socket socket = new Socket("localhost", 5555);
        Service service = new Service(socket);

        String username = ...;
        service.sendMsg("login#" + username);
        String msg = service.receiveMsg();
        if (!"ok".equals(msg)) { return; }

        Thread t1 = new Client(service, true);
        Thread t2 = new Client(service, false);
        t1.start();
        t2.start();

        t1.join();
        t2.join();

        service.close();
    }
}
```
