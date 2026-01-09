import {
  BarChart3,
  BookOpen,
  Bot,
  Bus,
  Calendar,
  CircleDollarSign,
  ClipboardCheck,
  Compass,
  Ear,
  FileText,
  Gift,
  GraduationCap,
  Heart,
  Lightbulb,
  MapPin,
  MessageSquare,
  Network,
  PenTool,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AppColor = 'pink' | 'blue' | 'orange' | 'green' | 'purple'

export interface App {
  id: string
  name: string
  description: string
  icon: LucideIcon
  color: AppColor
  href: string
  badge?: string
}

export interface AppCategory {
  id: string
  title: string
  description: string
  apps: Array<App>
}

export const featuredApp: App = {
  id: 'featured-1',
  name: 'Student Dashboard',
  description: 'View and manage student information at a glance.',
  icon: Users,
  color: 'blue',
  href: '/students',
}

export const appCategories: Array<AppCategory> = [
  {
    id: 'classes-students',
    title: 'Classes and Students',
    description:
      'Tools for classroom management, student assessment, and academic support',
    apps: [
      {
        id: 'student-dashboard',
        name: 'Student Dashboard',
        description: 'View and manage student information at a glance.',
        icon: Users,
        color: 'blue',
        href: '/students',
      },
      {
        id: 'seconnect',
        name: 'SEConnect',
        description: 'Connecting students and educators',
        icon: Compass,
        color: 'blue',
        href: '/seconnect',
      },
      {
        id: 'attendance-scm',
        name: 'Attendance (SCM)',
        description: 'Streamlined attendance tracking',
        icon: ClipboardCheck,
        color: 'blue',
        href: '/attendance',
      },
      {
        id: 'markly',
        name: 'Mark.ly',
        description: 'Reimagining marking with AI',
        icon: PenTool,
        color: 'blue',
        href: '/markly',
      },
      {
        id: 'appraiser',
        name: 'Appraiser',
        description: 'AI-powered student testimonials in minutes',
        icon: FileText,
        color: 'blue',
        href: '/appraiser',
      },
      {
        id: 'sdis',
        name: 'Student Development Integrated System (SDIS)',
        description: 'Holistic student development tracking',
        icon: Users,
        color: 'pink',
        href: '/sdis',
      },
    ],
  },
  {
    id: 'parents-communications',
    title: 'Parents and Communications',
    description: 'Connect with parents and manage school-home communication',
    apps: [
      {
        id: 'all-ears',
        name: 'All Ears',
        description: 'Listen, support, empower',
        icon: Ear,
        color: 'pink',
        href: '/all-ears',
      },
      {
        id: 'pg-messages',
        name: 'PG Messages',
        description: 'Connecting parents and schools seamlessly',
        icon: MessageSquare,
        color: 'purple',
        href: '/pg-messages',
      },
      {
        id: 'heytalia',
        name: 'HeyTalia',
        description: 'Smart parent communication assistant',
        icon: Bot,
        color: 'purple',
        href: '/heytalia',
      },
    ],
  },
  {
    id: 'school-life-admin',
    title: 'School Life and Admin',
    description: 'Administrative tools and school management systems',
    apps: [
      {
        id: 'allocate',
        name: 'Allocate',
        description: 'Ensuring fair school placement',
        icon: Settings,
        color: 'blue',
        href: '/allocate',
      },
      {
        id: 'rpa',
        name: 'RPA (Robotic Process Automation)',
        description: 'Automating repetitive tasks',
        icon: Settings,
        color: 'green',
        href: '/rpa',
      },
      {
        id: 'student-learning-space',
        name: 'Student learning space',
        description: 'Transforming learning through technology',
        icon: GraduationCap,
        color: 'green',
        href: '/student-learning-space',
      },
      {
        id: 'oneplacement',
        name: 'OnePlacement (OP)',
        description: 'Seamless online school registration',
        icon: MapPin,
        color: 'green',
        href: '/oneplacement',
      },
      {
        id: 'goventry',
        name: 'GovEntry',
        description: 'Self-serve access validation made simple',
        icon: ShieldCheck,
        color: 'blue',
        href: '/goventry',
      },
      {
        id: 'ifaas',
        name: 'iFAAS',
        description: 'Streamlined financial operations',
        icon: CircleDollarSign,
        color: 'green',
        href: '/ifaas',
      },
      {
        id: 'ibens',
        name: 'iBENs',
        description: 'Managing staff benefits efficiently',
        icon: Gift,
        color: 'orange',
        href: '/ibens',
      },
      {
        id: 'oneschoolbus',
        name: 'OneSchoolBus (OSB)',
        description: 'All school bus operations on one platform',
        icon: Bus,
        color: 'orange',
        href: '/oneschoolbus',
      },
      {
        id: 'timetable',
        name: 'Timetable',
        description: 'Intelligent school scheduling made effortless',
        icon: Calendar,
        color: 'purple',
        href: '/timetable',
        badge: '3rd party',
      },
    ],
  },
  {
    id: 'growth-community',
    title: 'Growth and Community',
    description: 'Professional development and community engagement platforms',
    apps: [
      {
        id: 'glow',
        name: 'Glow',
        description: 'On-the-go professional learning',
        icon: Lightbulb,
        color: 'blue',
        href: '/glow',
      },
      {
        id: 'nlds',
        name: 'nLDS',
        description: 'Advancing educational innovation',
        icon: Network,
        color: 'blue',
        href: '/nlds',
      },
      {
        id: 'community',
        name: 'Community',
        description: 'Building connections across schools',
        icon: Heart,
        color: 'pink',
        href: '/community',
      },
    ],
  },
]
