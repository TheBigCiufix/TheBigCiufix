import React, { useState } from 'react';
import CalendarBooker from './components/CalendarBooker.tsx';
import OracleChat from './components/OracleChat.tsx';
import MagicLifeCounter from './components/MagicLifeCounter.tsx';
import { Home, Calendar, Bot, Dices, Menu } from 'lucide-react';

enum View {
  HOME = 'HOME',
  CALENDAR = 'CALENDAR',
  MAGIC = 'MAGIC',
  ORACLE = 'ORACLE'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case View.CALENDAR:
        return <CalendarBooker />;
      case View.MAGIC:
        return <MagicLifeCounter />;
      case View.ORACLE:
        return <OracleChat />;
      case View.HOME:
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-faella-800 to-faella-900 p-8 rounded-2xl border border-faella-700 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-faella-green opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-faella-purple opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
               
               <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                 Il <span className="text-transparent bg-clip-text bg-gradient-to-r from-faella-green to-teal-400">Faellino</span>
               </h1>
               <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                 Il punto di ritrovo digitale per chi sa apprezzare le cose belle: 
                 <span className="text-faella-green font-semibold"> Cene</span>, 
                 <span className="text-purple-400 font-semibold"> Magic</span>, 
                 <span className="text-blue-400 font-semibold"> PlayStation</span> e 
                 <span className="text-gray-400 font-semibold"> Relax</span>.
               </p>
               <div className="mt-8 flex flex-wrap gap-4">
                 <button 
                   onClick={() => setCurrentView(View.CALENDAR)}
                   className="bg-faella-green text-faella-900 font-bold px-6 py-3 rounded-xl hover:bg-green-400 transition-transform transform hover:-translate-y-1 shadow-lg shadow-green-900/20"
                 >
                   Prenota Presenza
                 </button>
                 <button 
                   onClick={() => setCurrentView(View.ORACLE)}
                   className="bg-faella-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-faella-600 transition-transform transform hover:-translate-y-1 border border-faella-600"
                 >
                   Chiedi al Saggio
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => setCurrentView(View.MAGIC)}
                className="bg-faella-800 p-6 rounded-xl border border-faella-700 cursor-pointer hover:border-purple-500 transition-all group"
              >
                <div className="bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Dices className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Magic Counter</h3>
                <p className="text-gray-400 text-sm">Contatore punti vita per Commander a 4 giocatori. Semplice e veloce.</p>
              </div>

              <div 
                 onClick={() => setCurrentView(View.ORACLE)}
                 className="bg-faella-800 p-6 rounded-xl border border-faella-700 cursor-pointer hover:border-teal-500 transition-all group"
              >
                 <div className="bg-teal-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Bot className="text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">L'Oracolo</h3>
                <p className="text-gray-400 text-sm">Dubbi su una carta? Non sai cosa cucinare? Chiedi all'IA del Faellino.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full md:w-auto ${
        currentView === view 
          ? 'bg-faella-700 text-white shadow-md' 
          : 'text-gray-400 hover:text-white hover:bg-faella-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-faella-900 text-gray-200 font-sans selection:bg-faella-green selection:text-faella-900">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-faella-900/80 backdrop-blur-md border-b border-faella-700">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="text-xl font-black tracking-tighter text-white flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentView(View.HOME)}
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-faella-green to-purple-600 rounded-lg flex items-center justify-center text-xs">F</div>
            FAELLINO
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <NavItem view={View.HOME} icon={Home} label="Home" />
            <NavItem view={View.CALENDAR} icon={Calendar} label="Calendario" />
            <NavItem view={View.MAGIC} icon={Dices} label="Magic" />
            <NavItem view={View.ORACLE} icon={Bot} label="Oracolo" />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-faella-800 border-b border-faella-700 p-4 space-y-2 absolute w-full shadow-2xl">
            <NavItem view={View.HOME} icon={Home} label="Home" />
            <NavItem view={View.CALENDAR} icon={Calendar} label="Calendario" />
            <NavItem view={View.MAGIC} icon={Dices} label="Magic" />
            <NavItem view={View.ORACLE} icon={Bot} label="Oracolo" />
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Il Faellino. Fatto per ridere, giocare e mangiare.</p>
        <p className="mt-1 text-xs opacity-50">Stay Chill.</p>
      </footer>
    </div>
  );
};

export default App;