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

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <nav className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">WILL AI TAKE MY JOB?</div>

        {/* Desktop Navigation - Visible on desktop, hidden on mobile */}
        <div className="hidden md:flex space-x-4">
          <Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link>
          <Link href="/how-it-works" className="text-muted-foreground hover:text-primary">How It Works</Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link 
                  href="/about" 
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  href="/how-it-works" 
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </Link>
                <Link 
                  href="/contact" 
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}