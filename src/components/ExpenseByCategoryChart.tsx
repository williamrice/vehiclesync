"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import NoDataMessage from "./NoDataMessage";

const chartConfig = {
  "Oil Change": {
    label: "Oil Change",
    color: "hsl(var(--chart-1))",
  },
  Brakes: {
    label: "Brakes",
    color: "hsl(var(--chart-2))",
  },
  Tires: {
    label: "Tires",
    color: "hsl(var(--chart-3))",
  },
  Repair: {
    label: "Repair",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface ExpenseByCategoryChartProps extends ComponentProps<"div"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: any[];
  hasRecords: boolean;
}

export function ExpenseByCategoryChart(props: ExpenseByCategoryChartProps) {
  return (
    <>
      <Card className={cn(props.className, "flex flex-col")}>
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-2xl text-center">
            Expense By Category (YTD)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {props.hasRecords ? (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <Pie
                  data={props.chartData}
                  dataKey="amount"
                  nameKey="maintType"
                />
                <ChartLegend
                  content={(legendProps) => (
                    <ChartLegendContent
                      payload={legendProps.payload}
                      verticalAlign={legendProps.verticalAlign}
                      nameKey="maintType"
                    />
                  )}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <NoDataMessage />
          )}
        </CardContent>
      </Card>
    </>
  );
}
