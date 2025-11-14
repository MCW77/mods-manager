// utils
import type * as v from "valibot";

// domain
import type { CharacterTemplates } from "../domain/CharacterTemplates.js";
import type { CharacterTemplatesSchema as GIMOCharacterTemplatesSchema } from "#/domain/schemas/gimo/CharacterTemplatesSchemas.js";

// mappers
import { fromGIMOOptimizationPlan } from "./GIMOOptimizationPlanMapper.js";

type GIMOCharacterTemplates = v.InferOutput<
	typeof GIMOCharacterTemplatesSchema
>;

export const fromGIMOCharacterTemplates = (
	templates: GIMOCharacterTemplates,
): CharacterTemplates => {
	return templates.map((template) => {
		return {
			id: template.name,
			category: "",
			selectedCharacters: template.selectedCharacters.map(
				(selectedCharacter) => {
					return {
						id: selectedCharacter.id,
						target: fromGIMOOptimizationPlan(selectedCharacter.target),
					};
				},
			),
		};
	});
};
