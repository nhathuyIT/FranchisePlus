import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  FileText,
  Key,
  LogOut,
  Menu as MenuIcon,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth-store";
import { useLogoutCustomer } from "@/hooks/client/useClient.hooks";
import { useCart } from "@/pages/client/cart/useCart";
import { ROUTER_URL } from "@/router/route.const";
import { cn } from "@/lib/utils";

const BRAND_NAME = "GOAT Coffee";

const NAV_LINKS = [
  { label: "Menu", to: `/${ROUTER_URL.MENU}` },
  { label: "The Stories", to: ROUTER_URL.ABOUT },
  { label: "Contact", to: ROUTER_URL.CONTACT },
  { label: "Locations", to: ROUTER_URL.LOCATIONS },
];

const CART_PATH = `${ROUTER_URL.CLIENT}/${ROUTER_URL.CLIENT_ROUTER.CART}`;
const LOGIN_PATH = ROUTER_URL.CLIENT_ROUTER.LOGIN;
const REGISTER_PATH = ROUTER_URL.CLIENT_ROUTER.REGISTER;
const CHANGE_PASSWORD_PATH = ROUTER_URL.CLIENT_ROUTER.CHANGE_PASSWORD;
const PROFILE_PATH = `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_PROFILE}`;
const ORDER_PATH = `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER}`;

const PANEL_ITEM_CLASS =
  "flex w-full items-center gap-3 border-b border-[#E8DFD6] px-5 py-4 text-left transition-colors duration-200";

type HeaderSidePanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  side?: "left" | "right";
};

