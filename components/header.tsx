"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface HeaderProps {
  session: {
    user?: {
      name?: string;
      image?: string;
      role?: string;
    };
  } | null;
  isAdmin: boolean;
}

export default function Header({ session, isAdmin }: HeaderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          setTimeout(() => {
            router.refresh();
          }, 1000);
        },
      },
    });
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md text-white transition-colors">
      <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          
          <button 
            className="md:hidden flex items-center justify-center p-2 -ml-2 text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer" 
            aria-label="Open Menu"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="right" className="w-80 sm:w-96 overflow-y-auto bg-black text-white border-white/10 z-[100]">
              <div className="space-y-6 px-4 pt-6">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <span className="text-2xl font-bold tracking-tight">
                    zetu<span className="font-light text-white/70">Tech</span>
                  </span>
                </Link>

                {session && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <Avatar className="w-8 h-8 border border-white/20">
                      <AvatarImage src={session.user?.image || ""} />
                      <AvatarFallback className="bg-black text-white">{session.user?.name?.charAt(0) || <User size={16} />}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{session.user?.name}</p>
                      <p className="text-xs text-white/50 capitalize">{session.user?.role || "admin"}</p>
                    </div>
                  </div>
                )}

                <nav className="space-y-1">
                  <Link href="/" onClick={() => setIsOpen(false)} className="block rounded-md hover:bg-white/10 p-2 font-medium">Home</Link>
                  <Link href="/about" onClick={() => setIsOpen(false)} className="block rounded-md hover:bg-white/10 p-2 font-medium">About Us</Link>
                  <Link href="/services" onClick={() => setIsOpen(false)} className="block rounded-md hover:bg-white/10 p-2 font-medium">Services</Link>
                  <Link href="/contact" onClick={() => setIsOpen(false)} className="block rounded-md hover:bg-white/10 p-2 font-medium">Contact</Link>
                </nav>
                
                {!session && (
                  <div className="pt-4 border-t border-white/10">
                    <Button asChild className="w-full bg-white text-black hover:bg-white/90" onClick={() => setIsOpen(false)}>
                      <Link href="/contact">Get in Touch</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="text-2xl font-bold tracking-tight text-white flex-shrink-0">
            zetu<span className="font-light text-white/70">Tech</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center space-x-12">
          <Link href="/" className="text-xs uppercase tracking-widest font-medium text-white/60 hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="text-xs uppercase tracking-widest font-medium text-white/60 hover:text-white transition-colors">About Us</Link>
          <Link href="/services" className="text-xs uppercase tracking-widest font-medium text-white/60 hover:text-white transition-colors">Services</Link>
          <Link href="/contact" className="text-xs uppercase tracking-widest font-medium text-white/60 hover:text-white transition-colors">Contact</Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 hover:bg-white/10 text-white">
                  <Avatar className="w-8 h-8 border border-white/20">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-black text-white">{session.user?.name?.charAt(0) || <User size={16} />}</AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline font-medium">{session.user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-black border-white/10 text-white">
                <DropdownMenuLabel>
                  {session.user?.name || "User"}
                  <div className="text-xs text-white/50 capitalize font-normal mt-1">{session.user?.role || "admin"}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white"><Link href="/admin-dashboard" className="cursor-pointer">Admin Dashboard</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                  </>
                )}
                <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:text-red-400 focus:bg-red-950/50 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="hidden md:flex bg-white hover:bg-white/90 text-black text-xs uppercase tracking-widest px-6 py-5 rounded-none font-medium">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          )}
        </div>

      </div>
    </header>
  );
}