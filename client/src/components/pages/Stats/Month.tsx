import { Link, Redirect, RouteComponentProps } from "@reach/router";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  subMonths,
} from "date-fns";
import { Paper } from "eri";
import * as React from "react";
import { dayMonthFormatter, monthFormatter } from "../../../formatters";
import {
  formatIsoMonthInLocalTimezone,
  getMoodIdsInInterval,
} from "../../../utils";
import { StateContext } from "../../AppState";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import MoodChart from "./MoodChart";
import MoodFrequencyChart from "./MoodFrequencyChart";
import MoodSummary from "./MoodSummary";

const X_LABELS_COUNT = 5;

const isoMonthRegex = /^\d{4}-\d{2}$/;

export default function Month({
  month: monthStr,
}: RouteComponentProps<{ month: string }>) {
  if (!monthStr || !isoMonthRegex.test(monthStr)) return <Redirect to="/404" />;

  const state = React.useContext(StateContext);

  if (!state.moods.allIds.length)
    return (
      <Paper.Group>
        <AddFirstMoodCta />
      </Paper.Group>
    );

  const firstMoodDate = new Date(state.moods.allIds[0]);
  const finalMoodDate = new Date(
    state.moods.allIds[state.moods.allIds.length - 1]
  );

  const month = new Date(monthStr);
  const prevMonth = subMonths(month, 1);
  const nextMonth = addMonths(month, 1);

  const showPrevious = month > firstMoodDate;
  const showNext = nextMonth <= finalMoodDate;

  const moodIdsInMonth = getMoodIdsInInterval(
    state.moods.allIds,
    month,
    nextMonth
  );

  const monthLength = differenceInCalendarDays(nextMonth, month);

  const xLabels: [number, string][] = [];

  for (let i = 0; i < X_LABELS_COUNT; i++) {
    const date = addDays(
      month,
      Math.round((i * monthLength) / (X_LABELS_COUNT - 1))
    );
    xLabels.push([date.getTime(), dayMonthFormatter.format(date)]);
  }

  return (
    <Paper.Group>
      <Paper>
        <h2>{monthFormatter.format(month)}</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {showPrevious ? (
            <Link to={`../${formatIsoMonthInLocalTimezone(prevMonth)}`}>
              Previous month
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoMonthInLocalTimezone(nextMonth)}`}>
              Next month
            </Link>
          )}
        </div>
      </Paper>
      <MoodSummary
        dates={[prevMonth, month, nextMonth, addMonths(nextMonth, 1)]}
        periodName="month"
      />
      {moodIdsInMonth.length ? (
        <>
          <Paper>
            <MoodChart fromDate={month} toDate={nextMonth} xLabels={xLabels} />
          </Paper>
          <MoodFrequencyChart fromDate={month} toDate={nextMonth} />
        </>
      ) : (
        <Paper>
          <p>No data for this month.</p>
        </Paper>
      )}
    </Paper.Group>
  );
}
