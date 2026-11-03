import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MultiLevelDropdown = ({ label, items }) => {
  const navigate = useNavigate();

  const handleNavigate = (link) => {
    if (link) navigate(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1 px-4 py-2 font-medium hover:text-primary focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
        aria-haspopup="menu"
        aria-label={label}
      >
        {label} <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        role="menu"
        aria-label={`${label} menu`}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.subItems ? (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="flex items-center justify-between"
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded="false"
                >
                  {item.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    className="w-56"
                    role="menu"
                    aria-label={`${item.label} submenu`}
                  >
                    {item.subItems.map((subItem, subIndex) => (
                      <DropdownMenuItem
                        key={subIndex}
                        role="menuitem"
                        onSelect={() => handleNavigate(subItem.link)}
                        tabIndex={0}
                      >
                        {subItem.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem
                key={index}
                role="menuitem"
                tabIndex={0}
                onSelect={() => handleNavigate(item.link)}
              >
                {item.label}
              </DropdownMenuItem>
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
