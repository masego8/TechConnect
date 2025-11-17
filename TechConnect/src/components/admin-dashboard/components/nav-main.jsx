"use client";;
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";





export function NavMain({ items = [] }) {
  return (
   
      
  
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {/* Use asChild so the button renders your NavLink */}
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="data-[active=true]:bg-muted"
              >
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                      isActive && "bg-muted font-medium"
                    )
                  }
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
    
    
  );
}
