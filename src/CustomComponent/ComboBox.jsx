import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

export function SearchBox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [activeIndex, setActiveIndex] =
    (React.useState < number) | (null > null);

  const listRef = React.useRef < HTMLDivElement > null;

  const handleKeyDown = (e) => {
    if (!open) return;
    const maxIndex = frameworks.length - 1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === null ? 0 : Math.min(prev + 1, maxIndex)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === null ? maxIndex : Math.max(prev - 1, 0)
      );
    } else if (e.key === "Enter" && activeIndex !== null) {
      e.preventDefault();
      const selected = frameworks[activeIndex];
      setValue(selected.value);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls="framework-listbox"
          aria-haspopup="listbox"
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command onKeyDown={handleKeyDown}>
          <CommandInput
            placeholder="Search framework..."
            autoFocus
            aria-label="Search frameworks"
          />
          <CommandList id="framework-listbox" role="listbox" ref={listRef}>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework, index) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  role="option"
                  aria-selected={value === framework.value}
                  className={cn(
                    "relative flex items-center justify-between",
                    activeIndex === index ? "bg-gray-100" : ""
                  )}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
