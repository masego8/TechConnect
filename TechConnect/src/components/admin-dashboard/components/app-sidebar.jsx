import * as React from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { IconInnerShadowTop, IconDashboard, IconListDetails, IconChartBar, IconFolder, IconSearch, IconHome, IconHandGrab, IconUser } from "@tabler/icons-react";
import { NavMain } from "./nav-main";


const data = {

  navMain: [
    { title: "Home",        url: "/",            icon: IconHome },
    { title: "Connections", url: "/wip", icon: IconHandGrab},
    { title: "Profile",     url: "/profile",     icon: IconUser },
    { title: "Projects",    url: "/wip",    icon: IconFolder },
    { title: "Search",    url: "/wip",    icon: IconSearch },
  ],
};

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="none" className="h-auto border-r" {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* NavMain is where we map the items */}
        <NavMain items={data.navMain} />
      </SidebarContent>

    </Sidebar>
  );
}
