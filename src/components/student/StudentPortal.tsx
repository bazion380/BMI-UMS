import React, { useState } from 'react';
import { StudentDashboard } from './StudentDashboard';
import { StudentCourses } from './StudentCourses';
import { StudentTimetable } from './StudentTimetable';
import { StudentGrades } from './StudentGrades';
import { StudentFees } from './StudentFees';
import { StudentRegistration } from './StudentRegistration';
import { StudentCampusServices } from './StudentCampusServices';
import { StudentSupport } from './StudentSupport';
import { StudentProfile } from './StudentProfile';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Award, 
  CreditCard, 
  PlusCircle, 
  Building2, 
  HelpCircle, 
  User 
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'grades', label: 'Grades & Transcript', icon: Award },
    { id: 'fees', label: 'Fees & Payments', icon: CreditCard },
    { id: 'registration', label: 'Registration', icon: PlusCircle },
    { id: 'campus_services', label: 'Campus Services', icon: Building2 },
    { id: 'support', label: 'Support & Advising', icon: HelpCircle },
    { id: 'profile', label: 'Profile & ID', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Sub Navigation Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
            {navigationTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <StudentDashboard onNavigateTab={setActiveTab} />}
        {activeTab === 'courses' && <StudentCourses />}
        {activeTab === 'timetable' && <StudentTimetable />}
        {activeTab === 'grades' && <StudentGrades />}
        {activeTab === 'fees' && <StudentFees />}
        {activeTab === 'registration' && <StudentRegistration />}
        {activeTab === 'campus_services' && <StudentCampusServices />}
        {activeTab === 'support' && <StudentSupport />}
        {activeTab === 'profile' && <StudentProfile />}
      </main>

    </div>
  );
};
