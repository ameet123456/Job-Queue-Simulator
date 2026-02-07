# Job Queue Simulator

A simple **background job queue simulator** built with **JavaScript** and **React** to demonstrate how real systems process asynchronous jobs.

## Features
- In-memory job queue
- Job states: PENDING, RUNNING, COMPLETED, FAILED
- Retry logic with limits
- Single worker with Start / Pause / Resume / Stop
- Manual retry for failed jobs
- Live Kanban-style UI

## Run
```bash
npm install
npm run dev