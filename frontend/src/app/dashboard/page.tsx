"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  LayoutDashboard
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your workspace...</p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                  <p className="text-xs text-gray-500">Manage your work efficiently</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-cyan-600 text-white font-semibold">
                    {getInitials(currentUser?.name, currentUser?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-900">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p className="text-gray-600">Here's what you need to do today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Creation Card - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Plus className="h-5 w-5" />
                  Create New Task
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Add a new task to your list
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white rounded-lg p-4">
                <NewTaskForm onTaskCreated={handleTaskCreated} />
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-gray-600">To Do</CardTitle>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <ListTodo className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-blue-600">In Progress</CardTitle>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-green-600">Completed</CardTitle>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Task List - Main Area */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="text-2xl">Your Tasks</CardTitle>
                <CardDescription>Manage and track your tasks efficiently</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <TaskList refreshTrigger={refreshTrigger} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
