2018/decembar/IR Kolokvijum 1 - Decembar 2018 - Resenja.pdf
--------------------------------------------------------------------------------


1/  2 
Rešenja prvog kolokvijuma iz Operativnih sistema 2 
Decembar 2018. 
1. (10 poena) HP5, MP4, LP2, MP3, LP1, MP1, HP6, MP5, LP3, MP3, LP1 
2. (10 poena) 
monitor TickTuck; 
export tick, tuck; 
 
  var 
    bTuck : boolean; 
    canTuck : condition; 
 
procedure tick; 
begin 
  (* do tick *) 
  b  Tuck := true; 
  canTuck.signal;   
end; 
 
procedure tuck; 
begin 
  if not bTuck then canTuck.wait; 
  (* do tuck *) 
  bTuck := false; 
end; 
 
begin 
  b  Tuck := false; 
end; 
3. (10 poena) 
public class Client { 
    public int[][] doCalculation(int[][] matrix) throws IOException { 
        if (matrix.length == 0 || matrix[0].length == 0) { 
            return null; 
        } 
 
        Socket socket = new Socket("server.etf.rs", 5555); 
 
        Service service = new Service(socket); 
 
        waitInLine(service); 
 
        sendMatrix(matrix, service); 
 
        int[][] result = receiveMatrix(service); 
 
        service.close(); 
 
        return result; 
    } 
 
    private void waitInLine(Service service) { 
        String msg; 
        int users; 
        do { 
            msg = service.receiveMessage(); 
            users = Integer.parseInt(msg); 
        } while (users > 0); 
    } 
 
    private void sendMatrix(int[][] matrix, Service service) { 

2/  2 
        service.sendMessage(matrix.length + ""); 
        for (int[] row : matrix) { 
            StringBuilder sb = new StringBuilder(); 
            for (int val : row) { 
                sb.append(val); 
                sb.append(" "); 
            } 
            service.sendMessage(sb.toString().trim()); 
        } 
    } 
 
    private int[][] receiveMatrix(Service service) { 
        String msg; 
        msg = service.receiveMessage(); 
        int numRows = Integer.parseInt(msg); 
        int[][] result = new int[numRows][]; 
        for (int i = 0; i < numRows; i++) { 
            msg = service.receiveMessage(); 
            result[i] = parseArrayInt(msg); 
        } 
        return result; 
    } 
 
    private int[] parseArrayInt(String array) { 
        String[] values = array.split(" "); 
        int[] ret = new int[values.length]; 
        for (int i = 0; i < values.length; i++) { 
            ret[i] = Integer.parseInt(values[i]); 
        } 
        return ret; 
    } 
} 
Klasa Service je data na vežbama. 
 