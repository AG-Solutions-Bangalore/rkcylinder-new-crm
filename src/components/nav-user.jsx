import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";

export function NavUser({ user }) {
  const user_position = useSelector((state) => state.auth.user_position);

  // Prefer localStorage as requested
  const userName = localStorage.getItem("name") || user?.name || "User";
  const userMobile = localStorage.getItem("mobile") || user?.mobile || "";

  const intialsChar = userName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="bg-sidebar-accent/50 text-sidebar-accent-foreground cursor-default"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.avatar} alt={userName} />
            <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {intialsChar}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{userName}</span>
            <span className="truncate text-xs">{userMobile}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
