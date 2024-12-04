import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/utils";
import { Center, Group, GroupProps, Menu, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";

const HeaderMenu = forwardRef<HTMLDivElement, GroupProps>((props, ref) => {
  const t = useTranslations("Common");
  const pathname = usePathname();

  const links = [
    { name: "home", link: "/", label: t("Menu.home") },
    {
      name: "recipes",
      label: t("Menu.recipes"),
      links: [
        {
          name: "recipe-list",
          link: "/recipe/list",
          label: t("Menu.browse_recipe"),
        },
        {
          name: "recipe-create",
          link: "/create",
          label: t("Menu.create_recipe"),
        },
      ],
    },
    { name: "settings", link: "/settings", label: t("Menu.settings") },
  ];

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item
        className={cn("", {
          "bg-orange-100 dark:bg-orange-900/30": item.link?.includes(pathname),
        })}
        key={item.name}
        component={Link}
        href={item.link}
      >
        <span className="font-mulish text-lg font-bold opacity-70">
          {item.label}
        </span>
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.name}
          trigger="hover"
          transitionProps={{ exitDuration: 0, transition: "fade-down" }}
          withinPortal
          classNames={{
            dropdown: "rounded-xl p-2",
            item: "rounded-lg mb-2 last:mb-0",
          }}
        >
          <Menu.Target>
            <UnstyledButton
              className="p-2 px-4 rounded-lg hover:opacity-80"
              onClick={(event) => event.preventDefault()}
            >
              <Center className="flex gap-2">
                <span className="font-mulish text-lg font-bold opacity-70">
                  {link.label}
                </span>
                <IconChevronDown size={20} stroke={2} />
              </Center>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <UnstyledButton
        component={link.link ? Link : undefined}
        className={cn("p-2 px-4 hover:opacity-80 rounded-lg", {
          "bg-orange-100 dark:bg-orange-900/30": link.link?.includes(pathname),
        })}
        key={link.name}
        href={link.link || ""}
      >
        <span className="font-mulish text-lg font-bold opacity-70">
          {link.label}
        </span>
      </UnstyledButton>
    );
  });

  return (
    <Group className="flex gap-2" ref={ref} {...props}>
      {items}
    </Group>
  );
});

HeaderMenu.displayName = "HeaderMenu";
export default HeaderMenu;
