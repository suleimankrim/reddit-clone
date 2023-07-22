"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/ui/command";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma, Subreddit } from ".prisma/client";
import { Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks";
import SubredditCountOutputType = Prisma.SubredditCountOutputType;

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = () => {
  const [input, setInput] = useState<string>("");
  const {
    data: queryResult,
    isFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ["search-query"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: SubredditCountOutputType;
      })[];
    },
    enabled: false,
  });
  const router = useRouter();
  const request = debounce(async () => {
    await refetch();
  }, 300);
  const debounceRequst = useCallback(() => {
    request();
  }, []);
  const commandRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(commandRef, () => {
    setInput("");
  });
  const pathName = usePathname();
  useEffect(() => {
    setInput("");
  }, [pathName]);

  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        value={input}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        onValueChange={(text) => {
          setInput(text);
          debounceRequst();
        }}
        placeholder="Find Community"
      ></CommandInput>
      {input?.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>no results found</CommandEmpty>}
          {(queryResult?.length ?? 0) > 0 ? (
            <CommandGroup heading={"community"}>
              {queryResult?.map((value) => (
                <CommandItem
                  key={value.id}
                  value={value.name}
                  onSelect={(e) => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/r/${value.name}`}>{`/r/${value.name}`}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  );
};
export default SearchBar;
