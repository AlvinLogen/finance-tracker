# Finance Tracker

A comprehensive personal finance management application built with modern web technologies, designed to help users track expenses, manage budgets, and monitor their financial health.

## 🎯 Project Overview

**Status**: Phase 4 Complete - Transaction Management ✅  
**Next Phase**: Phase 5 - User Authentication & Security  
**Development Period**: August 2025  
**Author**: Alvin Logenstein  

## 🚀 Current Features

### ✅ **Core Financial Management**
- **Real-Time Dashboard**: Live financial overview with income, expenses, and balance
- **Transaction Management**: Add, view, and categorize financial transactions
- **Category System**: Income and expense categorization with system defaults
- **Database Integration**: Complete SQL Server backend with stored procedures

### ✅ **User Experience**
- **Responsive Design**: Mobile-first approach with modern CSS Grid
- **Professional UI**: Custom color scheme with smooth animations
- **Real-Time Updates**: Live data refresh and instant user feedback

## 🛠️ Tech Stack

### **Frontend**
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with custom properties and CSS Grid
- **Vanilla JavaScript**: ES6+ features with API integration

### **Backend**
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework with CORS support
- **RESTful API**: Clean endpoint design with proper HTTP methods

### **Database**
- **Microsoft SQL Server**: Enterprise-grade database system
- **T-SQL**: Stored procedures for business logic
- **Normalized Schema**: Proper relationships and constraints

## 🏗️ Current API Endpoints

```
GET  /health                           # Health check
GET  /api/test                         # API connectivity test
GET  /api/dashboard/summary/:userId    # Financial dashboard data
GET  /api/transactions/:userId         # User transactions
POST /api/transactions                 # Add new transaction
GET  /api/categories/:userId           # User categories
```

## 📊 Development Phases

### **✅ Phase 1: Foundation & UI Components** 
- Semantic HTML structure with accessibility
- Professional CSS design system
- Responsive layout with mobile support

### **✅ Phase 2: Database Design & Schema**
- Complete SQL Server database design
- Normalized table structure with relationships
- Data integrity constraints and validation

### **✅ Phase 3: Backend API Development**
- Express.js server with routing and middleware
- SQL Server integration with connection pooling
- Stored procedure execution framework

### **✅ Phase 4: Transaction Management** *(Current)*
- Complete transaction CRUD operations
- Category-based transaction organization
- Real-time dashboard updates

### **🔄 Phase 5: User Authentication & Security** *(Next)*
- [ ] Secure user registration and login system
- [ ] JWT token-based authentication
- [ ] Password hashing with bcrypt
- [ ] Protected API endpoints and routes

### **📋 Phase 6: Analytics & Reporting** *(Planned)*
- [ ] Interactive financial charts and visualizations
- [ ] Spending trends and category analysis
- [ ] Monthly and yearly financial reports

### **📋 Phase 7: Budget Management System** *(Final)*
- [ ] Comprehensive budget creation and management
- [ ] Real-time budget vs. actual tracking
- [ ] Category-wise budget allocation
- [ ] Automated alerts for budget overruns

## 🔧 Local Development Setup

### **Prerequisites**
- Node.js (v16 or higher)
- SQL Server 2019 Developer Edition
- SQL Server Management Studio (SSMS)
- VS Code with Live Server extension

### **Current Setup**
```bash
# Start backend server
cd backend
npm install express mssql cors
node server.js

# Start frontend (new terminal)
cd frontend
# Open index.html with VS Code Live Server
```

### **Environment Configuration**
```bash
# Development URLs
Frontend: http://127.0.0.1:5500
Backend:  http://localhost:3001
Database: SQL Server (local instance)

# Test endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/test
curl http://localhost:3001/api/dashboard/summary/1
```

---

**Last Updated**: August 2025  
**Current Status**: Phase 4 Complete ✅  
**Next Milestone**: User Authentication System