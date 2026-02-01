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
import { FileText, LogOut, Settings, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

const Header = () => {
  const { user, logout } = useAuthStore();
  return (
    <header className="sticky top-0 z-50 w-full h-18 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"} className="flex flex-col items-center ">
          <img
            className="h-15 "
            src={"/coffee-beans.png"}
            alt="Coffee Franchise"
          />
        </Link>
        <div className="flex items-center gap-6 ">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/about"
              className="text-lg font-medium text-[#5D4037] hover:text-[#6D4C41] transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-lg font-medium text-[#5D4037] hover:text-[#6D4C41] transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-12 w-12 cursor-pointer mt-5">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
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
                        {user.name || "Username"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {/* {user.role  === "admin" ? "Admin" : "Customer"} */}
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
                  {user.role === "admin" && (
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
