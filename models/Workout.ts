import User from "./User";
import WorkoutParticipant from "./WorkoutParticipant";

export default class Workout {
  constructor(
    public w_id: number | null,
    public name: string,
    public start: Date,
    public participants: WorkoutParticipant[],
  ) { }

  getParticipant(user: User | null): WorkoutParticipant | null {
    if (user) {
      const participant = this.participants.find(u => u.user.id === user.id);
      if (participant) {
        return participant;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  getWorkoutResults(user: User | null) {
    type WorkoutProgress = {
      id: number;
      name: string;
      date: Date;
      distance: number;
      duration: string;
      current_speed: number;
      steps: number;
    };

    if (user) {
      const participant = this.participants.find(u => u.user.id === user.id);
      if (participant) {
        var duration: string = "";
        if(participant?.samples?.length > 0){

          const endTime: Date = participant.samples[participant.samples.length - 1]!.sample_time;
          const elapsedMs: number = (endTime.getTime()) - (this.start.getTime());
          const hours: number = Math.floor(elapsedMs / (1000 * 60 * 60));
          const minutes: number = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds: number = Math.floor((elapsedMs % (1000 * 60)) / 1000);
          duration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        const progress: WorkoutProgress = {
          id: this.w_id,
          name: this.name,
          date: this.start,
          distance: participant.total_distance,
          duration: duration,
          current_speed: participant.avg_speed,
          steps: participant.steps,
        };
        return progress;
      }
    }
  }
}

