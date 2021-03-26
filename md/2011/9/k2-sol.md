2011/septembar/SI, IR Kolokvijum 2 - Septembar 2011 - Resenja.doc
--------------------------------------------------------------------------------
semaphore
```ada
type Coord = record {
  x : integer;
  y : integer;
};

var sharedCoord : Coord;
    readyToWrite : Semaphore = 1;
    readyToRead : Semaphore = 0;

process Helicopter
var nextCoord : Coord;
begin
  loop
    computeNextCoord(nextCoord);
    readyToWrite.wait;
    sharedCoord := nextCoord;
    readyToRead.signal;
  end;
end;

process PoliceCar
var nextCoord : Coord;
begin
  loop
    readyToRead.wait;
    nextCoord:= sharedCoord;
    readyToWrite.signal;
    moveTo(nextCoord);
  end;
end;
```

--------------------------------------------------------------------------------
semaphore
```ada
void Semaphore::wait () {
  for (int i=SemWaitLimit; val<=0 && i>0; i--);
  lock(lck);
  if (--val<0)
    block();
  unlock(lck);
}
```

--------------------------------------------------------------------------------
dynload
```cpp
class GeoRegion {
public:
  static GeoRegion* load (char* regionName);
  double getSurface ();
  double getHighestPeak ();
};

class GeoRegionProxy {
public:
  GeoRegionProxy (char* regionName);
  double getSurface ();
  double getHighestPeak ();
protected:
  GeoRegion* getServer ();
private:
  GeoRegion* myServer;
  char* myName;
};

GeoRegionProxy::GeoRegionProxy (char* regionName)
  : myServer(0), myName(regionName) {}

GeoRegion* GeoRegionProxy::getServer() {
  if (myServer==0) {
    myServer=GeoRegion::load(myName);
    if (myServer==0) ... // Raise exception
  }
  return myServer;
}

double GeoRegionProxy::getSurface () {
  return getServer()->getSurface();
}

double GeoRegionProxy::getHighestPeak () {
  return getServer()->getHighestPeak();
}
```

--------------------------------------------------------------------------------
cont
```
        32
      /    \
    24      48
   /  \    /  \
  8   28  36  56
 /    /  /
1    26 34
```
