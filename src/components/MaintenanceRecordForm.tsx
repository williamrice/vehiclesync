"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MaintenanceRecord, Vehicle } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  vehicleId: z.string().min(1, "Please select a vehicle"),
  maintenanceTypeId: z.string().min(1, "Please select a maintenance type"),
  date: z.date({ message: "Please select a date" }),
  mileage: z.number().min(0, "Mileage must be a positive number"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  amount: z.number().min(0, "Amount must be a positive number"),
});

interface MaintenanceType {
  id: string;
  name: string;
}

interface MaintenanceRecordFormProps {
  vehicle?: Vehicle;
  vehicles?: Vehicle[];
  maintenanceRecord?: MaintenanceRecord;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function MaintenanceRecordForm({
  setOpen,
  vehicle,
  vehicles,
  maintenanceRecord,
}: MaintenanceRecordFormProps) {
  const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceType[]>(
    []
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: vehicle?.id || maintenanceRecord?.vehicleId || "",
      maintenanceTypeId: maintenanceRecord?.maintenanceTypeId || "",
      date: maintenanceRecord?.date || new Date(),
      mileage: maintenanceRecord?.mileage || 0,
      description: maintenanceRecord?.description || "",
      location: maintenanceRecord?.location || "",
      amount: maintenanceRecord?.amount || 0,
    },
  });

  useEffect(() => {
    const fetchMaintenanceTypes = async () => {
      try {
        const response = await fetch("/api/maintenance-types");
        const data = await response.json();
        setMaintenanceTypes(data);
      } catch (error) {
        console.error("Error fetching maintenance types:", error);
      }
    };
    fetchMaintenanceTypes();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (maintenanceRecord) {
      console.log("Updating maintenance record");
      const response = await fetch(`/api/maintenance-record/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: maintenanceRecord.id,
          maintRecord: values,
        }),
      });
      if (response.ok) {
        toast("Maintenance record updated successfully");
        router.refresh();
        setOpen(false);
      } else {
        toast("Error updating maintenance record");
      }
    } else {
      const response = await fetch(`/api/maintenance-record/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        toast("Maintenance record added successfully");
        router.refresh();
      } else {
        toast("Error adding maintenance record");
      }
    }

    console.log(values);
    setOpen(false);
  }

  if (vehicles?.length === 0 && !vehicle) {
    return (
      <div className="p-4 flex justify-center items-center w-full">
        <p>
          No vehicles found. Please add a vehicle to your{" "}
          <Link className="underline text-blue-500" href="/dashboard/garage">
            garage
          </Link>{" "}
          first.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 min-w-full"
      >
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicle ? (
                    <SelectItem value={vehicle.id}>
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </SelectItem>
                  ) : (
                    vehicles?.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maintenanceTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maintenance Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select maintenance type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {maintenanceTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-[240px] pl-3 text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mileage</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter mileage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter maintenance location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
