import WorkoutParticipants from "./WorkoutParticipant";

export default class Workout {
    constructor(
      public w_id: number,
      public name: string,
      public start: Date,
      public participants: WorkoutParticipants[],
    ) {}
  }

