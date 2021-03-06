import { Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { moodsSelector } from "../../../selectors";
import {
  computeAverageMoodInInterval,
  computeStandardDeviation,
  getMoodIdsInInterval,
} from "../../../utils";
import MoodSummary from "../../shared/MoodSummary";

interface Props {
  dates: [Date, Date, Date, Date];
  periodType: "month" | "week";
}

export default function MoodSummaryForPeriod({
  dates: [date0, date1, date2, date3],
  periodType,
}: Props) {
  const moods = useSelector(moodsSelector);

  const firstMoodDate = new Date(moods.allIds[0]);
  const finalMoodDate = new Date(moods.allIds[moods.allIds.length - 1]);
  const showPrevious = date1 > firstMoodDate;
  const showNext = date2 <= finalMoodDate;
  const moodValues = getMoodIdsInInterval(moods.allIds, date1, date2).map(
    (id) => moods.byId[id].mood
  );
  const prevMoodValues = getMoodIdsInInterval(moods.allIds, date0, date1).map(
    (id) => moods.byId[id].mood
  );
  const nextMoodValues = getMoodIdsInInterval(moods.allIds, date2, date3).map(
    (id) => moods.byId[id].mood
  );

  return (
    <Paper>
      <h3>Summary</h3>
      <MoodSummary
        currentPeriod={{
          best: moodValues.length ? Math.max(...moodValues) : undefined,
          mean: computeAverageMoodInInterval(moods, date1, date2),
          standardDeviation: computeStandardDeviation(moodValues),
          total: moodValues.length,
          worst: moodValues.length ? Math.min(...moodValues) : undefined,
        }}
        nextPeriod={
          showNext
            ? {
                best: nextMoodValues.length
                  ? Math.max(...nextMoodValues)
                  : undefined,
                mean: computeAverageMoodInInterval(moods, date2, date3),
                standardDeviation: computeStandardDeviation(nextMoodValues),
                total: nextMoodValues.length,
                worst: nextMoodValues.length
                  ? Math.min(...nextMoodValues)
                  : undefined,
              }
            : undefined
        }
        periodType={periodType}
        previousPeriod={
          showPrevious
            ? {
                best: prevMoodValues.length
                  ? Math.max(...prevMoodValues)
                  : undefined,
                mean: computeAverageMoodInInterval(moods, date0, date1),
                standardDeviation: computeStandardDeviation(prevMoodValues),
                total: prevMoodValues.length,
                worst: prevMoodValues.length
                  ? Math.min(...prevMoodValues)
                  : undefined,
              }
            : undefined
        }
      />
    </Paper>
  );
}
