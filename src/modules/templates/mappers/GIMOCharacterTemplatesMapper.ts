// utils
import type * as v from "valibot";

// domain
import type { CharacterTemplates } from "../domain/CharacterTemplates";
import type { CharacterTemplatesSchema as GIMOCharacterTemplatesSchema } from "#/domain/schemas/gimo/CharacterTemplatesSchemas";

// mappers
import { fromGIMOOptimizationPlan } from "./GIMOOptimizationPlanMapper";

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
