// react
import { lazy, Suspense, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
	Memo,
	Show,
	reactive,
	useMount,
	useObserve,
} from "@legendapp/state/react";

// styles
import "./App.css";
import {
	faGear,
	faInfo,
	faMagnifyingGlass,
	faQuestion,
	faWrench,
} from "@fortawesome/free-solid-svg-icons";

// state
import { observable } from "@legendapp/state";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const { refreshPlayerData } = await import(
	"#/modules/profileFetch/profileFetch"
);

import { ui$ } from "#/modules/ui/state/ui";

// domain
import type { SectionNames } from "#/modules/ui/domain/SectionNames";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Spinner } from "#/modules/busyIndication/components/Spinner";
import { Spinner as SimpleSpinner } from "#/components/Spinner/Spinner";
import { Dialog } from "#/modules/dialog/components/Dialog";
const ProfilesManager = lazy(
	() => import("#/modules/profilesManagement/components/ProfilesManager"),
);

import { Toaster } from "#ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#ui/tabs";

// containers
const AboutView = lazy(() => import("#/containers/AboutView/AboutView"));
const CompilationsView = lazy(
	() => import("#/modules/compilations/pages/CompilationsView"),
);
import { HelpView } from "#/modules/help/pages/HelpView";
const ModsView = lazy(() => import("#/modules/modsView/pages/ModsView"));
const OptimizerView = lazy(
	() => import("#/containers/OptimizerView/OptimizerView"),
);
const SettingsView = lazy(
	() => import("#/modules/settings/pages/SettingsView"),
);

const profilesManagement$ = stateLoader$.profilesManagement$;
const about$ = stateLoader$.about$;
const hotutils$ = stateLoader$.hotutils$;

const ReactiveTabs = reactive(Tabs);

const firstRender$ = observable(true);

