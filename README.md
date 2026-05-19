# CurrCompare

Frontend (React JS) and server (ASP.NET) website for tracking currencies.

Website can be accessed through:  
https://currcompare-site.onrender.com

## Frontend

**Requirements:**

- Node.js: `^20.19.0 || >=22.12.0`
- Package Manager: `npm`

**Setup:**

```bash
cd ./client
npm install
npm run dev
```

## Backend

**Requirements:**

- .NET SDK: `net8.0`
- Database: `PostgreSQL`

**Setup:**

```bash
cd ./server/server
dotnet restore
dotnet run server.csproj
```

> Cold starts may occur due to server inactivity.

> AI analysis features for registered users may sometimes be unresponsive during peak hours due to high model demand.
