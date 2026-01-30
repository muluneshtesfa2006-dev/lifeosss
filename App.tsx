
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { NoteListSidebar } from './components/NoteListSidebar';
import { Routines } from './components/Routines';
import { Journal } from './components/Journal';
import { Plans } from './components/Plans';
import { MainDashboard } from './components/MainDashboard';
import { CalendarPage } from './components/CalendarPage';
import { Whiteboard } from './components/Whiteboard';
import { MoneyPage } from './components/MoneyPage';
import { SettingsModal } from './components/SettingsModal';
import { Note, Folder } from './types';
import { StorageService } from './services/storageService';
import { 
    FileText, CheckCircle2, Target, 
    LayoutDashboard, Wallet, MousePointer2
} from 'lucide-react';

type Tab = 'DASHBOARD' | 'CALENDAR' | 'NOTES' | 'ROUTINES' | 'JOURNAL' | 'PLANS' | 'WHITEBOARD' | 'MONEY';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    StorageService.init(); 
    setNotes(StorageService.getNotes());
    setFolders(StorageService.getFolders());
    
    // Theme Check
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    const handleResize = () => {
       const mobile = window.innerWidth < 768;
       setIsMobile(mobile);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
      if (isDarkMode) {
          document.documentElement.classList.remove('dark');
          localStorage.theme = 'light';
          setIsDarkMode(false);
      } else {
          document.documentElement.classList.add('dark');
          localStorage.theme = 'dark';
          setIsDarkMode(true);
      }
  };

  const handleTabChange = (newTab: Tab) => {
    setActiveTab(newTab);
  };

  const handleLogout = () => {
      StorageService.logout();
      window.location.reload();
  };

  const handleCreateNote = () => {
    const newNote = StorageService.createNote();
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    StorageService.saveNotes(updatedNotes);
    setSelectedNoteId(newNote.id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <MainDashboard onNavigate={handleTabChange} onLogout={handleLogout} />;
      case 'CALENDAR':
        return <CalendarPage onNavigate={handleTabChange} />;
      case 'WHITEBOARD':
        return <Whiteboard />;
      case 'ROUTINES':
        return <Routines />;
      case 'JOURNAL':
        return <Journal />;
      case 'PLANS':
        return <Plans />;
      case 'MONEY':
        return <MoneyPage />;
      case 'NOTES':
        return (
          <div className="flex h-full w-full overflow-hidden bg-white dark:bg-black transition-colors duration-500">
            <NoteListSidebar 
                notes={notes}
                selectedNoteId={selectedNoteId}
                onSelectNote={(n) => setSelectedNoteId(n.id)}
                onCreateNote={handleCreateNote}
            />
            <div className="flex-1 h-full relative overflow-hidden bg-gray-50 dark:bg-[#050505] border-l border-black/5 dark:border-white/5">
                <Editor 
                  note={notes.find(n => n.id === selectedNoteId) || null}
                  allNotes={notes}
                  onUpdateNote={(n) => {
                      const updated = notes.map(x => x.id === n.id ? n : x);
                      setNotes(updated);
                      StorageService.saveNotes(updated);
                  }}
                  onDeleteNote={(id) => {
                      const updated = notes.filter(x => x.id !== id);
                      setNotes(updated);
                      StorageService.saveNotes(updated);
                      setSelectedNoteId(null);
                  }}
                  onBack={() => setSelectedNoteId(null)}
                  onCreateNote={handleCreateNote}
                />
            </div>
          </div>
        );
      default:
        return <MainDashboard onNavigate={handleTabChange} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#020202] text-black dark:text-white overflow-hidden font-sans transition-colors duration-500">
      {!isMobile && (
          <Sidebar 
            notes={notes}
            folders={folders}
            selectedNoteId={selectedNoteId}
            onSelectNote={(n) => setSelectedNoteId(n.id)}
            onCreateNote={handleCreateNote}
            isOpen={isSidebarOpen}
            onCloseMobile={() => setSidebarOpen(false)}
            activeTab={activeTab}
            onNavigate={handleTabChange}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            onOpenSettings={() => setShowSettings(true)}
          />
      )}

      <main className="flex-1 relative overflow-hidden flex flex-col">
           {renderContent()}
      </main>

      {isMobile && (
        <nav className="h-20 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-black/10 dark:border-white/10 flex items-center justify-around px-2 z-[100] pb-4 fixed bottom-0 left-0 right-0">
          <ToolDockIcon active={activeTab === 'DASHBOARD'} onClick={() => handleTabChange('DASHBOARD')} icon={<LayoutDashboard size={20} />} label="Nexus" />
          <ToolDockIcon active={activeTab === 'NOTES'} onClick={() => handleTabChange('NOTES')} icon={<FileText size={20} />} label="Vault" />
          <ToolDockIcon active={activeTab === 'MONEY'} onClick={() => handleTabChange('MONEY')} icon={<Wallet size={20} />} label="Money" />
          <ToolDockIcon active={activeTab === 'ROUTINES'} onClick={() => handleTabChange('ROUTINES')} icon={<CheckCircle2 size={20} />} label="Rituals" />
          <ToolDockIcon active={activeTab === 'PLANS'} onClick={() => handleTabChange('PLANS')} icon={<Target size={20} />} label="Plans" />
        </nav>
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

const ToolDockIcon: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`group relative flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 w-full`}
  >
    <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white'}`}>
      {icon}
    </div>
    <span className={`text-[9px] uppercase font-bold tracking-widest ${active ? 'text-black dark:text-white' : 'text-black/30 dark:text-white/30'}`}>{label}</span>
  </button>
);

export default App;
