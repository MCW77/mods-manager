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

	const containerCSS =
		"grid gap-3 md:grid-cols-[[labels]auto_[gimo]1fr[hu]1fr] grid-auto-flow-row items-center justify-items-start" as const;
	const labelCSS = "grid-col-[labels] grid-row-auto" as const;
	const gimoCSS = "grid-col-[gimo] grid-row-auto" as const;
	const huCSS = "grid-col-[hu] grid-row-auto" as const;
	const namesByAllycode = use$(
		profilesManagement$.profiles.playernameByAllycode,
	);

	return (
		<div className={containerCSS}>
			<Label className={"labelCSS"}>{t("general.accounts.Profile")}</Label>
			{Object.entries(namesByAllycode).map(([allycode, name]) => (
				<Fragment key={allycode}>
					<Label className={labelCSS} htmlFor="player">
						{`${allycode} - ${name}`}
					</Label>
					<ReactiveInput
						className={gimoCSS}
						placeholder={t("general.hotutils.SessionIdPrompt")}
						size={20}
						type="text"
						$value={hotutils$.sessionIDsByProfile[allycode].gimoSessionId}
						onChange={(event) =>
							hotutils$.sessionIDsByProfile[allycode].gimoSessionId.set(
								event.target.value,
							)
						}
					/>
					<ReactiveInput
						className={huCSS}
						placeholder={t("general.hotutils.SessionIdPrompt")}
						size={20}
						type="text"
						$value={hotutils$.sessionIDsByProfile[allycode].huSessionId}
						onChange={(event) =>
							hotutils$.sessionIDsByProfile[allycode].huSessionId.set(
								event.target.value,
							)
						}
					/>
				</Fragment>
			))}
		</div>
	);
};

HotutilsSettingsForm.displayName = "HotutilsSettingsForm";

export default HotutilsSettingsForm;
