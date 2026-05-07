# 🛑 Mahii - How to Stop the Application

This guide explains how to properly stop the running Mahii application components (both backend server and frontend client).

## 📋 Overview

The Mahii application runs two main processes:
- **Backend Server** (Node.js/Express) - Runs on port 5000
- **Frontend Client** (React) - Runs on port 3000

Both need to be stopped gracefully to avoid data corruption and port conflicts.

## � Understanding PIDs (Process IDs)

A **PID (Process ID)** is a unique number assigned to each running process. When you start the application, each Node.js process gets a PID automatically.

**Example:**
- Backend Server PID: `12345`
- Frontend Client PID: `54321`

### Quick PID Reference:
- **View all Node processes**: `Get-Process node` (PowerShell)
- **Find process on port 5000**: `netstat -ano | findstr :5000`
- **Kill by PID**: `taskkill /PID 12345 /F`

📖 **For detailed PID management**, see [PID_REFERENCE.md](./docs/PID_REFERENCE.md)

---

## �🛑 Quick Stop Methods

### Method 1: Keyboard Interrupt (Recommended)

#### For Each Terminal Window:
1. **Focus the terminal** running the component
2. **Press `Ctrl + C`** (Windows/Linux/Mac)
3. **Wait for graceful shutdown** message
4. **Close the terminal** window

**Expected Output:**
```
^C
✅ Server stopped gracefully
```
or
```
^C
Stopping the development server...
```

### Method 2: Process Termination (Windows)

#### Step 1: Find the PID

**Option A - By Port Number (Recommended):**
```cmd
# Find backend server PID (port 5000)
netstat -ano | findstr :5000

# Output example:
# TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345
#                                                   ^^^^^ PID

# Find frontend client PID (port 3000)
netstat -ano | findstr :3000
```

**Option B - Using PowerShell:**
```powershell
# View all Node processes with PID
Get-Process node | Format-Table Name, ID, CPU, Memory

# Output:
# Name    ID      CPU    Memory
# node    12345   5.2    48 MB   (Backend)
# node    54321   3.1    52 MB   (Frontend)
```

#### Step 2: Kill the Process by PID

```batch
# Kill specific process (replace XXXX with actual PID)
taskkill /PID XXXX /F

# Example - Kill backend (PID 12345)
taskkill /PID 12345 /F

# Example - Kill frontend (PID 54321)  
taskkill /PID 54321 /F

# Kill both at once
taskkill /PID 12345 /PID 54321 /F
```

#### Batch Script for Quick Stop:
Create `stop-app.bat` in the project root:

```batch
@echo off
echo Stopping Mahii Application...

REM Kill processes on ports 3000 and 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /PID %%a /F 2>nul

echo ✅ Application stopped
pause
```

Run: `.\stop-app.bat`

### Method 3: Process Termination (PowerShell)

#### View Running Processes and PIDs:
```powershell
# List all Node processes with their PIDs
Get-Process node | Format-Table Name, ID, CPU, Memory, StartTime
```

#### Stop by PID:
```powershell
# Gracefully stop process
Stop-Process -Id 12345

# Force kill process
Stop-Process -Id 12345 -Force

# Stop multiple processes
Stop-Process -Id 12345, 54321 -Force
```

#### Stop by Port:
```powershell
# Find and stop process on port 5000
$port = 5000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
    ForEach-Object { Get-Process -Id $_.OwningProcess }
$process | Stop-Process -Force

# Or for port 3000
$port = 3000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
    ForEach-Object { Get-Process -Id $_.OwningProcess }
$process | Stop-Process -Force
```

#### Complete PowerShell Script:
Create `stop-app.ps1` in the project root:

```powershell
Write-Host "Stopping Mahii Application..." -ForegroundColor Yellow

# Get processes using ports 3000 and 5000
$nodeProcesses = Get-NetTCPConnection | Where-Object {
    ($_.LocalPort -eq 3000 -or $_.LocalPort -eq 5000) -and $_.State -eq 'Listen'
} | ForEach-Object {
    Get-Process -Id $_.OwningProcess
}

# Kill the processes
foreach ($process in $nodeProcesses) {
    Write-Host "Stopping process: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Red
    Stop-Process -Id $process.Id -Force
}

Write-Host "✅ Application stopped" -ForegroundColor Green
```

