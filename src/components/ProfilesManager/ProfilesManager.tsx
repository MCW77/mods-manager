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

import { ProfileAdder } from "#/components/ProfileAdder/ProfileAdder";
import { ProfileSelector } from "#/components/ProfileSelector/ProfileSelector";
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
			<div className="flex items-center">
				<FontAwesomeIcon icon={faUser} className="m-r-1" />
				{isAddingAProfile ? (
					<ProfileAdder setAddMode={setIsAddingAProfile} />
				) : (
					<ProfileSelector setAddMode={setIsAddingAProfile} />
				)}
				{allycode && (
					<>
						<div className="flex gap-1">
							<Button
								className={"m-l-2"}
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
						</div>
					</>
				)}
			</div>
		);
	}),
);

ProfilesManager.displayName = "ProfilesManager";

export { ProfilesManager };
