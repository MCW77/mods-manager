// react
import React, { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { Memo, reactive, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const modsView$ = stateLoader$.modsView$;

// hooks
import { useRenderCount } from "#/hooks/useRenderCount";

// domain
import type { Categories } from "../domain/Categories";

// components
const CategoryView = lazy(() => import("../components/CategoryView"));
const ViewSetupWidget = lazy(() => import("../components/ViewSetupWidget"));
import { FlexSidebar } from "#/components/FlexSidebar/FlexSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#ui/tabs";

const ReactiveTabs = reactive(Tabs);

const ModsView = React.memo(() => {
	const [t] = useTranslation("global-ui");
	useRenderCount("ModsView");
	const profile = use$(profilesManagement$.activeProfile);

	return (
		<FlexSidebar
			sidebarContent={<ViewSetupWidget />}
			mainContent={
				<ReactiveTabs
					className="flex flex-col"
					$value={modsView$.activeCategory}
					onValueChange={(category) =>
						modsView$.activeCategory.set(category as Categories)
					}
				>
					<TabsList className={"flex justify-around"}>
						<TabsTrigger value="AllMods">All Mods</TabsTrigger>
						<TabsTrigger value="Reveal">Reveal</TabsTrigger>
						<TabsTrigger value="Level">Level</TabsTrigger>
						<TabsTrigger value="Slice5Dot">Slice5Dot</TabsTrigger>
						<TabsTrigger value="Slice6E">Slice6E</TabsTrigger>
						<TabsTrigger value="Slice6Dot">Slice6Dot</TabsTrigger>
						<TabsTrigger value="Calibrate">Calibrate</TabsTrigger>
					</TabsList>
					<Memo>
						{() => (
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="AllMods"
							>
								<CategoryView />
							</TabsContent>
						)}
					</Memo>
					<Memo>
						{() => (
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Reveal"
							>
								<CategoryView />
							</TabsContent>
						)}
					</Memo>
					<Memo>
						{() => (
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Level"
							>
								<CategoryView />
							</TabsContent>
						)}
					</Memo>
					<Memo>
						{() => (
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Slice5Dot"
							>
								<CategoryView />
							</TabsContent>
						)}
					</Memo>
					<Memo>
						{() => (
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Slice6E"
							>
								<CategoryView />
							</TabsContent>
						)}
					</Memo>
					<Memo>
						{() => (
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Slice6Dot"
							>
								<CategoryView />
							</TabsContent>
						)}
					</Memo>
					<Memo>
						{() => (
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Calibrate"
							>
								<CategoryView />
							</TabsContent>
						)}
					</Memo>
				</ReactiveTabs>
			}
		/>
	);
});

ModsView.displayName = "ModsView";

export default ModsView;
