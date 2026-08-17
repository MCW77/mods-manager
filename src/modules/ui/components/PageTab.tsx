// react
import { useTranslation } from "react-i18next";
import { Show } from "@legendapp/state/react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";
const profilesManagement$ = stateLoader$.profilesManagement$;

// domain
import type { SectionData } from "../domain/SectionRegistry";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { TabsTrigger } from "#ui/tabs";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface PageTabProps {
	section: SectionData;
}

function PageTab({ section }: PageTabProps) {
	const [t] = useTranslation("global-ui");

	return (
		<Show if={section.isAlwaysVisible || profilesManagement$.hasProfiles}>
			<TabsTrigger value={section.name}>
				<div className={"flex flex-gap-1 items-center"}>
					<FontAwesomeIcon icon={section.icon} title={t(section.titleKey)} />
					{t(section.titleKey)}
				</div>
			</TabsTrigger>
		</Show>
	);
}

export { PageTab };