const App = () => {
	const [t] = useTranslation("global-ui");

	useObserve(() => {
		const hasProfiles = profilesManagement$.hasProfiles.get();
		if (!hasProfiles) {
			ui$.currentSection.set("help");
		}
		ui$.currentSection.set("mods");
	});

	// Memoize the section change callback to prevent recreating it on every render
	const handleSectionChange = useCallback((section: string) => {
		ui$.currentSection.set(section as SectionNames);
	}, []);
	const tabStyle =
		"flex data-[state=active]:grow-1 data-[state=inactive]:m-t-0 min-h-0";

	useMount(() => {
		if (firstRender$.peek() === true) {
			firstRender$.set(false);
			const queryParams = new URLSearchParams(document.location.search);
			const allycode = queryParams.get("Allycode");
			const sessionId = queryParams.get("SessionID");

			if (allycode) {
				if (sessionId) {
					if (queryParams.has("NoPull")) {
						if (profilesManagement$.profiles.activeAllycode.peek() === "")
							refreshPlayerData(allycode, false, sessionId, false);
						else
							hotutils$.sessionIDsByProfile[allycode].gimoSessionId.set(
								sessionId,
							);
					} else {
						refreshPlayerData(allycode, true, sessionId, false);
					}
				} else if (!queryParams.has("NoPull")) {
					refreshPlayerData(allycode, true, null, false);
				}
			}

			// Remove the query string after reading anything we needed from it.
			window.history.replaceState(
				{},
				document.title,
				document.location.href.split("?")[0],
			);

			about$.checkVersion();
		}
		console.log("App mounted");
	});

	return (
		<Suspense fallback={<div className={"bg-black h-full w-full"} />}>
			<div
				className={
					"min-w-1 grow-1 flex flex-col h-full font-[Helvetica_Arial_sans-serif]"
				}
			>
				<div
					className={`flex grow-1 justify-stretch overflow-hidden text-foreground
													before:content-["_"] before:fixed before:w-full before:h-full before:top-0 before:left-0 before:z-[-1] before:will-change-transform
												  before:bg-cover before:dark:bg-[url('/img/cantina-background.webp')] before:bg-no-repeat before:bg-center`}
				>
					<Dialog />
					<Spinner />
					<Toaster toastOptions={{ duration: 8000 }} />
					<ReactiveTabs
						className="flex flex-col grow-1 min-w-1"
						$value={ui$.currentSection}
						onValueChange={handleSectionChange}
					>
						<div className={"flex justify-around p-1"}>
							<div className={"flex flex-gap-2 items-center"}>
								<img
									alt={"Logo"}
									className={"h-6"}
									src={"/img/gold-crit-dmg-arrow-mod-cropped.webp"}
								/>
								<TabsList>
									<Show if={profilesManagement$.hasProfiles}>
										<TabsTrigger value="mods">
											<div className={"flex flex-gap-1 items-center"}>
												<FontAwesomeIcon
													icon={faMagnifyingGlass}
													title={t("header.NavMods")}
												/>
												{t("header.NavMods")}
											</div>
										</TabsTrigger>
									</Show>
									<Show if={profilesManagement$.hasProfiles}>
										<TabsTrigger value="mod compilations">
											<div className={"flex flex-gap-1 items-center"}>
												<FontAwesomeIcon
													icon={faMagnifyingGlass}
													title={t("header.NavModCompilations")}
												/>
												{t("header.NavModCompilations")}
											</div>
										</TabsTrigger>
									</Show>
									<Show if={profilesManagement$.hasProfiles}>
										<TabsTrigger value="optimize">
											<div className={"flex flex-gap-1 items-center"}>
												<FontAwesomeIcon
													icon={faWrench}
													title={t("header.NavOptimizeMods")}
												/>
												{t("header.NavOptimizeMods")}
											</div>
										</TabsTrigger>
									</Show>
									<Show if={profilesManagement$.hasProfiles}>
										<TabsTrigger value="settings">
											<div className={"flex flex-gap-1 items-center"}>
												<FontAwesomeIcon
													icon={faGear}
													title={t("header.NavSettings")}
												/>
												{t("header.NavSettings")}
											</div>
										</TabsTrigger>
									</Show>
									<TabsTrigger value="help">
										<div className={"flex flex-gap-1 items-center"}>
											<FontAwesomeIcon
												icon={faQuestion}
												title={t("header.NavHelp")}
											/>
											{t("header.NavHelp")}
										</div>
									</TabsTrigger>
									<TabsTrigger value="about">
										<div className={"flex flex-gap-1 items-center"}>
											<FontAwesomeIcon
												icon={faInfo}
												title={t("header.NavAbout")}
											/>
											{t("header.NavAbout")}
										</div>
									</TabsTrigger>
								</TabsList>
							</div>
							<Memo>
								<ProfilesManager />
							</Memo>
						</div>
						<Show if={profilesManagement$.hasProfiles}>
							<Memo>
								<TabsContent className={tabStyle} value="mods">
									<ModsView />
								</TabsContent>
							</Memo>
						</Show>
						<Show if={profilesManagement$.hasProfiles}>
							<Memo>
								<TabsContent className={tabStyle} value="mod compilations">
									<CompilationsView />
								</TabsContent>
							</Memo>
						</Show>
						<Show if={profilesManagement$.hasProfiles}>
							<Memo>
								<TabsContent className={tabStyle} value="optimize">
									<Suspense fallback={<SimpleSpinner isVisible={true} />}>
										<OptimizerView />
									</Suspense>
								</TabsContent>
							</Memo>
						</Show>
						<Show if={profilesManagement$.hasProfiles}>
							<Memo>
								<TabsContent className={tabStyle} value="settings">
									<SettingsView />
								</TabsContent>
							</Memo>
						</Show>
						<TabsContent className={tabStyle} value="help">
							<HelpView />
						</TabsContent>
						<TabsContent className={tabStyle} value="about">
							<AboutView />
						</TabsContent>
					</ReactiveTabs>
				</div>
			</div>
		</Suspense>
	);
};

App.displayName = "App";

export default App;
