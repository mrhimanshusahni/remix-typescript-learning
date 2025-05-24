import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Loader2 } from "lucide-react";

// Custom debounce hook
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Mock API fetch function - replace with your actual API
const fetchSearchResults = async (query) => {
  if (!query || query.trim() === "") return [];

  // Simulate API call delay
  // await new Promise((resolve) => setTimeout(resolve, 500));

  return fetch(`https://jsonplaceholder.typicode.com/users?q=${query}`).then(
    (res) => res.json(),
  );

  // Replace with your actual API endpoint
  // Example: return fetch(`https://api.example.com/search?q=${query}`).then(res => res.json());

  // Mock data for demonstration
  return [
    { id: 1, title: `Result for "${query}" #1` },
    { id: 2, title: `Result for "${query}" #2` },
    { id: 3, title: `Result for "${query}" #3` },
    { id: 4, title: `Result for "${query}" #4` },
    { id: 5, title: `Result for "${query}" #5` },
  ];
};

export default function SearchComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const commandRef = useRef<HTMLDivElement | null>(null);
  const debouncedSearch = useDebounce(inputValue, 300);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        event.target instanceof Node &&
        !commandRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // React Query for fetching search results
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => fetchSearchResults(debouncedSearch),
    enabled: debouncedSearch.trim().length > 0,
  });

  console.log("results :>> ", results);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!isOpen && e.target.value) {
      setIsOpen(true);
    }
  };

  const handleSelect = (item) => {
    console.log("Selected item:", item);
    setInputValue(item.title);
    setIsOpen(false);
  };

  return (
    <div className="relative mx-auto w-full max-w-md" ref={commandRef}>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue && setIsOpen(true)}
          placeholder="Search..."
          className="w-full pl-10"
        />
        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
      </div>

      {isOpen && (
        <Command className="absolute top-full z-10 mt-1 w-full rounded-md border bg-white shadow-md">
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-500" />
                <p className="text-sm text-gray-500">Searching...</p>
              </div>
            ) : (
              <>
                {results.length > 0 ? (
                  <CommandGroup heading="Results">
                    {results.map((item) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {item.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty className="py-6 text-center text-sm">
                    {debouncedSearch
                      ? "No results found."
                      : "Type to search..."}
                  </CommandEmpty>
                )}
              </>
            )}
          </CommandList>
        </Command>
      )}
    </div>
  );
}
