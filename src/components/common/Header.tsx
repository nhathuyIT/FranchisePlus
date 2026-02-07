import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FileText, LogOut, Settings, User, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

const Header = () => {
  const { authUser, logout, isAdmin } = useAuthStore();
  const user = authUser?.user;

  const primaryRole = authUser?.roles[0]?.name || "User";

  return (
    <header className="sticky top-0 z-50 w-full h-18 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Original Logo Block */}
        <Link
          to={"/"}
          className="flex w-48 h-16 overflow-hidden rounded-md group"
        >
          {/* PHẦN BÊN TRÁI: Chứa Logo (50% chiều rộng) */}
          <div className="w-1/2 h-full flex items-center justify-end">
            <img
              className="h-15 object-contain group-hover:scale-110 transition-transform"
              src={"/coffee-beans.png"}
              alt="Coffee Franchise"
            />
          </div>

          {/* PHẦN BÊN PHẢI: Chia đôi trên dưới (50% chiều rộng) */}
          <div className="w-1/2 h-full flex flex-col">
            <div className="h-1/2 flex items-end justify-start pl-2">
              <h3 className="font-bold leading-none text-[24px] text-[#6D4C41] uppercase tracking-tighter">
                GOAT
              </h3>
            </div>
            <div className="h-1/2 flex items-start justify-between pl-2">
              <p className="text-lg font-medium text-[#6D4C41] italic">
                coffee
              </p>
            </div>
          </div>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          <Link
            to="/client/menu"
            className="text-2xl font-coffee tracking-wide text-[#5D4037] hover:text-[#6D4C41] transition-colors duration-200"
          >
            Menu
          </Link>
          <Link
            to="/about"
            className="text-2xl font-coffee tracking-wide text-[#5D4037] hover:text-[#6D4C41] transition-colors duration-200"
          >
            The Stories
          </Link>
          <Link
            to="/contact"
            className="text-2xl font-coffee tracking-wide text-[#5D4037] hover:text-[#6D4C41] transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link to="/client/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-12 w-12 text-[#5D4037] hover:text-[#6D4C41] hover:bg-[#FAF8F5]"
              >
                <ShoppingCart className="h-7 w-7" strokeWidth={2} />
              </Button>
            </Link>

            {authUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-12 w-12  mt-5">
                      <AvatarImage
                        src={user?.avatar_url || undefined}
                        alt={user?.name}
                      />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "Username"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {primaryRole}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/account/my-profile"
                      className="flex items-center cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/account/my-posts"
                      className="flex items-center cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span>My Posts</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center cursor-pointer"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="text-md">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button className="text-md" variant="ghost" asChild>
                  <Link to="/client/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-[#6D4C41] hover:bg-[#5D4037] text-white text-md"
                >
                  <Link to="/client/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
