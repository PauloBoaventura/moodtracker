import {
  averageByMonthSelector,
  averageByWeekSelector,
  moodsSelector,
} from "./selectors";
import store, { RootState } from "./store";

describe("selectors", () => {
  let initialState: RootState;

  beforeAll(() => {
    initialState = store.getState();
  });

  describe("moodsSelector", () => {
    test("when there are no events", () => {
      expect(moodsSelector(initialState)).toEqual({
        allIds: [],
        byId: {},
      });
    });

    test("with a single create event", () => {
      expect(
        moodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-10-10T08:00:00.000Z"],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-10-10T08:00:00.000Z"],
        byId: { "2020-10-10T08:00:00.000Z": { mood: 5 } },
      });
    });

    test("with a delete event", () => {
      expect(
        moodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:00:00.000Z",
              "2020-10-10T08:01:00.000Z",
              "2020-10-10T08:02:00.000Z",
            ],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-10-10T08:01:00.000Z": {
                createdAt: "2020-10-10T08:01:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 8 },
              },
              "2020-10-10T08:02:00.000Z": {
                createdAt: "2020-10-10T08:02:00.000Z",
                type: "v1/moods/delete",
                payload: "2020-10-10T08:00:00.000Z",
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-10-10T08:01:00.000Z"],
        byId: { "2020-10-10T08:01:00.000Z": { mood: 8 } },
      });
    });

    test("with an update event", () => {
      expect(
        moodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:00:00.000Z",
              "2020-10-10T08:01:00.000Z",
              "2020-10-10T08:02:00.000Z",
              "2020-10-10T08:03:00.000Z",
              "2020-10-10T08:04:00.000Z",
            ],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-10-10T08:01:00.000Z": {
                createdAt: "2020-10-10T08:01:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 8 },
              },
              "2020-10-10T08:02:00.000Z": {
                createdAt: "2020-10-10T08:02:00.000Z",
                type: "v1/moods/delete",
                payload: "2020-10-10T08:00:00.000Z",
              },
              "2020-10-10T08:03:00.000Z": {
                createdAt: "2020-10-10T08:03:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
              "2020-10-10T08:04:00.000Z": {
                createdAt: "2020-10-10T08:04:00.000Z",
                type: "v1/moods/update",
                payload: { id: "2020-10-10T08:01:00.000Z", mood: 10 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-10-10T08:01:00.000Z", "2020-10-10T08:03:00.000Z"],
        byId: {
          "2020-10-10T08:01:00.000Z": {
            mood: 10,
            updatedAt: "2020-10-10T08:04:00.000Z",
          },
          "2020-10-10T08:03:00.000Z": { mood: 7 },
        },
      });
    });
  });

  describe("averageByMonthSelector", () => {
    it("works with 1 mood", () => {
      expect(
        averageByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual([[new Date("2020-07-01"), 5]]);
    });

    it("works with 2 moods in the same month", () => {
      expect(
        averageByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-29T00:00:00.000Z": {
                createdAt: "2020-07-29T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toEqual([[new Date("2020-07-01"), 6]]);
    });

    it("works with 2 moods in adjacent months", () => {
      expect(
        averageByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-06-25T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-06-25T00:00:00.000Z": {
                createdAt: "2020-06-25T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual([
        [new Date("2020-06-01"), 5],
        [new Date("2020-07-01"), 5],
      ]);

      expect(
        averageByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-06-10T00:00:00.000Z", "2020-07-10T00:00:00.000Z"],
            byId: {
              "2020-06-10T00:00:00.000Z": {
                createdAt: "2020-06-10T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 4 },
              },
              "2020-07-10T00:00:00.000Z": {
                createdAt: "2020-07-10T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Array [
          Array [
            2020-06-01T00:00:00.000Z,
            5.05,
          ],
          Array [
            2020-07-01T00:00:00.000Z,
            6.550000000000001,
          ],
        ]
      `);
    });

    it("works with 2 moods in separate non-adjacent months", () => {
      expect(
        averageByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-04-05T00:00:00.000Z", "2020-07-31T00:00:00.000Z"],
            byId: {
              "2020-04-05T00:00:00.000Z": {
                createdAt: "2020-04-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-31T00:00:00.000Z": {
                createdAt: "2020-07-31T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual([
        [new Date("2020-04-01"), 5],
        [new Date("2020-05-01"), 5],
        [new Date("2020-06-01"), 5],
        [new Date("2020-07-01"), 5],
      ]);

      expect(
        averageByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-04-05T00:00:00.000Z", "2020-07-05T00:00:00.000Z"],
            byId: {
              "2020-04-05T00:00:00.000Z": {
                createdAt: "2020-04-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 3 },
              },
              "2020-07-05T00:00:00.000Z": {
                createdAt: "2020-07-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 9 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Array [
          Array [
            2020-04-01T00:00:00.000Z,
            3.857142857142857,
          ],
          Array [
            2020-05-01T00:00:00.000Z,
            5.736263736263737,
          ],
          Array [
            2020-06-01T00:00:00.000Z,
            7.747252747252748,
          ],
          Array [
            2020-07-01T00:00:00.000Z,
            8.868131868131869,
          ],
        ]
      `);
    });
  });

  describe("averageByWeekSelector", () => {
    it("works with 1 mood", () => {
      expect(
        averageByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual([[new Date("2020-07-27"), 5]]);
    });

    it("gets date correct", () => {
      expect(
        averageByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-08-16T22:00:00.000Z"],
            byId: {
              "2020-08-16T22:00:00.000Z": {
                createdAt: "2020-08-16T22:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual([[new Date("2020-08-10"), 5]]);
    });

    it("works with 2 moods in the same week", () => {
      expect(
        averageByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-29T00:00:00.000Z": {
                createdAt: "2020-07-29T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toEqual([[new Date("2020-07-27"), 6]]);
    });

    it("works with 2 moods in adjacent weeks", () => {
      expect(
        averageByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-25T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-25T00:00:00.000Z": {
                createdAt: "2020-07-25T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual([
        [new Date("2020-07-20"), 5],
        [new Date("2020-07-27"), 5],
      ]);

      expect(
        averageByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-25T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-25T00:00:00.000Z": {
                createdAt: "2020-07-25T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 3 },
              },
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 6 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Array [
          Array [
            2020-07-20T00:00:00.000Z,
            4,
          ],
          Array [
            2020-07-27T00:00:00.000Z,
            5.5,
          ],
        ]
      `);
    });

    it("works with 2 moods in separate non-adjacent weeks", () => {
      expect(
        averageByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-05T00:00:00.000Z", "2020-07-31T00:00:00.000Z"],
            byId: {
              "2020-07-05T00:00:00.000Z": {
                createdAt: "2020-07-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-31T00:00:00.000Z": {
                createdAt: "2020-07-31T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual([
        [new Date("2020-06-29"), 5],
        [new Date("2020-07-06"), 5],
        [new Date("2020-07-13"), 5],
        [new Date("2020-07-20"), 5],
        [new Date("2020-07-27"), 5],
      ]);

      expect(
        averageByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-05T00:00:00.000Z", "2020-07-25T00:00:00.000Z"],
            byId: {
              "2020-07-05T00:00:00.000Z": {
                createdAt: "2020-07-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 4 },
              },
              "2020-07-25T00:00:00.000Z": {
                createdAt: "2020-07-25T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 6 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Array [
          Array [
            2020-06-29T00:00:00.000Z,
            4.050000000000001,
          ],
          Array [
            2020-07-06T00:00:00.000Z,
            4.449999999999999,
          ],
          Array [
            2020-07-13T00:00:00.000Z,
            5.15,
          ],
          Array [
            2020-07-20T00:00:00.000Z,
            5.75,
          ],
        ]
      `);
    });
  });
});
