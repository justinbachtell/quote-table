/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";
import { type Quote } from "./data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import useFilters from "./data/filter-options";

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "isImportant",
    header: ({ column }) => <DataTableColumnHeader column={column} title="★" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      return (
        <div className="flex w-5 space-x-2">
          {row.getValue("isImportant") == true && (
            <Star
              className="fill-yellow-400 text-yellow-400"
              size={16}
              strokeWidth={2}
              stroke="currentColor"
            />
          )}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "text",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quote" />
    ),
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div className="flex min-w-72 gap-3 space-x-2">
        {row.getValue("text")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "bookTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Book" />
    ),
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      const bookList = useFilters().books;
      const rowBook = row.getValue("bookTitle") as string;

      // Check if rowBook is in the bookList
      if (!bookList.includes(rowBook)) {
        return null;
      }

      return (
        <div className="flex space-x-2">
          <span className="flex min-w-44 max-w-72 gap-3 font-medium">
            {rowBook}
          </span>
        </div>
      );
    },
    filterFn: (row, id, filterValue) => {
      // Assuming row values are strings or can be converted to strings
      const rowValue = row.getValue(id);
      const value = rowValue ? String(rowValue).toLowerCase() : "";

      // Assuming filter value is a string
      const filter = filterValue ? String(filterValue).toLowerCase() : "";

      return value.includes(filter);
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "quoteAuthors",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author(s)" />
    ),
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      const authorList = useFilters().authors;
      const rowAuthors = row.getValue("quoteAuthors") as string[];

      // Check if rowAuthors is an array of strings
      if (!Array.isArray(rowAuthors) || !rowAuthors.every((author) => true)) {
        return null;
      }

      // Filter authors that are in the authorList
      const validAuthors = rowAuthors.filter((author) =>
        authorList.includes(author),
      );

      if (validAuthors.length === 0) {
        return null;
      }

      return (
        <div className="flex space-x-2">
          {validAuthors.map((author) => (
            <span
              key={author}
              className="flex min-w-32 max-w-44 gap-3 font-medium"
            >
              {author}
            </span>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);

      // Ensure rowValue is an array of strings
      if (
        !Array.isArray(rowValue) ||
        !rowValue.every((author) => typeof author === "string")
      ) {
        return false;
      }

      // Assuming value is an array of strings, check if any of the row values are included in value
      if (Array.isArray(value)) {
        return rowValue.some((author) => value.includes(author));
      }

      // Assuming value is a string, check if it is included in the row values
      if (typeof value === "string") {
        return rowValue.includes(value);
      }

      return false;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "quotedAuthor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quoted Author" />
    ),
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      const quotedList = useFilters().quoted;
      const rowQuoted = row.getValue("quotedAuthor") as string;

      // Check if rowQuoted is in the quotedList
      if (!quotedList.includes(rowQuoted)) {
        return null;
      }

      return (
        <div className="flex space-x-2">
          <span className="flex min-w-32 max-w-44 gap-3 font-medium">
            {rowQuoted}
          </span>
        </div>
      );
    },
    filterFn: (row, id, filterValue) => {
      // Assuming row values are strings or can be converted to strings
      const rowValue = row.getValue(id);
      const value = rowValue ? String(rowValue).toLowerCase() : "";

      // Assuming filter value is a string
      const filter = filterValue ? String(filterValue).toLowerCase() : "";

      return value.includes(filter);
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "pageNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Page(s)" />
    ),
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 gap-3 font-medium">
            {row.getValue("pageNumber")}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "quoteTopics",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topics" />
    ),
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      const topicList = useFilters().topics;
      const rowTopics = row.getValue("quoteTopics") as string[];

      // Check if rowTopics is an array of strings
      if (!Array.isArray(rowTopics) || !rowTopics.every((topic) => true)) {
        return null;
      }

      // Filter topics that are in the topicList
      const validTopics = rowTopics.filter((topic) =>
        topicList.includes(topic),
      );

      if (validTopics.length === 0) {
        return null;
      }

      return (
        <div className="flex space-x-2">
          {validTopics.map((topic) => (
            <span key={topic} className="max-w-[500px] font-medium">
              {topic}
            </span>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);

      // Ensure rowValue is an array of strings
      if (
        !Array.isArray(rowValue) ||
        !rowValue.every((topic) => typeof topic === "string")
      ) {
        return false;
      }

      // Assuming value is an array of strings, check if any of the row values are included in value
      if (Array.isArray(value)) {
        return rowValue.some((topic) => value.includes(topic));
      }

      // Assuming value is a string, check if it is included in the row values
      if (typeof value === "string") {
        return rowValue.includes(value);
      }

      return false;
    },
  },
  {
    accessorKey: "quoteTypes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Types" />
    ),
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      const typeList = useFilters().types;
      const rowTypes = row.getValue("quoteTypes") as string[];

      // Check if rowTypes is an array of strings
      if (!Array.isArray(rowTypes) || !rowTypes.every((type) => true)) {
        return null;
      }

      // Filter types that are in the typeList
      const validTypes = rowTypes.filter((type) => typeList.includes(type));

      if (validTypes.length === 0) {
        return null;
      }

      return (
        <div className="flex space-x-2">
          {validTypes.map((type) => (
            <span key={type} className="max-w-[500px] font-medium">
              {type}
            </span>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);

      // Ensure rowValue is an array of strings
      if (
        !Array.isArray(rowValue) ||
        !rowValue.every((type) => typeof type === "string")
      ) {
        return false;
      }

      // Assuming value is an array of strings, check if any of the row values are included in value
      if (Array.isArray(value)) {
        return rowValue.some((type) => value.includes(type));
      }

      // Assuming value is a string, check if it is included in the row values
      if (typeof value === "string") {
        return rowValue.includes(value);
      }

      return false;
    },
  },
  {
    accessorKey: "quoteTags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tags" />
    ),
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      const tagList = useFilters().tags;
      const rowTags = row.getValue("quoteTags") as string[];

      // Check if rowTags is an array of strings
      if (!Array.isArray(rowTags) || !rowTags.every((tag) => true)) {
        return null;
      }

      // Filter tags that are in the tagList
      const validTags = rowTags.filter((tag) => tagList.includes(tag));

      if (validTags.length === 0) {
        return null;
      }

      return (
        <div className="flex space-x-2">
          {validTags.map((tag) => (
            <span key={tag} className="max-w-[500px] font-medium">
              {tag}
            </span>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);

      // Ensure rowValue is an array of strings
      if (
        !Array.isArray(rowValue) ||
        !rowValue.every((tag) => typeof tag === "string")
      ) {
        return false;
      }

      // Assuming value is an array of strings, check if any of the row values are included in value
      if (Array.isArray(value)) {
        return rowValue.some((tag) => value.includes(tag));
      }

      // Assuming value is a string, check if it is included in the row values
      if (typeof value === "string") {
        return rowValue.includes(value);
      }

      return false;
    },
  },
  {
    accessorKey: "quoteGenres",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Genres" />
    ),
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      const genreList = useFilters().genres;
      const rowGenres = row.getValue("quoteGenres") as string[];

      // Check if rowGenres is an array of strings
      if (!Array.isArray(rowGenres) || !rowGenres.every((genre) => true)) {
        return null;
      }

      // Filter genres that are in the genreList
      const validGenres = rowGenres.filter((genre) =>
        genreList.includes(genre),
      );

      if (validGenres.length === 0) {
        return null;
      }

      return (
        <div className="flex space-x-2">
          {validGenres.map((genre) => (
            <span key={genre} className="max-w-[500px] font-medium">
              {genre}
            </span>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);

      // Ensure rowValue is an array of strings
      if (
        !Array.isArray(rowValue) ||
        !rowValue.every((genre) => typeof genre === "string")
      ) {
        return false;
      }

      // Assuming value is an array of strings, check if any of the row values are included in value
      if (Array.isArray(value)) {
        return rowValue.some((genre) => value.includes(genre));
      }

      // Assuming value is a string, check if it is included in the row values
      if (typeof value === "string") {
        return rowValue.includes(value);
      }

      return false;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
