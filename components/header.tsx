// components/header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

const navItems = [
  { href: '/about', label: 'About Us' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo - smaller on mobile */}
          <Link href="/" className="flex items-center">
            <span className="text-lg md:text-xl font-bold whitespace-nowrap">WILL AI TAKE MY JOB?</span>
          </Link>

          {/* Desktop Navigation - completely hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild>
              <Link href="/assessment">Start Assessment</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button - only shown on mobile */}
          <div className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="ml-2"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col space-y-6 mt-12">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        pathname === item.href
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                    <Link href="/assessment">Start Assessment</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}