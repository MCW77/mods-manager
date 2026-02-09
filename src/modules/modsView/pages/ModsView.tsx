// react
import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";

// state
import { Memo, reactive } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const modsView$ = stateLoader$.modsView$;

// domain
import type { Categories } from "../domain/Categories";

// components
import GroupedMods from "../components/GroupedMods";
import ViewSetupWidget from "../components/ViewSetupWidget";
import { FlexSidebar } from "#/components/FlexSidebar/FlexSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#ui/tabs";

const ReactiveTabs = reactive(Tabs);

const ModsView = React.memo(() => {
	const [t] = useTranslation("explore-ui");

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
						<TabsTrigger value="AllMods">{t("categories.All")}</TabsTrigger>
						<TabsTrigger value="Reveal">{t("categories.Reveal")}</TabsTrigger>
						<TabsTrigger value="Level">{t("categories.Level")}</TabsTrigger>
						<TabsTrigger value="Slice5Dot">
							{t("categories.Slice5Dot")}
						</TabsTrigger>
						<TabsTrigger value="Slice6E">{t("categories.Slice6E")}</TabsTrigger>
						<TabsTrigger value="Slice6Dot">
							{t("categories.Slice6Dot")}
						</TabsTrigger>
						<TabsTrigger value="Calibrate">
							{t("categories.Calibrate")}
						</TabsTrigger>
					</TabsList>
					<Memo>
						<Suspense fallback={null}>
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="AllMods"
							>
								<GroupedMods />
							</TabsContent>
						</Suspense>
					</Memo>
					<Memo>
						<Suspense fallback={null}>
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Reveal"
							>
								<GroupedMods />
							</TabsContent>
						</Suspense>
					</Memo>
					<Memo>
						<Suspense fallback={null}>
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Level"
							>
								<GroupedMods />
							</TabsContent>
						</Suspense>
					</Memo>
					<Memo>
						<Suspense fallback={null}>
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Slice5Dot"
							>
								<GroupedMods />
							</TabsContent>
						</Suspense>
					</Memo>
					<Memo>
						<Suspense fallback={null}>
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Slice6E"
							>
								<GroupedMods />
							</TabsContent>
						</Suspense>
					</Memo>
					<Memo>
						<Suspense fallback={null}>
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Slice6Dot"
							>
								<GroupedMods />
							</TabsContent>
						</Suspense>
					</Memo>
					<Memo>
						<Suspense fallback={null}>
							<TabsContent
								className={"flex data-[state=active]:grow-1 min-h-0"}
								value="Calibrate"
							>
								<GroupedMods />
							</TabsContent>
						</Suspense>
					</Memo>
				</ReactiveTabs>
			}
		/>
	);
});

ModsView.displayName = "ModsView";

export default ModsView;
