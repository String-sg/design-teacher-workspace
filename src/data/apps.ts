import {
  BookOpen,
  Calendar,
  FileText,
  Heart,
  MessageSquare,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AppColor = 'pink' | 'blue' | 'orange'

export interface App {
  id: string
  name: string
  description: string
  icon: LucideIcon
  color: AppColor
  href: string
}

export interface AppCategory {
  id: string
  title: string
  apps: Array<App>
}

export const featuredApp: App = {
  id: 'featured-1',
  name: 'Student Dashboard',
  description: 'View and manage student information at a glance.',
  icon: Users,
  color: 'blue',
  href: '/student-dashboard',
}

export const appCategories: Array<AppCategory> = [
  {
    id: 'classroom-student',
    title: 'Classroom and Student',
    apps: [
      {
        id: 'app-1',
        name: 'Student Dashboard',
        description:
          'View and manage student information at a glance.',
        icon: Users,
        color: 'blue',
        href: '/student-dashboard',
      },
      {
        id: 'app-2',
        name: 'Student Wellness',
        description: 'Track and support student well-being and mental health.',
        icon: Heart,
        color: 'pink',
        href: '/student-wellness',
      },
      {
        id: 'app-3',
        name: 'Assessment Tools',
        description: 'Create, manage, and grade assessments with ease.',
        icon: FileText,
        color: 'orange',
        href: '/assessment-tools',
      },
      {
        id: 'app-4',
        name: 'Learning Resources',
        description: 'Access curated educational materials and lesson plans.',
        icon: BookOpen,
        color: 'blue',
        href: '/learning-resources',
      },
      {
        id: 'app-5',
        name: 'Student Progress',
        description: 'Monitor and analyze student academic progress over time.',
        icon: Calendar,
        color: 'blue',
        href: '/student-progress',
      },
      {
        id: 'app-6',
        name: 'Behavior Tracking',
        description: 'Record and manage student behavior and conduct.',
        icon: FileText,
        color: 'blue',
        href: '/behavior-tracking',
      },
    ],
  },
  {
    id: 'parent-communication',
    title: 'Parent and communication',
    apps: [
      {
        id: 'app-7',
        name: 'Parent Connect',
        description: 'Communicate with parents and guardians effectively.',
        icon: MessageSquare,
        color: 'pink',
        href: '/parent-connect',
      },
      {
        id: 'app-8',
        name: 'Announcements',
        description: 'Send important announcements to parents and students.',
        icon: Heart,
        color: 'pink',
        href: '/announcements',
      },
      {
        id: 'app-9',
        name: 'Meeting Scheduler',
        description: 'Schedule and manage parent-teacher meetings.',
        icon: Calendar,
        color: 'orange',
        href: '/meeting-scheduler',
      },
    ],
  },
]
