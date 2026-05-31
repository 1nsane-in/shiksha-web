"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "../../lib/utils";
import { ChevronDown, X } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      search
        ? options.filter((o) =>
            o.label.toLowerCase().includes(search.toLowerCase())
          )
        : options,
    [options, search]
  );

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex h-10 w-full items-center rounded-md border border-input bg-background px-3 text-sm ring-offset-background",
          disabled && "cursor-not-allowed opacity-50",
          open && "ring-2 ring-ring ring-offset-2"
        )}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
      >
        {open ? (
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={selectedLabel || placeholder}
          />
        ) : (
          <span className={cn("flex-1 truncate", !value && "text-muted-foreground")}>
            {selectedLabel || placeholder}
          </span>
        )}
        {value && !disabled ? (
          <X
            className="h-4 w-4 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setSearch("");
            }}
          />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </div>
      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
          ) : (
            filtered.slice(0, 100).map((option) => (
              <div
                key={option.value}
                className={cn(
                  "cursor-pointer rounded-sm px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                  option.value === value && "bg-accent text-accent-foreground font-medium"
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
