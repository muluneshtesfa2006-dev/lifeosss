

export type BlockType = 'h1' | 'h2' | 'body' | 'checklist' | 'image' | 'sketch' | 'audio' | 'table';

export interface Block {
  id: string;
  type: BlockType;
  content: string; 
  checked?: boolean; 
  metadata?: {
    color?: string;
    width?: number;
    height?: number;
  };
}

export interface Note {
  id: string;
  title: string;
  folderId: string;
  blocks: Block[];
  updatedAt: string;
  createdAt: string;
  pinned: boolean;
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
}

export const DEFAULT_FOLDERS: Folder[] = [
  { id: 'all', name: 'All Notes', icon: 'Folder' },
  { id: 'personal', name: 'Personal', icon: 'User' },
  { id: 'work', name: 'Work', icon: 'Briefcase' },
  { id: 'spiritual', name: 'Spiritual', icon: 'Sparkles' },
];

// --- Routine & Gamification Types ---

export type StatCategory = 'Physical' | 'Mental' | 'Knowledge' | 'Spiritual' | 'Social' | 'Financial' | 'Career' | 'Lifestyle';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type RoutineFrequency = 'Daily' | 'Weekly' | 'Monthly';

export interface Subtask {
    id: string;
    title: string;
    description?: string; 
    completed: boolean;
}

export interface Routine {
  id: string;
  title: string;
  description?: string; 
  time: string; 
  category: StatCategory;
  xpReward: number;
  frequency: RoutineFrequency; // New field
  targetCount?: number; // For weekly/monthly (e.g., 3 times per week)
  subroutines?: Subtask[];
}

export interface TaskAttachment {
    id: string;
    name: string;
    type: 'image' | 'file' | 'link';
    url?: string;
}

export interface TaskComment {
    id: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean; // Legacy support (maps to status='done')
  date: string; 
  createdAt: number;
  category?: StatCategory; 
  priority?: TaskPriority;
  
  // New Detailed Fields
  description?: string;
  status?: TaskStatus; 
  subtasks?: Subtask[];
  tags?: string[];
  dueDate?: string;
  phase?: string; 
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
}

export interface RoutineLog {
  date: string; 
  routineId: string;
  completed: boolean;
  mood?: number; 
  completedSubtasks?: string[];
}

export interface DailyQuest {
  id: string;
  description: string;
  targetCategory?: StatCategory;
  targetCount: number;
  xpBonus: number;
  completedDates: string[]; 
}

export interface UserStats {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streak: number; 
  attributes: {
    physical: number;
    mental: number;
    knowledge: number;
    spiritual: number;
    social: number;
    financial?: number;
    career?: number;
    lifestyle?: number;
  };
}

// --- Journal Types ---
export interface JournalEntry {
  id: string;
  title?: string; 
  date: string; 
  blocks: Block[];
  mood: number; 
  tags: string[];
  photoOfTheDay?: string; 
  timeSpent?: number; 
  updatedAt: string;
}

// --- PLANS TYPES ---

export type PlanCategory = 'Physical' | 'Career' | 'Financial' | 'Lifestyle' | 'Skill';
export type ModuleType = 'TIMELINE' | 'BUDGET' | 'TIMER' | 'DATA_TABLE' | 'TODO' | 'NOTE';

export interface Attachment {
    id: string;
    type: 'link' | 'file' | 'image' | 'voice';
    content: string; // URL or Base64
    name: string;
}

export interface TableColumn {
    id: string;
    name: string;
    type: 'text' | 'number' | 'money' | 'tag' | 'status';
    options?: string[];
}

export interface PlanMilestone {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  status: 'todo' | 'doing' | 'done'; 
  attachments?: Attachment[];
  cost?: number; // Total Budget
  paid?: number; // Total Spent
  budgetType?: 'one-time' | 'recurring';
  budgetCategory?: string; 
  elapsedTime?: number; // Seconds
  isTimerRunning?: boolean;
  tableRowData?: Record<string, string>; 
}

export interface PlanPhase {
  id: string;
  title: string;
  type: ModuleType; 
  width: 'full' | 'half'; // New: Layout Control
  startDate: string; 
  endDate: string; 
  milestones: PlanMilestone[];
  color: string; 
  collapsed?: boolean;
  budgetLimit?: number; 
  tableColumns?: TableColumn[];
  content?: string; // For NOTE type
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  category: PlanCategory;
  startDate: string; 
  endDate: string; 
  phases: PlanPhase[];
  status: 'Active' | 'Completed' | 'Paused';
  createdAt: string;
  xpReward: number;
  priority?: 'High' | 'Medium' | 'Low'; 
}

// --- CALENDAR & ADVANCED TYPES ---

export interface AutomationRule {
    id: string;
    name: string;
    trigger: string;
    condition: string;
    action: string;
    active: boolean;
}

