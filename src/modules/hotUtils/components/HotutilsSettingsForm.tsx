// react
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";

// state
import { useValue } from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const hotutils$ = stateLoader$.hotutils$;

// components
import { Input } from "#/components/reactive/Input";
import { Label } from "#ui/label";

const HotutilsSettingsForm = () => {
	const [t] = useTranslation("settings-ui");

	const containerCSS =
		"grid gap-3 grid-cols-[auto_1fr] auto-rows-auto items-start justify-items-start w-full" as const;
	const labelCSS = "col-start-1 justify-self-start" as const;
	const inputsContainerCSS = "col-start-2 w-full space-y-2" as const;
	const inputCSS = "w-full min-w-72" as const;
	const namesByAllycode = useValue(
		profilesManagement$.profiles.playernameByAllycode,
	);

	return (
		<div className={containerCSS}>
			<Label className={labelCSS}>{t("general.accounts.Profile")}</Label>
			<div className={inputsContainerCSS}>
				<div className="text-sm font-medium text-muted-foreground">
					Session IDs
				</div>
			</div>
			{Object.entries(namesByAllycode).map(([allycode, name]) => (
				<Fragment key={allycode}>
					<Label className={labelCSS} htmlFor="player">
						{`${allycode} - ${name}`}
					</Label>
					<div className={inputsContainerCSS}>
						<Input
							className={inputCSS}
							placeholder={t("general.hotutils.GIMOSessionIdPrompt")}
							type="text"
							$value={hotutils$.sessionIDsByProfile[allycode].gimoSessionId}
						/>
						<Input
							className={inputCSS}
							placeholder={t("general.hotutils.HUSessionIdPrompt")}
							type="text"
							$value={hotutils$.sessionIDsByProfile[allycode].huSessionId}
						/>
					</div>
				</Fragment>
			))}
		</div>
	);
};

HotutilsSettingsForm.displayName = "HotutilsSettingsForm";

export default HotutilsSettingsForm;
