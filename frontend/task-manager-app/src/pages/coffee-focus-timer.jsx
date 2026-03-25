import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, Coffee,
  Maximize2, Minimize2, Sparkles, Zap,
  ArrowLeft, CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card } from "../components/ui/card";
import { useTasks } from "../components/task-context";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function CoffeeFocusTimer() {
  const { tasks } = useTasks();
  const containerRef = useRef(null);

  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigate = useNavigate();

  const totalSeconds = duration * 60;
  const percentage = (timeLeft / totalSeconds) * 100;

  // --- Timer Logic ---
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
      clearInterval(interval);
      toast.success("Session complete! Great work.", { duration: 5000 });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // --- Fullscreen Toggle Logic ---
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Keep isFullScreen in sync when the user presses Escape
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const resetTimer = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (m) => {
    setDuration(m);
    setTimeLeft(m * 60);
    setIsActive(false);
    setIsFinished(false);
  };

  const selectedTask = tasks.find((t) => String(t.id) === selectedTaskId);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center transition-colors duration-1000 overflow-hidden",
        isFullScreen ? "fixed inset-0 z-[100] w-screen h-screen" : "min-h-screen w-full py-12",
        isActive
          ? "bg-[#fdfcfb] dark:bg-[#0c0a09]"
          : isFinished
          ? "bg-green-50 dark:bg-green-950/30"
          : "bg-muted/30"
      )}
    >
      {/* Immersive Background Elements (Only visible when active) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-200/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brown-200/10 blur-[120px] rounded-full" />
          </motion.div>
        )}

        {isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute inset-0 bg-green-400/5 blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Control: Fullscreen Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullScreen}
        className="absolute top-6 right-6 z-10 rounded-full hover:bg-background/80"
      >
        {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </Button>

      <Card className={cn(
        "relative flex flex-col items-center p-8 md:p-12 space-y-10 w-full max-w-lg transition-all duration-500",
        isFullScreen ? "bg-transparent border-none shadow-none" : "bg-white dark:bg-zinc-950 shadow-2xl rounded-[3rem]"
      )}>

        {/* Header */}
        <div className="text-center space-y-3">
          <Button variant="ghost" className="mx-auto text-[#3c2a21] dark:text-orange-100" onClick={() => navigate(-1)}>
            <ArrowLeft />
            Back
          </Button>
          <motion.h2
            layout
            className="text-4xl font-black tracking-tight text-[#3c2a21] dark:text-orange-100"
          >
            {isFinished ? "Session Complete!" : isActive ? "Deep Work Brew" : "Ready to Focus?"}
          </motion.h2>
          <p className="text-muted-foreground font-medium">
            {selectedTaskId
              ? `Task: ${selectedTask?.title ?? "Unknown"}`
              : "Set your intention and start the clock."}
          </p>
        </div>

        {/* Completion celebration */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                <CheckCircle2 className="h-14 w-14 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-center text-sm text-muted-foreground max-w-xs">
                You stayed focused for {duration} minute{duration !== 1 ? "s" : ""}. Take a short break and keep going!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Mug Vessel — hidden when finished */}
        {!isFinished && (
          <div className="relative flex items-center justify-center py-6 scale-110 md:scale-125">
            {/* Steam Bubbles */}
            <div className="absolute -top-10 flex gap-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={isActive ? {
                    y: [0, -60],
                    opacity: [0, 0.4, 0],
                    scale: [1, 1.5, 0.5]
                  } : { opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.7 }}
                  className="text-xl"
                >
                  ☁️
                </motion.div>
              ))}
            </div>

            <div className="relative group">
              {/* Cup Body */}
              <div className="relative w-44 h-52 border-[10px] border-[#e7d4b5] dark:border-zinc-800 rounded-b-[4.5rem] rounded-t-xl overflow-hidden bg-background shadow-inner z-10">
                {/* Liquid Level */}
                <motion.div
                  animate={{ height: `${percentage}%` }}
                  transition={{ type: "spring", stiffness: 30, damping: 20 }}
                  className="absolute bottom-0 w-full bg-[#3c2a21] dark:bg-[#211814]"
                >
                  {/* 3D Surface Effect */}
                  <div className="absolute -top-3 w-full h-6 bg-[#4e3629] rounded-[100%] opacity-90 border-t border-white/10" />

                  {/* Face that moves with liquid */}
                  <div className="flex flex-col items-center pt-10 gap-2 opacity-30">
                    <div className="flex gap-6">
                      <div className="h-2 w-2 bg-white rounded-full" />
                      <div className="h-2 w-2 bg-white rounded-full" />
                    </div>
                    <motion.div
                      animate={isActive ? { scaleX: [1, 1.2, 1] } : {}}
                      className="h-3 w-5 border-b-2 border-white rounded-full"
                    />
                  </div>
                </motion.div>
              </div>
              {/* Handle */}
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-14 h-28 border-[10px] border-[#e7d4b5] dark:border-zinc-800 rounded-r-[2.5rem] -z-0" />
            </div>
          </div>
        )}

        {/* Timer & UI controls */}
        <div className="flex flex-col items-center w-full space-y-8">
          {!isFinished && (
            <div className="text-7xl font-black font-mono tracking-tighter tabular-nums text-[#3c2a21] dark:text-orange-50">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          )}

          {!isActive && !isFinished && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-6"
            >
              <Select onValueChange={setSelectedTaskId} value={selectedTaskId}>
                <SelectTrigger className="w-full h-12 rounded-2xl bg-muted/40 border-none text-center">
                  <SelectValue placeholder="Which task are we brewing?" />
                </SelectTrigger>
                <SelectContent>
                  {tasks
                    .filter((t) => !t.is_completed)
                    .map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.title}</SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2 justify-center">
                {[5, 10, 25, 50].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleDurationChange(m)}
                    className={cn(
                      "px-5 py-2 rounded-2xl text-sm font-bold transition-all",
                      duration === m
                        ? "bg-[#3c2a21] text-white shadow-lg scale-110"
                        : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                    )}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex gap-4 w-full">
            {isFinished ? (
              <Button
                size="lg"
                className="flex-1 h-20 rounded-[2rem] text-2xl font-black bg-green-600 hover:bg-green-700 text-white shadow-xl active:scale-95"
                onClick={resetTimer}
              >
                <RotateCcw className="mr-3 h-8 w-8" />
                Brew Again
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className={cn(
                    "flex-1 h-20 rounded-[2rem] text-2xl font-black transition-all shadow-xl active:scale-95",
                    isActive
                      ? "bg-muted text-muted-foreground hover:bg-muted/80"
                      : "bg-[#3c2a21] hover:bg-[#2a1d17] text-white"
                  )}
                  onClick={() => setIsActive(!isActive)}
                  disabled={!selectedTaskId}
                >
                  {isActive ? <Pause className="mr-3 h-8 w-8" /> : <Zap className="mr-3 h-8 w-8 fill-current" />}
                  {isActive ? "Pause Sip" : "Start Brew"}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-20 w-20 rounded-[2rem] border-4 border-muted"
                  onClick={resetTimer}
                >
                  <RotateCcw className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
