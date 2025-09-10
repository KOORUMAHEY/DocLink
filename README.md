# DocLink

DocLink is a full-stack Next.js application for a hospital doctor appointment system. It allows patients to book appointments with doctors directly, and provides an admin interface for management.

## Getting Started

### 1. Environment Variables

First, you need to set up your environment variables. Create a file named `.env.local` in the root of the project and add your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace `your_*` with your actual Firebase project credentials.

### 2. Installing Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 3. Running the Development Server

To run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Build and Run

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```
