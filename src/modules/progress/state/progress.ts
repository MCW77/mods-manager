// state
import {
	type ObservableObject,
	beginBatch,
	endBatch,
	observable,
} from "@legendapp/state";

// domain
import type { OptimizationStatus } from "../domain/OptimizationStatus";
import type { FlatCharacterModding } from "#/modules/compilations/domain/CharacterModdings";

interface Progress {
	error: Error | null;
	finished: boolean;
	hasMissingCharacters: boolean;
	postOptimizationMessages: FlatCharacterModding[];
	optimizationStatus: OptimizationStatus;
	abort: () => void;
	errorAbort: (error: Error) => void;
	setPostOptimizationMessages: (messages: FlatCharacterModding[]) => void;
	init: () => void;
	start: () => void;
	finish: () => void;
}

const startOptimizationStatus: OptimizationStatus = {
	character: "",
	characterCount: 0,
	characterIndex: 0,
	progress: 0,
	message: "",
	sets: [],
	setsCount: 0,
	setsIndex: 0,
	targetStat: "",
	targetStatCount: 0,
	targetStatIndex: 0,
};

const getStartOptimizationStatus = () =>
	structuredClone(startOptimizationStatus);
const progress$: ObservableObject<Progress> = observable<Progress>({
	error: null,
	finished: true,
	hasMissingCharacters: false,
	optimizationStatus: getStartOptimizationStatus(),
	postOptimizationMessages: [],
	init: () => {
		beginBatch();
		progress$.error.set(null);
		progress$.finished.set(false);
		progress$.hasMissingCharacters.set(false);
		progress$.postOptimizationMessages.set([]);
		progress$.optimizationStatus.character.set("");
		progress$.optimizationStatus.characterCount.set(0);
		progress$.optimizationStatus.characterIndex.set(0);
		progress$.optimizationStatus.message.set("");
		progress$.optimizationStatus.progress.set(0);
		progress$.optimizationStatus.sets.set([]);
		progress$.optimizationStatus.setsCount.set(0);
		progress$.optimizationStatus.setsIndex.set(0);
		progress$.optimizationStatus.targetStat.set("");
		progress$.optimizationStatus.targetStatCount.set(0);
		progress$.optimizationStatus.targetStatIndex.set(0);
		endBatch();
	},
	abort: () => {
		beginBatch();
		progress$.finished.set(true);
		progress$.hasMissingCharacters.set(true);
		endBatch();
	},
	errorAbort: (error) => {
		beginBatch();
		progress$.error.set(error);
		progress$.finished.set(true);
		endBatch();
	},
	setPostOptimizationMessages: (messages) => {
		beginBatch();
		progress$.postOptimizationMessages.set(messages);
		endBatch();
	},
	start: () => {
		beginBatch();
		progress$.optimizationStatus.character.set("");
		progress$.optimizationStatus.characterCount.set(0);
		progress$.optimizationStatus.characterIndex.set(0);
		progress$.optimizationStatus.message.set("");
		progress$.optimizationStatus.progress.set(0);
		progress$.optimizationStatus.sets.set([]);
		progress$.optimizationStatus.setsCount.set(0);
		progress$.optimizationStatus.setsIndex.set(0);
		progress$.optimizationStatus.targetStat.set("");
		progress$.optimizationStatus.targetStatCount.set(0);
		progress$.optimizationStatus.targetStatIndex.set(0);
		endBatch();
	},
	finish: () => {
		beginBatch();
		progress$.optimizationStatus.character.set("");
		progress$.optimizationStatus.characterIndex.set(
			progress$.optimizationStatus.characterCount.peek(),
		);
		progress$.optimizationStatus.message.set("Rendering your results");
		progress$.optimizationStatus.progress.set(0);
		progress$.optimizationStatus.sets.set([]);
		progress$.optimizationStatus.setsCount.set(0);
		progress$.optimizationStatus.setsIndex.set(0);
		progress$.optimizationStatus.targetStat.set("");
		progress$.optimizationStatus.targetStatCount.set(0);
		progress$.optimizationStatus.targetStatIndex.set(0);
		progress$.finished.set(true);
		endBatch();
	},
});

export { progress$ };
