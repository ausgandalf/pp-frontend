'use client'

import * as React from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { toast as sonnerToast } from 'sonner'
import { z } from 'zod'
import {
  Calendar as CalendarIcon,
  Info,
  Mail,
  MoreHorizontal,
  Plus,
  User,
} from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Kbd } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Toaster as RadixToaster } from '@/components/ui/toaster'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const chartDemo = [
  { month: 'Jan', total: 12 },
  { month: 'Feb', total: 8 },
  { month: 'Mar', total: 15 },
]

const chartConfig = {
  total: { label: 'Total', color: 'var(--chart-1)' },
} satisfies import('@/components/ui/chart').ChartConfig

const showcaseNav = [
  { id: 'ui-accordion', label: 'accordion' },
  { id: 'ui-alert-dialog', label: 'alert-dialog' },
  { id: 'ui-alert', label: 'alert' },
  { id: 'ui-aspect-ratio', label: 'aspect-ratio' },
  { id: 'ui-avatar', label: 'avatar' },
  { id: 'ui-badge', label: 'badge' },
  { id: 'ui-breadcrumb', label: 'breadcrumb' },
  { id: 'ui-button-group', label: 'button-group' },
  { id: 'ui-button', label: 'button' },
  { id: 'ui-calendar', label: 'calendar' },
  { id: 'ui-card', label: 'card' },
  { id: 'ui-carousel', label: 'carousel' },
  { id: 'ui-chart', label: 'chart' },
  { id: 'ui-checkbox', label: 'checkbox' },
  { id: 'ui-collapsible', label: 'collapsible' },
  { id: 'ui-command', label: 'command' },
  { id: 'ui-context-menu', label: 'context-menu' },
  { id: 'ui-dialog', label: 'dialog' },
  { id: 'ui-drawer', label: 'drawer' },
  { id: 'ui-dropdown-menu', label: 'dropdown-menu' },
  { id: 'ui-empty', label: 'empty' },
  { id: 'ui-field', label: 'field' },
  { id: 'ui-form', label: 'form' },
  { id: 'ui-hover-card', label: 'hover-card' },
  { id: 'ui-input-group', label: 'input-group' },
  { id: 'ui-input-otp', label: 'input-otp' },
  { id: 'ui-input', label: 'input' },
  { id: 'ui-item', label: 'item' },
  { id: 'ui-kbd', label: 'kbd' },
  { id: 'ui-label', label: 'label' },
  { id: 'ui-menubar', label: 'menubar' },
  { id: 'ui-navigation-menu', label: 'navigation-menu' },
  { id: 'ui-pagination', label: 'pagination' },
  { id: 'ui-popover', label: 'popover' },
  { id: 'ui-progress', label: 'progress' },
  { id: 'ui-radio-group', label: 'radio-group' },
  { id: 'ui-resizable', label: 'resizable' },
  { id: 'ui-scroll-area', label: 'scroll-area' },
  { id: 'ui-select', label: 'select' },
  { id: 'ui-separator', label: 'separator' },
  { id: 'ui-sheet', label: 'sheet' },
  { id: 'ui-sidebar', label: 'sidebar' },
  { id: 'ui-skeleton', label: 'skeleton' },
  { id: 'ui-slider', label: 'slider' },
  { id: 'ui-sonner', label: 'sonner' },
  { id: 'ui-spinner', label: 'spinner' },
  { id: 'ui-switch', label: 'switch' },
  { id: 'ui-table', label: 'table' },
  { id: 'ui-tabs', label: 'tabs' },
  { id: 'ui-textarea', label: 'textarea' },
  { id: 'ui-toast', label: 'toast' },
  { id: 'ui-toaster', label: 'toaster' },
  { id: 'ui-toggle-group', label: 'toggle-group' },
  { id: 'ui-toggle', label: 'toggle' },
  { id: 'ui-tooltip', label: 'tooltip' },
  { id: 'ui-use-mobile', label: 'use-mobile' },
] as const

