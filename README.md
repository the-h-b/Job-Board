# Taiyari24 Job Board Admin Dashboard

A comprehensive admin dashboard for managing the Taiyari24 job board platform built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

### Authentication System
- **Login Page**: Secure admin authentication with email and password
- **Context-based Auth**: React Context for authentication state management
- **Protected Routes**: Automatic redirects for authenticated/unauthenticated users

### Dashboard Overview
- **Interactive Analytics**: Real-time statistics and charts
- **Quick Actions**: Fast access to common admin tasks
- **Activity Feed**: Recent platform activities and alerts
- **Performance Metrics**: Key performance indicators

### User Management
- **Users List**: Comprehensive view of all registered users
- **Advanced Filtering**: Search and filter by role, status, location
- **User Actions**: View, edit, activate/deactivate, delete users
- **Bulk Operations**: Export user data, bulk actions

### Company Management
- **Company Profiles**: Detailed company information management
- **Approval Workflow**: Approve/reject new company registrations
- **Company Statistics**: Track company engagement and job postings
- **Card-based Layout**: Visual company management interface

### Student Management
- **Student Profiles**: Comprehensive student information
- **Academic Details**: CGPA, college, course, year tracking
- **Skills Management**: Track student skills and competencies
- **Application History**: View student job applications

### Job Management
- **Job Listings**: Complete job posting management
- **Advanced Filters**: Filter by company, status, location, type
- **Job Statistics**: Track applications, views, and performance
- **Approval System**: Review and approve job postings

### Calendar & Events
- **Interactive Calendar**: React-calendar integration
- **Event Management**: Create, edit, delete events
- **Event Types**: Interviews, deadlines, meetings, webinars
- **Event Notifications**: Track upcoming events and deadlines

### Notifications System
- **Notification Center**: Centralized notification management
- **Multiple Types**: Info, success, warning, error notifications
- **Categories**: Applications, interviews, companies, system alerts
- **Bulk Actions**: Mark all as read, delete notifications

### Bulk Operations
- **File Upload**: CSV/Excel file upload with drag-and-drop
- **Data Import**: Bulk import students, companies, and jobs
- **Template Downloads**: Pre-formatted templates for data import
- **Progress Tracking**: Real-time upload progress and error reporting

### Company Creation
- **Comprehensive Form**: Multi-step company registration
- **File Uploads**: Company logo upload with preview
- **Validation**: Form validation and error handling
- **Social Links**: Manage company social media presence

### Settings Management
- **Profile Settings**: Admin profile management
- **Password Management**: Secure password change functionality
- **Notification Preferences**: Customize notification settings
- **System Configuration**: Platform-wide settings
- **Security Settings**: Two-factor auth, session management, IP whitelisting

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Calendar**: React Calendar
- **Authentication**: Context API
- **State Management**: React Hooks

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                 # Main dashboard
│   │   ├── jobs/page.tsx           # Job management
│   │   ├── users/page.tsx          # User management
│   │   ├── companies/page.tsx      # Company management
│   │   ├── students/page.tsx       # Student management
│   │   ├── calendar/page.tsx       # Calendar & events
│   │   ├── notifications/page.tsx  # Notifications
│   │   ├── bulk-upload/page.tsx    # Bulk data upload
│   │   ├── create-company/page.tsx # Company creation
│   │   └── settings/page.tsx       # Settings
│   ├── login/page.tsx              # Login page
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home redirect
├── components/
│   └── DashboardLayout.tsx         # Main layout component
├── contexts/
│   └── AuthContext.tsx             # Authentication context
└── globals.css                     # Global styles
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Dashboard**
   - Open [http://localhost:3000](http://localhost:3000)
   - Login with demo credentials:
     - Email: `admin@taiyari24.com`
     - Password: `admin123`

## 📱 Responsive Design

The dashboard is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🔐 Security Features

- Protected routes with authentication checks
- Session management
- Password strength validation
- Two-factor authentication support
- IP whitelisting capabilities
- Secure file upload handling

## 📊 Key Components

### Dashboard Layout
- Responsive sidebar navigation
- Header with user profile and notifications
- Breadcrumb navigation
- Mobile-friendly design

### Data Tables
- Sortable columns
- Advanced filtering
- Search functionality
- Pagination support
- Export capabilities

### Forms
- Comprehensive validation
- File upload support
- Auto-save functionality
- Error handling
- Success feedback

### Charts & Analytics
- Real-time data visualization
- Interactive charts
- Key performance metrics
- Trend analysis

## 🔧 Customization

The dashboard is highly customizable:
- Easy theme modifications via Tailwind CSS
- Modular component structure
- Configurable settings
- Extensible authentication system

## 📈 Performance

- Optimized for performance with Next.js 15
- Lazy loading of components
- Efficient state management
- Minimized bundle size
- Fast page transitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

Built with ❤️ for Taiyari24 Job Board Platform
