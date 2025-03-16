"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import {
  Home,
  Key,
  Lock,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Trash2,
  Edit,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  ShieldAlert,
  Shield,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AddPasswordDialog } from "@/components/features/AddPasswordDialog"
import { EditPasswordDialog } from "@/components/features/EditPasswordDialog"
import { DeletePasswordDialog } from "@/components/features/DeletePasswordDialog"
import toast from "react-hot-toast"

// Types
interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  isActive?: boolean
}

interface Password {
  id: string
  siteName: string
  siteUrl: string
  username?: string
  decryptedPassword?: string
  category: "Personal" | "Work" | "Social" | "Finance" | "Shopping" | "Other"
  strength: "Vulnerable" | "Weak" | "Moderate" | "Strong"
  createdAt: string
}

// Strength color mapping
const strengthColors = {
  "Vulnerable": "text-red-500",
  "Weak": "text-orange-500",
  "Moderate": "text-yellow-500",
  "Strong": "text-green-500",
}

const strengthIcons = {
  "Vulnerable": ShieldAlert,
  "Weak": ShieldAlert,
  "Moderate": Shield,
  "Strong": Shield,
}

export default function PasswordListComponent() {
  // Navigation items for the sidebar
  const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    {
      title: "Passwords",
      href: "/dashboard/passwords",
      icon: Key,
      isActive: true,
    },
  ]

  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [strengthFilter, setStrengthFilter] = useState<string | null>(null)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { ref, inView } = useInView()
  const passwordTimeouts = useRef<Record<string, NodeJS.Timeout>>({})

  // Fetch passwords with infinite query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } = useInfiniteQuery({
    queryKey: ["passwords", searchQuery, categoryFilter, strengthFilter, sortField, sortOrder],
    queryFn: async ({ pageParam = 1 }) => {
      // Build query parameters
      const params = new URLSearchParams()
      params.append("page", pageParam.toString())

      if (searchQuery) params.append("search", searchQuery)
      if (categoryFilter) params.append("category", categoryFilter)
      if (strengthFilter) params.append("strength", strengthFilter)
      params.append("sortField", sortField)
      params.append("sortOrder", sortOrder)

      // Fetch passwords from API
      const response = await fetch(`/api/passwords?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch passwords")
      }

      const data = await response.json()
      return data.passwords || []
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
  })

  // Load more passwords when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Auto-hide passwords after reveal
  const revealPassword = useCallback((id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: true }))

    // Clear any existing timeout for this password
    if (passwordTimeouts.current[id]) {
      clearTimeout(passwordTimeouts.current[id])
    }

    // Set a new timeout to hide the password after 5 seconds
    passwordTimeouts.current[id] = setTimeout(() => {
      setVisiblePasswords((prev) => ({ ...prev, [id]: false }))
    }, 5000)
  }, [])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(passwordTimeouts.current).forEach((timeout) => {
        clearTimeout(timeout)
      })
    }
  }, [])

  // Copy to clipboard with security measures
  const copyToClipboard = useCallback((text: string, type: "password" | "username") => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${type === "password" ? "Password" : "Username"} copied to clipboard`, {
          duration: 3000,
          icon: "📋",
        })

        // If it's a password, schedule it to be cleared from clipboard after 30 seconds
        if (type === "password") {
          setTimeout(() => {
            // We can't actually clear the clipboard, but we can overwrite it with a space
            navigator.clipboard.writeText(" ").catch(() => {})
          }, 30000)
        }
      })
      .catch(() => {
        toast.error("Could not copy to clipboard. Please try again.", {
          duration: 3000,
        })
      })
  }, [])

  // Get favicon for a URL
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}`
    } catch {
      return "/placeholder.svg?height=16&width=16"
    }
  }

  // Handle password actions
  const handleEdit = (password: Password) => {
    setSelectedPassword(password)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (password: Password) => {
    setSelectedPassword(password)
    setIsDeleteDialogOpen(true)
  }

  const handleOpenUrl = (url: string) => {
    if (!url.startsWith("http")) {
      url = "https://" + url
    }
    window.open(url, "_blank", "noopener,noreferrer")
  }

  // Fetch a specific password to get the decrypted value
  const fetchPassword = async (id: string) => {
    try {
      const response = await fetch(`/api/passwords/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch password")
      }

      const data = await response.json()
      if (data.success && data.password) {
        return data.password.decryptedPassword
      }
      throw new Error("Password not found")
    } catch (error) {
      console.error("Error fetching password:", error)
      toast.error("Failed to fetch password. Please try again.")
      return null
    }
  }

  // Handle password reveal with decryption
  const handleRevealPassword = async (id: string) => {
    if (visiblePasswords[id]) {
      // If already visible, just hide it
      setVisiblePasswords((prev) => ({ ...prev, [id]: false }))
      return
    }

    // Fetch the decrypted password
    const decryptedPassword = await fetchPassword(id)
    if (decryptedPassword) {
      // Store the decrypted password temporarily
      const updatedPasswords = [...(data?.pages.flat() || [])]
      const passwordIndex = updatedPasswords.findIndex((p) => p.id === id)

      if (passwordIndex !== -1) {
        updatedPasswords[passwordIndex].decryptedPassword = decryptedPassword
      }

      // Show the password
      revealPassword(id)
    }
  }

  // Helper to get a readable label for the sort field
  const getSortLabel = (field: string) => {
    switch (field) {
      case "siteName":
        return "Site Name"
      case "createdAt":
        return "Date"
      case "category":
        return "Category"
      case "strength":
        return "Strength"
      default:
        return "Date"
    }
  }

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // If clicking the same field, toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // If clicking a different field, set it and default to descending order
      setSortField(field)
      setSortOrder("desc")
    }
  }

  // Flatten the pages of passwords
  const passwords = data?.pages.flat() || []

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border-b border-deepPurple/20">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  )

  // Render error state
  const renderError = () => (
    <div className="p-4 text-center">
      <ShieldAlert className="h-12 w-12 mx-auto text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-red-500">Error Loading Passwords</h2>
      <p className="mt-2 text-muted-foreground">Failed to load your passwords. Please try refreshing the page.</p>
      <Button variant="outline" className="mt-4" onClick={() => refetch()}>
        Try Again
      </Button>
    </div>
  )

  return (
    <SidebarProvider className="mt-12">
      {/* Sidebar */}
      <Sidebar collapsible="icon" className="mt-16">
        <SidebarContent>
          <SidebarMenu>
            <SidebarTrigger
              className="flex items-center justify-center h-10 w-10 rounded-full bg-deepPurple/40 hover:bg-deepPurple/80 transition-colors mx-2 my-1"
              aria-label="Toggle Sidebar"
            />
            <hr className="border border-synthwavePink w-full" />
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                  <a href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* Main Content */}
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-fancy font-bold">Password Manager</h1>
              <p className="text-muted-foreground">Securely manage and organize all your passwords</p>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="border-deepPurple/60">
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search passwords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 bg-background border-white"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={categoryFilter || "all"}
                    onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Social">Social</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={strengthFilter || "all"}
                    onValueChange={(value) => setStrengthFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Strength" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Strengths</SelectItem>
                      <SelectItem value="Strong">Strong</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Weak">Weak</SelectItem>
                      <SelectItem value="Vulnerable">Vulnerable</SelectItem>
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                        Sort: {getSortLabel(sortField)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSort("siteName")} className="flex justify-between">
                        Site Name
                        {sortField === "siteName" &&
                          (sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort("createdAt")} className="flex justify-between">
                        Date Created
                        {sortField === "createdAt" &&
                          (sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Table */}
          <Card className="border-deepPurple/60 shadow-md">
            <CardContent className="p-0">
              {isLoading ? (
                renderSkeleton()
              ) : isError ? (
                renderError()
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-cyberBlue cursor-pointer">
                          Site{" "}
                          {sortField === "siteName" &&
                            (sortOrder === "asc" ? (
                              <SortAsc className="inline h-3 w-3" />
                            ) : (
                              <SortDesc className="inline h-3 w-3" />
                            ))}
                        </TableHead>
                        <TableHead className="text-cyberBlue">Password</TableHead>
                        <TableHead className="text-cyberBlue cursor-pointer">
                          Category
                        </TableHead>
                        <TableHead className="text-cyberBlue cursor-pointer">
                          Strength
                        </TableHead>
                        <TableHead className="text-cyberBlue cursor-pointer text-center">
                          Created
                        </TableHead>
                        <TableHead className="text-right text-cyberBlue">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {passwords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">No passwords found</p>
                            {!searchQuery && !categoryFilter && (
                              <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Password
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        passwords.map((password) => (
                          <TableRow key={password.id} className="group hover:bg-deepPurple/5 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-deepPurple/10 flex items-center justify-center overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={
                                      getFavicon(password.siteUrl) ||
                                      "/placeholder.svg?height=16&width=16" ||
                                      "/placeholder.svg"
                                    }
                                    alt={password.siteName}
                                    className="h-4 w-4"
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=16&width=16"
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="font-medium font-fancy">{password.siteName}</div>
                                  <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                    {password.siteUrl}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="font-mono bg-cyberBlue/10 px-2 py-1 rounded text-white">
                                  {visiblePasswords[password.id] && password.decryptedPassword
                                    ? password.decryptedPassword
                                    : "••••••••"}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleRevealPassword(password.id)}
                                  aria-label={visiblePasswords[password.id] ? "Hide password" : "Show password"}
                                >
                                  {visiblePasswords[password.id] ? (
                                    <EyeOff className="h-3 w-3" />
                                  ) : (
                                    <Eye className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={async () => {
                                    // If password is not already decrypted, fetch it first
                                    if (!password.decryptedPassword) {
                                      const decryptedPassword = await fetchPassword(password.id)
                                      if (decryptedPassword) {
                                        copyToClipboard(decryptedPassword, "password")
                                      }
                                    } else {
                                      copyToClipboard(password.decryptedPassword, "password")
                                    }
                                  }}
                                  aria-label="Copy password"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{password.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {(() => {
                                  const StrengthIcon = strengthIcons[password.strength as keyof typeof strengthIcons]
                                  return <StrengthIcon className={cn("h-4 w-4", strengthColors[password.strength as keyof typeof strengthColors])} />
                                })()}
                                <span className={strengthColors[password.strength as keyof typeof strengthColors]}>{password.strength}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{new Date(password.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <span className="sr-only">Open menu</span>
                                    <svg
                                      width="15"
                                      height="15"
                                      viewBox="0 0 15 15"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                    >
                                      <path
                                        d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(password)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={async () => {
                                      // If password is not already decrypted, fetch it first
                                      if (!password.decryptedPassword) {
                                        const decryptedPassword = await fetchPassword(password.id)
                                        if (decryptedPassword) {
                                          copyToClipboard(decryptedPassword, "password")
                                        }
                                      } else {
                                        copyToClipboard(password.decryptedPassword, "password")
                                      }
                                    }}
                                  >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Password
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOpenUrl(password.siteUrl)}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Open Website
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-500 focus:text-red-500"
                                    onClick={() => handleDelete(password)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* Infinite scroll loader */}
                  {hasNextPage && (
                    <div ref={ref} className="flex justify-center p-4">
                      {isFetchingNextPage ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading more...</span>
                        </div>
                      ) : (
                        <Button variant="outline" onClick={() => fetchNextPage()}>
                          Load More
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Dialogs */}
      <AddPasswordDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          refetch()
          toast.success("Password added successfully", {
            icon: "🔐",
          })
        }}
      />

      {selectedPassword && (
        <>
          <EditPasswordDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            password={selectedPassword}
            onSuccess={() => {
              refetch()
              toast.success("Password updated successfully", {
                icon: "🔐",
              })
            }}
          />

          <DeletePasswordDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            passwordId={selectedPassword.id}
            siteName={selectedPassword.siteName}
            onSuccess={() => {
              refetch()
              toast.success("Password deleted successfully", {
                icon: "🗑️",
              })
            }}
          />
        </>
      )}
    </SidebarProvider>
  )
}
