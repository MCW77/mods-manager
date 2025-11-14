import type { MoveProgress } from "./MoveProgress.js";

interface MoveStatus {
	taskId: number;
	progress: MoveProgress;
	message: string;
}

export type { MoveStatus };
