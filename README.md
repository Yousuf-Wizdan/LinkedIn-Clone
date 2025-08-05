# LinkedIn Clone

This is a clone of the popular professional networking platform, LinkedIn, built with modern web technologies. It allows users to create posts, comment on posts, and like posts. User authentication is handled by Clerk, and data is stored in a MongoDB database. File uploads are managed through Azure Blob Storage.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v20 or later)
*   npm
*   A MongoDB database (local or cloud-hosted)
*   A Clerk account for authentication
*   An Azure account with a configured Blob Storage container

### Installing

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/linkedin-clone.git
    cd linkedin-clone
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env.local` file in the root of the project and add the following environment variables:

    ```env
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

    # MongoDB
    MONGODB_URI=

    # Azure Blob Storage
    AZURE_STORAGE_ACCOUNT_NAME=
    AZURE_STORAGE_ACCOUNT_KEY=
    AZURE_STORAGE_CONTAINER_NAME=
    AZURE_STORAGE_SAS_TOKEN=
    ```

4.  Run the development server:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

*   **User Authentication:** Sign up, sign in, and manage user sessions with Clerk.
*   **Create Posts:** Users can create new posts with text and optional images.
*   **Comment on Posts:** Users can add comments to posts.
*   **Like Posts:** Users can like and unlike posts.
*   **Real-time Updates:** The post feed is updated in real-time.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Authentication:** [Clerk](https://clerk.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
*   **File Storage:** [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

## Configuration

The `next.config.ts` file is configured to allow images from `upload.wikimedia.org` and your Azure Blob Storage container. The `serverActions` body size limit is increased to 5MB to accommodate file uploads.

The `tsconfig.json` file is set up with standard Next.js and TypeScript configurations, including path aliases for easier imports.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode.
*   `npm run build`: Builds the app for production.
*   `npm run start`: Starts a production server.
*   `npm run lint`: Runs the linter.