Run: `.\stop-app.ps1`

### Method 4: Task Manager (Windows)

1. **Open Task Manager** (`Ctrl + Shift + Esc`)
2. **Go to "Processes" tab**
3. **Find "Node.js: Server-side JavaScript"**
4. **Right-click and select "End task"**
5. **Repeat for both instances** (client and server)

### Method 5: Using Development Tools

#### VS Code Integrated Terminal:
1. **Open VS Code**
2. **View → Terminal**
3. **Click the trash icon** (🗑️) next to each terminal to kill them
4. **Or use `Ctrl + C`** in each terminal

#### VS Code Tasks (if configured):
- Use VS Code's "Terminate Task" option in the terminal dropdown

## 🔍 Verification

### Check if Processes are Stopped:

```bash
# Check if ports are free
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Should return no results if properly stopped
```

### Alternative Check:

```bash
# Check for Node.js processes
tasklist | findstr node

# Kill all Node.js processes (use with caution)
taskkill /IM node.exe /F
```

## 🛡️ Graceful vs Force Shutdown

### Graceful Shutdown (Recommended):
- Allows cleanup operations
- Saves any pending data
- Closes database connections properly
- **Method:** `Ctrl + C` in terminal

### Force Shutdown (Emergency):
- Immediate termination
- May cause data loss
- Database connections may not close properly
- **Method:** `taskkill /F` or Task Manager

## 🔄 Restarting After Stop

After stopping the application:

### Quick Restart:
```bash
# Start server
cd server && npm start

# In new terminal, start client
cd client && npm start
```

### Or use the start script if created:
```bash
./start-app.bat    # Windows
./start-app.ps1    # PowerShell
```

## 🐛 Troubleshooting Stop Issues

### Process Won't Terminate:

```bash
# Force kill stubborn processes
taskkill /IM node.exe /F /T

# Or kill by port specifically
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /PID %a /F
```

### Port Still in Use:

```bash
# Wait a few seconds and check again
timeout /t 5
netstat -ano | findstr :3000
```

### Multiple Node Processes:

```bash
# List all Node.js processes
tasklist | findstr node

# Kill all Node.js processes (careful!)
taskkill /IM node.exe /F
```

## 📊 Monitoring Running State

### Check Application Status:

```bash
# Test server
curl -s http://localhost:5000/api/test

# Test client (will return HTML)
curl -s http://localhost:3000 | head -n 5
```

### Process Monitoring:

```batch
:monitor
cls
echo Monitoring Mahii processes...
echo.
echo Port 3000 (Client):
netstat -ano | findstr :3000
echo.
echo Port 5000 (Server):
netstat -ano | findstr :5000
echo.
echo Node processes:
tasklist | findstr node
echo.
timeout /t 5
goto monitor
```

Save as `monitor.bat` and run to continuously monitor.

## ⚠️ Important Notes

- **Always stop gracefully** when possible to prevent data corruption
- **Close database connections** properly before stopping
- **Backup data** before force termination if critical
- **Check logs** after stopping for any error messages
- **Verify ports are free** before restarting to avoid conflicts

## 🔄 Development Workflow

1. **Make code changes**
2. **Stop application** (`Ctrl + C`)
3. **Restart components** as needed
4. **Test changes**
5. **Repeat**

## 📞 Support

If you encounter persistent stop issues:
1. **Check Task Manager** for remaining processes
2. **Restart your computer** if necessary
3. **Check firewall/antivirus** settings
4. **Verify no background services** are running

---

## 🔍 Deep Dive: PID Management

### What is a PID and Why It Matters?

A **Process ID (PID)** is a unique number assigned by Windows to every running process. It helps identify exactly which process you want to stop.

**Example:**
- When you run `npm run dev` for the backend, a Node.js process with PID `12345` starts
- When you run `npm start` for the frontend, another Node.js process with PID `54321` starts
- Each has its own memory, resources, and listening ports

