import User from "./User";
import WorkoutDataSample from "./WorkoutDataSample";

export default class WorkoutParticipant {
    constructor(
      public user: User,
      public total_distance: number,
      public avg_speed: number,
      public max_speed: number,
      public current_speed: number,
      public steps: number,
      public samples: WorkoutDataSample[],
    ) {}
  }

