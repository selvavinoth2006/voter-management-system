# VoterSync - Election Management System

A full-stack project built with React, Node.js, Express, and PostgreSQL (Neon).

## Features
- **Role-based Access**: Separate portals for Administrators and Citizens.
- **Voter Management**: Complete CRUD operations for voter registration.
- **Candidate Management**: Nominate and manage candidates with party affiliations.
- **Secure Voting**: Prevention of duplicate voting with real-time validation.
- **Live Results**: Interactive dashboards and charts showing live election outcomes.
- **Responsive Design**: Premium UI built with Tailwind CSS.

## Prerequisites
- Node.js (v16+)
- Neon PostgreSQL Account & Connection String

## Installation & Setup

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. The `.env` template has been created for you. **Open `.env` and paste your Neon connection string**:
   ```env
   DATABASE_URL="your_neon_connection_string_here"
   PORT=5000
   ```
3. Install dependencies and start the server:
   ```bash
   npm install
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

## Usage
- **Admin Portal**: Select "Administrator" on the login page to manage the system.
- **Citizen Portal**: Select "Citizen Voter" to search for your name and cast your vote.
- **Live Results**: Accessible to everyone from the sidebar.

## Database Schema
- `voters`: `voter_id`, `name`, `dob`, `gender`, `address`, `phone`
- `candidates`: `candidate_id`, `name`, `party`, `constituency`
- `votes`: `vote_id`, `voter_id` (unique), `candidate_id`
