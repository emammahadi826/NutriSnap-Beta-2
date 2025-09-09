# NutriSnap - AI-Powered Nutrition Tracker

NutriSnap is a modern, responsive web application designed to help users track their daily food intake and achieve their health goals. It leverages Artificial Intelligence to make meal logging quick and intuitive.

**Live Demo & Screenshots:** [View App Screenshots](https://photos.app.goo.gl/sx3K8xhbdxKfUmcf8)

## ✨ Features

- **AI-Powered Meal Logging**: Snap a picture of your meal, and our AI will automatically identify the food items, estimate portion sizes, and calculate the nutritional information. Users can log meals by uploading a photo or using their device's camera.
- **Comprehensive Dashboard**: Get a complete overview of your daily progress with summary cards for total calories, protein, carbs, and fat. A dynamic pie chart visualizes your macronutrient breakdown.
- **Conversational AI Health Coach**: Chat with an AI-powered health trainer to get personalized nutrition plans, workout routines, and lifestyle advice based on your specific health goals and user profile data.
- **Detailed Nutrition Reports**: Visualize your nutritional intake over time with a bar chart showing daily consumption and a detailed, searchable table of all your past meal logs.
- **Secure User Authentication**: Sign up and log in securely with email/password or Google Sign-In. A guest mode with limited credits is available for new users to try the app.
- **Personalized User Profiles**: Users can set and update their profile with details like age, gender, weight, and height to receive a more personalized experience from the AI coach.
- **Responsive & Modern UI**: A clean and fully responsive UI that works seamlessly on desktops, tablets, and mobile devices, featuring a collapsible sidebar for easy navigation.
- **Theme Customization**: Instantly switch between a light and dark theme from the settings page to suit your preference.

## 📄 Pages

### 1. Login/Sign-Up Page
- **Functionality**: Allows new users to create an account or existing users to log in.
- **Elements**:
    - Tabs to switch between "Login" and "Sign Up" forms.
    - Input fields for `Email`, `Password`, and `Confirm Password` (on sign-up).
    - "Sign in with Google" button for one-click authentication.
    - A "guest mode" option is available, giving users 3 free meal scans to explore the app.

### 2. Complete Profile Page
- **Functionality**: A mandatory step for new users after sign-up to provide essential information for personalization.
- **Elements**:
    - Input fields for `Full Name`, `Age`, `Weight (kg)`, and `Height (ft)`.
    - A dropdown select for `Gender`.
    - "Save and Continue" button to store the profile information.

### 3. Dashboard (Home Page)
- **Functionality**: The main landing page after logging in, providing a snapshot of the day's nutritional intake. Accessible via the "Home" button in the sidebar.
- **Elements**:
    - **Summary Cards**: Four prominent cards displaying `Total Calories`, `Carbohydrates`, `Protein`, and `Fat` consumed for the day.
    - **Macro Breakdown Pie Chart**: A large, dynamic pie chart that visualizes the distribution of macronutrients (carbs, protein, fat). It also shows the total calorie count in the center.
    - **Today's Meals List**: A scrollable list showing all meals logged on the current day, with icons and item descriptions.
    - **Header Buttons**: Quick-access buttons to "Upload Meal" or "Use Camera".

### 4. Meal Logging Dialog
- **Functionality**: A dialog (modal) for analyzing and logging meals. Accessible from the header on the Dashboard or a button in the Chat page.
- **Elements**:
    - **Upload View**: An area to drag-and-drop or select an image file.
    - **Camera View**: A live feed from the device's camera to take a new photo.
    - **Results View**: After AI analysis, a list of identified food items is shown with their name and nutritional info. Users can adjust serving sizes (+/- buttons) for each item before confirming.
    - "Log Meal" button to save the meal to the daily log.

### 5. Chat Page
- **Functionality**: A dedicated page for interacting with the AI Health Coach.
- **Elements**:
    - **Message Display Area**: A scrollable view showing the conversation history between the user and the AI bot.
    - **Input Form**: A text area at the bottom for typing messages, a "Send" button, and a "+" button that opens a menu to log a meal via "Upload" or "Camera".
    - **Welcome Screen**: An initial message from the bot prompting the user to start the conversation.

### 6. Report Page
- **Functionality**: Provides a historical view of the user's nutrition data.
- **Elements**:
    - **Nutrition Breakdown Chart**: A bar chart displaying daily intake of calories, protein, carbs, and fat over time.
    - **Meal Log History Table**: A detailed table view of all past meals, showing a thumbnail, meal details, date, and a full macronutrient breakdown for each entry.

### 7. Profile & Settings (via User Menu)
- **Functionality**: Users access their profile and settings from a dropdown menu attached to their user icon in the sidebar.
- **Profile Page**:
    - View and update personal information: `Name`, `Age`, `Gender`, `Weight`, and `Height`.
- **Settings Page**:
    - A toggle switch to change the application's appearance between **Light and Dark themes**.
- **Sign Out**:
    - A button in the user menu to securely log out of the application.

## 🚀 Technology Stack

- **Framework**: Next.js (React)
- **AI/Generative AI**: Google Genkit (Gemini)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Authentication & Database**: Firebase (Auth & Firestore)
- **Charts**: Recharts
- **State Management**: React Hooks & Context API

This project was built in **Firebase Studio**.
