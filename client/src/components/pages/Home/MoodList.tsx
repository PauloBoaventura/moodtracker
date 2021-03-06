import { Card, Paper, SubHeading, Pagination } from "eri";
import * as React from "react";
import { moodToColor, mapRight } from "../../../utils";
import { useNavigate, useLocation } from "@reach/router";
import { groupMoodsByDaySelector, moodsSelector } from "../../../selectors";
import { useSelector } from "react-redux";

const DAYS_PER_PAGE = 7;

const timeFormatter = Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

export default function MoodList() {
  const location = useLocation();
  const navigate = useNavigate();
  const moods = useSelector(moodsSelector);
  const moodsGroupedByDay = useSelector(groupMoodsByDaySelector);

  const pageStr = new URLSearchParams(location?.search).get("page");
  const page = pageStr === null ? 0 : parseInt(pageStr) - 1;

  if (pageStr && Number(pageStr) - 1 !== page) {
    navigate(page ? `?page=${page + 1}` : "/");
    return null;
  }

  const pageCount = Math.ceil(moodsGroupedByDay.length / DAYS_PER_PAGE);

  if (pageStr === "1" || page < 0 || page >= pageCount) {
    navigate("/");
    return null;
  }

  const endIndex = moodsGroupedByDay.length - page * DAYS_PER_PAGE;

  return (
    <>
      <Paper data-test-id="mood-list">
        <h2>Mood list</h2>
      </Paper>
      {mapRight(
        moodsGroupedByDay.slice(
          Math.max(endIndex - DAYS_PER_PAGE, 0),
          endIndex
        ),
        ([date, ids]) => (
          <Paper key={date}>
            <h3>{date}</h3>
            <Card.Group>
              {mapRight(ids, (id) => {
                const mood = moods.byId[id];
                return (
                  <Card
                    color={moodToColor(mood.mood)}
                    key={id}
                    onClick={() => navigate(`edit/${id}`)}
                  >
                    <h3 className="center">
                      {mood.mood}
                      <SubHeading>
                        {timeFormatter.format(new Date(id))}
                      </SubHeading>
                    </h3>
                  </Card>
                );
              })}
            </Card.Group>
          </Paper>
        )
      )}
      {pageCount > 1 && (
        <Paper>
          <Pagination
            onChange={(page) => navigate(page ? `?page=${page + 1}` : "/")}
            page={page}
            pageCount={pageCount}
          />
        </Paper>
      )}
    </>
  );
}
