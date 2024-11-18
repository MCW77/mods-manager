// react
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";

// state
import { observer, reactive } from "@legendapp/state/react";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// components
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { hotutils$ } from "../state/hotUtils";

const ReactiveInput = reactive(Input);

const HotutilsSettingsForm: React.FC = observer(() => {
	const [t, i18n] = useTranslation("settings-ui");

	const globalCSS =
		"grid gap-3 md:grid-cols-[[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
	const labelCSS = "grid-col-[labels] grid-row-auto" as const;
	const inputCSS = "grid-col-[controls] grid-row-auto" as const;
	const namesByAllycode =
		profilesManagement$.profiles.playernameByAllycode.get();

	return (
		<div className={globalCSS}>
			<Label className={"labelCSS"}>{t("general.accounts.Profile")}</Label>
			{Object.entries(namesByAllycode).map(([allycode, name]) => (
				<Fragment key={allycode}>
					<Label className={labelCSS} htmlFor="player">
						{`${allycode} - ${name}`}
					</Label>
					<ReactiveInput
						className={inputCSS}
						placeholder={t("general.hotutils.SessionIdPrompt")}
						size={20}
						type="text"
						$value={hotutils$.sessionIdByProfile[allycode]}
						onChange={(event) =>
							hotutils$.sessionIdByProfile[allycode].set(event.target.value)
						}
					/>
				</Fragment>
			))}
		</div>
	);
});

HotutilsSettingsForm.displayName = "HotutilsSettingsForm";

export { HotutilsSettingsForm };
