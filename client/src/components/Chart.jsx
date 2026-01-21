import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useMemo } from "react";

const chartConfig = {
    price: {
        label: "Price",
        color: "#000000"
    },
    sales: {
        label: 'Sales',
        color: '#000000'
    }
};

const Chart = ({ orders, watches }) => {
    const sales = {};

    orders?.forEach((order) => {
        order?.items.forEach((item) => {
            const watchId = item?.product;
            sales[watchId] = (sales[watchId] || 0) + (item.quantity || 1); // იმ შემთხვევაში თუ არ გვაქვს, ავტომარტურად ვანიჭებ 0 - ს
        });
    });

    const sortedSales = Object.entries(sales).sort((a, b) => b[1] - a[1]);

    const chartData = useMemo(() => {
        return watches?.map((watch) => ({
            name: watch.name,
            price: watch.price,
            sales: sales[watch._id] || 0,
        })).sort((a, b) => b.sales - a.sales)
    }, [watches, sortedSales]);

    const revenue = useMemo(() => {
        return orders?.reduce((acc, order) => {
            const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const exists = acc.find((item) => item.date === date);

            if(exists){
                exists.revenue += order.totalPrice;
            } else {
                acc.push({ date, revenue: order.totalPrice });
            }

            return acc;
        }, []).sort((a, b) => new Date(a.date) - new Date(b.date))
    }, [orders]);

    return (
        <div className="flex flex-col p-4 md:p-10 w-full">
            <div className="mb-10 bg-white shadow-xs border p-5 w-full">
                <ChartContainer config={chartConfig} className="w-full h-60 md:h-90">
                    <AreaChart data={revenue}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="black" stopOpacity={0.1}/>
                                <stop offset="96%" stopColor="black" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />

                        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} fontSize={12}  />

                        <ChartTooltip content={<ChartTooltipContent />} />

                        <Area type="basis" dataKey="revenue" fill="url(#colorRev)" stroke="black" strokeWidth={2} animationDuration={2000} />
                    </AreaChart>
                </ChartContainer>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 items-center bg-white shadow-xs border p-5">
                <ChartContainer config={chartConfig} className="min-h-50 w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />

                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} fontSize={12}  />

                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />

                        <Bar dataKey='price' fill="black" radius={2} />
                    </BarChart>
                </ChartContainer>
                <ChartContainer config={chartConfig} className="min-h-50 w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />

                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} fontSize={12}  />

                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />

                        <Bar dataKey='sales' fill="#061E29" radius={2} />
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
    );
};

export default Chart;