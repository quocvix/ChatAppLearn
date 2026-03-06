"use client";

import * as React from "react";
import { ChevronDown, Command, Moon, PlusIcon, Sun } from "lucide-react";

import { NavUser } from "@/components/sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Switch } from "../ui/switch";
import CreateNewChat from "../chat/CreateNewChat";
import { Button } from "../ui/button";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import GroupChatList from "../chat/GroupChatList";
import AddFriendModal from "../chat/AddFriendModal";
import DirectMessageList from "../chat/DirectMessageList";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const {isDark, toggleTheme} = useThemeStore();
    const {user} = useAuthStore();

    return (
        <Sidebar variant="inset" {...props}>
            {/* Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="bg-gradient-primary"
                        >
                            <a href="#">
                                <div className="flex w-full items-center justify-between px-2">
                                    <h1 className="text-xl font-bold text-white">
                                        Chat App
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <Sun className="size-4 text-white/80" />
                                        <Switch
                                            checked={isDark}
                                            onCheckedChange={toggleTheme}
                                            className="data-[state=checked]:bg-background/80"
                                        />
                                        <Moon className="size-4 text-white/80" />
                                    </div>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Content */}
            <SidebarContent>
                {/* New Chat */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <CreateNewChat />
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Group Chat */}
                <SidebarGroup>
                    <SidebarGroupLabel>Nhóm chat</SidebarGroupLabel>

                    <SidebarGroupAction
                        title="Tạo nhóm"
                        className="cursor-pointer"
                    >
                        <NewGroupChatModal />
                    </SidebarGroupAction>

                    <SidebarGroupContent>
                        <GroupChatList />
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Direct Message */}
                <SidebarGroup>
                    <SidebarGroupLabel>Bạn bè</SidebarGroupLabel>
                    
                    <SidebarGroupAction
                        title="Thêm bạn"
                        className="cursor-pointer"
                    >
                        <AddFriendModal />
                    </SidebarGroupAction>

                    <SidebarGroupContent>
                        <DirectMessageList />
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
        </Sidebar>
    );
}
