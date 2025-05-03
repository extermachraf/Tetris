# Red Tetris Project Guide

## Project Overview

Red Tetris is a multiplayer online Tetris game built entirely with JavaScript. Players compete against each other in real-time, with special mechanics like sending penalty lines to opponents when clearing rows in your own field.

## Core Requirements

- Full-stack JavaScript implementation
- Client-side: Functional programming approach (no 'this' keyword)
- Server-side: Object-oriented programming with Player, Piece, and Game classes
- Socket.io for real-time bidirectional communication
- Unit tests with at least 70% coverage for statements, functions, lines, and 50% for branches
- No use of `<TABLE>` elements, jQuery, Canvas, or SVG
- Game board is 10 columns by 20 rows
- URL format for joining games: `http://server:port/#room[player_name]`

## Technology Stack

### Required Technologies:

- **Node.js** - Server runtime
- **Socket.io** - Real-time communication
- **JavaScript** - Programming language for both client and server

### Recommended Modern Alternatives (for optional components):

- **Next.js** - Modern React framework with built-in features
- **Redux Toolkit** or **Zustand** - For state management
- **CSS Grid** - For layout
- **Jest** and **React Testing Library** - For testing
- **ESLint** and **Prettier** - For code quality

## Phase 1: Project Setup & Architecture Planning

### 1.1 Environment Setup

- Set up Node.js development environment
- Initialize Next.js project:
  ```
  npx create-next-app@latest red_tetris
  ```
- Create project folder structure:
  ```
  red_tetris/
  ├── pages/
  │   ├── api/          # Server-side API routes
  │   ├── index.js      # Landing page
  │   └── game.js       # Game page
  ├── components/       # React components
  ├── lib/              # Utility functions
  ├── server/           # Dedicated Socket.io server
  │   ├── classes/      # Game classes
  │   └── index.js      # Server entry point
  ├── public/           # Static assets
  ├── styles/           # CSS/SCSS files
  ├── .env.local        # Environment variables
  ├── .gitignore
  ├── next.config.js    # Next.js configuration
  └── package.json
  ```
- Set up ESLint and Prettier for code quality

### 1.2 Build System Configuration

- Configure Next.js for production:
  - Customize `next.config.js` for specific requirements
  - Set up environment variables
- Create custom server setup for Socket.io integration
- Configure testing with Jest
- Create scripts for development, testing, and production builds

### 1.3 Architecture Planning

- Define client-server communication protocol
- Design data models and state structure
- Plan component hierarchy
- Define class structure for server
- Create Socket.io event documentation
- Plan URL handling strategy for game room joining

## Phase 2: Server Development

### 2.1 Socket.io Server Setup

- Create a custom server that extends Next.js:
  ```
  server/
  ├── index.js          # Main server file integrating Next.js and Socket.io
  ├── classes/          # Game logic classes
  └── socket/           # Socket event handlers
  ```
- Configure Socket.io with the HTTP server
- Set up environment variable handling with dotenv
- Create connection/disconnection handlers

### 2.2 Socket.io Integration

- Initialize Socket.io with the custom server
- Create middleware for authentication and room handling
- Implement room (game) joining logic
- Set up event listeners and emitters

### 2.3 Game Logic Classes

- Create `Player` class:
  - Properties: name, game, isLeader, board state
  - Methods: join game, leave game, update board
- Create `Piece` class:
  - Properties: shape, position, rotation
  - Methods: rotate, move, validate position
- Create `Game` class:
  - Properties: room name, players, piece sequence, game state
  - Methods: start game, end game, add/remove players, distribute pieces

### 2.4 Game Management System

- Implement multiple simultaneous games handling
- Create leader designation logic
- Develop game state lifecycle (waiting, playing, game over)
- Create piece generation algorithm with consistent sequencing
- Build line clearing and penalty line distribution system

## Phase 3: Next.js Client Development

### 3.1 Next.js Application Setup

- Create pages for:
  - Home/landing page
  - Game room
  - 404 and error pages
- Set up client-side routing for game joining
- Implement URL hash parsing for room and player names
- Create layout components for consistent UI

### 3.2 State Management Implementation

- Set up Redux Toolkit or Zustand store
- Create slices for game state, player state, and UI state
- Implement async operations for game events
- Design actions and reducers for all game events
- Set up persistent state if needed

### 3.3 Socket.io Client Integration

- Create a Socket.io client connection hook:
  ```jsx
  // Example concept for a custom hook
  const useSocket = () => {
    // Initialize socket connection
    // Handle connection events
    // Provide methods for emitting events
  };
  ```
- Set up event listeners for game updates
- Create middleware to dispatch state actions from socket events
- Handle reconnection logic

### 3.4 UI Components Development

- Create functional components using React Hooks:
  - Game Board (10x20 grid using CSS Grid)
  - Tetrimino renderer
  - Next piece preview
  - Opponent spectrums display
  - Game controls and status indicators
  - Waiting room / lobby interface
- Implement keyboard controls for piece movement
- Create responsive layouts using CSS Grid/Flexbox

## Phase 4: Game Logic Implementation

### 4.1 Tetris Core Mechanics

