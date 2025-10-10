import { ChevronRight, type LucideIcon } from 'lucide-react';
import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavMainItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// ✅ Component con an toàn để dùng useState
function NavMainItem({
  item,
}: {
  item: {
    title: string;
    url: string;
    icon: LucideIcon;
    items?: { title: string; url: string }[];
  };
}) {
  const location = useLocation();
  const hasChildren = !!item.items?.length;
  const isParentActive = location.pathname.startsWith(item.url);
  const [open, setOpen] = React.useState(isParentActive);

  React.useEffect(() => {
    if (isParentActive) setOpen(true);
  }, [isParentActive]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
                setOpen((prev) => !prev);
              }
            }}
            className={isParentActive ? 'bg-accent text-accent-foreground' : ''}
          >
            <NavLink to={item.url}>
              <item.icon />
              <span>{item.title}</span>
              {hasChildren && (
                <ChevronRight
                  className={`ml-auto transition-transform ${open ? 'rotate-90' : ''}`}
                />
              )}
            </NavLink>
          </SidebarMenuButton>
        </CollapsibleTrigger>

        {hasChildren && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item?.items?.map((subItem) => {
                const isActive = location.pathname === subItem.url;
                return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      <NavLink
                        to={subItem.url}
                        className={isActive ? 'text-primary font-medium' : ''}
                      >
                        <span>{subItem.title}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}
