/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, 
  BookOpen, 
  TrendingUp, 
  RefreshCw, 
  HelpCircle, 
  History, 
  Award, 
  BookmarkCheck,
  CheckCircle2, 
  GraduationCap, 
  Info,
  ChevronDown,
  Printer,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { BRANCHES_DATA, GRADES_LIST } from "./data";
import { Subject, GradeScale, CalculationResult } from "./types";

export default function App() {
  // --- Page navigation ---
  const [activePage, setActivePage] = useState<"calculator" | "grade-calculation" | "how-it-works">("calculator");
  // mobile nav toggle
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  // --- Core State ---
  const [selectedBranchId, setSelectedBranchId] = useState<string>(BRANCHES_DATA[0].id);
  const [selectedSem, setSelectedSem] = useState<number>(1);
  
  // Previous CGPA Tracking States
  const [includePrevious, setIncludePrevious] = useState<boolean>(false);
  const [prevCgpaInput, setPrevCgpaInput] = useState<string>("");
  const [prevCreditsInput, setPrevCreditsInput] = useState<string>("");

  // Grade Input States: records { [subjectId]: gradeLetter }
  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>({});
  
  // Dynamic User-Editable Credits State: { [subjectId]: number }
  const [customCredits, setCustomCredits] = useState<Record<string, number>>({});

  // Help Modal/Accordion Toggles
  const [showFormulaInfo, setShowFormulaInfo] = useState<boolean>(false);
  
  // Calculate Feedback Animation Toggles
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Store final processed calculations that only update on Form submit ("Calculate NOW")
  const [finalResults, setFinalResults] = useState<CalculationResult | null>(null);

  // Reset calculations to ensure they must click Calculate NOW to recompute
  useEffect(() => {
    setFinalResults(null);
    setHasCalculated(false);
  }, [
    selectedBranchId,
    selectedSem,
    selectedGrades,
    customCredits,
    includePrevious,
    prevCgpaInput
  ]);

  // --- Derived Calculations & Memoization ---
  const activeBranch = useMemo(() => {
    return BRANCHES_DATA.find((b) => b.id === selectedBranchId) || BRANCHES_DATA[0];
  }, [selectedBranchId]);

  const activeSubjects = useMemo(() => {
    return activeBranch.semesters[selectedSem] || [];
  }, [activeBranch, selectedSem]);

  // Dynamically calculate cumulative credits up to but excluding the current selected semester
  const computedPrevCredits = useMemo(() => {
    let sum = 0;
    for (let s = 1; s < selectedSem; s++) {
      const subjects = activeBranch.semesters[s] || [];
      subjects.forEach((sub) => {
        sum += sub.credits;
      });
    }
    return sum;
  }, [activeBranch, selectedSem]);

  // Sync / Initialize grade selection and editable credits when branch or semester changes
  useEffect(() => {
    const initialGrades: Record<string, string> = {};
    const initialCredits: Record<string, number> = {};
    
    activeSubjects.forEach((sub) => {
      initialGrades[sub.id] = selectedGrades[sub.id] || ""; // Keep if already entered, else clear
      initialCredits[sub.id] = customCredits[sub.id] || sub.credits;
    });

    setSelectedGrades((prev) => ({ ...prev, ...initialGrades }));
    setCustomCredits((prev) => ({ ...prev, ...initialCredits }));
  }, [activeSubjects]);

  // Read current subjects and map them to their corresponding grade levels
  const currentSemesterCredits = useMemo(() => {
    return activeSubjects.reduce((acc, sub) => {
      const cred = customCredits[sub.id] !== undefined ? customCredits[sub.id] : sub.credits;
      return acc + cred;
    }, 0);
  }, [activeSubjects, customCredits]);

  // Direct calculation selector mapping
  const activeGradesDetails = useMemo(() => {
    return activeSubjects.map((sub) => {
      const selectedLetter = selectedGrades[sub.id] || "";
      const gradeDetail = GRADES_LIST.find((g) => g.grade === selectedLetter);
      const credits = customCredits[sub.id] !== undefined ? customCredits[sub.id] : sub.credits;
      return {
        subject: sub,
        credits: credits,
        gradeLetter: selectedLetter,
        points: gradeDetail ? gradeDetail.points : null,
      };
    });
  }, [activeSubjects, selectedGrades, customCredits]);

  // Verify if all subjects has selected grade
  const allGradesSelected = useMemo(() => {
    return activeSubjects.every((sub) => !!selectedGrades[sub.id]);
  }, [activeSubjects, selectedGrades]);

  // Calculate SGPA and CGPA results
  const results = useMemo<CalculationResult>(() => {
    let totalCredits = 0;
    let earnedPointsSum = 0;

    activeGradesDetails.forEach((detail) => {
      const pts = detail.points !== null ? detail.points : 0;
      totalCredits += detail.credits;
      earnedPointsSum += detail.credits * pts;
    });

    const sgpa = totalCredits > 0 ? Number((earnedPointsSum / totalCredits).toFixed(2)) : 0.0;

    let overallCgpa = sgpa;

    if (includePrevious) {
      const prevCgpaValue = parseFloat(prevCgpaInput) || 0;
      const prevCreditsValue = computedPrevCredits;

      if (prevCreditsValue > 0 || prevCgpaValue > 0) {
        const prevTotalPoints = prevCgpaValue * prevCreditsValue;
        const currentTotalPoints = earnedPointsSum;
        const globalCredits = prevCreditsValue + totalCredits;

        overallCgpa = globalCredits > 0 
          ? Number(((prevTotalPoints + currentTotalPoints) / globalCredits).toFixed(2))
          : 0.0;
      }
    }

    return {
      sgpa,
      totalCredits,
      earnedPoints: earnedPointsSum,
      overallCgpa,
    };
  }, [activeGradesDetails, includePrevious, prevCgpaInput, computedPrevCredits]);

  // Interactive Reset Handlers
  const handleReset = () => {
    const clearedGrades: Record<string, string> = {};
    activeSubjects.forEach((sub) => {
      clearedGrades[sub.id] = "";
    });
    setSelectedGrades(clearedGrades);
    setHasCalculated(false);
  };

  const handleFullReset = () => {
    setSelectedGrades({});
    setCustomCredits({});
    setIncludePrevious(false);
    setPrevCgpaInput("");
    setPrevCreditsInput("");
    setHasCalculated(false);
  };

  // Perform Calculation with mock animation delay
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setHasCalculated(true);
      setFinalResults(results);
    }, 450);
  };

  // Feedback Text generator
  const getPerformanceFeedback = (score: number) => {
    if (score >= 9.5) return { text: "Outstanding standard of pure academic excellence.", rank: "Outstanding" };
    if (score >= 8.5) return { text: "Outstanding performance! Perfect path to honors listing.", rank: "Excellent" };
    if (score >= 7.5) return { text: "Consistently doing great coursework.", rank: "First Class Distinction" };
    if (score >= 6.5) return { text: "Satisfactory standard. Meets high engineering quality.", rank: "First Class" };
    if (score >= 5.0) return { text: "Meets core guidelines. Keep tracking improvement indicators.", rank: "Second Class" };
    return { text: "Focus heavily on foundational structures to climb back.", rank: "Pass Class" };
  };

  const activeFeedback = getPerformanceFeedback(
    includePrevious 
      ? (finalResults ? finalResults.overallCgpa : 0) 
      : (finalResults ? finalResults.sgpa : 0)
  );

  // Preset Grades Fill for fast feedback
  const fillSampleGrades = () => {
    const presets = ["AA", "AB", "BB", "BC", "CC", "CD"];
    const presetGradesObj: Record<string, string> = {};
    activeSubjects.forEach((sub, index) => {
      presetGradesObj[sub.id] = presets[index % presets.length];
    });
    setSelectedGrades(presetGradesObj);
    setFinalResults(null);
    setHasCalculated(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. Header Navigation */}
      <header className="h-16 px-4 sm:px-8 flex items-center justify-between bg-white border-b border-slate-200 shrink-0 relative">
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setActivePage("calculator")}>
          <svg viewBox="0 0 100 100" className="w-7 h-7 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 26 28 A 34 34 0 1 1 26 72" />
            <path d="M 46 50 H 76" />
          </svg>
          <span className="text-xl font-extrabold tracking-tight text-indigo-600 font-sans">
            Grade Check
          </span>
        </div>

  {/* Centered Navbar Elements (hidden on mobile) */}
  <div className="hidden sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:flex sm:items-center sm:gap-2 sm:gap-6 text-xs sm:text-sm font-semibold">
          <button 
            type="button"
            onClick={() => setActivePage("grade-calculation")} 
            className={`transition-colors cursor-pointer px-3 py-1.5 rounded-lg ${
              activePage === "grade-calculation"
                ? "text-indigo-600 bg-indigo-50 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Grade Calculation
          </button>
          <button 
            type="button"
            onClick={() => setActivePage("how-it-works")} 
            className={`transition-colors cursor-pointer px-3 py-1.5 rounded-lg ${
              activePage === "how-it-works"
                ? "text-indigo-600 bg-indigo-50 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            How it Works
          </button>
        </div>

        <nav className="flex items-center gap-3 relative z-10">
          {/* Desktop actions (unchanged) */}
          <div className="hidden sm:flex items-center gap-3">
            {activePage !== "calculator" && (
              <button
                type="button"
                onClick={() => setActivePage("calculator")}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs shadow-indigo-100 flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Calculator</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="sm:hidden">
            <button
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((s) => !s)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileNavOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <path d="M3 12h18" />
                    <path d="M3 6h18" />
                    <path d="M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* Mobile nav panel (slide down) */}
          <div className={`absolute top-full right-2 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden transition-transform origin-top-right ${mobileNavOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'} sm:hidden`}>
            <div className="flex flex-col py-2">
              <button
                className={`text-left px-4 py-2 text-sm ${activePage === 'calculator' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => { setActivePage('calculator'); setMobileNavOpen(false); }}
              >
                Calculator
              </button>
              <button
                className={`text-left px-4 py-2 text-sm ${activePage === 'grade-calculation' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => { setActivePage('grade-calculation'); setMobileNavOpen(false); }}
              >
                Grade Calculation
              </button>
              <button
                className={`text-left px-4 py-2 text-sm ${activePage === 'how-it-works' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => { setActivePage('how-it-works'); setMobileNavOpen(false); }}
              >
                How it Works
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Sandbox Layout Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-8 flex flex-col gap-8">
        
        <AnimatePresence mode="wait">
          {activePage === "calculator" && (
            <motion.div
              key="calculator-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col lg:flex-row gap-8 w-full"
            >
              {/* SIDEBAR: Configuration Panel & Calculation Methods */}
              <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-indigo-600" />
                      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Basic Configuration
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={handleFullReset}
                      className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      title="Reset all inputs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Branch Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="branch-select" className="text-xs font-semibold text-slate-700">
                        Academic Branch / Major
                      </label>
                      <div className="relative">
                        <select
                          id="branch-select"
                          value={selectedBranchId}
                          onChange={(e) => {
                            setSelectedBranchId(e.target.value);
                            setHasCalculated(false);
                          }}
                          className="w-full h-10 pl-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {BRANCHES_DATA.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Semester Picker Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="semester-select" className="text-xs font-semibold text-slate-700">
                        Select Semester
                      </label>
                      <div className="relative">
                        <select
                          id="semester-select"
                          value={selectedSem}
                          onChange={(e) => {
                            setSelectedSem(Number(e.target.value));
                            setHasCalculated(false);
                          }}
                          className="w-full h-10 pl-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => (
                            <option key={semNum} value={semNum}>
                              Semester 0{semNum}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Previous CGPA Toggle Switch & Input Box */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Include Previous CGPA</span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={includePrevious}
                          onClick={() => {
                            setIncludePrevious(!includePrevious);
                            setHasCalculated(false);
                          }}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            includePrevious ? 'bg-indigo-600' : 'bg-slate-200'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                              includePrevious ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {includePrevious && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-2 px-1 pb-1 overflow-hidden"
                        >
                          <div className="flex flex-col gap-1">
                            <label htmlFor="prev-cgpa-input" className="text-[11px] font-semibold text-slate-700">
                              Previous CGPA Score
                            </label>
                            <input
                              id="prev-cgpa-input"
                              type="number"
                              step="0.01"
                              min="0"
                              max="10"
                              placeholder="e.g. 8.45"
                              value={prevCgpaInput}
                              onChange={(e) => {
                                setPrevCgpaInput(e.target.value);
                                setHasCalculated(false);
                              }}
                              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 font-semibold text-slate-800 transition-all"
                            />
                          </div>
                          
                          <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-50">
                            <span className="text-[11px] font-semibold text-slate-750">
                              Total Credits Cleared Prior
                            </span>
                            <div className="w-full h-9 px-3 bg-indigo-50/60 border border-indigo-100 rounded-lg text-xs flex items-center justify-between font-mono font-bold text-indigo-700">
                              <span>{computedPrevCredits} Credits</span>
                              <span className="text-[10px] text-indigo-500 bg-indigo-100 px-1.5 py-0.5 rounded font-sans font-semibold">
                                Sem 1-{selectedSem - 1}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-450 leading-relaxed italic">
                              {selectedSem > 1 
                                ? `Auto-summed from standard course scheme of Semester 1 to ${selectedSem - 1}.`
                                : "Semester 01 selected, so preceding credits sum is 0."}
                            </p>
                          </div>
                        </motion.div>
                      )}
                      <p className="text-[11px] text-slate-400 italic">Leave un-toggled if calculating Semester 01 in isolation.</p>
                    </div>

                  </div>
                </div>

                {/* Scale display index matrix */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">Grade-Point Scales Mapping</h4>
                  <div className="grid grid-cols-4 gap-1 pt-1 font-semibold">
                    {GRADES_LIST.map((m) => (
                      <div key={m.grade} className="bg-slate-50 border border-slate-200/60 p-1 text-center rounded text-[11px]">
                        <div className="text-indigo-600">{m.grade}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{m.points}.0</div>
                      </div>
                    ))}
                  </div>
                </div>

              </aside>

              {/* MAIN BODY: Subject Checklist & Results Module */}
              <section className="flex-1 flex flex-col gap-6 select-none">
                
                {/* Subjects Cards Grid Box Container */}
                <form onSubmit={handleCalculate} className="flex-1 flex flex-col gap-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {activeSubjects.map((sub) => {
                      const gradeValue = selectedGrades[sub.id] || "";
                      const currentCreditVal = customCredits[sub.id] !== undefined ? customCredits[sub.id] : sub.credits;

                      return (
                        <div 
                          key={sub.id} 
                          className={`bg-white p-5 rounded-2xl border transition-all duration-250 flex items-center justify-between gap-4 ${
                            gradeValue 
                              ? "border-indigo-200 bg-indigo-50/5 shadow-2xs" 
                              : "border-slate-200 hover:border-slate-350 shadow-xs"
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            {/* Code and dynamic credits tracker label above */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50/80 px-1.5 py-0.5 rounded">
                                {sub.code}
                              </span>
                              
                              {/* Interactive Credits Modifier Inline */}
                              <span className="text-[10px] font-medium text-slate-400 font-mono">
                                • {currentCreditVal} Credits
                              </span>
                            </div>
                            
                            <div className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug" title={sub.name}>
                              {sub.name}
                            </div>

                            {/* Micro inline credit editing utility to ensure full modification freedom */}
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <span className="text-[9px] text-slate-400 font-medium font-mono uppercase">Adjust Credits:</span>
                              <input
                                type="number"
                                min="1"
                                max="12"
                                value={currentCreditVal}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val > 0) {
                                    setCustomCredits((prev) => ({ ...prev, [sub.id]: val }));
                                    setHasCalculated(false);
                                  }
                                }}
                                className="w-8 h-5 text-center bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-400"
                              />
                            </div>
                          </div>

                          {/* Grade Selector Dropdown Box */}
                          <div className="shrink-0">
                            <select
                              id={`grade-${sub.id}`}
                              value={gradeValue}
                              required
                              onChange={(e) => {
                                setSelectedGrades((prev) => ({ ...prev, [sub.id]: e.target.value }));
                                setHasCalculated(false);
                              }}
                              className={`h-11 w-28 px-2 rounded-lg font-semibold text-xs border focus:outline-none transition-all cursor-pointer ${
                                gradeValue 
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <option value="" className="text-slate-700 bg-white">Grade</option>
                              {GRADES_LIST.map((opt) => (
                                <option key={opt.grade} value={opt.grade} className="text-slate-800 bg-white font-medium">
                                  {opt.grade} ({opt.points}.0)
                                </option>
                              ))}
                            </select>
                          </div>

                        </div>
                      );
                    })}

                  </div>

                  {/* Bottom Dynamic Results dashboard wrapper */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mt-auto">
                    
                    <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
                      
                      {/* 1. SGPA Metrics Display Box */}
                      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-center items-center shadow-3xs text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                          Semester SGPA
                        </span>
                        
                        {finalResults && allGradesSelected ? (
                          <motion.span 
                            key={finalResults.sgpa}
                            initial={{ scale: 0.9, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-black text-slate-900 font-mono tracking-tight"
                          >
                            {finalResults.sgpa.toFixed(2)}
                          </motion.span>
                        ) : (
                          <span className="text-3xl font-bold text-slate-300 font-mono">--</span>
                        )}
                        
                        <span className="text-[10px] mt-1 text-slate-500 font-mono uppercase font-bold text-center">
                          Credits: {finalResults ? finalResults.totalCredits : currentSemesterCredits} Weighted Hours
                        </span>
                      </div>

                      {/* 2. CGPA Metrics Cumulative Display Box */}
                      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-center items-center shadow-3xs text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                          Cumulative CGPA
                        </span>
                        
                        {finalResults && allGradesSelected ? (
                          <motion.span 
                            key={finalResults.overallCgpa}
                            initial={{ scale: 0.9, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-black text-indigo-600 font-mono tracking-tight"
                          >
                            {finalResults.overallCgpa.toFixed(2)}
                          </motion.span>
                        ) : (
                          <span className="text-3xl font-bold text-slate-300 font-mono">--</span>
                        )}

                        <span className="text-[9px] mt-1 text-indigo-500 font-bold uppercase">
                          {includePrevious ? "Linked History Combined" : "Single semester average"}
                        </span>
                      </div>

                      {/* 3. Main Master trigger action buttons */}
                      <div className="flex flex-col justify-center gap-2 shrink-0 md:w-56">
                        
                        <button
                          type="submit"
                          disabled={isCalculating || !allGradesSelected}
                          className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-xs uppercase tracking-wider disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isCalculating ? (
                            <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-300 border-t-transparent animate-spin"></span>
                          ) : (
                            <>
                              <Calculator className="w-3.5 h-3.5" />
                              <span>Calculate NOW</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => window.print()}
                          disabled={!finalResults || !allGradesSelected}
                          className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-semibold tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Report Sheet</span>
                        </button>

                      </div>

                    </div>

                    {/* Dynamic feedback advisory tags */}
                    {allGradesSelected && finalResults && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 justify-center text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[11px] font-semibold">
                          <Award className="w-3.5 h-3.5" />
                          <span>Status: {activeFeedback.rank}</span>
                        </div>
                        <span className="text-slate-400 text-sm hidden sm:inline">•</span>
                        <p className="text-xs text-slate-500 italic hidden sm:inline-block">
                          "{activeFeedback.text}"
                        </p>
                      </div>
                    )}

                    {!finalResults && allGradesSelected && (
                      <p className="text-center text-xs text-indigo-500 mt-3 font-semibold tracking-wide animate-pulse">
                        &bull; Inputs have modified. Press "Calculate NOW" to determine your score. &bull;
                      </p>
                    )}

                  </div>

                </form>

              </section>
            </motion.div>
          )}

          {activePage === "grade-calculation" && (
            <motion.div
              key="grade-calc-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-5xl mx-auto space-y-8"
            >
              {/* Elegant Header with Back Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                    Grade Point Conversion System
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Learn how academic letter grades correspond to weighted grade multipliers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage("calculator")}
                  className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-100 cursor-pointer"
                >
                  ← Go back to Calculator
                </button>
              </div>

              {/* Visual explanation cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">Grading Scale Structure</h3>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Performance in practical and theory coursework is officially mapped to standard letter indices. Each letter carries a corresponding mathematical point weight.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/60 pb-2">
                      <span>Letter Grade</span>
                      <span>Numerical Multiplier</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 font-mono text-xs text-slate-700 font-semibold pt-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-indigo-600" />
                        <span>AA (Outstanding)</span>
                      </div>
                      <span className="text-right text-indigo-600">10.0 Grade Points</span>
                      
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                        <span>AB (Excellent)</span>
                      </div>
                      <span className="text-right text-indigo-500">9.0 Grade Points</span>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-indigo-400" />
                        <span>BB (Very Good)</span>
                      </div>
                      <span className="text-right text-indigo-400">8.0 Grade Points</span>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-indigo-300" />
                        <span>BC (Good)</span>
                      </div>
                      <span className="text-right text-indigo-300">7.0 Grade Points</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">Pass vs Fail Indicators</h3>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Courses successfully completed with any grade from AA to DD earn full course credits. An FF grade (Fail) awards 0 points and doesn't clear requirements.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/60 pb-2">
                      <span>Letter Grade</span>
                      <span>Numerical Multiplier</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 font-mono text-xs text-slate-700 font-semibold pt-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-slate-400" />
                        <span>CC (Average)</span>
                      </div>
                      <span className="text-right text-slate-600">6.0 Grade Points</span>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-slate-400" />
                        <span>CD (Below Average)</span>
                      </div>
                      <span className="text-right text-slate-600">5.0 Grade Points</span>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-slate-400" />
                        <span>DD (Pass)</span>
                      </div>
                      <span className="text-right text-slate-600">4.0 Grade Points</span>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                        <span className="text-rose-600 font-bold">FF (Fail)</span>
                      </div>
                      <span className="text-right text-rose-600 font-bold">0.0 Grade Points</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Complete Bento Grid visualization matrix */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Detailed Letter Grade Mapping Scales</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {GRADES_LIST.map((scale) => (
                    <div 
                      key={scale.grade} 
                      className="border border-slate-150 p-4.5 rounded-xl bg-slate-50/50 flex flex-col justify-between hover:border-indigo-200 hover:bg-indigo-50/5 transition-all"
                    >
                      <div className="text-2xl font-black text-indigo-650 font-mono">{scale.grade}</div>
                      <div className="mt-1 font-mono text-sm font-bold text-slate-800">{scale.points}.0 GPA Scale</div>
                      <div className="text-xs text-slate-450 mt-1 capitalize font-medium">{scale.description} Class Level</div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {activePage === "how-it-works" && (
            <motion.div
              key="how-it-works-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-5xl mx-auto space-y-8"
            >
              {/* Elegant Header with Back Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Info className="w-6 h-6 text-indigo-600" />
                    GPA Formulation Methodologies
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Understand how SGPA and Cumulative CGPA are mathematically calculated step-by-step.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage("calculator")}
                  className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-100 cursor-pointer"
                >
                  ← Go back to Calculator
                </button>
              </div>

              <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
                
                {/* 1. SGPA Formula Section */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                    Semester Grade Point Average (SGPA)
                  </h3>
                  <p className="text-xs text-slate-500">
                    The SGPA represents the academic standard achieved in a specific single semester. It is computed by multiplying individual course credits with grade point scores earned, and dividing the global sum by total registered credits.
                  </p>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-indigo-100 font-mono text-indigo-700 text-xs shadow-3xs leading-relaxed">
                    <span className="font-sans font-bold block text-slate-800 mb-1.5">Mathematical Formula:</span>
                    SGPA = ( (Credit₁ &times; GP₁) + (Credit₂ &times; GP₂) + ... + (Creditₙ &times; GPₙ) ) / ( Total Semester Credits )
                  </div>

                  <div className="bg-indigo-50/15 border border-indigo-100/40 p-4.5 rounded-xl space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs">Practical step-by-step Example:</h4>
                    <p className="text-xs text-slate-500">
                      Suppose you completed a semester composed of three subjects:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-slate-700 bg-white p-3.5 rounded-lg border border-slate-150 shadow-3xs">
                      <div className="p-2.5 bg-slate-50/50 rounded">
                        <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">Subject A</span>
                        <strong>Credits: 4</strong><br/>
                        Grade: AA (10 pts)<br/>
                        Points: 4 &times; 10 = <strong>40</strong>
                      </div>
                      <div className="p-2.5 bg-slate-50/50 rounded">
                        <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">Subject B</span>
                        <strong>Credits: 3</strong><br/>
                        Grade: BB (8 pts)<br/>
                        Points: 3 &times; 8 = <strong>24</strong>
                      </div>
                      <div className="p-2.5 bg-slate-50/50 rounded">
                        <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">Subject C</span>
                        <strong>Credits: 4</strong><br/>
                        Grade: AB (9 pts)<br/>
                        Points: 4 &times; 9 = <strong>36</strong>
                      </div>
                    </div>
                    <div className="text-xs pt-2">
                      <div>&bull; Cumulative Coursework Sum: <strong>40 + 24 + 36 = 100 points</strong></div>
                      <div>&bull; Combined Standard Course Credits: <strong>4 + 3 + 4 = 11 credits</strong></div>
                      <div className="mt-2 text-slate-900 font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-100 inline-block text-xs font-mono">
                        SGPA Result: 100 / 11 = <span className="text-indigo-650 font-black">9.09</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. CGPA Formula Section */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                    Cumulative Grade Point Average (CGPA)
                  </h3>
                  <p className="text-xs text-slate-500">
                    The CGPA maps cumulative performance across all cleared semesters combined. It represents the weighted mean index of overall accumulated points over total registered credits.
                  </p>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-emerald-100 font-mono text-emerald-700 text-xs shadow-3xs leading-relaxed">
                    <span className="font-sans font-bold block text-slate-800 mb-1.5">Mathematical Formula:</span>
                    CGPA = ( Total Cumulative Points Secured Across All Semesters ) / ( Total Registered Credits Handled )
                  </div>

                  <div className="bg-emerald-50/15 border border-emerald-100/40 p-4.5 rounded-xl space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs">Practical step-by-step Example:</h4>
                    <p className="text-xs text-slate-500">
                      Suppose you want to compute CGPA up to Semester 2:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-slate-700 bg-white p-3.5 rounded-lg border border-slate-150 shadow-3xs">
                      <div className="p-2.5 bg-slate-50/50 rounded">
                        <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">Semester 1 Info</span>
                        SGPA Score: <strong>8.50</strong><br/>
                        Registered Credits: <strong>22</strong><br/>
                        Secured Points: 8.50 &times; 22 = <strong>187</strong>
                      </div>
                      <div className="p-2.5 bg-slate-50/50 rounded">
                        <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">Semester 2 Info</span>
                        SGPA Score: <strong>9.09</strong><br/>
                        Registered Credits: <strong>11</strong><br/>
                        Secured Points: 9.09 &times; 11 = <strong>100</strong>
                      </div>
                    </div>
                    <div className="text-xs pt-2">
                      <div>&bull; Overall Accumulated Points Secured: <strong>187 + 100 = 287 points</strong></div>
                      <div>&bull; Overall Cumulative Credits Registered: <strong>22 + 11 = 33 credits</strong></div>
                      <div className="mt-2 text-slate-900 font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-100 inline-block text-xs font-mono">
                        CGPA Result: 287 / 33 = <span className="text-emerald-650 font-black">8.70</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="h-14 px-4 sm:px-8 mt-auto flex flex-col sm:flex-row items-center justify-between bg-white border-t border-slate-200 text-[11px] text-slate-400 gap-2 text-center pb-4 sm:pb-0 pt-4 sm:pt-0">
        <div>
          Updated according to standard Indian &amp; Global University Academic Regulations
        </div>
        <div className="font-mono text-[10px] text-indigo-500">
          Total Semester Coursework Units: {currentSemesterCredits} credits
        </div>
      </footer>

    </div>
  );
}
