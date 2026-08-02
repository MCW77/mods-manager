// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const roster$ = stateLoader$.roster$;
const defaultCompilation$ = stateLoader$.defaultCompilation$;
const templates$ = stateLoader$.templates$;

// domain
import { characterSettings } from "#/constants/characterSettings";

const appendTemplate = (templateName: string) => {
	const template = templates$.allTemplates
		.get()
		.find(({ id }) => id === templateName);
	if (template === undefined) return [];

	const splitSelectedCharacters = Object.groupBy(
		template.selectedCharacters,
		(selectedCharacter) =>
			Object.keys(roster$.activeCharacterById.peek()).includes(
				selectedCharacter.id,
			)
				? "existing"
				: "missing",
	);

	if (splitSelectedCharacters.existing === undefined) return [];
	defaultCompilation$.data.reoptimizationIndex.set(-1);

	for (const selectedCharacterInTemplate of splitSelectedCharacters.existing) {
		const target = structuredClone(selectedCharacterInTemplate.target);
		const selectedCharacter = defaultCompilation$.data.selectedCharacters.find(
			(selectedCharacter) =>
				selectedCharacter.peek().id === selectedCharacterInTemplate.id,
		);
		if (selectedCharacter === undefined) {
			defaultCompilation$.selectCharacter(
				selectedCharacterInTemplate.id,
				target,
				defaultCompilation$.data.selectedCharacters.length - 1,
			);
		} else {
			selectedCharacter.target.set(selectedCharacterInTemplate.target);
		}
		const character =
			roster$.activeCharacterById[selectedCharacterInTemplate.id];
		if (character === undefined) continue;
		const characterTarget = character.targets.find(
			(t) => t.peek().id === selectedCharacterInTemplate.target.id,
		);
		if (characterTarget === undefined) {
			const builtinTarget = characterSettings[
				selectedCharacterInTemplate.id
			].targets.find((t) => t.id === selectedCharacterInTemplate.target.id);
			if (builtinTarget !== undefined) continue;
			character.targets.push(target);
		} else {
			characterTarget.set(target);
		}
	}
	if (splitSelectedCharacters.missing?.length) {
		return splitSelectedCharacters.missing;
	}
	return [];
};

const replaceWithTemplate = (templateName: string) => {
	const template = templates$.allTemplates
		.get()
		.find(({ id }) => id === templateName);
	if (template === undefined) return [];

	const splitSelectedCharacters = Object.groupBy(
		template.selectedCharacters,
		(selectedCharacter) =>
			Object.keys(roster$.activeCharacterById.peek()).includes(
				selectedCharacter.id,
			)
				? "existing"
				: "missing",
	);
	defaultCompilation$.data.selectedCharacters.set(
		splitSelectedCharacters.existing?.slice() ?? [],
	);
	defaultCompilation$.data.reoptimizationIndex.set(-1);

	if (splitSelectedCharacters.existing === undefined) return [];
	for (const selectedCharacterInTemplate of splitSelectedCharacters.existing) {
		const target = structuredClone(selectedCharacterInTemplate.target);
		const character =
			roster$.activeCharacterById[selectedCharacterInTemplate.id];
		if (character === undefined) continue;
		const characterTarget = character.targets.find(
			(t) => t.peek().id === selectedCharacterInTemplate.target.id,
		);
		if (characterTarget === undefined) {
			const builtinTarget = characterSettings[
				selectedCharacterInTemplate.id
			].targets.find((t) => t.id === selectedCharacterInTemplate.target.id);
			if (builtinTarget !== undefined) continue;
			character.targets.push(target);
		} else {
			characterTarget.set(target);
		}
	}
	if (splitSelectedCharacters.missing?.length) {
		return splitSelectedCharacters.missing;
	}
	return [];
};

const applyTemplateTargets = (templateName: string) => {
	const template = templates$.allTemplates
		.get()
		.find(({ id }) => id === templateName);
	if (template === undefined) return [];

	const splitSelectedCharacters = Object.groupBy(
		template.selectedCharacters,
		(templateSelectedCharacter) =>
			defaultCompilation$.data.selectedCharacters
				.peek()
				.some(
					(selectedCharacter) =>
						selectedCharacter.id === templateSelectedCharacter.id,
				)
				? "existing"
				: "missing",
	);

	if (splitSelectedCharacters.existing === undefined) return [];
	for (const selectedCharacterInTemplate of splitSelectedCharacters.existing) {
		const selectedCharacter = defaultCompilation$.data.selectedCharacters.find(
			(selectedCharacter) =>
				selectedCharacter.peek().id === selectedCharacterInTemplate.id,
		);
		if (selectedCharacter === undefined) continue;
		selectedCharacter.target.set(selectedCharacterInTemplate.target);
		defaultCompilation$.data.reoptimizationIndex.set(-1);
	}

	if (splitSelectedCharacters.missing?.length) {
		return splitSelectedCharacters.missing;
	}
	return [];
};

export { appendTemplate, replaceWithTemplate, applyTemplateTargets };
