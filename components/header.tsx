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
  { href: '/', label: 'Home' },
  { href: '/assessment', label: 'Assessment' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">WILL AI TAKE MY JOB?</span>
          </Link>
          <nav className="hidden md:flex gap-6">
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
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Button asChild>
              <Link href="/assessment">Start Assessment</Link>
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-base hover:bg-transparent focus:ring-0 md:hidden"
                >
                  <Menu />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pr-0">
                <nav className="flex flex-col gap-4">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === item.href
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button asChild>
                    <Link href="/assessment" onClick={() => setIsOpen(false)}>
                      Start Assessment
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  )
}

