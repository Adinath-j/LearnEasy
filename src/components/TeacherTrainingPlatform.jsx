import React from 'react';
import { Play, Users, Trophy, BookOpen, UserCircle, Share2, Star, CheckCircle, Lock, Award, Target, TrendingUp, MessageSquare, Heart, Lightbulb, Download, Edit3, Trash2, RotateCcw, Save, Palette } from 'lucide-react';

// --- Gemini API Helper Function ---
const callGeminiAPI = async (prompt, maxRetries = 3) => {
  // Per instructions, the API key should be an empty string.
  const apiKey = "AIzaSyCTkRzvKj8dlploJaqceGRfBjLBxC-dSHs";

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  let attempt = 0;
  let delay = 1000;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        if (response.status === 429 || response.status >= 500) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const errorBody = await response.json();
          console.error("API Error:", errorBody);
          return `Error: ${errorBody.error?.message || "An unexpected error occurred."}`;
        }
      }
      const result = await response.json();
      const candidate = result.candidates?.[0];
      if (candidate?.content?.parts?.[0]?.text) {
        return candidate.content.parts[0].text;
      } else {
        return "Sorry, I couldn't generate a response. The API returned an unexpected result.";
      }
    } catch (error) {
      console.warn(`API call attempt ${attempt + 1} failed: ${error.message}. Retrying in ${delay / 1000}s...`);
      attempt++;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        return "Sorry, I'm having trouble connecting to the AI assistant right now. Please try again later.";
      }
    }
  }
};

// --- UI Components ---

