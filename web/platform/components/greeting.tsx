import { useAuth } from '~/platform/lib/auth';

interface GreetingProps {
  userName?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

export function Greeting({ userName = 'Mr. Tan' }: GreetingProps) {
  const greeting = getGreeting();
  const { isLoggedIn } = useAuth();

  return (
    <h1 className="py-0 text-center text-2xl font-semibold text-foreground">
      {greeting}
      {isLoggedIn ? `, ${userName}` : ''}
    </h1>
  );
}
