// react
import React, { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

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
import { Show, observer, reactive } from "@legendapp/state/react";
import { about$ } from "#/modules/about/state/about";
import { hotutils$ } from "#/modules/hotUtils/state/hotUtils";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { ui$ } from "#/modules/ui/state/ui";

// modules
import { Data } from "#/state/modules/data";

// domain
import type { SectionNames } from "#/modules/ui/domain/SectionNames";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Spinner } from "#/modules/busyIndication/components/Spinner";
import { Dialog } from "#/modules/dialog/components/Dialog";
import { ProfilesManager } from "#/modules/profilesManagement/components/ProfilesManager";

import { Toaster } from "#ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#ui/tabs";

// containers
import { AboutView } from "#/containers/AboutView/AboutView";
import { HelpView } from "#/modules/help/pages/HelpView";
import { ModsView } from "#/modules/modsView/pages/ModsView";
import { OptimizerView } from "#/containers/OptimizerView/OptimizerView";
import { SettingsView } from "#/modules/settings/pages/SettingsView";

const ReactiveTabs = reactive(Tabs);

const App = observer(
	React.memo(() => {
		const dispatch: ThunkDispatch = useDispatch();
		const [t] = useTranslation("global-ui");
		const firstSection = profilesManagement$.hasProfiles.peek()
			? "mods"
			: "help";

		console.log("rendering APP");

		useEffect(() => {
			const queryParams = new URLSearchParams(document.location.search);
			const allycode = queryParams.get("allyCode");
			const sessionId = queryParams.get("SessionID");

			if (allycode) {
				if (sessionId) {
					if (queryParams.has("NoPull")) {
						if (profilesManagement$.profiles.activeAllycode.get() === "")
							dispatch(
								Data.thunks.refreshPlayerData(
									allycode,
									false,
									sessionId,
									false,
								),
							);
						else hotutils$.sessionIdsByProfile[allycode].set(sessionId);
					} else {
						dispatch(
							Data.thunks.refreshPlayerData(allycode, true, sessionId, false),
						);
					}
				} else if (!queryParams.has("NoPull")) {
					dispatch(Data.thunks.refreshPlayerData(allycode, true, null));
				}
			}

			// Remove the query string after reading anything we needed from it.
			window.history.replaceState(
				{},
				document.title,
				document.location.href.split("?")[0],
			);

			// Check the current version of the app against the API
			about$.checkVersion();
			ui$.currentSection.set(firstSection);
		}, [firstSection, dispatch]);

		return (
			<Suspense fallback={<Spinner />}>
				<div className={"min-w-1 grow-1 flex flex-col h-full font-[Helvetica_Arial_sans-serif] text-left"}>
					<div className={`flex grow-1 justify-stretch overflow-hidden text-white
													before:content-["_"] before:fixed before:w-full before:h-full before:top-0 before:left-0 before:z-[-1] before:will-change-transform
												  before:bg-cover before:bg-[url('../../img/cantina-background.webp')] before:bg-no-repeat before:bg-center`}>
						<Dialog />
						<Spinner />
						<Toaster toastOptions={{ duration: 8000 }} />
						<ReactiveTabs
							className="flex flex-col grow-1 min-w-1"
							$value={ui$.currentSection}
							onValueChange={(section) =>
								ui$.currentSection.set(section as SectionNames)
							}
						>
							<div className={"flex justify-around p-1"}>
								<div className={"flex flex-gap-2 items-center"}>
									<img
										alt={"Logo"}
										className={"h-6"}
										src={"../../img/gold-crit-dmg-arrow-mod-cropped.png"}
									/>
									<TabsList>
										<Show if={profilesManagement$.hasProfiles}>
											{() => (
												<TabsTrigger value="mods">
													<div className={"flex flex-gap-1 items-center"}>
														<FontAwesomeIcon
															icon={faMagnifyingGlass}
															title={t("header.NavMods")}
														/>
														{t("header.NavMods")}
													</div>
												</TabsTrigger>
											)}
										</Show>
										<Show if={profilesManagement$.hasProfiles}>
											{() => (
												<TabsTrigger value="optimize">
													<div className={"flex flex-gap-1 items-center"}>
														<FontAwesomeIcon
															icon={faWrench}
															title={t("header.NavOptimizeMods")}
														/>
														{t("header.NavOptimizeMods")}
													</div>
												</TabsTrigger>
											)}
										</Show>
										<Show if={profilesManagement$.hasProfiles}>
											{() => (
												<TabsTrigger value="settings">
													<div className={"flex flex-gap-1 items-center"}>
														<FontAwesomeIcon
															icon={faGear}
															title={t("header.NavSettings")}
														/>
														{t("header.NavSettings")}
													</div>
												</TabsTrigger>
											)}
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
								<ProfilesManager />
							</div>
							<TabsContent className={"flex data-[state=active]:grow-1 min-h-0"} value="mods">
								<ModsView />
							</TabsContent>
							<TabsContent className={"flex data-[state=active]:grow-1 min-h-0"} value="optimize">
								<OptimizerView />
							</TabsContent>
							<TabsContent className={"flex data-[state=active]:grow-1 min-h-0"} value="settings">
								<SettingsView />
							</TabsContent>
							<TabsContent className={"flex data-[state=active]:grow-1 min-h-0"} value="help">
								<HelpView />
							</TabsContent>
							<TabsContent className={"flex data-[state=active]:grow-1 min-h-0"} value="about">
								<AboutView />
							</TabsContent>
						</ReactiveTabs>
					</div>
				</div>
			</Suspense>
		);
	}),
);

App.displayName = "App";

export { App };
