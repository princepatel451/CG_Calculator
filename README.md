# 🎓 CGPA Calculator

A responsive **CGPA & SGPA Calculator** built with React and TypeScript. It allows students to calculate semester SGPA, cumulative CGPA, and grade-based performance using their academic branch, semester, grades, and credits.

🔗 **Live Demo:** https://cg-calculator-seven.vercel.app/
🔗 **GitHub:** https://github.com/princepatel451/CG_Calculator

## ✨ Features

* 📊 Calculate **SGPA** based on subject grades and credits
* 🎓 Calculate **CGPA** using previous CGPA and completed credits
* 🏫 Select academic branch and semester
* 📚 Pre-configured subjects and credit values
* ✏️ Customize subject credits
* 🔢 Grade-to-point mapping
* 🔄 Reset calculation inputs
* 📖 Built-in explanation of the calculation method
* 📱 Responsive design for desktop and mobile
* ✨ Smooth UI animations and transitions

## 🛠️ Tech Stack

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Motion** – animations
* **Lucide React** – icons

## 🧮 Calculation

### SGPA

```text
SGPA = Σ(Credit × Grade Point) / Σ(Credits)
```

### CGPA

When previous academic performance is included:

```text
CGPA =
(Previous CGPA × Previous Credits + Current Grade Points)
---------------------------------------------------------
              Previous Credits + Current Credits
```

Results are calculated dynamically based on the selected grades and credit values.

## ⚙️ Run Locally

### Clone the repository

```bash
git clone https://github.com/princepatel451/CG_Calculator.git
cd CG_Calculator
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The application will run at:

```text
http://localhost:3000
```

## 📦 Build for Production

```bash
npm run build
```

## 👨‍💻 Author

**Prince Patel**

GitHub: https://github.com/princepatel451
