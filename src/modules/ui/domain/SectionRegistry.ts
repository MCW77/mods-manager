import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { ParseKeys } from "i18next";

type TKeys = ParseKeys<"global-ui">;

// `#/components/icons/fa${Capitalize<IconName>}`
interface SectionData {
	icon: IconDefinition;
	isAlwaysVisible: boolean;
	name: string;
	hasNullSuspenseFallback: boolean;
	titleKey: TKeys;
	position: number;
}

type SectionRegistry = SectionData[];

export type { SectionData, SectionRegistry };
