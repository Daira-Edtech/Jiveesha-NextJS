"use client";
import Image from "next/image";
import { useEffect, useState, cloneElement } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { authClient, getUser } from "@/lib/auth-client";
import { useLanguage } from "@/contexts/LanguageContext"; // Import from context
import { useQueryClient } from "@tanstack/react-query";
import { clearUserData } from "@/lib/cache-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiBarChartAlt2 } from "react-icons/bi";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { MdDashboard, MdLanguage } from "react-icons/md";

const logoSrc = "/daira-logo1.png";
const profileSrc = "/profile-icon.jpg";

const SideNavBarItem = ({
  icon,
  text,
  route,
  isExpanded,
  isActive,
  onClick,
}) => {
  return (
    <li
      className={`flex items-center rounded-lg cursor-pointer transition-all duration-300 group
      ${
        isExpanded ? "px-2 py-2 md:px-3 md:py-3" : "justify-center py-2 md:py-3"
      } 
      ${
        isActive
          ? "bg-primary text-primary-foreground shadow-sm" // Use theme variables
          : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground" // Use theme variables
      }`}
      onClick={() => onClick(route)}
    >
      <div
        className={`${
          isActive
            ? "text-primary-foreground"
            : "text-primary group-hover:text-accent-foreground" // Icon color matches text or primary
        } transition-colors duration-300`}
      >
        {cloneElement(icon, { className: "w-[18px] h-[18px] md:w-5 md:h-5" })}
      </div>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded
            ? "max-w-[120px] md:max-w-[160px] opacity-100 ml-2 md:ml-3"
            : "max-w-0 opacity-0"
        }`}
      >
        <span className={`text-sm font-medium`}>{text}</span>
      </div>
    </li>
  );
};

export function AppSidebar() {
  const { state, toggleSidebar, setOpen } = useSidebar();
  const isExpanded = state === "expanded";
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Use useLanguage from context
  const {
    language,
    setLanguage,
    t,
    languagesList: contextLanguagesList,
    isTransitioning,
  } = useLanguage();

  // Local state for dropdown visibility
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Define languagesList, using context's list or a fallback
  const languagesList = contextLanguagesList || [
    { code: "en", name: "English", short: "EN" },
    { code: "hi", name: "हिंदी", short: "HI" },

    { code: "kn", name: "ಕನ್ನಡ", short: "KN" },
  ];

  const currentLanguageDetails =
    languagesList.find((l) => l.code === language) || languagesList[0];

  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        if (userData) {
          setUser({
            name: userData.name || "User",
            email: userData.email || "",
          });
        } else {
          setUser({ name: "Guest", email: "" });
        }
      } catch (error) {
        console.error("Error in AppSidebar fetchUser:", error);
        setUser({ name: "Error", email: "" });
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all TanStack Query cache first
      queryClient.clear();

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            clearUserData();
            router.push("/login");
          },
          onError: () => {
            clearUserData();
            router.push("/login");
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Clear cache and localStorage even if logout fails
      queryClient.clear();
      clearUserData();
      router.push("/login");
    }
  };

  const mainMenuItems = [
    {
      title: t("dashboard"),
      route: "/dashboard",
      icon: <MdDashboard size={20} />,
    },
    {
      title: t("students"),
      route: "/my-class",
      icon: <HiOutlineClipboardList size={20} />,
    },
    {
      title: t("tests"),
      route: "/take-tests",
      icon: <HiOutlineClipboardList size={20} />,
    },
    {
      title: t("analytics"),
      route: "/analytics",
      icon: <BiBarChartAlt2 size={20} />,
    },
  ];

  const handleItemClick = (route) => {
    router.push(route);
    if (
      typeof window !== "undefined" &&
      window.innerWidth < 768 &&
      state === "expanded"
    ) {
      setOpen(false);
    }
  };

  const handleToggle = () => {
    toggleSidebar();
  };

  return (
    <aside
      className={`h-screen bg-sidebar text-sidebar-foreground relative transition-all duration-300 ease-in-out overflow-x-hidden flex-shrink-0 border-r border-sidebar-border flex flex-col ${
        isExpanded ? "w-64" : "w-16"
      } md:${isExpanded ? "w-64" : "w-20"}`}
    >
      <div
        className={`flex relative flex-shrink-0 transition-all duration-300 ease-in-out ${
          isExpanded
            ? "items-center justify-between py-4 px-3 md:py-5 md:px-4 h-16 md:h-[68px]"
            : "flex-col items-center justify-center py-2 px-2 h-20 md:h-[88px]" // Adjusted for collapsed state: flex-col, new height, and padding
        }`}
      >
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <Image
            src={logoSrc}
            alt="Logo"
            width={32}
            height={32}
            className="min-w-[32px] md:w-9 md:h-9"
          />
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isExpanded
                ? "w-auto opacity-100 ml-2 md:ml-3"
                : "w-0 opacity-0 ml-0"
            }`}
          >
            <h1 className="text-lg md:text-xl font-bold text-foreground whitespace-nowrap">
              Daira
            </h1>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className={`text-primary hover:text-primary-hover hover:bg-accent rounded-full w-8 h-8 md:w-10 md:h-10 transition-all duration-300 ease-in-out ${
            isExpanded ? "" : "mt-1 md:mt-2"
          }`}
          aria-label={isExpanded ? t("collapseMenu") : t("expandMenu")}
        >
          {isExpanded ? (
            <FiChevronsLeft size={18} className="md:w-5 md:h-5" />
          ) : (
            <FiChevronsRight size={18} className="md:w-5 md:h-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 md:pb-36">
        <div className="mt-2 px-2 md:px-3">
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "opacity-100 mb-2 md:mb-3" : "opacity-0 h-0"
            }`}
          >
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
              {t("mainMenu")}
            </span>
          </div>
          <ul className="space-y-1 md:space-y-1.5">
            {mainMenuItems.map((item) => (
              <SideNavBarItem
                key={item.route}
                icon={item.icon}
                text={item.title}
                route={item.route}
                isExpanded={isExpanded}
                isActive={
                  pathname === item.route ||
                  (pathname === "/" && item.route === "/dashboard")
                }
                onClick={handleItemClick}
              />
            ))}
          </ul>

          <div className="mt-4 md:mt-6 px-1">
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? "opacity-100 mb-2" : "opacity-0 h-0"
              }`}
            >
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest select-none">
                {t("language")}
              </span>
            </div>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full flex items-center px-2 py-1.5 md:px-3 md:py-2 text-sm font-medium rounded-lg border border-border/50
                              ${
                                isExpanded
                                  ? "justify-between hover:bg-accent hover:border-border"
                                  : "justify-center hover:bg-accent"
                              }
                              text-sidebar-foreground focus:ring-0 focus:ring-offset-0 transition-all duration-200
                              ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
                  // onClick removed, DropdownMenuTrigger handles open/close via onOpenChange
                  aria-label={t("selectLanguage")}
                  disabled={isTransitioning}
                >
                  {isExpanded ? (
                    <>
                      <div className="flex items-center gap-2">
                        {isTransitioning ? (
                          <div className="w-4 h-4 border border-sidebar-foreground/30 border-t-sidebar-foreground rounded-full animate-spin" />
                        ) : (
                          <MdLanguage className="w-4 h-4 opacity-70" />
                        )}
                        <span className="text-sm">
                          {currentLanguageDetails.name}
                        </span>
                      </div>
                      <FiChevronDown
                        className={`w-4 h-4 opacity-70 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  ) : isTransitioning ? (
                    <div className="w-5 h-5 md:w-6 md:h-6 border border-sidebar-foreground/30 border-t-sidebar-foreground rounded-full animate-spin" />
                  ) : (
                    <MdLanguage className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" side="right" align="start">
                {languagesList.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onSelect={() => {
                      if (!isTransitioning) {
                        setLanguage(lang.code);
                        setDropdownOpen(false); // Close dropdown on selection
                      }
                    }}
                    className={`${language === lang.code ? "bg-accent" : ""} ${
                      isTransitioning ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isTransitioning}
                  >
                    {lang.name} ({lang.short})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 bg-sidebar px-3 pb-3 pt-3 border-t border-sidebar-border/50 transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-16 md:w-20"
        }`}
      >
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "opacity-100 mb-2" : "opacity-0 h-0"
          }`}
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
            {t("account")}
          </span>
        </div>

        <div className={`${isExpanded ? "pt-2" : "pt-0"}`}>
          <div
            className={`flex items-center ${
              isExpanded ? "" : "justify-center"
            }`}
          >
            <div className="relative">
              <Image
                src={profileSrc}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-primary/20" // Use primary color for border
              />
              <div className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full border-2 border-sidebar"></div>{" "}
              {/* Border matches sidebar bg */}
            </div>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isExpanded
                  ? "max-w-[120px] md:max-w-[160px] opacity-100 ml-2 md:ml-3"
                  : "max-w-0 opacity-0"
              }`}
            >
              <h2 className="font-medium text-foreground text-sm line-clamp-1">
                {user.name}
              </h2>
              <span className="text-muted-foreground text-xs line-clamp-1">
                {user.email}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`mt-2 md:mt-3 flex items-center w-full transition-colors duration-300 
                        text-red-500 hover:bg-red-100 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-700/20 dark:hover:text-red-400
                        ${
                          isExpanded
                            ? "justify-start px-2 py-2 md:px-3"
                            : "justify-center px-0 py-2"
                        }`}
            aria-label={t("logout")}
            title={isExpanded ? "" : t("logout")}
          >
            <FiLogOut className="w-[18px] h-[18px] md:w-[18px] md:h-[18px]" />
            {isExpanded && (
              <span className="ml-2 md:ml-3 text-sm font-medium">
                {t("logout")}
              </span>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
