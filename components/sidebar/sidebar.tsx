import React from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[202] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>

            <SidebarMenu title="Main Menu">
            <SidebarItem
                title="Faucet"
                icon={<HomeIcon />}
                isActive={pathname === "/faucet"}
                href="/faucet"
              />
              <SidebarItem
                title="Proposals"
                icon={<HomeIcon />}
                isActive={pathname === "/proposals"}
                href="/proposals"
              />
              <SidebarItem
                title="Play"
                icon={<HomeIcon />}
                isActive={pathname === "/play"}
                href="/play"
              />
              <SidebarItem
                title="Admin"
                icon={<HomeIcon />}
                isActive={pathname === "/admin"}
                href="/admin"
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