const HeaderSidePanel = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  side = "right",
}: HeaderSidePanelProps) => {
  const isLeft = side === "left";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className={cn(
          "top-0 flex h-screen w-[calc(100vw-0.75rem)] max-w-sm translate-y-0 flex-col gap-0 rounded-none border-0 bg-[#FFFDF9] p-0 shadow-2xl transition-[transform,opacity] duration-300 ease-out data-[state=open]:translate-x-0 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 sm:max-w-sm",
          isLeft
            ? "left-0 right-auto border-r border-[#E8DFD6] data-[state=closed]:-translate-x-full"
            : "right-0 left-auto border-l border-[#E8DFD6] data-[state=closed]:translate-x-full",
        )}
      >
        <div className="flex items-start justify-between border-b border-[#E8DFD6] bg-[linear-gradient(180deg,#fffdfa_0%,#fcf5ee_100%)] px-5 py-5">
          <DialogHeader className="text-left">
            <DialogTitle className="font-coffee text-2xl text-[#5D4037]">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#8D6E63]">
              {description}
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full p-3 text-[#6D4C41] hover:bg-[#F8E5E2] hover:text-[#C62828] active:bg-[#F3C9C3] active:text-[#B71C1C]"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close panel</span>
            </Button>
          </DialogClose>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const location = useLocation();
  const { authUser } = useAuthStore();
  const { itemCount } = useCart();
  const logoutMutation = useLogoutCustomer();
  const user = authUser?.user;
  const primaryRole = authUser?.roles[0]?.name || "User";

  const isActiveLink = (path: string) => {
    if (path === `/${ROUTER_URL.MENU}`) {
      return (
        location.pathname === path ||
        location.pathname.startsWith(`${path}/`) ||
        location.pathname.startsWith("/client/products")
      );
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const getPanelItemClass = (isActive = false) =>
    cn(
      PANEL_ITEM_CLASS,
      isActive
        ? "font-medium text-[#6D4C41]"
        : "text-[#5D4037] hover:text-[#6D4C41]",
    );

  const getDesktopNavLinkClass = (path: string) =>
    cn(
      "font-coffee relative inline-flex items-center px-1 py-2 text-[1.35rem] font-medium leading-none tracking-tight transition-colors duration-200 xl:text-[1.45rem]",
      isActiveLink(path)
        ? "text-[#5D4037] after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#C4A77D]"
        : "text-[#7B6258] hover:text-[#5D4037]",
    );

  const getDesktopAccountItemClass = (isActive = false) =>
    cn(
      "cursor-pointer rounded-2xl px-3 py-3 text-sm transition-colors focus:bg-[#FAF8F5] focus:text-[#3E2723]",
      isActive
        ? "bg-[#F3E7DB] font-medium text-[#3E2723]"
        : "text-[#5D4037] hover:bg-[#FAF8F5]",
    );

  const handleLogout = () => {
    setIsAccountOpen(false);
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid h-18 grid-cols-[1fr_auto_1fr] items-center gap-3 lg:hidden">
          <div className="flex items-center justify-start">
            <HeaderSidePanel
              open={isMenuOpen}
              onOpenChange={setIsMenuOpen}
              title="Menu"
              description="Browse the main pages from a fixed panel on the left."
              side="left"
              trigger={
                <Button
                  variant="ghost"
                  className="h-11 rounded-full border-0 bg-transparent px-4 text-[#5D4037] shadow-none hover:bg-transparent hover:text-[#6D4C41]"
                  aria-label="Open site menu"
                >
                  <MenuIcon className="h-5 w-5" />
                  <span className="font-coffee text-lg leading-none">Menu</span>
                </Button>
              }
            >
              <nav className="-mx-5 flex flex-col gap-0">
                {NAV_LINKS.map((link) => (
                  <DialogClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className={getPanelItemClass(isActiveLink(link.to))}
                    >
                      <MenuIcon className="h-4 w-4" />
                      <span className="font-coffee text-lg">{link.label}</span>
                    </Link>
                  </DialogClose>
                ))}
              </nav>
            </HeaderSidePanel>
          </div>

          <Link
            to={ROUTER_URL.HOME}
            className="flex h-13 w-13 items-center justify-center rounded-full border-0 bg-transparent shadow-none transition-transform hover:scale-105"
            aria-label="Go to homepage"
          >
            <img
              className="h-9 w-9 object-contain"
              src="/coffee-beans.png"
              alt={BRAND_NAME}
            />
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <Link to={CART_PATH}>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-11 w-11 rounded-full text-[#5D4037] hover:bg-[#FAF8F5] hover:text-[#6D4C41] sm:h-12 sm:w-12"
                aria-label="Open cart"
              >
                <ShoppingCart
                  className="h-6 w-6 sm:h-7 sm:w-7"
                  strokeWidth={2}
                />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 flex h-6 w-6 min-w-[1.5rem] items-center justify-center p-0 text-xs font-bold"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <HeaderSidePanel
              open={isAccountOpen}
              onOpenChange={setIsAccountOpen}
              title={authUser ? "My Account" : "Welcome"}
              description={
                authUser
                  ? "Manage profile, orders, password, and account session."
                  : "Sign in or create an account from the same right-side panel."
              }
              trigger={
                <Button
                  variant="ghost"
                  className="relative h-11 w-11 rounded-full p-0 text-[#5D4037] hover:bg-[#FAF8F5] hover:text-[#6D4C41] sm:h-12 sm:w-12"
                  aria-label="Open account menu"
                >
                  {authUser ? (
                    <Avatar className="h-11 w-11 border border-[#E8DFD6] sm:h-12 sm:w-12">
                      <AvatarImage
                        src={user?.avatarUrl || undefined}
                        alt={user?.name}
                      />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E8DFD6] bg-[#FFFDF9] sm:h-12 sm:w-12">
                      <User className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              }
            >
              {authUser ? (
                <>
                  <div className="px-0 py-1">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={user?.avatarUrl || undefined}
                          alt={user?.name}
                        />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-[#3E2723]">
                          {user?.name || "Username"}
                        </p>
                        <p className="text-sm text-[#8D6E63]">{primaryRole}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 -mx-5 flex flex-col gap-0">
                    <DialogClose asChild>
                      <Link
                        to={PROFILE_PATH}
                        className={getPanelItemClass(
                          location.pathname.startsWith(PROFILE_PATH),
                        )}
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DialogClose>

                    <DialogClose asChild>
                      <Link
                        to={ORDER_PATH}
                        className={getPanelItemClass(
                          location.pathname.startsWith(ORDER_PATH),
                        )}
                      >
                        <FileText className="h-4 w-4" />
                        <span>My Order</span>
                      </Link>
                    </DialogClose>

                    <DialogClose asChild>
                      <Link
                        to={CHANGE_PASSWORD_PATH}
                        className={getPanelItemClass(
                          location.pathname === CHANGE_PASSWORD_PATH,
                        )}
                      >
                        <Key className="h-4 w-4" />
                        <span>Change password</span>
                      </Link>
                    </DialogClose>
                  </div>

                  <div className="mt-auto border-t border-[#E8DFD6] pt-5">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleLogout}
                      className="h-11 w-full justify-start rounded-2xl px-4 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="-mx-5 flex flex-col gap-0">
                  <DialogClose asChild>
                    <Link to={LOGIN_PATH} className={getPanelItemClass()}>
                      <User className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                  </DialogClose>

                  <DialogClose asChild>
                    <Link to={REGISTER_PATH} className={getPanelItemClass()}>
                      <FileText className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </DialogClose>
                </div>
              )}
            </HeaderSidePanel>
          </div>
        </div>

        <div className="hidden h-20 grid-cols-[1fr_auto_1fr] items-center gap-6 lg:grid">
          <div className="flex items-center justify-start">
            <Link
              to={ROUTER_URL.HOME}
              className="inline-flex items-center gap-3 pr-4"
              aria-label="Go to homepage"
            >
              <span className="flex h-12 w-12 items-center justify-center">
                <img
                  className="h-8 w-8 object-contain"
                  src="/coffee-beans.png"
                  alt={BRAND_NAME}
                />
              </span>

              <div className="min-w-0">
                <p className="font-coffee text-2xl leading-none text-[#5D4037]">
                  {BRAND_NAME}
                </p>
              </div>
            </Link>
          </div>

          <nav
            className="flex items-center justify-center gap-8"
            aria-label="Desktop navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={getDesktopNavLinkClass(link.to)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <Link to={CART_PATH}>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-12 w-12 rounded-full p-0 text-[#5D4037] shadow-none hover:bg-transparent hover:text-[#6D4C41]"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-6 w-6" strokeWidth={2} />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 flex h-6 w-6 min-w-[1.5rem] items-center justify-center p-0 text-xs font-bold"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto w-auto rounded-full p-0 text-[#5D4037] shadow-none hover:bg-transparent hover:text-[#6D4C41]"
                  aria-label="Open account dropdown"
                >
                  {authUser ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.avatarUrl || undefined}
                        alt={user?.name}
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8C5B6] text-[#5D4037] transition-colors duration-200 hover:border-[#6D4C41]">
                      <User className="h-6 w-6" />
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="center"
                collisionPadding={16}
                sideOffset={12}
                className="w-72 rounded-[1.5rem] border-[#E8DFD6] bg-[#FFFDF9] p-2 shadow-[0_28px_70px_rgba(63,41,33,0.16)]"
              >
                {authUser ? (
                  <>
                    <DropdownMenuLabel className="px-2 py-2">
                      <div className="flex items-center gap-3 rounded-2xl bg-[#FAF8F5] p-3">
                        <Avatar className="h-11 w-11 border border-[#E8DFD6]">
                          <AvatarImage
                            src={user?.avatarUrl || undefined}
                            alt={user?.name}
                          />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#3E2723]">
                            {user?.name || "Username"}
                          </p>
                          <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#8D6E63]">
                            {primaryRole}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-[#E8DFD6]" />

                    <DropdownMenuItem
                      asChild
                      className={getDesktopAccountItemClass(
                        location.pathname.startsWith(PROFILE_PATH),
                      )}
                    >
                      <Link to={PROFILE_PATH}>
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className={getDesktopAccountItemClass(
                        location.pathname.startsWith(ORDER_PATH),
                      )}
                    >
                      <Link to={ORDER_PATH}>
                        <FileText className="h-4 w-4" />
                        <span>My Order</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className={getDesktopAccountItemClass(
                        location.pathname === CHANGE_PASSWORD_PATH,
                      )}
                    >
                      <Link to={CHANGE_PASSWORD_PATH}>
                        <Key className="h-4 w-4" />
                        <span>Change password</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-[#E8DFD6]" />

                    <DropdownMenuItem
                      onSelect={handleLogout}
                      className="cursor-pointer rounded-2xl px-3 py-3 text-red-600 transition-colors focus:bg-red-50 focus:text-red-700 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="px-2 py-2">
                      <div className="rounded-2xl bg-[#FAF8F5] p-3">
                        <p className="text-sm font-semibold text-[#3E2723]">
                          Welcome
                        </p>
                        <p className="mt-1 text-xs font-normal leading-5 text-[#8D6E63]">
                          Sign in or create an account from the desktop dropdown.
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-[#E8DFD6]" />

                    <DropdownMenuItem
                      asChild
                      className={getDesktopAccountItemClass()}
                    >
                      <Link to={LOGIN_PATH}>
                        <User className="h-4 w-4" />
                        <span>Login</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className={getDesktopAccountItemClass()}
                    >
                      <Link to={REGISTER_PATH}>
                        <FileText className="h-4 w-4" />
                        <span>Sign Up</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
