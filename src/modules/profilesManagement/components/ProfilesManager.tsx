// react
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import { Show, observer } from "@legendapp/state/react";

// styles
import {
	faArrowsRotate,
	faFire,
	faUser,
} from "@fortawesome/free-solid-svg-icons";

// state
import { hotutils$ } from "#/modules/hotUtils/state/hotUtils";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// modules
import { Data } from "#/state/modules/data";

//components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ProfileAdder } from "./ProfileAdder";
import { ProfileSelector } from "./ProfileSelector";

import { Button } from "#ui/button";

const ProfilesManager = observer(
	React.memo(() => {
		const dispatch: ThunkDispatch = useDispatch();
		const [t] = useTranslation("global-ui");
		const allycode = profilesManagement$.profiles.activeAllycode.get();
		const profiles = profilesManagement$.profiles.playernameByAllycode.get();
		const [isAddingAProfile, setIsAddingAProfile] = useState(
			Object.keys(profiles).length === 0,
		);

		return (
			<div className="flex items-center gap-2">
				<FontAwesomeIcon icon={faUser} />
				{isAddingAProfile ? (
					<ProfileAdder setAddMode={setIsAddingAProfile} />
				) : (
					<ProfileSelector setAddMode={setIsAddingAProfile} />
				)}
				<Show if={profilesManagement$.profiles.activeAllycode}>
					<div className="flex gap-1">
						<Button
							type={"button"}
							variant={"outline"}
							size={"icon"}
							onClick={() => {
								dispatch(Data.thunks.refreshPlayerData(allycode, true, null));
							}}
						>
							<FontAwesomeIcon
								icon={faArrowsRotate}
								title={`${t("header.Fetch")}`}
							/>
						</Button>
						<Show if={hotutils$.hasActiveSession}>
							<Button
								size={"icon"}
								type={"button"}
								variant={"outline"}
								onClick={() =>
									dispatch(
										Data.thunks.refreshPlayerData(
											allycode,
											true,
											hotutils$.activeSessionId.get() ?? null,
										),
									)
								}
							>
								<span className="fa-layers">
									<FontAwesomeIcon
										icon={faArrowsRotate}
										title={`${t("header.FetchHot")}`}
									/>
									<FontAwesomeIcon
										icon={faFire}
										size="sm"
										transform="shrink-1 right-14 down-15"
										color="Red"
									/>
								</span>
							</Button>
						</Show>
						<span>
							Last updated: {profilesManagement$.activeLastUpdated.get()}
						</span>
					</div>
				</Show>
			</div>
		);
	}),
);

ProfilesManager.displayName = "ProfilesManager";

export { ProfilesManager };
