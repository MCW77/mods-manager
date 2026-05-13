// react
import { useId } from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

import { ui$ } from "../state/ui";

// components
import { Label } from "#ui/label";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { Select as ReactiveSelect } from "#/components/reactive/Select";

const languageItems = [
	{ label: "English", value: "en-US" },
	{ label: "Deutsch", value: "de-DE" },
];

const UISettingsForm: React.FC = observer(() => {
	const [t] = useTranslation("settings-ui");
	const languageId = useId();

	const globalCSS =
		"grid gap-3 md:grid-cols-[[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
	const labelCSS = "grid-col-[labels] grid-row-auto" as const;
	const inputCSS = "grid-col-[controls] grid-row-auto" as const;

	return (
		<div className={globalCSS}>
			<Label className={labelCSS} htmlFor={`languageId_${languageId}`}>
				{t("general.display.Language")}
			</Label>
			<ReactiveSelect items={languageItems} $value={ui$.language}>
				<SelectTrigger
					className={`${inputCSS} w-[180px] accent-blue`}
					id={`languageId_${languageId}`}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent className="accent-blue">
					<SelectItem key={"English"} value={"en-US"}>
						English
					</SelectItem>
					<SelectItem key={"Deutsch"} value={"de-DE"}>
						Deutsch
					</SelectItem>
				</SelectContent>
			</ReactiveSelect>
		</div>
	);
});

UISettingsForm.displayName = "UISettingsForm";

export { UISettingsForm };
