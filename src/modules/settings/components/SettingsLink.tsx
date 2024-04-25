// react
import React from "react";

// state
import { settings$ } from "../state/settings";

// domain
import { SettingsSections } from "../domain/SettingsSections";

// components
import { Settings as SettingsIcon } from "lucide-react";

import { Button } from "#ui/button";

type ComponentProps = {
	title: string;
	section: SettingsSections;
};

const SettingsLink = React.memo(({ title, section }: ComponentProps) => {
	return (
		<Button
			className="inline-block h-6 w-6 m-x-1 m-y-0 align-middle cursor-pointer"
			size="icon"
			title={title}
			variant="ghost"
			onClick={() => settings$.section.set(section)}
		>
			<SettingsIcon className="h-6 w-6 m-auto"></SettingsIcon>
		</Button>
	);
});

SettingsLink.displayName = "SettingsLink";

export { SettingsLink };
