// react
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import { observer, reactive } from "@legendapp/state/react";

// state
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// modules
import { Storage } from "#/state/modules/storage";

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
		const dispatch: ThunkDispatch = useDispatch();
		const [t] = useTranslation("global-ui");
		const profiles = profilesManagement$.profiles.playernameByAllycode.get();
		const allycode = profilesManagement$.profiles.activeAllycode.get();

		return (
			<ReactiveSelect
				value={allycode}
				onValueChange={(value) => {
					if (value === "new") {
						setAddMode(true);
					} else {
						dispatch(Storage.thunks.loadProfile(value));
						profilesManagement$.profiles.activeAllycode.set(value);
					}
				}}
			>
				<SelectTrigger className="w-[180px] accent-blue">
					<SelectValue placeholder={allycode} />
				</SelectTrigger>
				<SelectContent className="accent-blue">
					<SelectGroup className="accent-blue">
						{Object.entries(profiles).map(([allyCode, playerName]) => (
							<SelectItem key={allyCode} value={allyCode}>
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

export { ProfileSelector };