const Header = ({ userProgress, setActiveTab }) => (
  <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-3 text-left cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg"><img src="public/SIH-logo.png" alt="SIH Logo" className='h-full w-full overflow-hidden object-cover' /></span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">LearnEasy</h1>
            <p className="text-blue-100 text-xs">AI-Powered Teacher Training</p>
          </div>
        </button>
        <div className="flex items-center gap-6 text-white">
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <div className="text-right">
              <div className="text-sm font-medium">Level {userProgress.level}</div>
              <div className="text-xs text-blue-100">{userProgress.xp} XP</div>
            </div>
            <div className="w-32 bg-blue-400 bg-opacity-30 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(userProgress.xp % 1000) / 10}%` }}
              ></div>
            </div>
          </button>
          <div className="flex items-center gap-2 bg-orange-500 bg-opacity-20 px-3 py-1 rounded-full">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-medium">{userProgress.streak} day streak</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const Navigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp className="w-4 h-4" />, color: 'blue' },
    { id: 'modules', label: 'Training Modules', icon: <BookOpen className="w-4 h-4" />, color: 'green' },
    { id: 'create', label: 'AI Lesson Builder', icon: <Lightbulb className="w-4 h-4" />, color: 'yellow' },
    { id: 'community', label: 'Community Hub', icon: <Users className="w-4 h-4" />, color: 'pink' }
  ];

  return (
    <nav className="flex gap-1 mb-8 bg-white rounded-xl p-1 shadow-md border">
      {navItems.map((tab) => {
        const isActive = activeTab === tab.id;
        const activeClasses = {
          blue: 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg',
          green: 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg',
          yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-800 shadow-lg',
          pink: 'bg-gradient-to-r from-pink-400 to-pink-500 text-slate-800 shadow-lg',
        };

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all transform  ${isActive ? activeClasses[tab.color] : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {tab.icon}
            {tab.label}
            {isActive && tab.id === 'create' && (
              <span className="bg-white text-yellow-700 font-bold px-2 py-1 rounded-full text-xs">✨AI</span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

const Dashboard = ({ userProgress, badges, modules }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Stats Cards */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transition transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Modules Completed</p>
            <p className="text-3xl font-bold">{userProgress.completedModules}</p>
            <p className="text-xs text-blue-200 mt-1">+3 this week</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-xl"><img src="public/circle_check.svg" alt="circle check" /></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg transition transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Badges Earned</p>
            <p className="text-3xl font-bold">{userProgress.badges}</p>
            <p className="text-xs text-green-200 mt-1">2 more to unlock</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-xl"><img src="public/medal.svg" alt="medal image" /></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transition transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Current Level</p>
            <p className="text-3xl font-bold">{userProgress.level}</p>
            <p className="text-xs text-purple-200 mt-1">Master Teacher</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-xl"><img src="public/trophy.svg" alt="trophy image" /></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg transition transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Learning Streak</p>
            <p className="text-3xl font-bold">{userProgress.streak}</p>
            <p className="text-xs text-orange-200 mt-1">Personal best!</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-xl"><span className="text-3xl">🔥</span></div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Your Achievement Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge, index) => (
            <div key={index} className={`text-center p-4 rounded-xl transition-all hover:scale-105 ${badge.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-md' : 'bg-gray-50 border-2 border-gray-200'}`}>
              <div className="text-3xl mb-2">{badge.earned ? badge.icon : '🔒'}</div>
              <p className={`text-sm font-bold mb-1 ${badge.earned ? 'text-yellow-800' : 'text-gray-500'}`}>{badge.name}</p>
              <p className={`text-xs ${badge.earned ? 'text-yellow-600' : 'text-gray-400'}`}>{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Continue Learning</h3>
        <div className="space-y-3">
          {modules.slice(0, 3).map((module) => (
            <div key={module.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className={`p-2 rounded-lg ${module.completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                {module.completed ? <CheckCircle className="w-4 h-4" /> : module.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{module.title}</p>
                <p className="text-xs text-gray-500">{module.duration} • {module.xp} XP</p>
              </div>
              <button className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${module.completed ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                {module.completed ? 'Review' : 'Start'}
              </button>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg">
          View All Modules
        </button>
      </div>
    </div>
  </div>
);

const TrainingModules = ({ modules, setSelectedModule }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Training Modules</h2>
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">All Levels</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">Beginner</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">Intermediate</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">Advanced</button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {modules.map((module) => (
                <div key={module.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl ${module.completed ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-600' : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600'}`}>
                            {module.completed ? <CheckCircle className="w-6 h-6" /> : module.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{module.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${module.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{module.difficulty}</span>
                                <span>•</span><span>{module.duration}</span><span>•</span><span>{module.xp} XP</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                        {module.simulation && <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium">🎮 Interactive Simulation</span>}
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">🤖 AI-Enhanced</span>
                    </div>
                    <button onClick={() => setSelectedModule(module)} className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${module.completed ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'}`}>
                        {module.completed ? '✅ Review Module' : '🚀 Start Learning'}
                    </button>
                </div>
            ))}
        </div>
    </div>
);

const LessonBuilder = ({ lessonBuilder, setLessonBuilder, generateAISuggestions, generateAILessonPlan, loadingAI, aiSuggestions, exportToPDF }) => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-xl font-bold mb-4">✨ AI-Powered Lesson Builder</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
              <input type="text" value={lessonBuilder.title} onChange={(e) => setLessonBuilder({...lessonBuilder, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Introduction to Photosynthesis" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select value={lessonBuilder.subject} onChange={(e) => setLessonBuilder({...lessonBuilder, subject: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Subject</option>
                <option value="math">Mathematics</option>
                <option value="biology">Biology</option>
                <option value="chemistry">Chemistry</option>
                <option value="physics">Physics</option>
                <option value="english">English Language Arts</option>
                <option value="history">Social Studies</option>
                <option value="art">Arts</option>
                <option value="technology">Technology</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <select value={lessonBuilder.gradeLevel} onChange={(e) => setLessonBuilder({...lessonBuilder, gradeLevel: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Grade</option><option value="k-2">K-2</option><option value="3-5">3-5</option><option value="6-8">6-8</option><option value="9-12">9-12</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives</label>
              <textarea value={lessonBuilder.objectives.join('\n')} onChange={(e) => setLessonBuilder({...lessonBuilder, objectives: e.target.value.split('\n').filter(obj => obj.trim())})} className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter each objective on a new line..."/>
            </div>
          </div>
        </div>
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Content</label>
            <textarea value={lessonBuilder.content} onChange={(e) => setLessonBuilder({...lessonBuilder, content: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg h-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent whitespace-pre-wrap" placeholder="Describe your lesson, or let the AI generate a plan for you!" />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Digital Tools & Technologies</label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {['Smart Board', 'Real-time Polls', 'Video Conferencing', 'Interactive Games', 'Digital Quizzes', 'Collaboration Tools', '3D Simulations', 'AR/VR', 'Screen Sharing', 'Breakout Rooms', 'Digital Whiteboard', 'File Sharing'].map((tool) => (
              <button key={tool} onClick={() => { const tools = lessonBuilder.tools.includes(tool) ? lessonBuilder.tools.filter(t => t !== tool) : [...lessonBuilder.tools, tool]; setLessonBuilder({...lessonBuilder, tools}); }} className={`p-2 rounded-lg text-sm font-medium transition-colors ${lessonBuilder.tools.includes(tool) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{tool}</button>
            ))}
          </div>
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">AI Teaching Assistant</h4>
                <div className="bg-white/50 p-3 rounded-md mb-3 min-h-[80px]">
                    {loadingAI ? (<div className="flex items-center gap-2 text-blue-800"><div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>Generating...</div>) : aiSuggestions ? (<p className="text-sm text-blue-800 whitespace-pre-wrap">{aiSuggestions}</p>) : (<p className="text-sm text-blue-800">Fill in your lesson details, then click a button below to get creative suggestions or a full lesson plan.</p>)}
                </div>
              <div className="flex gap-2 flex-wrap">
                  <button onClick={generateAISuggestions} disabled={loadingAI} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">✨ Get Suggestions</button>
                  <button onClick={generateAILessonPlan} disabled={loadingAI} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">✨ Generate Full Lesson Plan</button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"><Save className="w-4 h-4" />Save & Share Lesson</button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">Preview Lesson</button>
          <button onClick={exportToPDF} className="border border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors">Export to PDF</button>
        </div>
      </div>
    </div>
);

const CommunityHub = ({ sharedLessons }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Community Learning Hub</h2>
                <p className="text-gray-600">Discover and share AI-enhanced lesson plans</p>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"><Share2 className="w-4 h-4" />Share Your Lesson</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl text-center shadow-lg transition transform hover:-translate-y-1"><div className="text-2xl font-bold">1,247</div><div className="text-sm text-blue-100">Total Lessons</div></div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl text-center shadow-lg transition transform hover:-translate-y-1"><div className="text-2xl font-bold">892</div><div className="text-sm text-green-100">AI-Enhanced</div></div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl text-center shadow-lg transition transform hover:-translate-y-1"><div className="text-2xl font-bold">15.2k</div><div className="text-sm text-purple-100">Downloads</div></div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl text-center shadow-lg transition transform hover:-translate-y-1"><div className="text-2xl font-bold">234</div><div className="text-sm text-orange-100">Active Teachers</div></div>
        </div>
        <div className="space-y-4">
            {sharedLessons.map((lesson) => (
                <div key={lesson.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold">{lesson.title}</h3>
                                {lesson.aiEnhanced && <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">🤖 AI-Enhanced</span>}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <span>by <span className="font-semibold text-gray-700">{lesson.author}</span></span><span>•</span><span>{lesson.subject}</span><span>•</span><span>Grade {lesson.gradeLevel}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(lesson.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                                <span className="text-sm text-gray-600 ml-2">{lesson.rating}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-500" />{lesson.likes}</div>
                            <div className="flex items-center gap-1"><Download className="w-4 h-4 text-blue-500" />{lesson.downloads}</div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {lesson.tools.map((tool, index) => <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{tool}</span>)}
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"><Download className="w-4 h-4" />Use This Lesson</button>
                        <button className="border border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Preview</button>
                        <button className="border border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"><Heart className="w-4 h-4" />Like</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Profile = ({ userProgress }) => (
    <div className="bg-white rounded-xl p-8 shadow-sm border">
        <div className="flex items-center gap-6">
            <UserCircle className="w-24 h-24 text-purple-500" />
            <div>
                <h2 className="text-3xl font-bold">Adinath</h2>
                <p className="text-gray-600">adinath@example.com</p>
                <div className="mt-4 flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{userProgress.level}</p>
                        <p className="text-sm text-gray-500">Level</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{userProgress.completedModules}</p>
                        <p className="text-sm text-gray-500">Modules Done</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{userProgress.badges}</p>
                        <p className="text-sm text-gray-500">Badges</p>
                    </div>
                    <div className="text-center flex items-center gap-1">
                        <p className="text-2xl font-bold text-orange-500">{userProgress.streak}</p>
                        <span className="text-2xl text-orange-500">🔥</span>
                        <p className="text-sm text-gray-500 self-end pb-1">Day Streak</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


const TeacherTrainingPlatform = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [userProgress, setUserProgress] = React.useState({
    level: 12,
    xp: 2850,
    xpToNext: 650,
    completedModules: 18,
    badges: 7,
    streak: 5
  });
  
  const [selectedModule, setSelectedModule] = React.useState(null);
  
  const [lessonBuilder, setLessonBuilder] = React.useState({
    title: '',
    content: '',
    subject: '',
    gradeLevel: '',
    tools: [],
    objectives: []
  });
  
  const [aiSuggestions, setAiSuggestions] = React.useState('');
  const [loadingAI, setLoadingAI] = React.useState(false);

  const modules = [
    { id: 2, title: "Digital Lesson Creation", description: "Build engaging multimedia lessons with AI assistance", difficulty: "Intermediate", duration: "35 min", xp: 250, completed: true, simulation: true, icon: <BookOpen className="w-6 h-6" />},
    { id: 3, title: "Student Response Systems", description: "Implement real-time polling and assessment tools", difficulty: "Intermediate", duration: "25 min", xp: 200, completed: false, simulation: true, icon: <Target className="w-6 h-6" />},
    { id: 4, title: "Virtual Collaboration Hub", description: "Facilitate online group work and peer learning", difficulty: "Advanced", duration: "40 min", xp: 300, completed: false, simulation: true, icon: <Users className="w-6 h-6" />}
  ];

  const badges = [
    { name: "Digital Pioneer", icon: "🚀", earned: true, description: "Completed first module" }, { name: "Smart Board Expert", icon: "📱", earned: true, description: "Mastered interactive whiteboard" }, { name: "AI Collaborator", icon: "🤖", earned: true, description: "Used AI suggestions 10 times" }, { name: "Community Contributor", icon: "🤝", earned: false, description: "Shared 5 lessons" }, { name: "Innovation Master", icon: "💡", earned: false, description: "Used advanced AR/VR tools" }
  ];

  const sharedLessons = [
    { id: 1, title: "Interactive Fraction Workshop", author: "Dr. Sarah Martinez", subject: "Mathematics", gradeLevel: "3-5", likes: 47, downloads: 234, rating: 4.8, tools: ["Smart Board", "Real-time Polls", "Interactive Games"], aiEnhanced: true },
    { id: 2, title: "Virtual Chemistry Lab", author: "Prof. Michael Chen", subject: "Science", gradeLevel: "9-12", likes: 62, downloads: 318, rating: 4.9, tools: ["3D Simulations", "Collaboration Tools", "Digital Quizzes"], aiEnhanced: true },
    { id: 3, title: "Shakespeare in VR", author: "Ms. Emma Thompson", subject: "English Language Arts", gradeLevel: "6-8", likes: 35, downloads: 167, rating: 4.7, tools: ["AR/VR", "Video Conferencing", "Digital Whiteboard"], aiEnhanced: false }
  ];

  React.useEffect(() => {
    const scriptId = 'jspdf-script';
    // Prevent adding the script more than once
    if (document.getElementById(scriptId)) {
        return;
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    document.head.appendChild(script);

    // Optional: cleanup script on component unmount
    return () => {
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            document.head.removeChild(existingScript);
        }
    };
  }, []); // Run only once when the component mounts

  const generateAISuggestions = async () => {
      const { title, subject, gradeLevel, objectives, tools } = lessonBuilder;
      if (!title || !subject || !gradeLevel) {
          setAiSuggestions("Please fill out the lesson title, subject, and grade level to get the best suggestions.");
          return;
      }
      setLoadingAI(true);
      const prompt = `As an expert instructional designer, provide three creative and engaging suggestions for a lesson titled "${title}". The lesson is for ${gradeLevel} students in the subject of ${subject}. Key learning objectives are: ${objectives.join(', ') || 'not specified'}. The teacher plans to use the following digital tools: ${tools.join(', ') || 'not specified'}. IMPORTANT: Provide the response as simple, unformatted plain text. Do not use markdown.`;
      const response = await callGeminiAPI(prompt);
      setAiSuggestions(response);
      setLoadingAI(false);
  };

  const generateAILessonPlan = async () => {
      const { title, subject, gradeLevel, objectives, tools } = lessonBuilder;
      if (!title || !subject || !gradeLevel) {
          setAiSuggestions("Please fill out the lesson title, subject, and grade level before generating a full lesson plan.");
          return;
      }
      setLoadingAI(true);
      setAiSuggestions('');
      const prompt = `Create a detailed lesson plan for a lesson titled "${title}". Subject: ${subject}. Grade Level: ${gradeLevel}. Learning Objectives: ${objectives.join('; ')}. Digital Tools Available: ${tools.join(', ')}. Please structure the plan with the following sections: Introduction/Hook, Instructional Activities, Guided Practice, Assessment, and Differentiation. IMPORTANT: Write the content in a clear, easy-to-follow format using only plain text. Do not use any markdown formatting like asterisks or hashes.`;
      const response = await callGeminiAPI(prompt);
      setLessonBuilder(prev => ({ ...prev, content: response }));
      setLoadingAI(false);
  };
  
  const exportToPDF = () => {
    if (!lessonBuilder.content.trim()) {
        console.warn("There is no content to export. Please generate a lesson plan first.");
        return;
    }
    
    // Check if the jsPDF library has loaded onto the window object.
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        console.error("jsPDF library is not loaded yet. Please wait a moment and try again.");
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const title = lessonBuilder.title || "Untitled Lesson Plan";
    const content = lessonBuilder.content;

    // Get page dimensions
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    // --- RENDER TITLE ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 15, 20);

    // --- RENDER CONTENT ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // Define margins and starting position
    const margin = 15;
    let y = 35; // Start content below the title
    const lineHeight = 7; // Adjust this based on your font size for better spacing

    // Split the content into lines that fit within the page width minus margins
    const splitContent = doc.splitTextToSize(content, pageWidth - margin * 2);

    // Loop through each line and add it to the PDF
    splitContent.forEach(line => {
      // Check if the next line will go off the page
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage(); // If it does, add a new page
        y = margin; // And reset the Y position to the top margin
      }
      doc.text(line, margin, y); // Add the current line of text
      y += lineHeight; // Move the Y position down for the next line
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
 };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userProgress={userProgress} badges={badges} modules={modules} />;
      case 'modules':
        return <TrainingModules modules={modules} setSelectedModule={setSelectedModule} />;
      case 'create':
        return <LessonBuilder 
                  lessonBuilder={lessonBuilder} 
                  setLessonBuilder={setLessonBuilder}
                  generateAISuggestions={generateAISuggestions}
                  generateAILessonPlan={generateAILessonPlan}
                  loadingAI={loadingAI}
                  aiSuggestions={aiSuggestions}
                  exportToPDF={exportToPDF}
                />;
      case 'community':
        return <CommunityHub sharedLessons={sharedLessons} />;
      case 'profile':
        return <Profile userProgress={userProgress} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userProgress={userProgress} setActiveTab={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderContent()}
      </div>
    </div>
  );
};

export default TeacherTrainingPlatform;