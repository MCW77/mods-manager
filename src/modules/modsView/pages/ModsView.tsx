// react
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// state
import { observer, reactive } from "@legendapp/state/react";
import { modsView$ } from "../state/modsView";

// modules
import { Storage } from "#/state/modules/storage";

// domain
import type { Categories } from "../domain/Categories";

// components
import { CategoryView } from "../components/CategoryView";
import { ViewSetupWidget } from "../components/ViewSetupWidget";
import { FlexSidebar } from "#/components/FlexSidebar/FlexSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#ui/tabs";

const ReactiveTabs = reactive(Tabs);

const ModsView = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");
		const profile = useSelector(Storage.selectors.selectActiveProfile);

		return (
      <FlexSidebar
      sidebarContent={
        <ViewSetupWidget />
      }
      mainContent={
        <ReactiveTabs
          className="flex flex-col"
          $value={modsView$.activeCategory}
          onValueChange={(category) =>
            modsView$.activeCategory.set(category as Categories)
          }
        >
          <TabsList className={"flex justify-around"}>
            <TabsTrigger value="Reveal">
              Reveal
            </TabsTrigger>
            <TabsTrigger value="Level">
              Level
            </TabsTrigger>
            <TabsTrigger value="Slice5Dot">
              Slice5Dot
            </TabsTrigger>
            <TabsTrigger value="Slice6E">
              Slice6E
            </TabsTrigger>
            <TabsTrigger value="Slice6Dot">
            Slice6Dot
            </TabsTrigger>
            <TabsTrigger value="Calibrate">
              Calibrate
            </TabsTrigger>
          </TabsList>
          <TabsContent className={"flex data-[state=active]:grow-1 min-h-0"} value="Reveal">
            <CategoryView />
          </TabsContent>
          <TabsContent className={"flex data-[state=active]:grow-1 min-h-0"} value="Level">
            <CategoryView />
          </TabsContent>
          <TabsContent className={"flex data-[state=active]:grow-1 min-h-0"} value="Slice5Dot">
            <CategoryView />
          </TabsContent>
          <TabsContent className={"flex data-[state=active]:grow-1 min-h-0"} value="Slice6E">
            <CategoryView />
          </TabsContent>
          <TabsContent className={"flex data-[state=active]:grow-1 min-h-0"} value="Slice6Dot">
            <CategoryView />
          </TabsContent>
          <TabsContent className={"flex data-[state=active]:grow-1 min-h-0"} value="Calibrate">
            <CategoryView />
          </TabsContent>
        </ReactiveTabs>
      }
    />
		);
	}),
);

ModsView.displayName = "ModsView";

export { ModsView };
