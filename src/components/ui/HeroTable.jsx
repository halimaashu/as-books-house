"use client";

// Export each HeroUI primitive separately. Server Components can render each
// client primitive, but a compound object's static slots do not survive the
// Server/Client Component boundary as properties such as Table.ScrollContainer.
export {
  TableBody,
  TableCell,
  TableColumn,
  TableContent,
  TableFooter,
  TableHeader,
  TableRoot,
  TableRow,
  TableScrollContainer,
} from "@heroui/react";
