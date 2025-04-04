// react
import React from "react";
import { useTranslation } from "react-i18next";
import { observer, reactive, use$ } from "@legendapp/state/react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
// components
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

const ReactiveSelect = reactive(Select);

type ComponentProps = {
	setAddMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileSelector = observer(
	React.memo(({ setAddMode }: ComponentProps) => {
		const [t] = useTranslation("global-ui");
		const profiles = use$(profilesManagement$.profiles.playernameByAllycode);
		const allycode = use$(profilesManagement$.profiles.activeAllycode);

		return (
			<ReactiveSelect
				value={allycode ?? ""}
				onValueChange={(value) => {
					if (value === "new") {
						setAddMode(true);
					} else {
						if (value === "") return;
						profilesManagement$.profiles.activeAllycode.set(value);
					}
				}}
			>
				<SelectTrigger className="w-60 accent-blue">
					<SelectValue placeholder={allycode} />
				</SelectTrigger>
				<SelectContent className="accent-blue">
					<SelectGroup className="accent-blue">
						{Object.entries(profiles).map(([allycode, playerName]) => (
							<SelectItem key={allycode} value={allycode}>
								{playerName}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup className="accent-blue">
						<SelectItem key="new" value="new">
							{t("header.ProfileAdderNewCode")}
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</ReactiveSelect>
		);
	}),
);

ProfileSelector.displayName = "ProfileSelector";

export default ProfileSelector;
