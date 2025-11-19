# TranscendBody – Your 90-Day Tracker for Fat Loss & Muscle Gain

Built for Beginners, Busy Professionals & Master Coaches

A powerful web application designed to help you stay consistent and accountable across four key pillars of transformation: Workouts, Nutrition, Recovery, and Mindset.

Whether you're just starting out or guiding others, TranscendBody supports your 90-day journey with smart tracking, personalized routines, and a gamified system to keep you progressing every step of the way.

## 🎯 Project Overview

TranscendBody is a gamified personal transformation platform that helps users track their daily activities across four key areas:
- **Workout**: Physical exercise and training routines
- **Nutrition**: Dietary habits and meal planning
- **Recovery**: Rest, sleep, and recovery practices
- **Mindset**: Mental health and personal development activities

### Key Features

#### For Users
- **Daily Activity Tracking**: Assign and complete activities across morning, afternoon, evening, and night time slots
- **Gamification System**: Tier-based progression (Bronze → Silver → Gold) with accountability levels (Beginner → Intermediate → Master)
- **Custom Activities**: Create personalized activities tailored to individual goals
- **Progress Analytics**: Visual charts and statistics showing completion rates and streaks
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

> 📖 **Gamification System**: For a complete understanding of how the progression system works, including levels, tiers, requirements, and metrics, see [GAMIFICATION_LOGIC.md](./GAMIFICATION_LOGIC.md).

#### For Administrators
- **User Management**: View, edit, and manage all user accounts
- **Activity Management**: Manage global activities available to all users
- **Analytics Dashboard**: Comprehensive statistics and insights
- **System Monitoring**: Track user engagement and system performance

## 📸 Screenshots

Here's a quick preview of the Transcend Body web app in action:

### 🔐 Login & Landing Page
Transform your body and mind in just 90 days — plan, track, and thrive.
![Login Landing Page](screenshots/login-page.png)

---

### 👑 Admin Dashboard
Track completion, streaks, and user roles with a beautifully designed admin view.
![Admin Dashboard](screenshots/admin-dashboard.png)

---

### 🥉 Beginner Dashboard
Designed to build strong habits — a daily routine tracker tailored for beginners.
![Beginner Dashboard](screenshots/beginner-dashboard.png)

## 🏗️ Technical Architecture

### Frontend
- **Template Engine**: EJS (Embedded JavaScript)
- **Styling**: Tailwind CSS with custom themes
- **JavaScript**: Vanilla JS with modern ES6+ features
- **Charts**: Chart.js for data visualization
- **UI Components**: Custom modal system and responsive design

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with bcrypt password hashing
- **Validation**: Zod schema validation

### Database Schema

#### Core Tables

**Users Table**
```sql
users (
  id: VARCHAR (Primary Key)
  email: VARCHAR (Unique)
  password: VARCHAR (Hashed)
  first_name: VARCHAR
  last_name: VARCHAR
  preferred_name: VARCHAR
  gender: VARCHAR
  age: INTEGER
  role: VARCHAR (user/admin)
  plan: VARCHAR (basic/pro)
  accountability_level: VARCHAR (beginner/intermediate/master)
  tier: VARCHAR (bronze/silver/gold)
  is_admin: BOOLEAN
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
)
```

**Global Activities Table**
```sql
global_activities (
  id: SERIAL (Primary Key)
  title: TEXT
  description: TEXT
  category: VARCHAR (workout/nutrition/recovery/mindset)
  time_of_day: VARCHAR (morning/afternoon/evening/night)
  is_custom: BOOLEAN
  difficulty: VARCHAR (easy/medium/hard)
  created_by: VARCHAR (FK to users.id)
  created_at: TIMESTAMP
)
```

**Daily Trackers Table**
```sql
daily_trackers (
  id: SERIAL (Primary Key)
  user_id: VARCHAR (FK to users.id)
  date: DATE
  completion_rate: INTEGER (0-100)
  created_at: TIMESTAMP
)
```

**Tracker Entries Table**
```sql
tracker_entries (
  id: SERIAL (Primary Key)
  tracker_id: INTEGER (FK to daily_trackers.id)
  activity_id: INTEGER (FK to global_activities.id)
  time_slot: VARCHAR (morning/afternoon/evening/night)
  status: VARCHAR (pending/completed)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TranscendBodyCursor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/transcendbody
   SESSION_SECRET=your-super-secret-key
   PORT=5050
   ```

