"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { MaintenanceRecordWithType } from "@/models/MaintenanceRecordWithType";
import { EditRecordDialog } from "@/components/EditRecordDialog";
import DeleteRecordAlertDialog from "@/components/DeleteRecordAlertDialog";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "dd-MM-yyyy");
}

// Define the columns
export const columns: ColumnDef<MaintenanceRecordWithType>[] = [
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="grid gap-2">
              <EditRecordDialog maintenanceRecord={record} />
              <DeleteRecordAlertDialog mRecordId={record.id} />
            </div>
          </PopoverContent>
        </Popover>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const record = row.original;
      const date = new Date(record.date);
      return <div>{format(date, "PPP")}</div>;
    },
  },
  {
    accessorKey: "maintenanceType",
    header: "Type",
    cell: ({ row }) => {
      const record = row.original;

      return <div>{record.maintenanceType.name}</div>;
    },
  },
  {
    accessorKey: "mileage",
    header: "Mileage",
    cell: ({ row }) => {
      const record = row.original;
      return <div>{record.mileage}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const record = row.original;
      return <div>{record.description}</div>;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const record = row.original;
      return <div>{record.location}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const record = row.original;
      return <div>${record.amount.toFixed(2)}</div>;
    },
  },
];
