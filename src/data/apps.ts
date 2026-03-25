import {
  Briefcase,
  CircleDollarSign,

  Gift,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AppColor = 'pink' | 'blue' | 'orange' | 'green' | 'purple'

export interface App {
  id: string
  name: string
  description: string
  icon: LucideIcon | string
  color: AppColor
  href: string
  badge?: string
  iconPadding?: 'none' | 'sm' | 'md'
}

export interface AppCategory {
  id: string
  title: string
  description: string
  apps: Array<App>
}

export const featuredApp: App = {
  id: 'featured-students',
  name: 'Students',
  description: 'Key data to understand your students holistically.',
  icon: '/logos/Student-logo.svg',
  color: 'purple',
  href: '/students',
  badge: 'Beta',
  iconPadding: 'sm',
}

export const appCategories: Array<AppCategory> = [
  {
    id: 'daily-recommended',
    title: 'Essentials',
    description: 'Your most essential daily tools and recommended apps',
    apps: [
      {
        id: 'school-cockpit',
        name: 'School Cockpit',
        description:
          'Your central hub for school management and daily operations',
        icon: '/logos/School-cockpit.svg',
        color: 'blue',
        href: '/school-cockpit',
      },
      {
        id: 'sc-mobile',
        name: 'SC Mobile',
        description: 'Streamlined attendance tracking on the go',
        icon: '/logos/sc-mobile.png',
        color: 'blue',
        href: '/sc-mobile',
        iconPadding: 'md',
      },
      {
        id: 'sls',
        name: 'SLS',
        description: 'Transforming learning through technology',
        icon: '/logos/SLS.svg',
        color: 'green',
        href: '/sls',
        iconPadding: 'none',
      },
    ],
  },
  {
    id: 'student-information',
    title: 'Student Information',
    description: 'Access and manage student data and records',
    apps: [
      {
        id: 'all-ears',
        name: 'All Ears',
        description: 'Listen, support, empower',
        icon: '/logos/ae-logo.png',
        color: 'pink',
        href: '/all-ears',
      },
      {
        id: 'formsg',
        name: 'FormSG',
        description: 'Build government forms in minutes',
        icon: '/logos/formsg.png',
        color: 'blue',
        href: '/formsg',
        iconPadding: 'md',
      },
      {
        id: 'sdt-data-tool',
        name: 'Students',
        description: 'Key data to understand your students holistically',
        icon: '/logos/Student-logo.svg',
        color: 'blue',
        href: '/students',
        iconPadding: 'sm',
      },
    ],
  },
  {
    id: 'ai-productivity',
    title: 'AI Productivity Tools',
    description: 'AI-powered tools to boost your productivity',
    apps: [
      {
        id: 'heytalia',
        name: 'HeyTalia',
        description: 'Smart parent communication assistant',
        icon: '/logos/heytalia-icon.png',
        color: 'purple',
        href: '/heytalia',
      },
    ],
  },
  {
    id: 'teaching-learning',
    title: 'Teaching & Learning',
    description: 'Tools for teaching, assessment, and learning support',
    apps: [
      {
        id: 'langbuddy',
        name: 'LangBuddy',
        description: 'AI-powered language learning companion',
        icon: '/logos/langbuddy-square-with-text-blue.png',
        color: 'blue',
        href: '/langbuddy',
        iconPadding: 'none',
      },
      {
        id: 'markly',
        name: 'Mark.ly',
        description: 'Reimagining marking with AI',
        icon: '/logos/Markly.svg',
        color: 'blue',
        href: '/markly',
        iconPadding: 'none',
      },
      {
        id: 'appraiser',
        name: 'Appraiser',
        description: 'AI-powered student testimonials in minutes',
        icon: '/logos/appraiser-logo.svg',
        color: 'blue',
        href: '/appraiser',
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Administrative and school management tools',
    apps: [
      {
        id: 'workpal',
        name: 'Workpal',
        description: 'Your workplace management companion',
        icon: Briefcase,
        color: 'blue',
        href: '/workpal',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'Financial management and staff benefits',
    apps: [
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
        name: 'iBENS',
        description: 'Managing staff benefits efficiently',
        icon: Gift,
        color: 'orange',
        href: '/ibens',
      },
    ],
  },
  {
    id: 'professional-development',
    title: 'Professional Development',
    description: 'Professional growth and learning platforms',
    apps: [
      {
        id: 'opal',
        name: 'OPAL',
        description: 'One-stop portal for professional learning',
        icon: '/logos/Opal.svg',
        color: 'blue',
        href: '/opal',
        iconPadding: 'none',
      },
      {
        id: 'glow',
        name: 'Glow',
        description: 'On-the-go professional learning',
        icon: '/logos/glow-logo.svg',
        color: 'blue',
        href: '/glow',
      },
    ],
  },
]
