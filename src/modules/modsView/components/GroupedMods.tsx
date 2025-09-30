// react
import React, { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { reactive, use$ } from "@legendapp/state/react";
import { beginBatch, endBatch, observable } from "@legendapp/state";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
import { dialog$ } from "#/modules/dialog/state/dialog";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";

import type { Mod } from "#/domain/Mod";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAnglesDown,
	faAnglesUp,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import * as Collapsible from "@radix-ui/react-collapsible";

const ModDetail = lazy(() => import("#/components/ModDetail/ModDetail"));
import { RenderIfVisible } from "#/components/RenderIfVisible/RenderIfVisible";
const DeleteModsModal = lazy(() => import("./DeleteModsModal"));

import { Button } from "#ui/button";

interface GroupedModsProps {
	allModsCount: number;
	displayedModsCount: number;
	groupedMods: Mod[][];
}

const ReactiveCollapsible = reactive(Collapsible.Root);

const modElements = (
	mods: Mod[],
	modGroupsElement: React.RefObject<HTMLDivElement>,
) => {
	return mods.map((mod) => {
		return (
			<RenderIfVisible
				className={"w-[21em]"}
				defaultHeight={278}
				key={`RIV-${mod.id}`}
				visibleOffset={2780}
				root={modGroupsElement}
			>
				<ModDetail mod={mod} />
			</RenderIfVisible>
		);
	});
};

const GroupedMods = ({
	groupedMods,
	allModsCount,
	displayedModsCount,
}: GroupedModsProps) => {
	const [t] = useTranslation("explore-ui");
	const [tDomain] = useTranslation("domain");
	const characterById = use$(profilesManagement$.activeProfile.characterById);

	const modGroupsElement = React.createRef<HTMLDivElement>();

	type ModGroup = {
		isOpen: boolean;
		key: string;
		mods: Mod[];
	};
	const modGroups: ModGroup[] = [];
	for (const modGroup of groupedMods) {
		modGroups.push({
			isOpen: true,
			key: `${modGroup[0].slot}-${modGroup[0].modset}-${modGroup[0].primaryStat.getDisplayType()}`,
			mods: modGroup,
		});
	}
	type ObservableModGroups = {
		modGroups: ModGroup[];
		closeAll: () => void;
		openAll: () => void;
	};

	const modGroups$ = observable<ObservableModGroups>({
		modGroups: modGroups,
		closeAll: () => {
			beginBatch();
			// biome-ignore lint/complexity/noForEach: <explanation>
			modGroups$.modGroups.forEach((group) => {
				group.isOpen.set(false);
			});
			endBatch();
		},
		openAll: () => {
			beginBatch();
			// biome-ignore lint/complexity/noForEach: <explanation>
			modGroups$.modGroups.forEach((group) => {
				group.isOpen.set(true);
			});
			endBatch();
		},
	});

	return (
		<div className="flex flex-col grow-1">
			<div className="flex justify-between">
				<div className="flex gap-2 p-l-2 items-center text-sm align-middle">
					{t("ModsShown", {
						actual: displayedModsCount,
						max: allModsCount,
					})}
					&nbsp;
					<Button
						type={"button"}
						size={"sm"}
						variant={"destructive"}
						onClick={() => {
							dialog$.show(<DeleteModsModal groupedMods={groupedMods} />);
						}}
					>
						<FontAwesomeIcon icon={faTrashCan} title={t("DeleteButton")} />
					</Button>
				</div>
				<div className="flex gap-2 justify-center items-center p-t-2 p-r-6">
					<Button
						size={"sm"}
						onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
							modGroups$.openAll();
						}}
					>
						<FontAwesomeIcon icon={faAnglesDown} title={t("Expand")} />
					</Button>
					<Button
						size={"sm"}
						onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
							modGroups$.closeAll();
						}}
					>
						<FontAwesomeIcon icon={faAnglesUp} title={t("Collapse")} />
					</Button>
				</div>
			</div>
			<div className={"flex"}>
				<span className="basis-20%">{tDomain("Slot")}: </span>
				<span className="basis-30%">{tDomain("Set")}: </span>
				<span className="basis-30%">{tDomain("Primary")}: </span>
				<span className="basis-20%">{"#"}</span>
			</div>
			<div
				className="flex flex-col overflow-y-auto overscroll-y-contain grow-1"
				ref={modGroupsElement}
			>
				{modGroups$.modGroups.map((modGroup$) => {
					return (
						<ReactiveCollapsible
							key={`modgroup-${modGroup$.key.peek()}`}
							$open={modGroup$.isOpen}
							onOpenChange={(isOpen) => {
								modGroup$.isOpen.set(isOpen);
							}}
						>
							<Collapsible.Trigger
								className="flex hover:cursor-pointer"
								asChild
							>
								<div>
									<span className="basis-20%">
										{tDomain(`slots.name.${modGroup$.mods[0].slot.peek()}`)}
									</span>
									<span className="basis-30%">
										{tDomain(`stats.${modGroup$.mods[0].modset.peek()}`)}
									</span>
									<span className="basis-30%">
										{tDomain(
											`stats.${modGroup$.mods[0].primaryStat.peek().getDisplayType()}`,
										)}
									</span>
									<span className="basis-20%">
										(
										{tDomain("ModWithCount", {
											count: modGroup$.peek().mods.length,
										})}
										)
									</span>
								</div>
							</Collapsible.Trigger>
							<Collapsible.Content className="flex flex-row flex-wrap justify-evenly gap-y-4 p-y-2 text-center">
								{modElements(modGroup$.mods.peek(), modGroupsElement)}
							</Collapsible.Content>
						</ReactiveCollapsible>
					);
				})}
			</div>
		</div>
	);
};

GroupedMods.displayName = "GroupedMods";

export default GroupedMods;
