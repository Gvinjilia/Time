import { Clock, User, ClipboardList, FileText, LogOut, Shield } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";

const AdminSidebar = ({ activeSection, setSection }) => {
    const { logout } = useAuth();
    const { t } = useTranslation();

    const sections = [
        {
            title: t('admin.sections.watches'),
            key: "watches",
            icon: Clock,
        },
        {
            title: t('admin.sections.reviews'),
            key: "reviews",
            icon: FileText,
        },
        {
            title: t('admin.sections.users'),
            key: "users",
            icon: User,
        },
        {
            title: t('admin.sections.overview'),
            key: "collection overview",
            icon: Shield,
        },
        {
            title: t('admin.sections.orders'),
            key: "orders",
            icon: ClipboardList,
        }
    ];

    return (
        <Sidebar className="w-60">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className="font-bold">Admin privileges</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sections.map((section) => (
                                <SidebarMenuItem key={section.key}>
                                    <SidebarMenuButton isActive={activeSection === section.key} onClick={() => setSection(section.key)}><section.icon />
                                        <p>{section.title}</p>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className="font-bold">Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => setSection('profile')}>
                                    <p className={`flex gap-3 justify-center items-center ${activeSection === 'profile' && 'font-semibold'}`}><User className="w-4 h-4" />{t('admin.sections.profile')}</p>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={logout}>
                                    <p className="flex gap-3 justify-center items-center"><LogOut className="w-4 h-4" />Logout</p>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export default AdminSidebar;