export interface RoutineStep {
    id: string;
    title: string;
    duration: number; // minutes
    dependencyId?: string; // ID of step that must complete first
    completed: boolean;
}

export interface PredictiveSlot {
    time: string;
    score: number; // 0-100
    reason: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    startTime?: string; // HH:MM
    endTime?: string; // HH:MM
    type: 'TASK' | 'ROUTINE_SUMMARY' | 'MANUAL' | 'PLAN_MILESTONE' | 'FOCUS_SESSION';
    color?: string;
    completed: boolean;
    metadata?: any;
    
    // Pro Features
    isPrivate?: boolean; // Privacy Guard
    steps?: RoutineStep[]; // Routine Orchestrator
    smartTrigger?: string; // Contextual Reminders
    sharedWith?: string[]; // Collaboration
}

// --- CANVASLAB TYPES (Whiteboard Engine V2) ---

export type CanvasObjectType = 'STICKY' | 'SHAPE' | 'TEXT' | 'FRAME' | 'CONNECTOR' | 'IMAGE' | 'PEN';
export type ShapeType = 'RECT' | 'CIRCLE' | 'DIAMOND' | 'ROUNDED' | 'TRIANGLE' | 'ELLIPSE' | 'HEXAGON' | 'STAR';

export type WhiteboardItemType = CanvasObjectType;

export interface WhiteboardItem {
  id: string;
  type: WhiteboardItemType;
  content?: string;
  color?: string;
}

export interface CanvasObject {
    id: string;
    type: CanvasObjectType;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    zIndex: number;
    
    // Style
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    opacity?: number;
    
    // Content
    text?: string; // Used for Title in structured shapes
    note?: string; // Used for Body/List in structured shapes
    
    // Typography
    textAlign?: 'left' | 'center' | 'right';
    fontSize?: number;
    fontFamily?: string;
    textColor?: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    headingLevel?: 'h1' | 'h2' | 'h3' | 'p';
    
    // Specifics
    shapeType?: ShapeType;
    frameId?: string; // Parent Frame (optional explicit linking)
    
    // Structure & Hierarchy
    groupId?: string;
    locked?: boolean;
    linkUrl?: string;
    
    // Metadata
    authorId?: string;
    createdAt?: string;
}

export interface CanvasBoard {
    id: string;
    title: string;
    objects: CanvasObject[];
    connections: CanvasConnection[];
    viewport: { x: number, y: number, zoom: number };
    version: number;
    lastModified: string;
    thumbnail?: string; 
}

export interface CanvasConnection {
    id: string;
    from: string; // Object ID
    to: string;   // Object ID
    type: 'STRAIGHT' | 'CURVED' | 'ELBOW';
    startArrow?: boolean;
    endArrow?: boolean;
    label?: string;
    color?: string;
    strokeWidth?: number;
    strokeStyle?: 'solid' | 'dashed';
}

// --- NOTEBOOK TYPES (Hybrid Workspace) ---
export type NotebookBlockType = 'h1' | 'h2' | 'h3' | 'paragraph' | 'bullet' | 'checkbox' | 'divider' | 'synthesis';

export interface NotebookBlock {
    id: string;
    type: NotebookBlockType;
    content: string;
    checked?: boolean;
    linkedBoardId?: string; // ID of the item on the whiteboard
    accentColor?: string; // Visual tag color if linked
}

export interface NotebookData {
    id: string;
    title: string;
    blocks: NotebookBlock[];
    updatedAt: string;
}

// --- FINANCIAL TRACKER TYPES ---

export type WalletType = 'CASH' | 'BANK' | 'CRYPTO' | 'MOBILE_MONEY' | 'SAVINGS' | 'INVESTMENT';
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type RecurringFrequency = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Wallet {
    id: string;
    name: string;
    type: WalletType;
    balance: number;
    currency: string;
    color: string;
    icon?: string;
    archived?: boolean;
    accountNumber?: string; // Optional (last 4 digits)
}

export interface FinanceTransaction {
    id: string;
    walletId: string;
    toWalletId?: string; // For transfers
    type: TransactionType;
    amount: number;
    category: string;
    date: string; // ISO Date YYYY-MM-DD
    note?: string;
    tags: string[];
    recurring: RecurringFrequency; 
    nextRecurringDate?: string; // If recurring, when is the next one due?
    createdAt: number;
}

export interface FinanceBudget {
    id: string;
    category: string;
    limit: number;
    spent: number;
    period: 'MONTHLY' | 'YEARLY';
    walletId?: string; // Optional: Budget per wallet
}

export interface FinancialGoal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    walletId?: string; // If linked to a specific savings wallet
    icon?: string;
    color?: string;
}

// --- IDENTITY TYPES ---

export interface UserIdentity {
    name: string;
    email?: string;
    phone?: string;
    socials?: {
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
    age: string;
    birthDate?: string; 
    mainGoal: string;
    obstacle: string;
    onboarded: boolean;
    profilePic?: string; // Stored as Base64 usually
}