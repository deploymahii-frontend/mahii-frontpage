# 🚀 Mahii - How to Run the Application

This guide explains how to start the Mahii application, which consists of both backend (server) and frontend (client) components.

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **MongoDB Atlas** account and connection string
- **Git** (optional, for cloning the repository)

## 🗄️ Database Setup

1. **MongoDB Atlas Setup:**
   - Create a MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a new cluster (free tier available)
   - Get your connection string from the "Connect" section

2. **Environment Configuration:**
   - Copy `server/.env.example` to `server/.env`
   - Update the `MONGODB_URI` with your Atlas connection string
   - Configure other environment variables as needed

## 🏃‍♂️ Running the Application

### Method 1: Individual Components (Recommended for Development)

#### Step 1: Start the Backend Server
```bash
# Open Terminal/Command Prompt
cd server
npm install
npm start
```

The server will start on `http://localhost:5000`

#### Step 2: Start the Frontend Client
```bash
# Open a new Terminal/Command Prompt
cd client
npm install
npm start
```

The client will start on `http://localhost:3000`

### Method 2: Using Scripts (Windows)

#### Option A: Batch Script
Create a file called `start-app.bat` in the root directory:

```batch
@echo off
echo Starting Mahii Application...

REM Start server in background
start cmd /k "cd server && npm start"

REM Wait a moment for server to initialize
timeout /t 5 /nobreak > nul

REM Start client
cd client
npm start
```

Then run:
```bash
./start-app.bat
```

#### Option B: PowerShell Script
Create a file called `start-app.ps1` in the root directory:

```powershell
Write-Host "Starting Mahii Application..." -ForegroundColor Green

# Start server in background
Start-Process powershell -ArgumentList "cd server; npm start" -NoNewWindow

# Wait for server to initialize
Start-Sleep -Seconds 5

# Start client
cd client
npm start
```

Then run:
```powershell
.\start-app.ps1
```

### Method 3: Using Development Tools

#### VS Code Tasks
If using VS Code, you can create tasks in `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Server",
      "type": "shell",
      "command": "cd server && npm start",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "isBackground": true
    },
    {
      "label": "Start Client",
      "type": "shell",
      "command": "cd client && npm start",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "isBackground": true
    }
  ]
}
```

## 🌐 Accessing the Application

Once both components are running:

- **Frontend (Client):** http://localhost:3000
- **Backend (Server):** http://localhost:5000

## 🔍 Verification

### Check if Server is Running:
```bash
curl http://localhost:5000/api/test
```

Expected response: `{"message": "Auth routes working!"}`

### Check if Client is Running:
Open http://localhost:3000 in your browser

## 🐛 Troubleshooting

### Common Issues:

1. **Port Already in Use:**
   ```bash
   # Find process using port 3000
   netstat -ano | findstr :3000

   # Kill the process (replace XXXX with actual PID)
   taskkill /PID XXXX /F
   ```

2. **MongoDB Connection Error:**
   - Verify your `MONGODB_URI` in `server/.env`
   - Ensure MongoDB Atlas IP whitelist includes your IP (0.0.0.0/0 for testing)

3. **npm install Issues:**
   ```bash
   # Clear npm cache
   npm cache clean --force

   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Permission Errors:**
   ```bash
   # Run as administrator (Windows)
   # or use sudo (Linux/Mac)
   ```

## 📱 Development Workflow

1. **Start both server and client** as described above
2. **Make changes** to code
3. **Client auto-reloads** on file changes
4. **Server requires restart** for backend changes
5. **Test features** in the browser

## 🔄 Hot Reload

- **Client:** Automatic hot reload on file changes
- **Server:** Manual restart required for backend changes

## 📊 Monitoring

Check the terminal windows for:
- Server: "✅ MongoDB Connected" and "Server running on port 5000"
- Client: "Compiled successfully!" and "You can now view client in the browser"