interface GreetingProps {
  userName?: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) {
    return 'Good morning'
  } else if (hour < 17) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}

export function Greeting({ userName = 'Mr. Tan' }: GreetingProps) {
  const greeting = getGreeting()

  return (
    <h1 className="text-center text-2xl font-semibold text-foreground">
      {greeting}, {userName}
    </h1>
  )
}
