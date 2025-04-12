"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

export type Branch = {
  id: string;
  name: string;
  location: string;
  services: string[];
  status?: "active" | "maintenance" | "coming-soon";
};

const branches: Branch[] = [
  {
    id: "bishoftu",
    name: "Kuriftu Bishoftu",
    location: "Bishoftu, Ethiopia",
    services: ["accommodation", "spa", "dining", "events"],
    status: "active",
  },
  {
    id: "entoto",
    name: "Kuriftu Entoto",
    location: "Entoto, Addis Ababa",
    services: ["accommodation", "spa", "dining", "events", "adventure"],
    status: "active",
  },
  {
    id: "awash",
    name: "Kuriftu Awash Falls",
    location: "Awash National Park",
    services: ["accommodation", "dining", "safari", "adventure"],
    status: "active",
  },
  {
    id: "bahirdar",
    name: "Kuriftu Bahir Dar",
    location: "Bahir Dar, Lake Tana",
    services: ["accommodation", "spa", "dining", "boating"],
    status: "active",
  },
  {
    id: "langano",
    name: "Kuriftu Langano",
    location: "Lake Langano",
    services: ["accommodation", "waterpark", "dining", "beach"],
    status: "active",
  },
  {
    id: "djibouti",
    name: "Kuriftu Djibouti",
    location: "Djibouti",
    services: ["accommodation", "spa", "dining", "diving"],
    status: "coming-soon",
  },
];

interface BranchSelectorProps {
  onBranchChange: (branch: Branch) => void;
  defaultBranchId?: string;
}

export function BranchSelector({
  onBranchChange,
  defaultBranchId,
}: BranchSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    // Set default branch if provided
    if (defaultBranchId) {
      const branch = branches.find((b) => b.id === defaultBranchId);
      if (branch) {
        setSelectedBranch(branch);
        onBranchChange(branch);
      }
    } else if (branches.length > 0) {
      // Otherwise set first active branch as default
      const activeBranch =
        branches.find((b) => b.status === "active") || branches[0];
      setSelectedBranch(activeBranch);
      onBranchChange(activeBranch);
    }
  }, [defaultBranchId, onBranchChange]);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setOpen(false);
    onBranchChange(branch);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "maintenance":
        return (
          <Badge
            variant="outline"
            className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Maintenance
          </Badge>
        );
      case "coming-soon":
        return (
          <Badge
            variant="outline"
            className="ml-2 bg-blue-100 text-blue-800 border-blue-300"
          >
            Coming Soon
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedBranch ? (
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-purple-600" />
              <span>{selectedBranch.name}</span>
              {getStatusBadge(selectedBranch.status)}
            </div>
          ) : (
            "Select branch..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandList>
            <CommandEmpty>No branch found.</CommandEmpty>
            <CommandGroup>
              {branches.map((branch) => (
                <CommandItem
                  key={branch.id}
                  value={branch.id}
                  onSelect={() => handleBranchSelect(branch)}
                  disabled={branch.status === "coming-soon"}
                  className={cn(
                    "flex items-center",
                    branch.status === "coming-soon" &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedBranch?.id === branch.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span>{branch.name}</span>
                      {getStatusBadge(branch.status)}
                    </div>
                    <span className="text-xs text-gray-500">
                      {branch.location}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
