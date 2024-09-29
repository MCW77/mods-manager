// react
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import { Memo, Show, observer, useMount } from "@legendapp/state/react";

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

// hooks
import { useRenderCount } from "#/hooks/useRenderCount";

//components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ProfileAdder } from "./ProfileAdder";
import { ProfileSelector } from "./ProfileSelector";

import { Button } from "#ui/button";

const ProfilesManager = observer(
	React.memo(() => {
		useRenderCount("ProfilesManager");
		const dispatch: ThunkDispatch = useDispatch();
		const [t] = useTranslation("global-ui");
		const [isAddingAProfile, setIsAddingAProfile] = useState(
			!profilesManagement$.hasProfiles.get(),
		);

		useMount(() => {
			console.log("ProfilesManager mounted");
		});

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
						<Memo>
							{() => (
								<Button
									size={"icon"}
									type={"button"}
									variant={"outline"}
									onClick={() => {
										dispatch(
											Data.thunks.refreshPlayerData(
												profilesManagement$.profiles.activeAllycode.get(),
												true,
												null,
											),
										);
									}}
								>
									<FontAwesomeIcon
										icon={faArrowsRotate}
										title={`${t("header.Fetch")}`}
									/>
								</Button>
							)}
						</Memo>
						<Show if={hotutils$.hasActiveSession}>
							<Memo>
								{() =>
									<Button
										size={"icon"}
										type={"button"}
										variant={"outline"}
										onClick={() =>
											dispatch(
												Data.thunks.refreshPlayerData(
													profilesManagement$.profiles.activeAllycode.get(),
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
								}
							</Memo>
						</Show>
						<Memo>
							{() =>
								<span>
									Last updated: {profilesManagement$.activeLastUpdated.get()}
								</span>
							}
						</Memo>
					</div>
				</Show>
			</div>
		);
	}),
);

ProfilesManager.displayName = "ProfilesManager";

export { ProfilesManager };
