# 🔍 PID (Process ID) Reference Guide

Complete guide to understanding and managing PIDs for Mahii application processes.

---

## 📚 What is a PID?

A **Process ID (PID)** is a unique numerical identifier assigned by the operating system to each running process. It helps identify and manage individual processes on your system.

### Key Points:
- **Unique per session**: Each time a process starts, it gets a new PID
- **System-wide**: PIDs are unique across all running processes
- **Temporary**: PID is released when the process terminates
- **Range**: Typically from 1 to 32,767 (Windows) or higher on modern systems

---

## 🎟 Mahii Process Information

### Backend Server Process
```
Process Name: node.exe (running server.js)
Default Port: 5000
Type: Node.js/Express
Typical PID: 12345 (example)
```

### Frontend Client Process
```
Process Name: node.exe (running React dev server)
Default Port: 3000
Type: React Development Server
Typical PID: 54321 (example)
```

---

## 🔎 How to Find PIDs

### Method 1: PowerShell (Most Reliable)

#### List All Node Processes:
```powershell
Get-Process node
```

**Output Example:**
```
Handles  NPM(M)      PM(M)      WS(M)  CPU(s)     Id  SI   ProcessName
    245      15       48        85    0.55  12345   1   node
    189      20       52        92    0.42  54321   1   node
```

#### Get Detailed Information:
```powershell
Get-Process node | Format-Table Name, ID, ProcessName, StartTime, Path
```

#### Find Process by Port:
```powershell
# Find process listening on port 5000
Get-NetTCPConnection | Where-Object LocalPort -eq 5000 | Select-Object OwningProcess

# Get more details
$pid = (Get-NetTCPConnection | Where-Object LocalPort -eq 5000).OwningProcess
Get-Process -Id $pid
```

---

### Method 2: Task Manager (GUI)

1. **Press `Ctrl + Shift + Esc`** or **right-click taskbar → Task Manager**
2. **Click "Details" tab** (if using "Processes" tab, click "Details")
3. **Look for column "PID"** (may need to enable it)
   - **Right-click column headers → Select "PID"** if not visible
4. **Find processes where:**
   - **Image Name** = `node.exe`
   - **Look at corresponding PID value**

**Quick Visual:**
```
Image Name          User Name    CPU    Memory    PID
node.exe            YourName     5%     48 MB     12345
node.exe            YourName     3%     52 MB     54321
```

---

### Method 3: Command Prompt (cmd)

#### List all processes:
```cmd
tasklist
```

#### Find specific process:
```cmd
tasklist | findstr node
```

**Output:**
```
node.exe                     12345 Console        0     48,192 K
node.exe                     54321 Console        0     52,456 K
```

#### Find by port:
```cmd
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

**Output Explanation:**
```
TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345
                                                   ^^^^^ PID
```

---

### Method 4: PowerShell by Port

```powershell
# Check port 5000
netstat -ano | findstr :5000

# Or using PowerShell cmdlets:
$port = 5000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
    ForEach-Object { Get-Process -Id $_.OwningProcess }
$process | Select-Object Name, Id, Handles
```

---

## 🛑 How to Stop Process by PID

### Method 1: PowerShell (Graceful)

```powershell
# Stop process gracefully
Stop-Process -Id 12345

# Force stop (immediate termination)
Stop-Process -Id 12345 -Force

# Confirm before stopping
Stop-Process -Id 12345 -Confirm
```

### Method 2: Command (Forceful)

```cmd
# Kill process by PID
taskkill /PID 12345 /F

# Kill without force (graceful attempt)
taskkill /PID 12345

# Kill multiple processes
taskkill /PID 12345 /PID 54321 /F
```

### Method 3: PowerShell by Port

```powershell
# Stop process listening on port 5000
$port = 5000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    ForEach-Object { Get-Process -Id $_.OwningProcess }
$process | Stop-Process -Force

