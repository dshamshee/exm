import {
  Users,
  FileText,
  Ticket,
  type LucideIcon
} from "lucide-react";

export type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

export type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Management",
      menus: [
        {
          href: "/candidate",
          label: "Candidates",
          icon: Users,
          active: pathname === "/" || pathname.includes("/candidate"),
        },
        {
          href: "/exam",
          label: "Exams",
          icon: FileText,
          active: pathname.includes("/exam"),
        },
        {
          href: "/hall-ticket",
          label: "Hall Ticket",
          icon: Ticket,
          active: pathname.includes("/hall-ticket"),
        },
      ],
    },
  ];
}
