# 🧮 Mental Math Game

A web-based mental arithmetic game built with React to help you practice and improve your math skills. Test your speed and accuracy with addition, subtraction, multiplication, and division!

## 🎮 Features

### Game Modes
- **Three Difficulty Levels:**
  - **Easy**: Numbers 1-10, Addition & Subtraction
  - **Medium**: Numbers 1-50, Addition, Subtraction & Multiplication
  - **Hard**: Numbers 1-100, All operations (Addition, Subtraction, Multiplication & Division)

### Core Features
- ✅ **Instant Feedback**: Get immediate visual feedback (✅/❌) after each answer
- ⏱️ **Timer Tracking**: Track time spent on each match
- 📊 **Match Summary**: Detailed breakdown of your performance after each match
- 💾 **Persistent Storage**: All match history saved in localStorage
- 📈 **Statistics Dashboard**: Comprehensive analytics of your performance over time
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Match History
- Browse all your past matches
- View detailed information for each match
- See all questions, your answers, and correct answers
- Filter by difficulty and performance

### Statistics & Analytics
- **Overall Performance Metrics:**
  - Total matches played
  - Overall accuracy percentage
  - Average score and time per match
  - Best and worst scores

- **Visual Analytics with Charts:**
  - Accuracy trend over time (line chart)
  - Performance breakdown by difficulty level
  - Performance breakdown by operation type (+, −, ×, ÷)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/raxzy0/mentalmath.git
cd mentalmath
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open automatically in your browser at [http://localhost:3000](http://localhost:3000)

## 📦 Building for Production

To create a production build:

```bash
npm run build
```

The optimized build will be created in the `build` folder, ready to be deployed.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: Custom CSS with responsive design
- **Data Persistence**: Browser localStorage API
- **Build Tool**: Create React App

## 🎯 How to Play

1. **Select Difficulty**: Choose Easy, Medium, or Hard based on your skill level
2. **Start Game**: Click "Start Game" to begin a match of 10 questions
3. **Answer Questions**: Type your answer and press Enter or click Submit
4. **Get Feedback**: Receive instant feedback on each answer
5. **View Summary**: See your complete match summary with all questions and answers
6. **Track Progress**: Visit the Statistics page to see your improvement over time

## 📊 Features in Detail

### Game Page
- Select difficulty level
- Solve 10 arithmetic questions per match
- Real-time score tracking
- Progress indicator (Question X of 10)
- Immediate visual feedback after each answer

### Match History Page
- Chronological list of all completed matches
- Quick stats (score, difficulty, time) for each match
- Click any match to view full details
- Color-coded difficulty badges

### Statistics Page
- Dashboard-style layout with key metrics
- Interactive charts powered by Chart.js
- Accuracy trends over time
- Performance breakdowns by difficulty and operation type
- Best and worst performance tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with Create React App
- Charts powered by Chart.js
- Icons from Unicode emoji set

---

**Start training your mental math skills today!** 🎓✨