# Same for port 3000
$port = 3000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    ForEach-Object { Get-Process -Id $_.OwningProcess }
$process | Stop-Process -Force
```

---

## 🚀 Starting Processes (PIDs Assigned on Start)

### Start Backend Server
```bash
cd server
npm run dev
```

**Result:**
- New PID assigned automatically
- Node.js process starts listening on port 5000
- Process remains active until stopped

### Start Frontend Client (Separate Terminal)
```bash
cd client
npm start
```

**Result:**
- New PID assigned automatically
- React dev server starts listening on port 3000
- Process remains active until stopped

---

## 📊 Real-World Example: Complete Process Lifecycle

### 1. Start Both Processes (Two Terminals)

**Terminal 1 - Server:**
```
$ cd server
$ npm run dev

Starting server on port 5000...
PID: 12345 (automatically assigned)
✅ Server ready
```

**Terminal 2 - Client:**
```
$ cd client
$ npm start

Starting development server...
PID: 54321 (automatically assigned)
✅ Compiled successfully
```

### 2. Monitor Processes

```powershell
Get-Process node | Format-Table Name, ID, CPU, Memory
```

**Output:**
```
Name    ID      CPU    Memory
----    --      ---    ------
node    12345   5.2    48 MB  (Backend)
node    54321   3.1    52 MB  (Frontend)
```

### 3. Stop Specific Process

```powershell
# Stop only backend (PID 12345)
Stop-Process -Id 12345 -Force

# Or by port
netstat -ano | findstr :5000
taskkill /PID 12345 /F
```

### 4. Verify Process Stopped

```powershell
Get-Process node -ErrorAction SilentlyContinue | Where-Object Id -eq 12345
# Returns nothing if process is stopped
```

---

## ⚠️ Common PID Issues & Solutions

### Issue 1: Port Already in Use
```powershell
# Find which process is using port 5000
$port = 5000
Get-NetTCPConnection -LocalPort $port | Select-Object OwningProcess

# Get process details
Get-Process -Id (Get-NetTCPConnection -LocalPort $port).OwningProcess

# Kill it
Stop-Process -Id <PID> -Force
```

### Issue 2: Process Won't Die
```powershell
# Use Force flag with taskkill
taskkill /PID 12345 /F

# Or Force with PowerShell
Stop-Process -Id 12345 -Force
```

### Issue 3: Multiple Node Processes
```powershell
# Show all node processes with details
Get-Process node | Format-Table Name, ID, StartTime, Path

# Stop specific one by time started
Get-Process node | Sort-Object StartTime | Select-Object -Last 1 | Stop-Process -Force
```

### Issue 4: PID Already Assigned When Starting
```
# Always happens automatically - no action needed
# New PID = old PID is freed
```

---

## 📋 Quick Reference Commands

| Task | Command |
|------|---------|
| View all node PIDs | `Get-Process node` |
| View process by port 5000 | `Get-NetTCPConnection -LocalPort 5000` |
| Stop by PID | `taskkill /PID 12345 /F` |
| Stop gracefully | `Stop-Process -Id 12345` |
| Find by port | `netstat -ano \| findstr :5000` |
| Kill all node | `taskkill /IM node.exe /F` |
| Monitor processes | `Get-Process node \| Format-Table` |

---

## 🔗 Related Documentation

- [STOPPING_GUIDE.md](../STOPPING_GUIDE.md) - How to stop the application
- [RUNNING_GUIDE.md](../RUNNING_GUIDE.md) - How to start the application
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Initial setup guide

---

## 💡 Tips & Best Practices

1. **Always use `Ctrl + C` first** - Most graceful way to stop
2. **Use Task Manager for quick visual** - Easier than terminal commands
3. **Port-based approach** - More reliable than guessing PIDs
4. **Write down PID when starting** - Helps with manual termination
5. **One terminal per process** - Makes stopping individual processes easier
6. **Use script for automation** - Create `.bat` or `.ps1` for repeated tasks
7. **Check before killing** - Verify you're stopping the right PID
8. **Logs on termination** - Node.js usually logs before shutting down

