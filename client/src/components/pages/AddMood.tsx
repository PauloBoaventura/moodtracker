import { RouteComponentProps, NavigateFn } from "@reach/router";
import * as React from "react";
import { Button, Paper, RadioButton, requiredValidator } from "eri";
import { DispatchContext } from "../AppState";

export default function AddMood({ navigate }: RouteComponentProps) {
  const dispatch = React.useContext(DispatchContext);
  const [moodError, setMoodError] = React.useState<string | undefined>();

  return (
    <Paper.Group>
      <Paper>
        <h2>Add mood</h2>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const moodValue: string = (e.target as HTMLFormElement).mood.value;
            const fieldError = requiredValidator(moodValue);
            if (fieldError) {
              setMoodError(fieldError);
              return;
            }
            const createdAt = new Date().toISOString();
            dispatch({
              type: "events/add",
              payload: {
                type: "moods/create",
                createdAt,
                payload: {
                  mood: Number(moodValue),
                  createdAt,
                },
              },
            });
            (navigate as NavigateFn)("/");
          }}
        >
          <RadioButton.Group
            error={moodError}
            label="Mood"
            onChange={() => {
              if (moodError) setMoodError(undefined);
            }}
          >
            {[...Array(10)].map((_, i) => (
              <RadioButton key={i} name="mood" value={i + 1}>
                {i + 1}
              </RadioButton>
            ))}
          </RadioButton.Group>
          <Button>Submit</Button>
        </form>
      </Paper>
    </Paper.Group>
  );
}