### Mapping PIDs to Ports

| Port | Process | Example PID | How to Find |
|------|---------|------------|------------|
| 5000 | Backend Server | 12345 | `netstat -ano \| findstr :5000` |
| 3000 | Frontend Client | 54321 | `netstat -ano \| findstr :3000` |

### PID Lifecycle

```
1. Start process → PID assigned (e.g., 12345)
2. Process running → PID remains same
3. Process stopped → PID released
4. Restart process → New PID assigned
```

**Example Output:**
```
First start:   npm run dev → PID 12345 assigned
Stop (Ctrl+C):            → PID 12345 released
Second start:  npm run dev → PID 12346 assigned (new!)
```

### Common PID Commands Quick Reference

| What You Need | Command | Windows |
|--------------|---------|---------|
| List all PIDs | `tasklist` | `tasklist` |
| Find by port | `netstat -ano \| findstr :5000` | Works |
| Find by name | `tasklist \| findstr node` | Works |
| View with details | `Get-Process node` | PowerShell |
| Kill by PID | `taskkill /PID 12345 /F` | Works |
| Kill by name | `taskkill /IM node.exe /F` | Works |
| Kill by port | See script above | Works |

### Troubleshooting PID Issues

#### Problem: "Port already in use"

```bash
# Find which PID is using the port
netstat -ano | findstr :5000

# Output: TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345
#                                                            ^^^^^ PID

# Kill that specific PID
taskkill /PID 12345 /F

# Try restarting your app
npm run dev
```

#### Problem: "Can't find node processes"

```bash
# List all running node processes
tasklist | findstr node

# Or with more detail
Get-Process node | Format-Table ID, Name, StartTime
```

#### Problem: "Multiple node processes - which to kill?"

```bash
# View with more context
Get-Process node | Format-Table ID, Path, StartTime

# Kill the one started first (oldest)
# Or kill by port instead

netstat -ano | findstr :5000
taskkill /PID <result> /F
```

### Advanced: Create a PID Log File

Create `log-processes.ps1`:

```powershell
# Log current PIDs and ports for reference
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logfile = "process-log.txt"

Add-Content -Path $logfile -Value "`n=== $timestamp ==="
Add-Content -Path $logfile -Value "Backend (port 5000):"
netstat -ano | findstr :5000 | Add-Content -Path $logfile

Add-Content -Path $logfile -Value "`nFrontend (port 3000):"
netstat -ano | findstr :3000 | Add-Content -Path $logfile

Add-Content -Path $logfile -Value "`nAll Node processes:"
Get-Process node | Format-Table ID, Name, Memory | Add-Content -Path $logfile

Write-Host "Logged to $logfile"
```

Run before starting:
```powershell
.\log-processes.ps1
```

---

## 📚 Related Resources

- **[PID_REFERENCE.md](./docs/PID_REFERENCE.md)** - Complete PID management guide
- **[RUNNING_GUIDE.md](./RUNNING_GUIDE.md)** - How to start the application
- **[GETTING_STARTED.md](./docs/GETTING_STARTED.md)** - Initial setup
- **[Quick Reference](./docs/QUICK_REFERENCE.md)** - Common commands

---

## ✅ Checklist: Before Stopping

- [ ] Save any unsaved work in browser
- [ ] Close database connection UI (if applicable)
- [ ] Stop file uploads/background tasks
- [ ] Note down current PIDs (optional but helpful)
- [ ] Use `Ctrl + C` first (most graceful)
- [ ] Wait 5 seconds for graceful shutdown
- [ ] Use `taskkill /F` only if needed

---

## 💾 Quick Copy-Paste Commands

### View Current PIDs:
```powershell
Get-Process node | Format-Table ID, Name, Memory
```

### Find by Port:
```cmd
netstat -ano | findstr :5000
```

### Kill Specific PID:
```cmd
taskkill /PID 12345 /F
```

### Kill All Node:
```cmd
taskkill /IM node.exe /F
```

### Kill by Port:
```cmd
for /f "tokens=5" %a in ('netstat -ano ^| findstr :5000') do taskkill /PID %a /F
```