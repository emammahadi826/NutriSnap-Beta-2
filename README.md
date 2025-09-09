# NutriSnap - AI-Powered Nutrition Tracker

NutriSnap is a modern, responsive web application designed to help users track their daily food intake and achieve their health goals. It leverages Artificial Intelligence to make meal logging quick and intuitive.

**Live Demo & Screenshots:** [View App Screenshots](https://photos.app.goo.gl/sx3K8xhbdxKfUmcf8)

## ✨ Features

- **AI-Powered Meal Logging**: Snap a picture of your meal, and our AI will automatically identify the food items, estimate portion sizes, and calculate the nutritional information.
- **Dashboard**: A comprehensive overview of your daily progress, including total calories, macronutrient breakdown (protein, carbs, fat), and a list of your logged meals.
- **Conversational AI Health Coach**: Chat with an AI-powered health trainer to get personalized nutrition plans, workout routines, and lifestyle advice based on your specific goals.
- **Nutrition Reports**: Visualize your nutritional intake over time with detailed charts and summaries to understand your eating habits better.
- **User Authentication**: Secure sign-up and login with email/password or Google. Includes a guest mode with limited credits for new users to try the app.
- **Personalized User Profiles**: Users can set and update their profile with details like age, gender, weight, and height to get a more personalized experience.
- **Responsive Design**: A clean, modern, and fully responsive UI that works seamlessly on desktops, tablets, and mobile devices, complete with a collapsible sidebar.
- **Theme Customization**: Instantly switch between a light and dark theme to suit your preference.

## 📄 Pages

### 1. Login/Sign-Up Page
- Allows new users to create an account or existing users to log in.
- Provides options for email/password authentication and Google Sign-In.
- A "guest mode" option is available, giving users 3 free meal scans to explore the app.

### 2. Complete Profile Page
- After signing up, new users are prompted to provide basic information like name, gender, age, weight, and height.
- This information is used to personalize the user's health and nutrition plan.

### 3. Dashboard (Home Page)
- The main landing page after logging in, accessible via the sidebar.
- Displays four key summary cards: Total Calories, Carbohydrates, Protein, and Fat consumed for the day.
- Features a dynamic pie chart that visualizes the macronutrient breakdown.
- Shows a list of all meals logged on the current day.

### 4. Meal Logging Dialog
- Accessible from the main navigation header or the chat page.
- Users can either upload a photo of their meal or use their device's camera to take a new one.
- The AI analyzes the image, identifies food items, and presents them with estimated nutritional values.
- Users can review and adjust the serving sizes before logging the meal.

### 5. Chat Page
- A dedicated page for interacting with the AI Health Coach.
- Users can ask questions about nutrition, request meal plans, and get workout suggestions.
- The chat interface maintains conversation history for a seamless experience.

### 6. Report Page
- Provides a historical view of the user's nutrition.
- Features a bar chart showing the daily intake of calories and macronutrients over time.
- Includes a detailed table view of all past meals logged.

### 7. Profile & Settings
- Users can access their Profile and Settings from the user menu in the sidebar.
- **Profile Page**: View and update personal information such as name, age, gender, weight, and height.
- **Settings Page**: Change the application's appearance by switching between light and dark themes.
- **Sign Out**: Securely log out of the application.

## 🚀 Technology Stack

- **Framework**: Next.js (React)
- **AI/Generative AI**: Google Genkit (Gemini)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Authentication & Database**: Firebase (Auth & Firestore)
- **Charts**: Recharts
- **State Management**: React Hooks & Context API

This project was built in **Firebase Studio**.
