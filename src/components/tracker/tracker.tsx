import React, { useMemo } from "react";
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

export default function TrackerContent({
  rawData,
  start,
  end,
}: {
  rawData: { day: Date; tags: Tag[] }[];
  start: Date;
  end: Date;
}) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedData, setSelectedData] = useState<DailyData | undefined>(
    undefined
  );

  const modifiedData = useMemo(() => {
    return transposeArray(
      modifyRawData(start, end, rawData, (tag) => {
        if (selectedTags.length === 0) return true;
        return selectedTags.includes(tag.name);
      })
    );
  }, [rawData, selectedTags]);
  const monthIndicator = modifiedData[modifiedData.length - 1]
    .map((it) => it.day.getMonth())
    .reduce<{ month: number; count: number }[]>((acc, cur) => {
      if (acc.length === 0 || acc[acc.length - 1].month !== cur) {
        acc.push({ month: cur, count: 1 });
      } else {
        acc[acc.length - 1].count = acc[acc.length - 1].count + 1;
      }
      return acc;
    }, []);
  const tags = Array.from(
    new Set(rawData.flatMap((it) => it.tags.map((it) => it.name)))
  );

  return (
    <>
      <pre>
        매일 진행한 일을 기록합니다. <br />
        시각적으로 스스로의 게으름을 확인하고 싶어서 만들었습니다. <br />
      </pre>
      <div
        style={{
          width: "100%",
          marginBottom: "20px",
          overflowX: "scroll",
        }}
      >
        <table
          className="not-prose"
          style={{
            width: "",
            borderSpacing: "3px",
            borderCollapse: "separate",
          }}
        >
          <thead>
            <tr>
              <td /> {/* for day indicator */}
              {monthIndicator.map((it) => (
                <td className="month-indicator" colSpan={it.count}>
                  {monthToStr(it.month)}
                </td>
              ))}
            </tr>
          </thead>
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
                      // setHoveredData(day);
                    }}
                    onMouseOut={() => {
                      // setHoveredData(undefined);
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
      </div>
      <div style={{ overflow: "scroll", width: "100%", height: "30px" }}>
        {tags.map((tag) => (
          <span
            className={`filter-tag ${
              selectedTags.includes(tag) ? "selected" : ""
            }`}
            onClick={() => {
              setSelectedTags((prev) => {
                if (prev.includes(tag)) {
                  return prev.filter((it) => it !== tag);
                } else {
                  return [...prev, tag];
                }
              });
              setSelectedData(undefined);
            }}
          >
            @{tag}
          </span>
        ))}
      </div>
      <br />
      {selectedData !== undefined && (
        <>
          <h3>{`${selectedData?.description}`}의 기록</h3>
          <ul>
            {selectedData?.tags?.map((tag) => (
              <li>
                {tag.content ?? "."}{" "}
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
      const targetTags = targetData?.tags?.filter(tagFilter) ?? [];
      const description = targetDay.toLocaleDateString("ko-KR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (targetTags.length > 0) {
        const tagCount = targetTags.length;
        const intensity = Math.ceil((tagCount * 3) / maxTagCountInPeriod) + 1;
        weekData.push({
          description,
          intensity,
          day: targetDay,
          tags: targetTags,
        });
      } else {
        weekData.push({
          description,
          intensity: 0,
          day: targetDay,
          tags: [],
        });
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

function monthToStr(month: number): string {
  switch (month) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
  }
  return "";
}
