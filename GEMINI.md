# Gemini Project Context: NutriSnap

## Project Overview

NutriSnap is a web application designed for nutrition and meal tracking. It allows users to log meals, track nutritional intake (calories, protein, carbs, fat), and manage their user profile, which includes metrics like weight and height.

The application is built with a modern tech stack:

*   **Framework**: Next.js 15 with React (using App Router).
*   **Language**: TypeScript.
*   **Backend & Database**: Firebase is used for user authentication (Email/Password, Google Sign-In) and Firestore for storing user data like profiles and meal logs.
*   **Styling**: Tailwind CSS is used for styling, with a custom theme defined in `tailwind.config.ts`. The UI is built using `shadcn/ui` components, and icons are provided by `lucide-react`.
*   **AI Features**: The application integrates Google's Generative AI via `genkit`. It includes flows for identifying food from images, suggesting food alternatives, and a chat feature, all powered by the `gemini-1.5-flash` model.

## Building and Running

Key commands are defined in `package.json`:

*   **Run the development server**:
    ```bash
    npm run dev
    ```
*   **Build for production**:
    ```bash
    npm run build
    ```
*   **Start the production server**:
    ```bash
    npm run start
    ```
*   **Run AI flows (Genkit)**:
    ```bash
    npm run genkit:dev
    ```
*   **Lint the code**:
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Styling**: The project uses Tailwind CSS with CSS variables defined in `src/app/globals.css`. UI components are from `shadcn/ui` and should be used whenever possible to maintain consistency. Path alias `@/components/ui` is configured for them.
*   **Authentication**: All authentication logic is centralized in the `src/hooks/use-auth.tsx` hook. This hook provides context for the current user and methods for sign-up, login, and logout.
*   **Firebase Credentials**: Firebase API keys are managed through environment variables (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`) loaded in `next.config.ts`. These should be stored in a `.env.local` file at the project root.
*   **Type Definitions**: Core data structures and types are defined in `src/lib/types.ts`. New or shared types should be added here.
*   **Build Configuration**: The `next.config.ts` file is configured to `ignoreBuildErrors` for both TypeScript and ESLint. While this is the current setup, it's good practice to resolve these errors when possible.
*   **Path Aliases**: The project uses path aliases (e.g., `@/lib`, `@/components`) for cleaner imports. These are configured in `components.json` and likely `tsconfig.json`.
