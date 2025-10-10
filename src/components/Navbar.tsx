import { ThemeToggle } from './ThemeToggle'

export function Navbar() {

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* App Title */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-foreground">
              Focus Notebook
            </h1>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