function Section({
  id,
  title,
  file,
  children,
  className,
}: {
  id: string
  title: string
  file: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card id={id} className={cn('scroll-mt-24 py-4', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">components/ui/{file}</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

const formSchema = z.object({
  demo: z.string().min(2, 'At least 2 characters.'),
})

function FormDemo() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { demo: '' },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="max-w-sm space-y-4">
        <FormField
          control={form.control}
          name="demo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demo field</FormLabel>
              <FormControl>
                <Input placeholder="Type here…" {...field} />
              </FormControl>
              <FormDescription>react-hook-form + Form primitives.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm">
          Submit (no-op)
        </Button>
      </form>
    </Form>
  )
}

export function DesignUiShowcase() {
  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(new Date())
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [collapsibleOpen, setCollapsibleOpen] = React.useState(false)

  return (
    <>
      <RadixToaster />

      <div className="sticky top-0 z-40 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:-mx-0 md:px-0">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Jump to</p>
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex w-max flex-wrap gap-1.5 pb-1">
            {showcaseNav.map((item) => (
              <Button key={item.id} variant="outline" size="sm" className="h-7 shrink-0 px-2 text-xs" asChild>
                <a href={`#${item.id}`}>{item.label}</a>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="mt-10 grid gap-6">
        <Section id="ui-accordion" title="Accordion" file="accordion.tsx">
          <Accordion type="single" collapsible className="w-full max-w-md">
            <AccordionItem value="a">
              <AccordionTrigger>First item</AccordionTrigger>
              <AccordionContent>Content for the first panel.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Second item</AccordionTrigger>
              <AccordionContent>Content for the second panel.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        <Section id="ui-alert-dialog" title="Alert dialog" file="alert-dialog.tsx">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                Open alert dialog
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Section>

        <Section id="ui-alert" title="Alert" file="alert.tsx">
          <Alert>
            <Info className="size-4" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>Default alert styling.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <Info className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Destructive variant.</AlertDescription>
          </Alert>
        </Section>

        <Section id="ui-aspect-ratio" title="Aspect ratio" file="aspect-ratio.tsx">
          <div className="w-full max-w-sm overflow-hidden rounded-md border">
            <AspectRatio ratio={16 / 9}>
              <div className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
                16:9
              </div>
            </AspectRatio>
          </div>
        </Section>

        <Section id="ui-avatar" title="Avatar" file="avatar.tsx">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="" alt="Demo" />
              <AvatarFallback>PP</AvatarFallback>
            </Avatar>
            <Avatar className="size-12">
              <AvatarFallback>LG</AvatarFallback>
            </Avatar>
          </div>
        </Section>

        <Section id="ui-badge" title="Badge" file="badge.tsx">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Section>

        <Section id="ui-breadcrumb" title="Breadcrumb" file="breadcrumb.tsx">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/design">Design</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Showcase</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Section>

        <Section id="ui-button-group" title="Button group" file="button-group.tsx">
          <ButtonGroup>
            <ButtonGroupText>https://</ButtonGroupText>
            <ButtonGroupSeparator />
            <Input className="min-w-[8rem] rounded-none border-0 shadow-none" placeholder="example.com" />
            <ButtonGroupSeparator />
            <Button size="sm" className="rounded-l-none">
              Go
            </Button>
          </ButtonGroup>
        </Section>

        <Section id="ui-button" title="Button" file="button.tsx">
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Default</Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Button size="sm" variant="outline">
              Outline
            </Button>
            <Button size="sm" variant="ghost">
              Ghost
            </Button>
            <Button size="sm" variant="link">
              Link
            </Button>
            <Button size="sm" variant="destructive">
              Destructive
            </Button>
          </div>
        </Section>

        <Section id="ui-calendar" title="Calendar" file="calendar.tsx">
          <Calendar mode="single" selected={calendarDate} onSelect={setCalendarDate} className="rounded-md border" />
        </Section>

        <Section id="ui-card" title="Card" file="card.tsx">
          <Card className="max-w-sm border-dashed">
            <CardHeader>
              <CardTitle>Nested card</CardTitle>
              <CardDescription>CardTitle, CardDescription, CardFooter.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">CardContent area.</CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
        </Section>

        <Section id="ui-carousel" title="Carousel" file="carousel.tsx">
          <Carousel className="max-w-xs">
            <CarouselContent>
              {[1, 2, 3].map((i) => (
                <CarouselItem key={i}>
                  <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted p-6">
                    <span className="text-2xl font-semibold">{i}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </Section>

        <Section id="ui-chart" title="Chart" file="chart.tsx">
          <ChartContainer config={chartConfig} className="h-[200px] w-full max-w-md">
            <BarChart accessibilityLayer data={chartDemo}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            </BarChart>
          </ChartContainer>
        </Section>

        <Section id="ui-checkbox" title="Checkbox" file="checkbox.tsx">
          <div className="flex items-center gap-2">
            <Checkbox id="c1" defaultChecked />
            <Label htmlFor="c1">Checked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="c2" />
            <Label htmlFor="c2">Unchecked</Label>
          </div>
        </Section>

        <Section id="ui-collapsible" title="Collapsible" file="collapsible.tsx">
          <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className="max-w-md space-y-2">
            <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3">
              <span className="text-sm font-medium">@peduarte starred 3 repositories</span>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {collapsibleOpen ? 'Hide' : 'Show'}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2 text-sm text-muted-foreground">
              <p>Hidden content goes here.</p>
            </CollapsibleContent>
          </Collapsible>
        </Section>

        <Section id="ui-command" title="Command" file="command.tsx">
          <Button variant="outline" size="sm" onClick={() => setCommandOpen(true)}>
            Open command palette
          </Button>
          <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <CommandInput placeholder="Search…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem onSelect={() => setCommandOpen(false)}>
                  Calendar
                  <CommandShortcut>⌘C</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => setCommandOpen(false)}>
                  Settings
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="More">
                <CommandItem>Help</CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
          <div className="rounded-md border">
            <Command className="max-h-48">
              <CommandInput placeholder="Inline command…" />
              <CommandList>
                <CommandEmpty>No matches.</CommandEmpty>
                <CommandGroup heading="Items">
                  <CommandItem>Profile</CommandItem>
                  <CommandItem>Billing</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </Section>

        <Section id="ui-context-menu" title="Context menu" file="context-menu.tsx">
          <ContextMenu>
            <ContextMenuTrigger className="flex h-24 max-w-md items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              Right-click here
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Back</ContextMenuItem>
              <ContextMenuItem>Forward</ContextMenuItem>
              <ContextMenuItem>Reload</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </Section>

        <Section id="ui-dialog" title="Dialog" file="dialog.tsx">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Open dialog
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog title</DialogTitle>
                <DialogDescription>Short description of what this dialog does.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section id="ui-drawer" title="Drawer" file="drawer.tsx">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm">
                Open drawer
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Drawer</DrawerTitle>
                <DrawerDescription>Mobile-style panel from the bottom.</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button size="sm">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Section>

        <Section id="ui-dropdown-menu" title="Dropdown menu" file="dropdown-menu.tsx">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Open menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        <Section id="ui-empty" title="Empty" file="empty.tsx">
          <Empty className="max-w-md border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarIcon />
              </EmptyMedia>
              <EmptyTitle>No results</EmptyTitle>
              <EmptyDescription>Try adjusting your search.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">Clear filters</Button>
            </EmptyContent>
          </Empty>
        </Section>

        <Section id="ui-field" title="Field" file="field.tsx">
          <FieldSet className="max-w-md">
            <FieldLegend>Notifications</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="f-email">Email</FieldLabel>
                <Input id="f-email" type="email" placeholder="you@example.com" />
                <FieldDescription>We will never share your email.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </Section>

        <Section id="ui-form" title="Form" file="form.tsx">
          <FormDemo />
        </Section>

        <Section id="ui-hover-card" title="Hover card" file="hover-card.tsx">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="h-auto p-0 text-foreground">
                @platinum
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>PP</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Platinum Pitches</p>
                  <p className="text-xs text-muted-foreground">Hover card preview.</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Section>

        <Section id="ui-input-group" title="Input group" file="input-group.tsx">
          <InputGroup className="max-w-md">
            <InputGroupAddon>
              <Mail className="size-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Email" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" variant="ghost">
                <MoreHorizontal className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup className="max-w-md">
            <InputGroupAddon>
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="domain.com" />
          </InputGroup>
        </Section>

        <Section id="ui-input-otp" title="Input OTP" file="input-otp.tsx">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </Section>

        <Section id="ui-input" title="Input" file="input.tsx">
          <Input className="max-w-sm" placeholder="Text input" />
        </Section>

        <Section id="ui-item" title="Item" file="item.tsx">
          <ItemGroup className="max-w-md rounded-lg border">
            <Item>
              <ItemMedia variant="icon">
                <User className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Profile</ItemTitle>
                <ItemDescription>Manage your account.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm" variant="outline">
                  Open
                </Button>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>Compact row</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </Section>

        <Section id="ui-kbd" title="Kbd" file="kbd.tsx">
          <p className="text-sm text-muted-foreground">
            Save with <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
          </p>
        </Section>

        <Section id="ui-label" title="Label" file="label.tsx">
          <div className="space-y-2">
            <Label htmlFor="lbl">Example label</Label>
            <Input id="lbl" className="max-w-sm" placeholder="Associated input" />
          </div>
        </Section>

        <Section id="ui-menubar" title="Menubar" file="menubar.tsx">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Share</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Undo</MenubarItem>
                <MenubarItem>Redo</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </Section>

        <Section id="ui-navigation-menu" title="Navigation menu" file="navigation-menu.tsx">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 md:w-[200px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="#" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Introduction</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Overview.</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="#" className="bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Docs
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Section>

        <Section id="ui-pagination" title="Pagination" file="pagination.tsx">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Section>

        <Section id="ui-popover" title="Popover" file="popover.tsx">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Open popover
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="start">
              <p className="text-sm">Popover body content.</p>
            </PopoverContent>
          </Popover>
        </Section>

        <Section id="ui-progress" title="Progress" file="progress.tsx">
          <Progress value={45} className="max-w-xs" />
        </Section>

        <Section id="ui-radio-group" title="Radio group" file="radio-group.tsx">
          <RadioGroup defaultValue="a" className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="a" id="r-a" />
              <Label htmlFor="r-a">Option A</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="b" id="r-b" />
              <Label htmlFor="r-b">Option B</Label>
            </div>
          </RadioGroup>
        </Section>

        <Section id="ui-resizable" title="Resizable" file="resizable.tsx">
          <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border md:min-h-[120px]">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6 text-sm">Panel A</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6 text-sm">Panel B</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Section>

        <Section id="ui-scroll-area" title="Scroll area" file="scroll-area.tsx">
          <ScrollArea className="h-32 max-w-md rounded-md border">
            <div className="space-y-2 p-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <p key={i} className="text-sm leading-relaxed">
                  Line {i + 1} — scroll inside the box.
                </p>
              ))}
            </div>
          </ScrollArea>
        </Section>

        <Section id="ui-select" title="Select" file="select.tsx">
          <Select defaultValue="apple">
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Pick one" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
          </Select>
        </Section>

        <Section id="ui-separator" title="Separator" file="separator.tsx">
          <div className="space-y-2">
            <p className="text-sm">Above</p>
            <Separator />
            <p className="text-sm">Below</p>
          </div>
        </Section>

        <Section id="ui-sheet" title="Sheet" file="sheet.tsx">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Open sheet
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet title</SheetTitle>
                <SheetDescription>Side panel content.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </Section>

        <Section id="ui-sidebar" title="Sidebar" file="sidebar.tsx">
          <p className="text-sm text-muted-foreground">
            Static layout with <code className="font-mono text-xs">collapsible=&quot;none&quot;</code> (avoids fixed
            positioning in this demo).
          </p>
          <div className="h-56 overflow-hidden rounded-lg border">
            <SidebarProvider className="min-h-0! flex h-full min-h-56">
              <Sidebar collapsible="none" className="border-r">
                <SidebarHeader>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Plus className="size-4" />
                        <span>New</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton>Settings</SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
              <SidebarInset className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
                  <SidebarTrigger />
                  <span className="text-sm font-medium">Main</span>
                </header>
                <main className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
                  Content
                </main>
              </SidebarInset>
            </SidebarProvider>
          </div>
        </Section>

        <Section id="ui-skeleton" title="Skeleton" file="skeleton.tsx">
          <div className="flex max-w-xs items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </Section>

        <Section id="ui-slider" title="Slider" file="slider.tsx">
          <Slider defaultValue={[40]} max={100} step={1} className="max-w-xs" />
        </Section>

        <Section id="ui-sonner" title="Sonner (toast)" file="sonner.tsx">
          <p className="text-sm text-muted-foreground">
            Uses the app root <code className="font-mono text-xs">Toaster</code> from <code className="font-mono text-xs">components/ui/sonner.tsx</code>.
          </p>
          <Button size="sm" variant="outline" onClick={() => sonnerToast.success('Hello from Sonner')}>
            Show Sonner toast
          </Button>
        </Section>

        <Section id="ui-spinner" title="Spinner" file="spinner.tsx">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-5 text-primary" />
            Loading…
          </div>
        </Section>

        <Section id="ui-switch" title="Switch" file="switch.tsx">
          <div className="flex items-center gap-2">
            <Switch id="sw" defaultChecked />
            <Label htmlFor="sw">Airplane mode</Label>
          </div>
        </Section>

        <Section id="ui-table" title="Table" file="table.tsx">
          <div className="rounded-md border">
            <Table>
              <TableCaption>Sample caption.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Alpha</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beta</TableCell>
                  <TableCell>Pending</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Section>

        <Section id="ui-tabs" title="Tabs" file="tabs.tsx">
          <Tabs defaultValue="one" className="max-w-md">
            <TabsList>
              <TabsTrigger value="one">One</TabsTrigger>
              <TabsTrigger value="two">Two</TabsTrigger>
            </TabsList>
            <TabsContent value="one" className="text-sm text-muted-foreground">
              First tab content.
            </TabsContent>
            <TabsContent value="two" className="text-sm text-muted-foreground">
              Second tab content.
            </TabsContent>
          </Tabs>
        </Section>

        <Section id="ui-textarea" title="Textarea" file="textarea.tsx">
          <Textarea className="max-w-md" placeholder="Multiline text…" rows={3} />
        </Section>

        <Section id="ui-toast" title="Toast (primitives)" file="toast.tsx">
          <p className="text-sm text-muted-foreground">
            Low-level <code className="font-mono text-xs">Toast*</code> primitives; you normally trigger via{' '}
            <code className="font-mono text-xs">useToast</code> + <code className="font-mono text-xs">Toaster</code> below.
          </p>
        </Section>

        <Section id="ui-toaster" title="Toaster" file="toaster.tsx">
          <Button size="sm" variant="outline" onClick={() => toast({ title: 'Saved', description: 'Radix toast demo.' })}>
            Show Radix toast
          </Button>
        </Section>

        <Section id="ui-toggle" title="Toggle" file="toggle.tsx">
          <Toggle aria-label="Toggle italic" size="sm" variant="outline">
            B
          </Toggle>
        </Section>

        <Section id="ui-toggle-group" title="Toggle group" file="toggle-group.tsx">
          <ToggleGroup type="single" defaultValue="left" size="sm" variant="outline">
            <ToggleGroupItem value="left" aria-label="Left">
              Left
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Center">
              Center
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Right">
              Right
            </ToggleGroupItem>
          </ToggleGroup>
        </Section>

        <Section id="ui-tooltip" title="Tooltip" file="tooltip.tsx">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Hover me
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </Section>

        <Section id="ui-use-mobile" title="use-mobile" file="use-mobile.tsx">
          <p className="text-sm text-muted-foreground">
            This file exports <code className="font-mono text-xs">useIsMobile</code> for client components. Prefer{' '}
            <code className="font-mono text-xs">hooks/use-mobile.ts</code> where the sidebar imports it from—same hook
            pattern, not a visual primitive.
          </p>
        </Section>
      </div>
    </>
  )
}
