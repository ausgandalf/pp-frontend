'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Search, MapPin, Calendar as CalendarIcon, Users } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { cn } from '@/lib/utils'

interface SearchFormProps {
  variant?: 'hero' | 'compact'
  className?: string
}

export function SearchForm({ variant = 'hero', className }: SearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined
  )
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined
  )
  const [guests, setGuests] = useState(searchParams.get('guests') || '2')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (checkIn) params.set('checkIn', format(checkIn, 'yyyy-MM-dd'))
    if (checkOut) params.set('checkOut', format(checkOut, 'yyyy-MM-dd'))
    if (guests) params.set('guests', guests)
    router.push(`/parks?${params.toString()}`)
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className={cn("flex items-center gap-2", className)}>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch} className={cn("bg-card rounded-xl shadow-lg p-2", className)}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-11 h-14 border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Check In */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-14 justify-start text-left font-normal border-0",
                !checkIn && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {checkIn ? format(checkIn, 'MMM dd, yyyy') : 'Check in'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={(date) => {
                setCheckIn(date)
                if (date && (!checkOut || checkOut <= date)) {
                  setCheckOut(addDays(date, 1))
                }
              }}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Check Out */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-14 justify-start text-left font-normal border-0",
                !checkOut && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {checkOut ? format(checkOut, 'MMM dd, yyyy') : 'Check out'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={(date) => date < (checkIn ? addDays(checkIn, 1) : new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Guests & Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="number"
              min="1"
              max="20"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="pl-11 h-14 border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Guests"
            />
          </div>
          <Button type="submit" size="lg" className="h-14 px-6">
            <Search className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Search</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
