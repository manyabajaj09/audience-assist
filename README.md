cat > README.md << 'EOF'
# 🚀 Audience Query Management System

![Dashboard Preview](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge)

An AI-powered unified inbox system for managing customer queries across multiple channels with intelligent auto-classification, ticket management, and analytics.

## ✨ Features

### 🎯 Core Features
- **Unified Inbox** - Centralized view of all messages from email, chat, social media, and community platforms
- **AI Auto-Classification** - Automatic tagging, sentiment analysis, and priority detection using OpenAI
- **Smart Ticket System** - Auto-create tickets for high-priority messages
- **Real-time Analytics** - Visual dashboards showing query distribution and performance metrics
- **Status Tracking** - Track tickets through open → in progress → resolved workflow
- **Filter & Search** - Filter by tag, priority, channel, and status

### 🤖 AI-Powered
- Automatic message categorization (question, request, complaint, praise)
- Sentiment analysis (positive, neutral, negative)
- Priority scoring (1-5 scale)
- AI reply suggestions for faster responses

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - RESTful API
- **MongoDB** + **Mongoose** - Database
- **OpenAI API** - AI classification and reply suggestions

### Frontend
- **React** (Vite) - Modern UI framework
- **Tailwind CSS** - Styling with dark theme
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- OpenAI API key

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/manyabajaj09/audience-assist.git
cd audience-assist/backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in backend folder
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

4. Start backend server
```bash
node server.js
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🎮 Usage

### Add Test Messages
```bash
curl -X POST http://localhost:5000/api/messages/ingest \
  -H "Content-Type: application/json" \
  -d '{"channel":"email","sender":"customer@test.com","content":"My order has not arrived"}'
```

### API Endpoints

#### Messages
- `POST /api/messages/ingest` - Ingest new message
- `GET /api/messages` - List all messages
- `GET /api/messages/:id` - Get message details
- `POST /api/messages/suggest-reply` - Get AI reply suggestion

#### Tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets` - List all tickets
- `GET /api/tickets/:id` - Get ticket details
- `PATCH /api/tickets/:id/status` - Update ticket status

#### Analytics
- `GET /api/analytics/overview` - Get overview stats
- `GET /api/analytics/messages-by-tag` - Tag distribution
- `GET /api/analytics/messages-by-channel` - Channel distribution

## 📊 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/0f172a/00d4ff?text=Dark+Theme+Dashboard)

### Unified Inbox
![Inbox](https://via.placeholder.com/800x400/0f172a/00d4ff?text=Unified+Inbox+with+Filters)

### Analytics
![Analytics](https://via.placeholder.com/800x400/0f172a/00d4ff?text=Analytics+Charts)

## 🏗️ Project Structure
```
audience-assist/
├── backend/
│   ├── config/
│   │   └── connectDB.js
│   ├── controllers/
│   │   ├── messagesController.js
│   │   └── ticketsController.js
│   ├── models/
│   │   ├── Message.js
│   │   ├── Ticket.js
│   │   ├── User.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── messages.js
│   │   ├── tickets.js
│   │   ├── users.js
│   │   └── analytics.js
│   ├── utils/
│   │   └── openaiClient.js
│   ├── .env (create this)
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
OPENAI_API_KEY=sk-...
```

## 🚀 Deployment

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy

## 🎯 Key Features Implemented

- ✅ Unified inbox for all channels
- ✅ Auto-tagging (question, request, complaint, praise, other)
- ✅ Priority detection (1-5 scale)
- ✅ Sentiment analysis (positive, neutral, negative)
- ✅ Automatic ticket creation for high-priority messages
- ✅ Ticket assignment and status tracking
- ✅ Activity logs
- ✅ Analytics dashboard with charts
- ✅ AI-powered reply suggestions
- ✅ Filter by tag, priority, and status
- ✅ Dark theme UI with electric blue gradients

## 🎨 Design Highlights

- Modern dark theme with cyan/blue gradients
- Futuristic UI with glowing elements
- Responsive design
- Smooth animations and transitions
- Professional data visualizations

## 📝 License

MIT License

## 👨‍💻 Author

**Manya Bajaj**
- GitHub: [@manyabajaj09](https://github.com/manyabajaj09)

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- MongoDB for database
- React & Vite for frontend framework
- Tailwind CSS for styling
- Recharts for data visualization

---

**Built with ❤️ for efficient customer query management**
EOF
