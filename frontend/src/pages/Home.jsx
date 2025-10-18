import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Home = () => {

  const features = [
    {
      icon: "📝",
      title: "Smart Notes",
      description: "Organize your study materials with intelligent note-taking and folder management",
      link: "/notes",
      color: "from-blue-500 to-blue-600",
      benefits: ["Organized folders", "Markdown support", "Drag & drop"]
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description: "Transform your notes into interactive flashcards and study questions",
      link: "/ai",
      color: "from-purple-500 to-purple-600",
      benefits: ["Smart flashcards", "Study questions", "AI summaries"]
    },
    {
      icon: "📄",
      title: "PDF Chat",
      description: "Chat with your PDF documents and extract key insights instantly",
      link: "/chat",
      color: "from-green-500 to-green-600",
      benefits: ["PDF upload", "AI chat", "Key insights"]
    },
    {
      icon: "📊",
      title: "Analytics",
      description: "Track your study progress and performance with detailed analytics",
      link: "/profile",
      color: "from-orange-500 to-orange-600",
      benefits: ["Study stats", "Progress tracking", "Achievements"]
    }
  ]

  const stats = [
    { number: "100%", label: "AI Powered", icon: "🤖" },
    { number: "24/7", label: "Available", icon: "⏰" },
    { number: "∞", label: "Possibilities", icon: "🚀" },
    { number: "50+", label: "Students", icon: "👥" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16">
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-4">
                <span className="text-white font-bold text-lg sm:text-2xl">SB</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                Study<span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Buddy</span>
              </h1>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
              Your intelligent study companion that revolutionizes how you learn, organize, and master your studies
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-slate-400 px-4">
              <span className="px-3 py-1 sm:px-4 sm:py-2 bg-slate-800/50 rounded-full border border-slate-700 text-sm sm:text-base">📚 Smart Learning</span>
              <span className="px-3 py-1 sm:px-4 sm:py-2 bg-slate-800/50 rounded-full border border-slate-700 text-sm sm:text-base">🤖 AI-Powered</span>
              <span className="px-3 py-1 sm:px-4 sm:py-2 bg-slate-800/50 rounded-full border border-slate-700 text-sm sm:text-base">📄 PDF Integration</span>
              <span className="px-3 py-1 sm:px-4 sm:py-2 bg-slate-800/50 rounded-full border border-slate-700 text-sm sm:text-base">🎯 Study Focus</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Transform Your
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    Study Experience
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-6 sm:mb-8">
                  StudyBuddy combines the power of AI with intuitive design to help you study smarter, not harder.
                  From intelligent note-taking to interactive flashcards, we've got everything you need to excel.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs sm:text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Smart Organization</h3>
                    <p className="text-sm sm:text-base text-slate-400">Organize your notes with intelligent folders and drag-and-drop functionality</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs sm:text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">AI-Powered Learning</h3>
                    <p className="text-sm sm:text-base text-slate-400">Generate flashcards, study questions, and summaries automatically from your content</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs sm:text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">PDF Intelligence</h3>
                    <p className="text-sm sm:text-base text-slate-400">Chat with your PDF documents and extract key insights instantly</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/notes"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-center"
                >
                  Start Studying Now
                </Link>
                <Link
                  to="/ai"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 border border-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700/50 transition-all duration-200 text-center"
                >
                  Try AI Features
                </Link>
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-600">
                <div className="text-center">
                  <div className="mb-4 sm:mb-6 flex justify-center">
                    <img
                      src={logo}
                      alt="StudyBuddy Logo"
                      className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Study Smarter</h3>
                  <p className="text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base">
                    Join thousands of students who are already using StudyBuddy to improve their grades and study efficiency.
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl font-bold text-blue-400">95%</div>
                      <div className="text-slate-400 text-xs sm:text-sm">Success Rate</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl font-bold text-green-400">2x</div>
                      <div className="text-slate-400 text-xs sm:text-sm">Faster Learning</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              Powerful Features We Offer
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto px-4">
              Everything you need to transform your study routine and achieve academic success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group block"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-8 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <span className="text-2xl sm:text-3xl">{feature.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {feature.benefits.map((benefit, idx) => (
                          <span key={idx} className="px-2 sm:px-3 py-1 bg-slate-700/50 rounded-full text-slate-300 text-xs sm:text-sm">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Trusted by Students Worldwide
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Join the growing community of successful learners
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700 text-center hover:bg-slate-800/70 transition-all duration-200">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-slate-400 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8 px-4">
            Join thousands of students who are already studying smarter with StudyBuddy
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/notes"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/profile"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 border border-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700/50 transition-all duration-200"
            >
              View Your Progress
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-3">
              <span className="text-white font-bold text-base sm:text-lg">SB</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">StudyBuddy</span>
          </div>
          <p className="text-slate-400 mb-3 sm:mb-4 text-sm sm:text-base">
            Your intelligent study companion for academic success
          </p>
          <p className="text-slate-500 text-xs sm:text-sm">
            &copy; 2024 StudyBuddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home