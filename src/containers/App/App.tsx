// react
import { Suspense, useCallback } from "react";
import {
	For,
	Memo,
	Show,
	reactive,
	useMount,
	useObserve,
	useValue,
} from "@legendapp/state/react";

// styles
import "./App.css";

// state
import { observable } from "@legendapp/state";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

import { refreshPlayerData } from "#/modules/profileFetch/profileFetch";

import { ui$ } from "#/modules/ui/state/ui";

// domain
import type { SectionNames } from "#/modules/ui/domain/SectionNames";

// components
import { Spinner } from "#/modules/busyIndication/components/Spinner";
import { PageContent } from "#/modules/ui/components/PageContent";
import { PageTab } from "#/modules/ui/components/PageTab";
import { ThemeToggle } from "#/modules/ui/components/ThemeToggle";
import { Spinner as SimpleSpinner } from "#/components/Spinner/Spinner";
import { Dialog } from "#/modules/dialog/components/Dialog";
import ProfileSwitcher from "#/modules/profilesManagement/components/ProfileSwitcher";

import { Toaster } from "#ui/sonner";
import { Tabs, TabsList } from "#ui/tabs";

const profilesManagement$ = stateLoader$.profilesManagement$;
const about$ = stateLoader$.about$;
const hotutils$ = stateLoader$.hotutils$;

const ReactiveTabs = reactive(Tabs);

const firstRender$ = observable(true);

profilesManagement$.hasProfiles.onChange(({ value }) => {
	if (value === true) {
		ui$.loadAllPageModules();
	}
});

const AppContent = () => {
	const themeClass = useValue(ui$.themeClass);

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
				className={`${themeClass} min-w-1 grow-1 flex flex-col h-full font-[Helvetica_Arial_sans-serif]`}
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
									height={24}
									width={24}
									src={"/img/gold-crit-dmg-arrow-mod-cropped.webp"}
								/>
								<TabsList>
									<For each={ui$.orderedSectionRegistry}>
										{(section$) => {
											const section = section$.get();
											return <PageTab section={section} key={section.name} />;
										}}
									</For>
								</TabsList>
							</div>
							<Memo>
								<ProfileSwitcher />
							</Memo>
							<ThemeToggle />
						</div>
						<For each={ui$.orderedSectionRegistry}>
							{(section$) => {
								const section = section$.get();
								return (
									<PageContent
										section$={section$}
										hasProfiles$={profilesManagement$.hasProfiles}
										key={section.name}
									/>
								);
							}}
						</For>
					</ReactiveTabs>
				</div>
			</div>
		</Suspense>
	);
};

AppContent.displayName = "AppContent";

const App = () => {
	return (
		<Show
			if={stateLoader$.isDone}
			else={
				<div className="flex h-full w-full items-center justify-center bg-black">
					<SimpleSpinner isVisible={true} />
				</div>
			}
		>
			<AppContent />
		</Show>
	);
};

App.displayName = "App";

export default App;
