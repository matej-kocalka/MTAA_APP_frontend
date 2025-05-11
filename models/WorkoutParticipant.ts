import User from "./User";
import WorkoutDataSample from "./WorkoutDataSample";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { LatLng }from "react-native-maps";

export default class WorkoutParticipant {
    constructor(
      public user: User,
      public total_distance: number = 0,
      public avg_speed: number = 0,
      public max_speed: number = 0,
      public current_speed: number = 0,
      public steps: number = 0,
      public coordinates : LatLng[] = [],
      public samples: WorkoutDataSample[] = [],
      public samplesNotSent: WorkoutDataSample[] =[], 
    ) {}
  }

