import React from "react";
import Day from "./day";
import { useState } from "react";

interface Tag {
  name: string;
  content?: string;
}

interface DailyData {
  day: Date;
  description?: string;
  intensity: number;
  tags: Tag[];
}

const rawData: { day: Date; tags: Tag[] }[] = [
  {
    day: new Date("2021-01-01"),
    tags: [{ name: "A" }, { name: "A" }, { name: "A" }],
  },
  {
    day: new Date("2021-01-02"),
    tags: [
      { name: "A" },
      { name: "B" },
      { name: "A" },
      { name: "D" },
      { name: "A" },
      { name: "C" },
      { name: "A" },
      { name: "A" },
      { name: "A" },
    ],
  },
  {
    day: new Date("2021-01-03"),
    tags: [{ name: "D" }],
  },
  { day: new Date("2021-01-04"), tags: [] },
  { day: new Date("2021-01-05"), tags: [{ name: "A" }] },
  { day: new Date("2021-01-06"), tags: [] },
  { day: new Date("2021-01-07"), tags: [] },
  {
    day: new Date("2021-01-08"),
    tags: [{ name: "C" }, { name: "A" }],
  },
  {
    day: new Date("2021-01-09"),
    tags: [
      { name: "A" },
      { name: "A" },
      { name: "B" },
      { name: "A" },
      { name: "A" },
      { name: "B" },
    ],
  },
  { day: new Date("2021-01-10"), tags: [{ name: "A" }, { name: "A" }] },
  {
    day: new Date("2021-01-11"),
    tags: [{ name: "A" }, { name: "B" }, { name: "A" }, { name: "A" }],
  },
  {
    day: new Date("2021-01-12"),
    tags: [{ name: "A" }, { name: "A" }, { name: "A" }, { name: "C" }],
  },
];

export default function Main() {
  const start = new Date("2021-01-03");
  const end = new Date("2021-01-31");
  const modifiedData = transposeArray(modifyRawData(start, end, rawData));
  const [hoveredData, setHoveredData] = useState<DailyData | undefined>(
    undefined
  );
  const [selectedData, setSelectedData] = useState<DailyData | undefined>(
    undefined
  );

  return (
    <>
      <table
        className="not-prose"
        style={{
          width: 0,
          borderSpacing: "3px",
          borderCollapse: "separate",
        }}
      >
        <tbody>
          {modifiedData.map((dayOfWeekDatas) => (
            <tr key={dayOfWeekDatas[0].day.getTime()}>
              <td className="day-indicator">
                <span>{dayNumberToStr(dayOfWeekDatas[0].day.getDay())}</span>
              </td>
              {dayOfWeekDatas.map((day) => (
                <Day
                  onClick={() => {
                    if (selectedData?.day.getTime() === day.day.getTime()) {
                      setSelectedData(undefined);
                    } else {
                      setSelectedData(day);
                    }
                  }}
                  onMouseOver={() => {
                    setHoveredData(day);
                  }}
                  onMouseOut={() => {
                    setHoveredData(undefined);
                  }}
                  key={day.day.getTime()}
                  description={day.description}
                  intensity={day.intensity}
                  state={
                    selectedData === undefined
                      ? "neutral"
                      : day.day.getTime() === selectedData.day.getTime()
                      ? "selected"
                      : "unselected"
                  }
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedData !== undefined && (
        <>
          <p>On {`${selectedData?.day.toUTCString()}`}</p>
          <ul>
            {selectedData?.tags?.map((tag) => (
              <li>
                {tag.content ?? "한 일 상세  "}
                <span key={tag.name} className="meta">
                  <a className="tag">{tag.name}</a>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function getWeekOfYear(day: Date): number {
  const firstDayOfYear = new Date(day.getFullYear(), 0, 1);
  const pastDaysOfYear = (day.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function modifyRawData(
  startDay: Date,
  endDay: Date,
  rawData: { day: Date; tags: Tag[] }[],
  tagFilter: (tag: Tag) => boolean = () => true
): DailyData[][] {
  const maxTagCountInPeriod = rawData.reduce((max, data) => {
    if (
      data.day.getTime() < startDay.getTime() ||
      data.day.getTime() > endDay.getTime()
    )
      return max;
    else return Math.max(max, data.tags.filter(tagFilter).length);
  }, 0);

  const modifiedData: DailyData[][] = [];
  const startWeek = getWeekOfYear(startDay);
  const endWeek = getWeekOfYear(endDay);
  for (let week = 0; week <= endWeek - startWeek; week++) {
    const weekData: DailyData[] = [];
    for (let day = 0; day < 7; day++) {
      const targetDay = new Date(
        startDay.getTime() + 86400000 * (week * 7 + day)
      );
      const targetData = rawData.find(
        (data) => data.day.getTime() === targetDay.getTime()
      );
      if (targetData !== undefined && targetData.tags.length > 0) {
        const description = `has ${targetData.tags.length} actions`;
        const tagCount = targetData.tags.filter(tagFilter).length;
        const intensity =
          Math.ceil(((tagCount - 1) * 3) / maxTagCountInPeriod) + 1;
        weekData.push({
          description,
          intensity,
          day: targetDay,
          tags: targetData.tags,
        });
      } else {
        weekData.push({ intensity: 0, day: targetDay, tags: [] });
      }
    }
    modifiedData.push(weekData);
  }
  return modifiedData;
}

function transposeArray<T>(array: T[][]): T[][] {
  // Calculate the number of rows and columns.
  const numRows = array.length;
  const numCols = array[0].length;

  // Create a new array with the transposed dimensions.
  const transposedArray: T[][] = new Array(numCols);
  for (let i = 0; i < numCols; i++) {
    transposedArray[i] = new Array(numRows);
  }

  // Copy values from the original array to the transposed array.
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      transposedArray[j][i] = array[i][j];
    }
  }

  return transposedArray;
}

function dayNumberToStr(dayNumber: number): string {
  switch (dayNumber) {
    case 0:
      return "";
    case 1:
      return "Mon";
    case 2:
      return "";
    case 3:
      return "Wed";
    case 4:
      return "";
    case 5:
      return "Fri";
    case 6:
      return "";
  }
  return "";
}
