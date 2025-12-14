// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";
import {
	Memo,
	Show,
	Switch,
	useMount,
	useObservable,
} from "@legendapp/state/react";

// styles
import {
	faArrowsRotate,
	faFire,
	faUser,
} from "@fortawesome/free-solid-svg-icons";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const profilesManagement$ = stateLoader$.profilesManagement$;
const hotutils$ = stateLoader$.hotutils$;

const { refreshPlayerData } = await import(
	"#/modules/profileFetch/profileFetch.jsx"
);

//components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProfileAdder = lazy(() => import("./ProfileAdder.jsx"));
const ProfileSelector = lazy(() => import("./ProfileSelector.jsx"));

import { Button } from "#ui/button.jsx";

const ProfilesManager = () => {
	const [t] = useTranslation("global-ui");
	const isAddingProfile$ = useObservable<boolean>(
		!profilesManagement$.hasProfiles.peek(),
	);
	profilesManagement$.hasProfiles.onChange(({ value }) => {
		if (!value) isAddingProfile$.set(true);
	});

	return (
		<div className="flex items-center gap-2">
			<FontAwesomeIcon icon={faUser} />
			<Switch value={isAddingProfile$}>
				{{
					true: () => <ProfileAdder isAddingProfile$={isAddingProfile$} />,
					false: () => <ProfileSelector isAddingProfile$={isAddingProfile$} />,
				}}
			</Switch>
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
					</Show>
					<Memo>
						<div className="flex flex-col items-center justify-center gap-1">
							<span className="w-full min-w-max text-sm text-foreground text-balance">
								Last updated:
							</span>
							<span className="w-full min-w-max text-sm text-foreground text-balance">
								{profilesManagement$.activeLastUpdated.get()}
							</span>
						</div>
					</Memo>
				</div>
			</Show>
		</div>
	);
};

ProfilesManager.displayName = "ProfilesManager";

export default ProfilesManager;
