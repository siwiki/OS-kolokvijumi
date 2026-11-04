2024/oktobar/SI Kolokvijum 1 - Oktobar 2024 - Resenja.pdf
--------------------------------------------------------------------------------
schedule

```cpp
PCB* Scheduler::put(PCB* p, Time execTime) {
    if (execTime > 0)
        p->setExecTime(p->getExecTime() + execTime);
    else {
        p->setExecTime(0);
        p->setEntranceTime(Timing::getTime());
    }
    queue.put(p);
}

PCB* Scheduler::get() {
    unsigned long num = queue.getSize();
    PCB* p = queue.get();
    Time slice = (Timing::getTime() - p->getEntranceTime()) / num;
    p->setTimeslice(slice);
    return p;
}
```

--------------------------------------------------------------------------------
sharedobj

```cpp
class Monitor1 {
public:
    Monitor1() : mySem(1) {}
    void op1(T t, bool flag=true);
private:
    Semaphore mySem;
    void old_op1(T t);
};

void Monitor1::op1(T t, bool flag) {
    if (flag) {
        Mutex dummy(&mySem);
        old_op1(t);
    } else
        old_op1(t);
}

void Monitor1::old_op1(T t) {
    ...
}

void Monitor2::op2(T t) {
    Mutex dummy(&mySem);
    ...
    myM1->op1(t, false);
    ...
}
```

--------------------------------------------------------------------------------
network

```java
public class RequestHandler extends Thread {
    private final Server server;
    private final Service service;
    private String username = null;

    private boolean signOut = false;

    public RequestHandler(Server server, Service service) {
        this.server = server;
        this.service = service;
    }

    public void run() {
        String user = null;
        try {
            String msg = service.receiveMsg();
            if (msg == null) {
                throw new IOException("Msg null received");
            }

            user = msg;

            server.login(msg, this);

            relayMsg();


        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (signOut) {
                server.signOut(username);
            }
        }
        if (user != null) {
            server.signOut(user);
        }
        service.close();
    }

    public synchronized void sendMsg(String msg) {
        service.sendMsg(msg);
    }

    private void relayMsg() throws IOException {
        while (true) {
            String msg = service.receiveMsg();
            if (msg == null) {
                break;
            }

            String[] data = msg.split("#");
            RequestHandler thread = server.getUser(data[0]);

            if (thread != null) {
                thread.sendMsg(data[1]);
            }
        }
    }
}
```

U klasu `Server` sa vežbi treba dodati:
```java
private Map<String, RequestHandler> userLogged = new HashMap<>();

public synchronized void login(String user, RequestHandler thread) {
    userLogged.put(user, thread);
}

public synchronized RequestHandler getUser(String user) {
    return userLogged.getOrDefault(user, null);
}

public synchronized void signOut(String user) {
    userLogged.remove(user);
}
```

Klasa `Service` je ista kao na vežbama.
