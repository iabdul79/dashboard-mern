import { useMemo } from "react";
import { Box, useTheme } from "@mui/material";
import { useGetSalesQuery } from "state/api";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";

function Monthly() {
  const theme = useTheme();
  const { data } = useGetSalesQuery();

  const [formattedData] = useMemo(() => {
    if (!data) return [];

    const { monthlyData } = data;
    const monthlySalesLine = {
      id: "monthlySales",
      color: theme.palette.secondary.main,
      data: [],
    };
    const monthlyUnitsLine = {
      id: "dailyUnits",
      color: theme.palette.secondary[600],
      data: [],
    };

    Object.values(monthlyData).forEach(({ month, totalSales, totalUnits }) => {
      monthlySalesLine.data = [
        ...monthlySalesLine.data,
        { x: month, y: totalSales },
      ];
      monthlyUnitsLine.data = [
        ...monthlyUnitsLine.data,
        { x: month, y: totalUnits },
      ];
    });
    return [[monthlySalesLine, monthlyUnitsLine]];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Monthly sales" subtitle="monthly sales and unit report" />
      <Box height="75vh">
        {data ? (
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: theme.palette.secondary[200],
                  },
                },
                legend: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
              },
              legends: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              tooltip: {
                container: {
                  color: theme.palette.primary.main,
                },
              },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: "Month",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total sales and units",
              legendOffset: -60,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
}

export default Monthly;
