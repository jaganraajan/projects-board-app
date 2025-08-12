# Projects Board App

A mobile-optimized Kanban-style project management board built with Expo React Native, designed to work with the Rails backend at [@jaganraajan/projects-board-tenant-server](https://github.com/jaganraajan/projects-board-tenant-server).

## Demo 
<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/f7f941ff-c043-4812-b77f-f58d93c7ccec" width="150"/></td>
    <td><img src="https://github.com/user-attachments/assets/83e3ad82-1dee-4fc9-886f-a9d66aa6d12b" width="150"/></td>
    <td><img src="https://github.com/user-attachments/assets/dd2061cc-0c48-46e0-9103-33435664c6f4" width="150"/></td>
    <td><img src="https://github.com/user-attachments/assets/98eecb59-2b78-48df-9f59-8078868b22ba" width="150"/></td>
    <td><img src="https://github.com/user-attachments/assets/77e7402e-539f-4c9b-a7fe-933c142aee81" width="150"/></td>
  </tr>
</table>

## Features

- **Mobile-Optimized Kanban Board**: Touch-friendly task management with three columns (To Do, In Progress, Done)
- **JWT Authentication**: Secure login/register with multi-tenant support
- **Task Management**: Create, edit, delete, and move tasks between columns
- **iOS Design Language**: Native iOS styling with rounded corners, shadows, and smooth animations
- **Offline-Ready**: AsyncStorage for token persistence
- **Priority & Due Dates**: Task priority levels and due date management
- **Company Branding**: Multi-tenant support with company-specific data

## Backend Integration

This app connects to the Ruby on Rails backend:
- **Repository**: [@jaganraajan/projects-board-tenant-server](https://github.com/jaganraajan/projects-board-tenant-server)
- **API Documentation**: See the backend's `API_DOCUMENTATION.md` for endpoint details
- **Authentication**: JWT tokens with multi-tenant support via email parameter

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Emulator (for Android)
- Rails backend server running (see backend repository)

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jaganraajan/projects-board-app.git
   cd projects-board-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Update the API configuration in `constants/Config.ts`:
   ```typescript
   export const API_CONFIG = {
     BASE_URL: __DEV__ 
       ? 'http://localhost:3000' // Your local Rails server
       : 'https://your-production-server.com', // Your production URL
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
├── app/                    # App screens (file-based routing)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home/Welcome screen
│   │   ├── board.tsx      # Main Kanban board
│   │   └── explore.tsx    # Profile/Settings screen
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   └── register.tsx   # Registration screen
│   └── _layout.tsx        # Root layout with AuthProvider
├── components/            # Reusable components
│   ├── kanban/           # Kanban board components
│   │   ├── KanbanBoard.tsx    # Main board container
│   │   ├── KanbanColumn.tsx   # Individual columns
│   │   ├── TaskCard.tsx       # Task cards
│   │   ├── TaskEditModal.tsx  # Edit task modal
│   │   └── AddTaskModal.tsx   # Add task modal
│   └── ui/               # UI components
├── context/              # React Context providers
│   └── AuthContext.tsx   # Authentication & task management
├── lib/                  # Utilities and services
│   └── api/              # API client and types
│       └── client.ts     # HTTP client for Rails backend
├── constants/            # App constants
│   └── Config.ts         # API configuration and constants
└── assets/              # Static assets
```

## API Configuration

The app is configured to work with the Rails backend API. Key configuration options:

### Development
- Default: `http://localhost:3000` (Rails server)
- Ensure your Rails server is running on port 3000

### Production
- Update `BASE_URL` in `constants/Config.ts` with your production URL
- Ensure CORS is configured in your Rails app for your app's domain

### Authentication
- Uses JWT tokens stored in AsyncStorage
- Multi-tenant support via email parameter
- Automatic token refresh and error handling

## Usage

### Authentication
1. **Register**: Create account with email, password, and company name
2. **Login**: Sign in with existing credentials
3. **Logout**: Sign out from the Profile screen

### Task Management
1. **View Board**: Navigate to Board tab to see your Kanban board
2. **Add Tasks**: Tap the "+" button in any column to create a new task
3. **Edit Tasks**: Tap the pencil icon on any task card to edit
4. **Move Tasks**: Tap a task card and select which column to move it to
5. **Delete Tasks**: Tap the trash icon on any task card to delete

### Features
- **Priority Levels**: Critical, High, Medium, Low
- **Due Dates**: Set and modify due dates for tasks
- **Company Data**: Multi-tenant data isolation by company
- **Offline Support**: App works offline, syncs when reconnected

## Mobile Optimizations

- **Touch-First Design**: Large touch targets and gesture-friendly interactions
- **iOS Design Language**: Native iOS styling with proper spacing and typography
- **Tab Navigation**: Bottom tab navigation following iOS conventions
- **Modal Presentations**: iOS-style modals for forms and detailed views
- **Responsive Layout**: Adapts to different screen sizes
- **Performance**: Optimized scrolling and rendering for smooth experience

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run on web (limited functionality)
- `npm run lint` - Run ESLint

## Architecture

### State Management
- **React Context**: Used for authentication and global task state
- **AsyncStorage**: Persistent storage for tokens and offline data
- **Effect Management**: Proper cleanup and dependency handling

### API Integration
- **Axios**: HTTP client with interceptors and error handling
- **TypeScript**: Full type safety for API requests and responses
- **Error Boundaries**: Graceful error handling throughout the app

### Navigation
- **Expo Router**: File-based routing with TypeScript support
- **Tab Navigation**: iOS-style bottom tabs
- **Modal Stack**: Proper modal presentation for forms

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Related Projects

- **Backend API**: [@jaganraajan/projects-board-tenant-server](https://github.com/jaganraajan/projects-board-tenant-server)
- **Web Frontend**: [@jaganraajan/projects-board](https://github.com/jaganraajan/projects-board)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
