"use client";

import { useState, useEffect } from "react";
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

export type Service = {
  id: string;
  name: string;
  icon: string;
  description: string;
  availableAt: string[]; // branch IDs
};

const services: Service[] = [
  {
    id: "accommodation",
    name: "Accommodation",
    icon: "🏨",
    description: "Luxury rooms and suites",
    availableAt: [
      "bishoftu",
      "entoto",
      "awash",
      "bahirdar",
      "langano",
      "djibouti",
    ],
  },
  {
    id: "spa",
    name: "Spa & Wellness",
    icon: "💆",
    description: "Relaxing treatments and massages",
    availableAt: ["bishoftu", "entoto", "bahirdar", "djibouti"],
  },
  {
    id: "dining",
    name: "Dining",
    icon: "🍽️",
    description: "Restaurants and cafes",
    availableAt: [
      "bishoftu",
      "entoto",
      "awash",
      "bahirdar",
      "langano",
      "djibouti",
    ],
  },
  {
    id: "events",
    name: "Events & Conferences",
    icon: "🎪",
    description: "Venues for special occasions",
    availableAt: ["bishoftu", "entoto"],
  },
  {
    id: "waterpark",
    name: "Waterpark",
    icon: "🌊",
    description: "Water slides and activities",
    availableAt: ["langano"],
  },
  {
    id: "adventure",
    name: "Adventure Activities",
    icon: "🧗",
    description: "Hiking, zip-lining, and more",
    availableAt: ["entoto", "awash"],
  },
  {
    id: "safari",
    name: "Safari",
    icon: "🦁",
    description: "Wildlife viewing experiences",
    availableAt: ["awash"],
  },
  {
    id: "boating",
    name: "Boating",
    icon: "🚣",
    description: "Lake excursions and boat trips",
    availableAt: ["bahirdar"],
  },
  {
    id: "diving",
    name: "Diving",
    icon: "🤿",
    description: "Scuba diving and snorkeling",
    availableAt: ["djibouti"],
  },
  {
    id: "beach",
    name: "Beach Activities",
    icon: "🏖️",
    description: "Lakeside beach and activities",
    availableAt: ["langano"],
  },
];

interface ServiceSelectorProps {
  branchId: string;
  onServiceChange: (service: Service | null) => void;
  includeAllOption?: boolean;
}

export function ServiceSelector({
  branchId,
  onServiceChange,
  includeAllOption = false,
}: ServiceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Filter services available at the selected branch
  const availableServices = services.filter((service) =>
    service.availableAt.includes(branchId)
  );

  useEffect(() => {
    // Reset selected service when branch changes
    setSelectedService(null);
    onServiceChange(null);
  }, [branchId, onServiceChange]);

  const handleServiceSelect = (serviceId: string) => {
    if (serviceId === "all" && includeAllOption) {
      setSelectedService(null);
      onServiceChange(null);
    } else {
      const service = services.find((s) => s.id === serviceId) || null;
      setSelectedService(service);
      onServiceChange(service);
    }
    setOpen(false);
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
          {selectedService ? (
            <div className="flex items-center">
              <span className="mr-2">{selectedService.icon}</span>
              <span>{selectedService.name}</span>
            </div>
          ) : (
            <span>
              {includeAllOption ? "All Services" : "Select service..."}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search service..." />
          <CommandList>
            <CommandEmpty>No service found.</CommandEmpty>
            <CommandGroup>
              {includeAllOption && (
                <CommandItem
                  value="all"
                  onSelect={() => handleServiceSelect("all")}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !selectedService ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center">
                    <span className="mr-2">📋</span>
                    <span>All Services</span>
                  </div>
                </CommandItem>
              )}
              {availableServices.map((service) => (
                <CommandItem
                  key={service.id}
                  value={service.id}
                  onSelect={() => handleServiceSelect(service.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedService?.id === service.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="mr-2">{service.icon}</span>
                      <span>{service.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {service.description}
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
