"use client";
import React, { useCallback } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { type Row } from "@tanstack/react-table";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface DataRow {
  id: number;
  text: string;
  citation: string;
}

interface IDataWithId {
  id: number;
}

type TData = DataRow & IDataWithId;

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
  };

  const handleCopyQuote = useCallback(() => {
    copyToClipboard((row.original as DataRow).text);
  }, [row]);

  const handleCopyCitation = useCallback(() => {
    copyToClipboard((row.original as DataRow).citation);
  }, [row]);

  const handleViewDetails = useCallback(() => {
    router.push(`/quotes/${(row.original as DataRow).id}`);
  }, [router, row.original]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={handleCopyQuote}>
          Copy quote
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleCopyCitation}>
          Copy citation
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleViewDetails}>
          View quote details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