4. **Database Setup**

   ✅ **Recommended for full demo setup**
   ```bash
   # Check PostgreSQL connection
   pg_isready

   # Clean and reseed the database with master activities and demo users
   npx tsx scripts/cleanAndSeed.ts
   # OR (depending on config)
   node --loader ts-node/esm scripts/cleanAndSeed.ts
   ```

   🔁 **Alternative (use only if the above is not viable)**
   ```bash
   # Push database schema (optional)
   npm run db:push

   # Seed initial data (optional)
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Main app: http://localhost:5050
   - Admin panel: http://localhost:5050/admin

## Demo Accounts

For testing purposes, the following demo accounts are available:

| Email             | Password | Tier   | Level      | Plan  |
|------------------|----------|--------|------------|-------|
| admin@demo.com   | test     | Gold   | Master     | Pro   |
| bronze@demo.com  | test     | Bronze | Beginner   | Basic |
| silver@demo.com  | test     | Silver | Intermediate | Pro |

## 📁 Project Structure

```
TranscendBodyCursor/
├── server/                 # Backend server code
│   ├── index.ts           # Main server entry point
│   ├── routes.ts          # API route definitions
│   ├── auth.ts            # Authentication middleware
│   ├── db.ts              # Database connection
│   ├── progress.ts        # Progress tracking logic
│   ├── storage.ts         # Session storage
│   └── validators.ts      # Input validation schemas
├── shared/                # Shared code between frontend/backend
│   └── schema.ts          # Database schema definitions
├── views/                 # EJS template files
│   ├── layout.ejs         # Base layout template
│   ├── dashboard.ejs      # Main dashboard view
│   ├── admin.ejs          # Admin panel view
│   └── index.ejs          # Landing page
├── public/                # Static assets
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side JavaScript
│   └── images/            # Image assets
├── scripts/               # Database seeding scripts
│   ├── cleanAndSeed.ts    # Clean and reseed database
│   ├── seedMasterActivities.ts # Seed master activities
│   └── seedDemoData.ts    # Seed demo user data
├── drizzle/               # Database migration files
└── package.json           # Project dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run seed` - Seed initial data
- `npm run check` - TypeScript type checking

## 🎨 Features in Detail

### Activity Management
- **40 Pre-built Activities**: Curated activities for fat loss and muscle gain
- **Custom Activities**: Users can create personalized activities
- **Time Slot Assignment**: Activities can be assigned to specific time slots
- **Category Organization**: Activities organized by workout, nutrition, recovery, and mindset

### Gamification System
- **Tier Progression**: Bronze → Silver → Gold
- **Accountability Levels**: Beginner → Intermediate → Master
- **Completion Tracking**: Daily completion rates and streaks
- **Progress Visualization**: Charts showing trends and achievements

### User Experience
- **Responsive Design**: Optimized for all device sizes
- **Intuitive Interface**: Clean, modern UI with clear navigation
- **Real-time Updates**: Instant feedback on activity completion
- **Accessibility**: Designed with accessibility best practices

## 🔒 Security Features

- **Password Hashing**: Bcrypt encryption for user passwords
- **Session Management**: Secure session handling with express-session
- **Input Validation**: Zod schema validation for all user inputs
- **SQL Injection Protection**: Parameterized queries with Drizzle ORM
- **XSS Protection**: Proper input sanitization and output encoding

## 📊 Analytics and Reporting

### User Analytics
- Daily completion rates
- Activity category breakdown
- Streak tracking
- Progress over time

### Admin Analytics
- User engagement metrics
- Activity popularity
- System usage statistics
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the code comments for implementation details

## 🔮 Future Enhancements

- [ ] Mobile app development
- [ ] Social features and community
- [ ] Advanced analytics and AI insights
- [ ] Integration with fitness trackers
- [ ] Meal planning and nutrition tracking
- [ ] Video tutorials and guided workouts
- [ ] Multi-language support
- [ ] Dark mode theme

---

**Built with ❤️ for personal transformation and growth**
