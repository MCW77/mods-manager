// react
import { lazy, useState } from "react";
import { useTranslation } from "react-i18next";
import { Memo, Show, useMount } from "@legendapp/state/react";

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

const ProfilesManager = () => {
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
				<div className="flex items-center gap-2">
					<Show
						if={hotutils$.hasActiveSession}
						else={() => (
							<Button
								className="aspect-ratio-square"
								size={"icon"}
								type={"button"}
								variant={"outline"}
								onClick={() => {
									refreshPlayerData(
										profilesManagement$.profiles.activeAllycode.peek(),
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
					>
						{() => (
							<Button
								className="aspect-ratio-square m-r-1 m-b-1"
								size={"icon"}
								type={"button"}
								variant={"outline"}
								onClick={() =>
									refreshPlayerData(
										profilesManagement$.profiles.activeAllycode.peek(),
										true,
										hotutils$.activeSessionId.peek() ?? null,
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
					</Show>
					<Memo>
						{() => (
							<div className="flex flex-col items-center justify-center gap-1">
								<span className="w-full min-w-max text-sm text-foreground text-balance">
									Last updated:
								</span>
								<span className="w-full min-w-max text-sm text-foreground text-balance">
									{profilesManagement$.activeLastUpdated.get()}
								</span>
							</div>
						)}
					</Memo>
				</div>
			</Show>
		</div>
	);
};

ProfilesManager.displayName = "ProfilesManager";

export default ProfilesManager;
