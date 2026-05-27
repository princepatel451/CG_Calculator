import { BranchConfig, GradeScale, Subject } from "./types";

// Standard University Letter Grades to Grade Points Mapping (using user's updated scale: AA to FF)
export const GRADES_LIST: GradeScale[] = [
  { grade: "AA", points: 10, description: "Outstanding" },
  { grade: "AB", points: 9, description: "Excellent" },
  { grade: "BB", points: 8, description: "Very Good" },
  { grade: "BC", points: 7, description: "Good" },
  { grade: "CC", points: 6, description: "Above Average" },
  { grade: "CD", points: 5, description: "Average" },
  { grade: "DD", points: 4, description: "Pass" },
  { grade: "FF", points: 0, description: "Fail" },
];

// Helper to construct a dynamic list of subjects in case some are empty
const createSubjects = (
  prefix: string,
  sem: number,
  names: string[],
  credits: number[],
  codes: string[]
): Subject[] => {
  return names.map((name, i) => ({
    id: `${prefix}-S${sem}-C${i + 1}`,
    name,
    code: codes[i] || `${prefix}-${sem}0${i + 1}`,
    credits: credits[i] !== undefined ? credits[i] : 4,
  }));
};

// Realistic curricular templates for all six of your requested college branches
export const BRANCHES_DATA: BranchConfig[] = [
  {
    id: "cse",
    name: "Computer Science & Engineering (CSE)",
    semesters: {
      1: createSubjects(
        "CSE",
        1,
        [
          "Calculus for Engineers",
          "Elements of Electrical Engineering",
          "Applied Sciences",
          "Computer Programming",
          "Electronics Devices and Circuits",
          "Environmental Studies"
        ],
        [4, 4, 4, 4, 4, 2],
        ["MAL 103", "BEL 102", "BSL 101", "CSL 101", "ECL 101", "HUL 102"]
      ),
      2: createSubjects(
        "CSE",
        2,
        [
          "Matrices, Transform Techniques & Differential Equations",
          "Digital Electronics",
          "Data Structures",
          "Application Programming",
          "Communication Skills",
          "Mechanics & Graphics"
        ],
        [4, 4, 4, 4, 3, 4],
        ["MAL 104", "ECL 102", "CSL 102", "CSL 103", "HUL 101", "BEL 101"]
      ),
      3: createSubjects(
        "CSE",
        3,
        [
          "Numerical Methods and Probability Theory",
          "Introduction to Object Oriented Programming",
          "Computer System Organisation",
          "Data Structures with Applications",
          "IT Workshop-I",
          "Microprocessors & Interfacing"
        ],
        [4, 4, 3, 3, 2, 4],
        ["MAL 201", "CSL 202", "CSL 203", "CSL 210", "CSP 201", "ECL 202"]
      ),
      4: createSubjects(
        "CSE",
        4,
        [
          "Design and Analysis of Algorithms",
          "Software Engineering",
          "Operating Systems",
          "Design Principles of Programming Languages",
          "Discrete Maths and Graph Theory",
          "IT Workshop-II"
        ],
        [4, 3, 4, 4, 4, 2],
        ["CSL 205", "CSL 206", "CSL 207", "CSL 208", "CSL 204", "CSP 202"]
      ),
      5: createSubjects(
        "CSE",
        5,
        [
          "Database Management Systems",
          "Open Course - I",
          "Computer Networks",
          "Theory of Computation",
          "Elective-I"
        ],
        [4, 3, 4, 4, 3],
        ["CSL 301", "OC-1", "CSL 302", "CSL 303", "DE-1", "CSL 432"]
      ),
      6: createSubjects(
        "CSE",
        6,
        [
          "Compilers",
          "Cryptography and Network Security",
          "Open Course-II",
          "Elective-II",
          "Elective-III",
        ],
        [4, 4, 3, 3, 4],
        ["CSL 304", "CSL 305", "OC-302", "DE-2", "DE-3", "CSD 301"]
      ),
      7: createSubjects(
        "CSE",
        7,
        [
          "Project Stage-I",
          "Elective-IV",
          "Elective-V",
          "Elective-VI",
          "Elective-VII",
          "Open Course III / MOOC"
        ],
        [8, 3, 3, 3, 3, 3],
        ["CSD 401", "DE-4", "DE-5", "DE-6", "DE-7", "OC-401"]
      ),
      8: createSubjects(
        "CSE",
        8,
        [
          "Internship / Major Project-II",
          "Elective-IV (Advanced)",
          "Elective-V (Specialized)",
          "Elective-VI (Specialized)",
          "Elective-VII (Advanced)",
          "Open Course III / MOOC-II"
        ],
        [8, 3, 3, 3, 3, 3],
        ["CSD 402", "DE-8", "DE-9", "DE-10", "DE-11", "OC-402"]
      ),
    },
  },
  {
    id: "csh",
    name: "CSE (Human Computer Interaction & Gaming Technology)",
    semesters: {
      1: createSubjects(
        "CSH",
        1,
        [
          "Calculus for Engineers",
          "Introduction to Gaming",
          "Computer Programming",
          "Mechanics & Graphics",
          "Communication Skills",
          "Introduction to HCI"
        ],
        [4, 2, 4, 4, 3, 2],
        ["MAL 103", "CSL 106", "CSL 101", "BEL 101", "HUL 101", "CSL 107"]
      ),
      2: createSubjects(
        "CSH",
        2,
        [
          "Matrices, Transform Techniques & Differential Equations",
          "Applied Physics for Gaming",
          "Data Structures",
          "Application Programming",
          "Game Development Design Thinking",
          "Applied Electronics"
        ],
        [4, 3, 4, 4, 2, 4],
        ["MAL 104", "ASL 103", "CSL 102", "CSL 103", "CSL 108", "ECL 103"]
      ),
      3: createSubjects(
        "CSH",
        3,
        [
          "Discrete Maths & Graph Theory",
          "Gamification for Learning",
          "Introduction to Object Oriented Programming",
          "Computer Architecture and Organization",
          "Data Structures With Applications",
          "IT Workshop – I"
        ],
        [4, 3, 4, 3, 3, 2],
        ["CSL 204", "CSL 211", "CSL 202", "CSL 212", "CSL 210", "CSP 201"]
      ),
      4: createSubjects(
        "CSH",
        4,
        [
          "Design & Analysis of Algorithms",
          "Operating Systems",
          "Human Computer Interaction",
          "Software Engineering and Game Testing",
          "Numerical Methods and Probability Theory",
          "IT Workshop – II"
        ],
        [4, 4, 3, 3, 4, 2],
        ["CSL 205", "CSL 207", "CSL 432", "CSL 213", "MAL 201", "CSP 202"]
      ),
      5: createSubjects(
        "CSH",
        5,
        [
          "Computer Networks",
          "Computer Graphics",
          "Theory of Computation",
          "UI and UX Design",
          "Database Management Systems",
          "Open Course – I"
        ],
        [4, 3, 4, 4, 4, 3],
        ["CSL 302", "CSL 431", "CSL 303", "CSL 306", "CSL 301", "OC-1"]
      ),
      6: createSubjects(
        "CSH",
        6,
        [
          "Augmented & Virtual Reality",
          "Computer Vision Techniques",
          "GPU Computing",
          "2D & 3D game development",
          "Open Course – II",
          "Mini Project"
        ],
        [4, 4, 3, 4, 3, 3],
        ["CSL 307", "CSL 308", "CSL 309", "CSL 310", "OC-2", "CSD 301"]
      ),
      7: createSubjects(
        "CSH",
        7,
        [
          "Project Phase-I",
          "Elective – I",
          "Elective – II",
          "Elective – III",
          "Elective – IV",
          "MooC Course / Open Course III"
        ],
        [8, 3, 3, 3, 3, 3],
        ["CSD 401", "DE-1", "DE-2", "DE-3", "DE-4", "OC-3"]
      ),
      8: createSubjects(
        "CSH",
        8,
        [
          "Internship Phase-II",
          "Elective – I (Advanced)",
          "Elective – II (Advanced)",
          "Elective – III (Advanced)",
          "Elective – IV (Advanced)",
          "MooC Course / Open Course IV"
        ],
        [8, 3, 3, 3, 3, 3],
        ["CSD 402", "DE-5", "DE-6", "DE-7", "DE-8", "OC-4"]
      ),
    },
  },
  {
    id: "csd",
    name: "CSE (Data Science & Analytics)",
    semesters: {
      1: createSubjects(
        "CSD",
        1,
        [
          "Calculus for Data Science",
          "Introduction to Data and Analytics",
          "Professional Ethics",
          "Computer Programming",
          "Communication Skills",
          "Applied Sciences"
        ],
        [4, 4, 3, 4, 3, 4],
        ["MAL 105", "CSL 109", "HUL 304", "CSL 101", "HUL 101", "BSL 101"]
      ),
      2: createSubjects(
        "CSD",
        2,
        [
          "Introduction to Linear Algebra",
          "Probability and Statistics",
          "Data Structures",
          "Web Programming",
          "Applied Electronics",
          "Introduction to Entrepreneurship"
        ],
        [4, 4, 4, 2, 4, 3],
        ["MAL 107", "MAL 106", "CSL 102", "CSP 101", "ECL 103", "HUL 103"]
      ),
      3: createSubjects(
        "CSD",
        3,
        [
          "Advanced Probability and Statistics",
          "Introduction to Object Oriented Programming",
          "Discrete Maths and Graph Theory",
          "Data Structures with Applications",
          "Tools and Practices for Data Science – I",
          "Data Handling and Visualization"
        ],
        [4, 4, 4, 3, 2, 2],
        ["MAL 202", "CSL 202", "CSL 204", "CSL 210", "CSP 205", "CSL 214"]
      ),
      4: createSubjects(
        "CSD",
        4,
        [
          "Design and Analysis of Algorithms",
          "Operating Systems",
          "Sensor Data Analytics",
          "Foundations of Computing",
          "Web Analytics",
          "Tools and Practices for Data Science – II"
        ],
        [4, 4, 4, 3, 3, 2],
        ["CSL 205", "CSL 207", "CSL 215", "CSL 216", "CSL 217", "CSP 206"]
      ),
      5: createSubjects(
        "CSD",
        5,
        [
          "Machine Learning",
          "Data Privacy and Security",
          "Database Management Systems",
          "Artificial Intelligence",
          "Computer Networks",
          "Tools and Practices for Data Science - III"
        ],
        [4, 4, 4, 4, 4, 2],
        ["CSL 422", "CSL 311", "CSL 301", "CSL 421", "CSL 302", "CSP 301"]
      ),
      6: createSubjects(
        "CSD",
        6,
        [
          "Computer Vision and Deep Learning",
          "Big Data Analytics",
          "Data Mining and Warehousing",
          "Design Thinking",
          "Open Course – I",
          "Mini Project - II"
        ],
        [4, 4, 4, 3, 3, 3],
        ["CSL 313", "CSL 444", "CSL 436", "CSL 314", "OC-1", "CSD 301"]
      ),
      7: createSubjects(
        "CSD",
        7,
        [
          "Project",
          "Elective – I",
          "Elective – II",
          "Elective – III",
          "MooC Course / Open Course – II",
          "Internship (Initial Stage)"
        ],
        [8, 3, 3, 4, 3, 8],
        ["CSD 401", "DE-1", "DE-2", "DE-3", "OC-2", "CSD 402"]
      ),
      8: createSubjects(
        "CSD",
        8,
        [
          "Internship (Final Stage)",
          "Elective – I (Advanced)",
          "Elective – II (Advanced)",
          "Elective – III (Advanced)",
          "MooC Course / Open Course – II",
          "Project / Internship - II"
        ],
        [8, 3, 3, 4, 3, 8],
        ["CSD 402", "DE-4", "DE-5", "DE-6", "OC-3", "CSD 403"]
      ),
    },
  },
  {
    id: "csa",
    name: "CSE (Artificial Intelligence & Machine Learning)",
    semesters: {
      1: createSubjects(
        "CSA",
        1,
        [
          "Calculus for Data Science",
          "Conversational AI",
          "Computer Programming",
          "AI, Ethics and Society",
          "Applied Electronics",
        ],
        [4, 3, 4, 2, 4],
        ["MAL 105", "CSL 110", "CSL 101", "CSL 111", "ECL 103", "HUL 102"]
      ),
      2: createSubjects(
        "CSA",
        2,
        [
          "Probability and Statistics",
          "Introduction to Linear Algebra",
          "Data Structures",
          "Application Programming",
          "Communication Skills",
          "IT Workshop – I"
        ],
        [4, 4, 4, 4, 3, 2],
        ["MAL 106", "MAL 107", "CSL 102", "CSL 103", "HUL 101", "CSP 201"]
      ),
      3: createSubjects(
        "CSA",
        3,
        [
          "Introduction to Object Oriented Programming",
          "Data Structures with Applications",
          "Discrete Maths and Graph Theory",
          "Foundations of Computing",
          "Computer System Organization",
          "Introduction to Entrepreneurship",
          "AI/ML Workshop - I"
        ],
        [4, 3, 4, 3, 3, 3, 2],
        ["CSL 202", "CSL 210", "CSL 204", "CSL 216", "CSL 203", "CSP 203"]
      ),
      4: createSubjects(
        "CSA",
        4,
        [
          "Machine Learning",
          "Design and Analysis of Algorithms",
          "Software Engineering",
          "Operating Systems",
          "Database Management Systems",
          "Data Handling and Visualization",
          "AI/ML Workshop – II"
        ],
        [4, 4, 3, 4, 4, 2, 2],
        ["CSL 422", "CSL 205", "CSL 206", "CSL 207", "CSL 301", "CSP 204"]
      ),
      5: createSubjects(
        "CSA",
        5,
        [
          "Artificial Intelligence",
          "Natural Language Processing",
          "Computer Vision Techniques",
          "Computer Networks",
          "Open Course –I",
          "Mini Project – I"
        ],
        [4, 4, 4, 4, 3, 3],
        ["CSL 421", "CSL 433", "CSL 308", "CSL 302", "OC-1", "CSD 301"]
      ),
      6: createSubjects(
        "CSA",
        6,
        [
          "Reinforcement Learning",
          "Neural Networks and Deep Learning",
          "Parallel and Distributed Computing",
          "Open Course – II",
          "Optimization Techniques in ML",
          "Mini Project – II"
        ],
        [4, 3, 3, 3, 3, 3],
        ["CSL 454", "CSL 446", "CSL 317", "OC-2", "CSL 318", "CSD 302"]
      ),
      7: createSubjects(
        "CSA",
        7,
        [
          "Project Phase-I",
          "Elective – I",
          "Elective – II",
          "Elective – III",
          "MooC Course / Open Course – III",
          "Internship Scheme"
        ],
        [8, 3, 3, 4, 3, 8],
        ["CSD 401", "DE-1", "DE-2", "DE-3", "OC-3", "CSD 402"]
      ),
      8: createSubjects(
        "CSA",
        8,
        [
          "Internship / Industrial Electives",
          "Elective – I (Advanced)",
          "Elective – II (Advanced)",
          "Elective – III (Advanced)",
          "MooC Course / Open Course – III",
          "Project / Internship - II"
        ],
        [8, 3, 3, 4, 3, 8],
        ["CSD 402", "DE-4", "DE-5", "DE-6", "OC-4", "CSD 403"]
      ),
    },
  },
  {
    id: "ece",
    name: "Electronics & Communication Engineering (ECE)",
    semesters: {
      1: createSubjects(
        "ECE",
        1,
        [
          "Calculus for Engineers",
          "Elements of Electrical Engineering",
          "Mechanics & Graphics",
          "Computer Programming",
          "Electronic Devices and Circuits",
          "Communication Skills"
        ],
        [4, 4, 4, 4, 4, 3],
        ["MAL 103", "BEL 102", "BEL 101", "CSL 101", "ECL 101", "HUL 101"]
      ),
      2: createSubjects(
        "ECE",
        2,
        [
          "Matrices, Transform Techniques & Differential Equations",
          "Applied Sciences",
          "Digital Electronics",
          "Data Structures",
          "Environmental Studies",
          "Application Programming"
        ],
        [4, 4, 4, 4, 2, 4],
        ["MAL 104", "ASL 101", "ECL 102", "CSL 102", "HUL 102", "CSL 103"]
      ),
      3: createSubjects(
        "ECE",
        3,
        [
          "Numerical Methods and Probability Theory",
          "Signals and Systems",
          "Microprocessors and Interfacing",
          "Analog ICs",
          "Network Theory",
          "IT Workshop- I"
        ],
        [4, 4, 4, 4, 4, 2],
        ["MAL 201", "ECL 201", "ECL 202", "ECL 203", "ECL 204", "CSP 201"]
      ),
      4: createSubjects(
        "ECE",
        4,
        [
          "Digital Signal Processing",
          "Analog Communication",
          "Control Systems",
          "Electromagnetics",
          "Computer Architecture and Organisation",
          "IT Workshop- II"
        ],
        [4, 4, 3, 3, 3, 2],
        ["ECL 205", "ECL 206", "ECL 207", "ECL 208", "ECL 209", "CSP 202"]
      ),
      5: createSubjects(
        "ECE",
        5,
        [
          "Hardware Description Languages",
          "Waveguides and Antennas",
          "Embedded Systems",
          "Digital Communication",
          "Open Course - I",
          "Intro to OOP"
        ],
        [4, 3, 4, 4, 3, 4],
        ["ECL 303", "ECL 307", "ECL 308", "ECL 320", "OC-1", "CSL 202"]
      ),
      6: createSubjects(
        "ECE",
        6,
        [
          "Wireless Communication",
          "CMOS Design",
          "Mini Project",
          "Open Course - II",
          "Departmental Elective - I",
          "Departmental Elective - II"
        ],
        [4, 4, 1, 3, 3, 4],
        ["ECL 311", "ECL 312", "ECD 302", "OC-2", "DE-1", "DE-2"]
      ),
      7: createSubjects(
        "ECE",
        7,
        [
          "Departmental Elective - III",
          "Departmental Elective - IV",
          "Departmental Elective - V",
          "Departmental Elective - VI",
          "OPEN / MOOC course",
          "Project Phase-I"
        ],
        [3, 3, 3, 3, 3, 8],
        ["DE-3", "DE-4", "DE-5", "DE-6", "OC-3", "ECD 403"]
      ),
      8: createSubjects(
        "ECE",
        8,
        [
          "Internship / Project Phase-II",
          "Departmental Elective - III (Adv)",
          "Departmental Elective - IV (Adv)",
          "Departmental Elective - V (Adv)",
          "Departmental Elective - VI (Adv)",
          "OPEN / MOOC course II"
        ],
        [8, 3, 3, 3, 3, 3],
        ["ECD 402", "DE-7", "DE-8", "DE-9", "DE-10", "OC-4"]
      ),
    },
  },
  {
    id: "iot",
    name: "ECE (Internet of Things) [ECE IoT]",
    semesters: {
      1: createSubjects(
        "IoT",
        1,
        [
          "Applied Mathematics for Engineers",
          "Electronic Devices and Applications",
          "Introduction to IoT",
          "Computer Programming",
          "Electrical Systems",
          "Environmental studies"
        ],
        [4, 4, 4, 4, 4, 2],
        ["MAL 108", "ECL 110", "ECL 104", "CSL 101", "ECL 105", "HUL 102"]
      ),
      2: createSubjects(
        "IoT",
        2,
        [
          "Digital System Design with HDL",
          "Data Structures",
          "Analog IC and Fabrication",
          "IoT Workshop –I",
          "Numerical Methods and Probability Theory",
          "Instrumentation Techniques"
        ],
        [4, 4, 4, 2, 4, 3],
        ["ECL 106", "CSL 102", "ECL 107", "ECP 101", "MAL 201", "ECL 109"]
      ),
      3: createSubjects(
        "IoT",
        3,
        [
          "Applied Signals and Systems",
          "Introduction to Object Oriented Programming",
          "Sensors and Transducers",
          "IoT Workshop -II",
          "Programming Techniques for IoT",
          "Electromagnetic Field Theory"
        ],
        [4, 4, 4, 2, 3, 3],
        ["ECL 211", "CSL 202", "ECL 212", "ECP 201", "CSL 217", "ECL 213"]
      ),
      4: createSubjects(
        "IoT",
        4,
        [
          "DSP and Applications",
          "Modelling for IoT",
          "Microprocessor and Microcontroller",
          "Communication Systems",
          "Database Management System",
          "IoT Workshop- III"
        ],
        [4, 4, 4, 4, 4, 2],
        ["ECL 214", "ECL 215", "ECL 216", "ECL 217", "CSL 301", "ECP 202"]
      ),
      5: createSubjects(
        "IoT",
        5,
        [
          "Communication Network",
          "Embedded Systems",
          "Departmental Elective -I",
          "Departmental Elective - II",
          "Departmental Elective - III",
          "Open Course - I"
        ],
        [4, 4, 3, 4, 4, 3],
        ["ECL 315", "ECL 308", "DE-1", "DE-2", "DE-3", "OC-1"]
      ),
      6: createSubjects(
        "IoT",
        6,
        [
          "IoT Security",
          "Departmental Elective -IV",
          "Departmental Elective - V",
          "Fractal Course (DE) (1.1)",
          "Fractal Course (DE) (1.2)",
          "Minor Project"
        ],
        [3, 4, 4, 1, 1, 3],
        ["ECL 316", "DE-4", "DE-5", "FC-1.1", "FC-1.2", "ECD 301"]
      ),
      7: createSubjects(
        "IoT",
        7,
        [
          "OPEN / MOOC course",
          "Departmental Elective –VI",
          "Departmental Elective - VII",
          "Project Phase-I",
          "Internship Scheme",
          "Open Course - II"
        ],
        [3, 3, 3, 8, 8, 3],
        ["OC-2", "DE-6", "DE-7", "ECD 406", "ECD 407", "OC-3"]
      ),
      8: createSubjects(
        "IoT",
        8,
        [
          "Internship Phase-II",
          "OPEN / MOOC course",
          "Departmental Elective –VI",
          "Departmental Elective - VII",
          "Project Phase-II / Internship",
          "Specialized Elective"
        ],
        [8, 3, 3, 3, 8, 4],
        ["ECD 407", "OC-4", "DE-8", "DE-9", "ECD 408", "DE-10"]
      ),
    },
  },
];
