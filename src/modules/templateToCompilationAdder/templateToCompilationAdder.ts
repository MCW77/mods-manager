// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
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
			Object.keys(
				profilesManagement$.activeProfile.characterById.peek(),
			).includes(selectedCharacter.id)
				? "existing"
				: "missing",
	);

	if (splitSelectedCharacters.existing === undefined) return [];
	compilations$.defaultCompilation.hasSelectionChanged.set(true);

	for (const selectedCharacterInTemplate of splitSelectedCharacters.existing) {
		const target = structuredClone(selectedCharacterInTemplate.target);
		const selectedCharacter =
			compilations$.defaultCompilation.selectedCharacters.find(
				(selectedCharacter) =>
					selectedCharacter.peek().id === selectedCharacterInTemplate.id,
			);
		if (selectedCharacter === undefined) {
			compilations$.selectCharacter(
				selectedCharacterInTemplate.id,
				target,
				compilations$.defaultCompilation.selectedCharacters.length - 1,
			);
		} else {
			selectedCharacter.target.set(selectedCharacterInTemplate.target);
		}
		const character =
			profilesManagement$.activeProfile.characterById[
				selectedCharacterInTemplate.id
			];
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
			Object.keys(
				profilesManagement$.activeProfile.characterById.peek(),
			).includes(selectedCharacter.id)
				? "existing"
				: "missing",
	);
	compilations$.defaultCompilation.selectedCharacters.set(
		splitSelectedCharacters.existing?.slice() ?? [],
	);
	compilations$.defaultCompilation.hasSelectionChanged.set(true);

	if (splitSelectedCharacters.existing === undefined) return [];
	for (const selectedCharacterInTemplate of splitSelectedCharacters.existing) {
		const target = structuredClone(selectedCharacterInTemplate.target);
		const character =
			profilesManagement$.activeProfile.characterById[
				selectedCharacterInTemplate.id
			];
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
			compilations$.defaultCompilation.selectedCharacters
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
		const target = structuredClone(selectedCharacterInTemplate.target);
		const selectedCharacter =
			compilations$.defaultCompilation.selectedCharacters.find(
				(selectedCharacter) =>
					selectedCharacter.peek().id === selectedCharacterInTemplate.id,
			);
		if (selectedCharacter === undefined) continue;
		selectedCharacter.target.set(selectedCharacterInTemplate.target);
		compilations$.defaultCompilation.hasSelectionChanged.set(true);
	}

	if (splitSelectedCharacters.missing?.length) {
		return splitSelectedCharacters.missing;
	}
	return [];
};

export { appendTemplate, replaceWithTemplate, applyTemplateTargets };