- Implement tetrimino data structures (shapes, rotations)
- Create collision detection system
- Develop gravity and piece falling mechanics
- Build line completion and clearing logic
- Implement scoring system (if desired)
- Create pure functions for game logic operations

### 4.2 Player Controls

- Create keyboard event handlers:
  - Left/right movement (arrow keys)
  - Rotation (up arrow)
  - Soft drop (down arrow)
  - Hard drop (spacebar)
- Implement touch controls for mobile (optional)
- Handle input throttling for responsive controls

### 4.3 Multiplayer Features

- Develop opponent spectrum visualization
- Implement penalty line system
- Create game over detection
- Build winner determination logic
- Implement rematch functionality for game leader
- Add real-time updates of opponent actions

### 4.4 Game Flow Management

- Handle URL-based game joining
- Create game start/end sequences
- Implement player joining/leaving handling
- Develop game state synchronization
- Create waiting room functionality

## Phase 5: Advanced Features & Polishing

### 5.1 Responsive Design

- Implement mobile-friendly layouts with Next.js responsive features
- Adjust controls for different screen sizes
- Ensure proper scaling of game elements
- Use CSS variables for theming
- Implement dark/light mode

### 5.2 Visual Effects

- Add animations for line clearing
- Create visual feedback for penalties
- Implement game over and victory animations
- Add particle effects or screen shake for impactful moments
- Use CSS transitions and keyframes for smooth animations

### 5.3 User Experience Improvements

- Add sound effects and background music
- Implement game settings (volume, controls)
- Create helpful tooltips and instructions
- Add visual countdown before game starts
- Implement accessibility features

### 5.4 Performance Optimization

- Use React's useMemo and useCallback for optimization
- Implement efficient rendering for tetriminos
- Optimize network traffic by minimizing payload size
- Use Next.js image optimization for assets
- Add proper error handling and recovery

## Phase 6: Testing & Deployment

### 6.1 Unit Testing

- Set up Jest and React Testing Library
- Write tests for:
  - Server-side game logic
  - Client-side components
  - State management actions and reducers
  - Socket event handlers
- Achieve required coverage metrics
- Create testing utilities for common scenarios

### 6.2 Integration Testing

- Test client-server communication
- Verify game flow from start to finish
- Test edge cases like disconnections and reconnections
- Verify multiplayer functionality
- Create end-to-end tests for critical user flows

### 6.3 Deployment Preparation

- Configure Next.js for production build
- Set up environment variables for different environments
- Create deployment scripts
- Prepare documentation
- Implement logging and monitoring

### 6.4 Deployment

- Deploy to a hosting platform (Vercel for Next.js frontend)
- Deploy Socket.io server to a suitable platform (Heroku, AWS, DigitalOcean)
- Set up domain and SSL if needed
- Verify production setup works correctly
- Implement continuous integration/deployment pipeline

## Learning Resources

### Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [Creating a Custom Server with Next.js](https://nextjs.org/docs/advanced-features/custom-server)
- [API Routes in Next.js](https://nextjs.org/docs/api-routes/introduction)

### JavaScript Functional Programming

- [JavaScript Functional Programming Explained](https://www.freecodecamp.org/news/functional-programming-in-javascript-explained/)
- [Pure Functions in JavaScript](https://www.freecodecamp.org/news/what-is-a-pure-function-in-javascript-acb887375dfe/)

### Object-Oriented JavaScript

- [OOP in JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_programming)
- [Classes in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

### Socket.io

- [Socket.io Documentation](https://socket.io/docs/v4)
- [Using Socket.io with Next.js](https://socket.io/how-to/use-with-react)
- [Building Real-time Applications with Socket.io](https://socket.io/get-started/)

### State Management

- [Redux Toolkit Quick Start](https://redux-toolkit.js.org/tutorials/quick-start)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Managing Asynchronous Logic with Redux Toolkit](https://redux-toolkit.js.org/tutorials/advanced-tutorial)

### Game Development Concepts

- [Tetris Game Tutorial](https://medium.com/@michael.karen/learning-modern-javascript-with-tetris-92d532bcd057)
- [Collision Detection in Games](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)

## Important Concepts to Master

### Functional Programming Principles

- Pure functions
- Immutability
- Function composition
- Avoiding side effects
- Higher-order functions

### Object-Oriented Programming Principles

- Classes and objects
- Inheritance
- Encapsulation
- Polymorphism
- Method overriding

### Socket Communication

- Event-based programming
- Real-time updates
- Rooms and namespaces
- Broadcast vs. direct messaging
- Error handling in socket connections

### Next.js & React

- Server-side rendering vs. client-side rendering
- Component lifecycle with Hooks
- State and props
- Side effects with useEffect
- Custom hooks
- Client vs. server code in Next.js

### Game Development

- Game loop
- Collision detection
- State synchronization
- Input handling
- Animation timing

## Project Constraints to Remember

1. Client code must avoid the 'this' keyword (except for Error subclasses)
2. Server code must use object-oriented programming
3. No use of `<TABLE>` elements, jQuery, Canvas, or SVG
4. Test coverage requirements must be met
5. Game board is 10 columns by 20 rows
6. URL format must be followed for joining games
7. Keep credentials in .env file, never commit them to Git
