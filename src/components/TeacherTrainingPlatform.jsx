import React from 'react';
import { Play, Users, Trophy, BookOpen, Monitor, Share2, Star, CheckCircle, Lock, Award, Target, TrendingUp, MessageSquare, Heart, Lightbulb, Download, Edit3, Trash2, RotateCcw, Save, Palette } from 'lucide-react';

const TeacherTrainingPlatform = () => {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [drawingTool, setDrawingTool] = React.useState('pen');
  const [drawingColor, setDrawingColor] = React.useState('#000000');
  const [stickyNotes, setStickyNotes] = React.useState([]);
  const [showStickyDialog, setShowStickyDialog] = React.useState(false);
  const [newStickyText, setNewStickyText] = React.useState('');
  const [stickyPosition, setStickyPosition] = React.useState({ x: 0, y: 0 });
  
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
  const [simulationActive, setSimulationActive] = React.useState(false);
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
    {
      id: 1,
      title: "Smart Board Mastery",
      description: "Master interactive whiteboard tools and techniques",
      difficulty: "Beginner",
      duration: "20 min",
      xp: 150,
      completed: true,
      simulation: true,
      icon: <Monitor className="w-6 h-6" />
    },
    {
      id: 2,
      title: "Digital Lesson Creation",
      description: "Build engaging multimedia lessons with AI assistance",
      difficulty: "Intermediate",
      duration: "35 min",
      xp: 250,
      completed: true,
      simulation: true,
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      id: 3,
      title: "Student Response Systems",
      description: "Implement real-time polling and assessment tools",
      difficulty: "Intermediate",
      duration: "25 min",
      xp: 200,
      completed: false,
      simulation: true,
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 4,
      title: "Virtual Collaboration Hub",
      description: "Facilitate online group work and peer learning",
      difficulty: "Advanced",
      duration: "40 min",
      xp: 300,
      completed: false,
      simulation: true,
      icon: <Users className="w-6 h-6" />
    }
  ];

  // Canvas Drawing Functions
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = drawingTool === 'pen' ? 2 : 10;
      ctx.strokeStyle = drawingColor;
    }
  }, [drawingTool, drawingColor]);

  const startDrawing = (e) => {
    if (drawingTool === 'sticky') {
      const rect = canvasRef.current.getBoundingClientRect();
      setStickyPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setShowStickyDialog(true);
      return;
    }
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing || drawingTool === 'sticky') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    if (drawingTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStickyNotes([]);
  };

  const addStickyNote = () => {
    if (newStickyText.trim()) {
      setStickyNotes([...stickyNotes, {
        id: Date.now(),
        text: newStickyText,
        x: stickyPosition.x,
        y: stickyPosition.y,
        color: '#fef3c7' // yellow-100
      }]);
      setNewStickyText('');
      setShowStickyDialog(false);
    }
  };

  const removeStickyNote = (id) => {
    setStickyNotes(stickyNotes.filter(note => note.id !== id));
  };

  // AI Integration Simulation
  const generateAISuggestions = async () => {
    setLoadingAI(true);
    // Simulate API call
    setTimeout(() => {
      const suggestions = [
        "Consider adding an interactive poll at the beginning to gauge prior knowledge.",
        "Use visual diagrams on the smart board to explain complex concepts.",
        "Include breakout rooms for small group discussions.",
        "Add a quick formative assessment using digital tools.",
        "Incorporate multimedia elements like videos or animations."
      ];
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setAiSuggestions(randomSuggestion);
      setLoadingAI(false);
    }, 1500);
  };

  // Enhanced Smart Board Simulation with Canvas
  const SmartBoardSimulation = () => (
    <div className="bg-gray-900 rounded-lg p-6 text-white">
      <div className="bg-white rounded-lg p-4 mb-4 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="border border-gray-300 rounded cursor-crosshair w-full"
          style={{ maxWidth: '100%', height: 'auto' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        {/* Sticky Notes */}
        {stickyNotes.map((note) => (
          <div
            key={note.id}
            className="absolute bg-yellow-200 p-2 rounded shadow-md text-black text-sm max-w-32"
            style={{ left: `${note.x}px`, top: `${note.y}px` }}
          >
            <button
              onClick={() => removeStickyNote(note.id)}
              className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
            {note.text}
          </div>
        ))}
      </div>
      
      {/* Drawing Tools */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setDrawingTool('pen')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            drawingTool === 'pen' ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Pen
        </button>
        
        <button
          onClick={() => setDrawingTool('eraser')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            drawingTool === 'eraser' ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          <span>🧹</span>
          Eraser
        </button>
        
        <button
          onClick={() => setDrawingTool('sticky')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            drawingTool === 'sticky' ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
        >
          <span>📝</span>
          Sticky Note
        </button>
        
        <input
          type="color"
          value={drawingColor}
          onChange={(e) => setDrawingColor(e.target.value)}
          className="w-12 h-10 rounded-lg border-2 border-white cursor-pointer"
        />
        
        <button
          onClick={clearCanvas}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <span>📊</span> Chart
        </button>
        <button className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <span>🎮</span> Quiz
        </button>
        <button className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <span>📹</span> Video
        </button>
        <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <span>🖼️</span> Image
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          AI Teaching Assistant
        </h4>
        <p className="text-sm text-gray-300">
          Great drawing! Try adding interactive elements like polls or clickable hotspots to make this content more engaging for students.
        </p>
      </div>
    </div>
  );

  // Sticky Note Dialog
  const StickyNoteDialog = () => (
    showStickyDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
          <h3 className="text-lg font-bold mb-4">Add Sticky Note</h3>
          <textarea
            value={newStickyText}
            onChange={(e) => setNewStickyText(e.target.value)}
            placeholder="Enter your note..."
            className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none"
            autoFocus
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={addStickyNote}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Add Note
            </button>
            <button
              onClick={() => setShowStickyDialog(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Enhanced Lesson Builder with AI Integration
  const LessonBuilder = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-xl font-bold mb-4">AI-Powered Lesson Builder</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
              <input
                type="text"
                value={lessonBuilder.title}
                onChange={(e) => setLessonBuilder({...lessonBuilder, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your lesson title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={lessonBuilder.subject}
                onChange={(e) => setLessonBuilder({...lessonBuilder, subject: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Subject</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English Language Arts</option>
                <option value="history">Social Studies</option>
                <option value="art">Arts</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <select
                value={lessonBuilder.gradeLevel}
                onChange={(e) => setLessonBuilder({...lessonBuilder, gradeLevel: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Grade</option>
                <option value="k-2">K-2</option>
                <option value="3-5">3-5</option>
                <option value="6-8">6-8</option>
                <option value="9-12">9-12</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives</label>
              <textarea
                value={lessonBuilder.objectives.join('\n')}
                onChange={(e) => setLessonBuilder({
                  ...lessonBuilder, 
                  objectives: e.target.value.split('\n').filter(obj => obj.trim())
                })}
                className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter each objective on a new line..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Content</label>
              <textarea
                value={lessonBuilder.content}
                onChange={(e) => setLessonBuilder({...lessonBuilder, content: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your lesson content..."
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Digital Tools & Technologies</label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[
              'Smart Board', 'Real-time Polls', 'Video Conferencing', 'Interactive Games', 
              'Digital Quizzes', 'Collaboration Tools', '3D Simulations', 'AR/VR', 
              'Screen Sharing', 'Breakout Rooms', 'Digital Whiteboard', 'File Sharing'
            ].map((tool) => (
              <button
                key={tool}
                onClick={() => {
                  const tools = lessonBuilder.tools.includes(tool) 
                    ? lessonBuilder.tools.filter(t => t !== tool)
                    : [...lessonBuilder.tools, tool];
                  setLessonBuilder({...lessonBuilder, tools});
                }}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  lessonBuilder.tools.includes(tool)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">AI Teaching Assistant</h4>
              {loadingAI ? (
                <div className="flex items-center gap-2 text-blue-800">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  Generating personalized suggestions...
                </div>
              ) : aiSuggestions ? (
                <p className="text-sm text-blue-800 mb-3">{aiSuggestions}</p>
              ) : (
                <p className="text-sm text-blue-800 mb-3">
                  I can help you enhance this lesson with personalized suggestions based on your subject, grade level, and selected tools.
                </p>
              )}
              <button
                onClick={generateAISuggestions}
                disabled={loadingAI}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {loadingAI ? 'Generating...' : 'Get AI Suggestions'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save & Share Lesson
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium">
            Preview Lesson
          </button>
          <button className="border border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium">
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );

  const badges = [
    { name: "Digital Pioneer", icon: "🚀", earned: true, description: "Completed first module" },
    { name: "Smart Board Expert", icon: "📱", earned: true, description: "Mastered interactive whiteboard" },
    { name: "AI Collaborator", icon: "🤖", earned: true, description: "Used AI suggestions 10 times" },
    { name: "Community Contributor", icon: "🤝", earned: false, description: "Shared 5 lessons" },
    { name: "Innovation Master", icon: "💡", earned: false, description: "Used advanced AR/VR tools" }
  ];

  const sharedLessons = [
    {
      id: 1,
      title: "Interactive Fraction Workshop",
      author: "Dr. Sarah Martinez",
      subject: "Mathematics",
      gradeLevel: "3-5",
      likes: 47,
      downloads: 234,
      rating: 4.8,
      tools: ["Smart Board", "Real-time Polls", "Interactive Games"],
      aiEnhanced: true
    },
    {
      id: 2,
      title: "Virtual Chemistry Lab",
      author: "Prof. Michael Chen",
      subject: "Science", 
      gradeLevel: "9-12",
      likes: 62,
      downloads: 318,
      rating: 4.9,
      tools: ["3D Simulations", "Collaboration Tools", "Digital Quizzes"],
      aiEnhanced: true
    },
    {
      id: 3,
      title: "Shakespeare in VR",
      author: "Ms. Emma Thompson",
      subject: "English Language Arts",
      gradeLevel: "6-8",
      likes: 35,
      downloads: 167,
      rating: 4.7,
      tools: ["AR/VR", "Video Conferencing", "Digital Whiteboard"],
      aiEnhanced: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">EduTech Mastery</h1>
                <p className="text-blue-100 text-xs">AI-Powered Teacher Training</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">Level {userProgress.level}</div>
                  <div className="text-xs text-blue-100">{userProgress.xp} XP</div>
                </div>
                <div className="w-32 bg-blue-400 bg-opacity-30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{width: `${(userProgress.xp % 1000) / 10}%`}}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-orange-500 bg-opacity-20 px-3 py-1 rounded-full">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-medium">{userProgress.streak} day streak</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Navigation */}
        <nav className="flex gap-1 mb-8 bg-white rounded-xl p-1 shadow-md border">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp className="w-4 h-4" />, color: 'blue' },
            { id: 'modules', label: 'Training Modules', icon: <BookOpen className="w-4 h-4" />, color: 'green' },
            { id: 'simulations', label: 'Smart Board Lab', icon: <Monitor className="w-4 h-4" />, color: 'purple' },
            { id: 'create', label: 'AI Lesson Builder', icon: <Lightbulb className="w-4 h-4" />, color: 'yellow' },
            { id: 'community', label: 'Community Hub', icon: <Users className="w-4 h-4" />, color: 'pink' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-grow flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && tab.id === 'create' && (
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">AI</span>
              )}
            </button>
          ))}
        </nav>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Modules Completed</p>
                    <p className="text-3xl font-bold">{userProgress.completedModules}</p>
                    <p className="text-xs text-blue-200 mt-1">+3 this week</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Badges Earned</p>
                    <p className="text-3xl font-bold">{userProgress.badges}</p>
                    <p className="text-xs text-green-200 mt-1">2 more to unlock</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <Award className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Current Level</p>
                    <p className="text-3xl font-bold">{userProgress.level}</p>
                    <p className="text-xs text-purple-200 mt-1">Master Teacher</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <Trophy className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Learning Streak</p>
                    <p className="text-3xl font-bold">{userProgress.streak}</p>
                    <p className="text-xs text-orange-200 mt-1">Personal best!</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <span className="text-3xl">🔥</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-bold mb-4">Your Achievement Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {badges.map((badge, index) => (
                    <div key={index} className={`text-center p-4 rounded-xl transition-all hover:scale-105 ${
                      badge.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-md' : 'bg-gray-50 border-2 border-gray-200'
                    }`}>
                      <div className="text-3xl mb-2">{badge.earned ? badge.icon : '🔒'}</div>
                      <p className={`text-sm font-bold mb-1 ${badge.earned ? 'text-yellow-800' : 'text-gray-500'}`}>
                        {badge.name}
                      </p>
                      <p className={`text-xs ${badge.earned ? 'text-yellow-600' : 'text-gray-400'}`}>
                        {badge.description}
                      </p>
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
                      <button className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        module.completed ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}>
                        {module.completed ? 'Review' : 'Start'}
                      </button>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all">
                  View All Modules
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Training Modules */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Interactive Training Modules</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">All Levels</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Beginner</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Intermediate</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Advanced</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {modules.map((module) => (
                <div key={module.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all hover:scale-[1.02]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl ${
                      module.completed 
                        ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-600' 
                        : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600'
                    }`}>
                      {module.completed ? <CheckCircle className="w-6 h-6" /> : module.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{module.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          module.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                          module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {module.difficulty}
                        </span>
                        <span>•</span>
                        <span>{module.duration}</span>
                        <span>•</span>
                        <span>{module.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {module.simulation && (
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium">
                        🎮 Interactive Simulation
                      </span>
                    )}
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      🤖 AI-Enhanced
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedModule(module)}
                    className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
                      module.completed
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                    }`}
                  >
                    {module.completed ? '✅ Review Module' : '🚀 Start Learning'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Smart Board Simulation */}
        {activeTab === 'simulations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Smart Board Laboratory</h2>
                <p className="text-gray-600">Practice with our HTML5 Canvas-powered interactive whiteboard</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                  Save Session
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium">
                  Load Template
                </button>
              </div>
            </div>
            
            <SmartBoardSimulation />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-bold mb-4">Practice Scenarios</h3>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-semibold mb-2">📱 Technology Troubleshooting</h4>
                    <p className="text-sm text-gray-600 mb-3">Handle common smart board issues during live lessons</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">15 min</span>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600">Start</button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-semibold mb-2">🎯 Student Engagement Tools</h4>
                    <p className="text-sm text-gray-600 mb-3">Master polls, quizzes, and interactive activities</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">20 min</span>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600">Start</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border">
                <h3 className="text-lg font-bold mb-4">🎨 Canvas Features</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Multi-color drawing with HTML5 Canvas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Interactive sticky notes system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Eraser and drawing tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>Save and load functionality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>Real-time collaboration ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI-Powered Lesson Builder */}
        {activeTab === 'create' && <LessonBuilder />}

        {/* Enhanced Community Hub */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Community Learning Hub</h2>
                <p className="text-gray-600">Discover and share AI-enhanced lesson plans</p>
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Your Lesson
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-blue-100">Total Lessons</div>
              </div>
              <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">892</div>
                <div className="text-sm text-green-100">AI-Enhanced</div>
              </div>
              <div className="bg-purple-500 text-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">15.2k</div>
                <div className="text-sm text-purple-100">Downloads</div>
              </div>
              <div className="bg-orange-500 text-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">234</div>
                <div className="text-sm text-orange-100">Active Teachers</div>
              </div>
            </div>

            <div className="space-y-4">
              {sharedLessons.map((lesson) => (
                <div key={lesson.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{lesson.title}</h3>
                        {lesson.aiEnhanced && (
                          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            🤖 AI-Enhanced
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>by {lesson.author}</span>
                        <span>•</span>
                        <span>{lesson.subject}</span>
                        <span>•</span>
                        <span>Grade {lesson.gradeLevel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(lesson.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">{lesson.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        {lesson.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4 text-blue-500" />
                        {lesson.downloads}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lesson.tools.map((tool, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Use This Lesson
                    </button>
                    <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                      Preview
                    </button>
                    <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Like
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <StickyNoteDialog />
    </div>
  );
};

export default TeacherTrainingPlatform;

