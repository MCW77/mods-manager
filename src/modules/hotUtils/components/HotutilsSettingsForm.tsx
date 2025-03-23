// react
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";

// state
import { reactive, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const hotutils$ = stateLoader$.hotutils$;

// components
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

const ReactiveInput = reactive(Input);

const HotutilsSettingsForm = () => {
	const [t, i18n] = useTranslation("settings-ui");

	const globalCSS =
		"grid gap-3 md:grid-cols-[[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
	const labelCSS = "grid-col-[labels] grid-row-auto" as const;
	const inputCSS = "grid-col-[controls] grid-row-auto" as const;
	const namesByAllycode = use$(
		profilesManagement$.profiles.playernameByAllycode,
	);

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
};

HotutilsSettingsForm.displayName = "HotutilsSettingsForm";

export default HotutilsSettingsForm;
