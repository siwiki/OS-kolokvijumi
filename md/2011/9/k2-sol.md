2011/septembar/SI, IR Kolokvijum 2 - Septembar 2011 - Resenja.doc
--------------------------------------------------------------------------------


1/  2
Rešenja zadataka za nadoknadu drugog
kolokvijuma iz Operativnih sistema 1
Septembar 2011.
1. (10 poena)
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
2. (10 poena)
void Semaphore::wait () {
  for (int i=SemWaitLimit; val<=0 && i>0; i--);
  lock(lck);
  if (--val<0)
    block();
  unlock(lck);
}
3. (10 poena)
class GeoRegion {
public:
  static GeoRegion* load (char* regionName);
  double getSurface ();
  double getHighestPeak ();
};

2/  2
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
4. (10 poena)

32
24
8 28
26
48
36 56
34 1
