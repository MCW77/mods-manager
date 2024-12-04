import type { MoveProgress } from "./MoveProgress";

interface MoveStatus {
	taskId: number;
	progress: MoveProgress;
	message: string;
}

export type { MoveStatus };
