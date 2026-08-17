// react
import { lazy, Suspense } from "react";
import { Memo, Show, Switch } from "@legendapp/state/react";

// state
import type { Observable } from "@legendapp/state";

// domain
import type { SectionData } from "../domain/SectionRegistry";

// components
import { Spinner } from "#/components/Spinner/Spinner";
import { TabsContent } from "#ui/tabs";

const AboutView = lazy(() => import("#/modules/about/pages/AboutView"));
const CompilationsView = lazy(
	() => import("#/modules/compilations/pages/CompilationsView"),
);
const HelpView = lazy(() => import("#/modules/help/pages/HelpView"));
const ModsView = lazy(() => import("#/modules/modsView/pages/ModsView"));
const OptimizerView = lazy(
	() => import("#/modules/optimizerView/pages/OptimizerView"),
);
const SettingsView = lazy(
	() => import("#/modules/settings/pages/SettingsView"),
);
const DatacronsView = lazy(
	() => import("#/modules/datacrons/pages/DatacronsView"),
);

const tabStyle =
	"flex data-[state=active]:grow-1 data-[state=inactive]:m-t-0 min-h-0";

interface PageContentProps {
	section$: Observable<SectionData>;
	hasProfiles$: Observable<boolean>;
}

interface ContentProps {
	section$: Observable<SectionData>;
}

function Content({ section$ }: ContentProps) {
	return (
		<Switch value={section$.name}>
			{{
				about: () => <AboutView />,
				compilations: () => <CompilationsView />,
				help: () => <HelpView />,
				mods: () => <ModsView />,
				optimizer: () => <OptimizerView />,
				settings: () => <SettingsView />,
				datacrons: () => <DatacronsView />,
			}}
		</Switch>
	);
}

function PageContent({ section$, hasProfiles$ }: PageContentProps) {
	return (
		<Switch value={section$.isAlwaysVisible}>
			{{
				true: () => (
					<TabsContent className={tabStyle} value={section$.name}>
						<Suspense
							fallback={
								section$.hasNullSuspenseFallback ? null : (
									<Spinner isVisible={true} />
								)
							}
						>
							<Content section$={section$} />
						</Suspense>
					</TabsContent>
				),
				default: () => (
					<Show if={hasProfiles$}>
						<Memo>
							<TabsContent className={tabStyle} value={section$.name}>
								<Suspense
									fallback={
										section$.hasNullSuspenseFallback ? null : (
											<Spinner isVisible={true} />
										)
									}
								>
									<Content section$={section$} />
								</Suspense>
							</TabsContent>
						</Memo>
					</Show>
				),
			}}
		</Switch>
	);
}

export { PageContent };
