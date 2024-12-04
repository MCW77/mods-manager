// react
import type React from "react";
import { lazy, useState } from "react";
import { useTranslation } from "react-i18next";
import { Memo, Show, observer, useMount } from "@legendapp/state/react";

// styles
import {
	faArrowsRotate,
	faFire,
	faUser,
} from "@fortawesome/free-solid-svg-icons";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const hotutils$ = stateLoader$.hotutils$;

const { refreshPlayerData } = await import(
	"#/modules/profileFetch/profileFetch"
);

// hooks
import { useRenderCount } from "#/hooks/useRenderCount";

//components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProfileAdder = lazy(() => import("./ProfileAdder"));
const ProfileSelector = lazy(() => import("./ProfileSelector"));

import { Button } from "#ui/button";

const ProfilesManager: React.FC = observer(() => {
	useRenderCount("ProfilesManager");
	const [t] = useTranslation("global-ui");
	const [isAddingAProfile, setIsAddingAProfile] = useState(
		!profilesManagement$.hasProfiles.get(),
	);

	useMount(() => {
		hotutils$.isSubscribed();
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
									refreshPlayerData(
										profilesManagement$.profiles.activeAllycode.get(),
										true,
										null,
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
							{() => (
								<Button
									size={"icon"}
									type={"button"}
									variant={"outline"}
									onClick={() =>
										refreshPlayerData(
											profilesManagement$.profiles.activeAllycode.get(),
											true,
											hotutils$.activeSessionId.get() ?? null,
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
							)}
						</Memo>
					</Show>
					<Memo>
						{() => (
							<span>
								Last updated: {profilesManagement$.activeLastUpdated.get()}
							</span>
						)}
					</Memo>
				</div>
			</Show>
		</div>
	);
});

ProfilesManager.displayName = "ProfilesManager";

export default ProfilesManager;
