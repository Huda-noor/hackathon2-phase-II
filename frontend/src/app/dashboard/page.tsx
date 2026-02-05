"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NewTaskForm } from "@/components/tasks/new-task-form";
import { TaskList } from "@/components/tasks/task-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/lib/auth-service";
import { auth } from "@/lib/auth";
import {
  LogOut,
  Plus,
  CheckCircle2,
  Clock,
  ListTodo,
  LayoutDashboard,
  Zap,
  Sparkles
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isChecking, setIsChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name?: string } | null>(null);

  useEffect(() => {
    // Only run on client side after mount
    const token = auth.getToken();
    const user = auth.getUser();

    if (!token || !user) {
      router.replace("/signup");
      return;
    }

    setCurrentUser(user);
    setIsChecking(false);
  }, [router]);

  const handleSignOut = () => {
    authService.signOut();
    router.replace("/signin");
  };

  const handleTaskCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-b-4 border-t-4 border-white mx-auto mb-4"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white font-semibold text-lg"
          >
            Loading your workspace...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-pink-400 rounded-full blur-3xl"
        />
      </div>

      {/* Modern Header with Glassmorphism */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/10 backdrop-blur-xl shadow-xl border-b border-white/20 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  <Zap className="h-6 w-6 text-white" />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl bg-cyan-400"
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-black text-white drop-shadow-lg flex items-center gap-2">
                    TaskFlow
                    <Sparkles className="h-5 w-5 text-yellow-300" />
                  </h1>
                  <p className="text-xs text-purple-200 font-medium">Supercharge your productivity</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Avatar className="h-9 w-9 ring-2 ring-white/50">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-purple-600 text-white font-bold text-sm">
                    {getInitials(currentUser?.name, currentUser?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-white">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-purple-200">{currentUser?.email}</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white border-red-300/50 hover:border-red-300 backdrop-blur-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline font-semibold">Sign Out</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-black text-white mb-3 drop-shadow-lg">
            Welcome back, {currentUser?.name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p className="text-purple-200 text-lg font-medium">Here's what you need to do today.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Creation Card - Sidebar */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 space-y-6"
          >
            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-white overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 text-white text-xl font-bold">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Plus className="h-6 w-6" />
                    </motion.div>
                    Create New Task
                  </CardTitle>
                  <CardDescription className="text-cyan-100 font-medium">
                    Add a new task to your workflow
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 m-4 shadow-xl relative z-10">
                  <NewTaskForm onTaskCreated={handleTaskCreated} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Cards with Electric Effects */}
            <div className="grid grid-cols-1 gap-4">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold text-purple-200">To Do</CardTitle>
                        <p className="text-3xl font-black text-white">0</p>
                      </div>
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-lg">
                        <ListTodo className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold text-cyan-200">In Progress</CardTitle>
                        <p className="text-3xl font-black text-white">0</p>
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-lg"
                      >
                        <Clock className="h-7 w-7 text-white" />
                      </motion.div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold text-green-200">Completed</CardTitle>
                        <p className="text-3xl font-black text-white">0</p>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-14 w-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle2 className="h-7 w-7 text-white" />
                      </motion.div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Task List - Main Area with Glassmorphism */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <CardHeader className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-b border-white/20 relative z-10">
                <CardTitle className="text-3xl font-black text-white flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-yellow-300" />
                  Your Tasks
                </CardTitle>
                <CardDescription className="text-purple-200 font-semibold text-base">
                  Manage and track your tasks with lightning speed
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                <TaskList refreshTrigger={refreshTrigger} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
