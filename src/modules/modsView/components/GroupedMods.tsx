// react
import React from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

// state
import { For, reactive, useValue, useObservable } from "@legendapp/state/react";
import { beginBatch, endBatch, type Observable } from "@legendapp/state";

import { dialog$ } from "#/modules/dialog/state/dialog";

// domain
import type { Mod } from "#/domain/Mod";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAnglesDown,
	faAnglesUp,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import * as Collapsible from "@radix-ui/react-collapsible";

import ModDetail from "#/components/ModDetail/ModDetail";
import { RenderIfVisible } from "#/components/RenderIfVisible/RenderIfVisible";
import DeleteModsModal from "./DeleteModsModal";

import { Button } from "#ui/button";

const ReactiveCollapsible = reactive(Collapsible.Root);

type ModGroup = {
	isOpen: boolean;
	id: string;
	mods: Mod[];
};

type ObservableModGroups = {
	modGroups: ModGroup[];
	closeAll: () => void;
	openAll: () => void;
};

type ModGroupItemProps = {
	item$: Observable<ModGroup>;
	modGroupsElement: React.RefObject<HTMLDivElement | null>;
};

function ModGroupItem({
	item$: modGroup$,
	modGroupsElement,
}: ModGroupItemProps) {
	const [tDomain] = useTranslation("domain");
	return (
		<ReactiveCollapsible
			key={`modgroup-${modGroup$.id.peek()}`}
			$open={modGroup$.isOpen}
			onOpenChange={(isOpen) => {
				modGroup$.isOpen.set(isOpen);
			}}
		>
			<Collapsible.Trigger className="flex hover:cursor-pointer" asChild>
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
							count: modGroup$.mods.length,
						})}
						)
					</span>
				</div>
			</Collapsible.Trigger>
			<Collapsible.Content className="flex flex-row flex-wrap justify-evenly gap-4 p-y-2 text-center">
				<For
					each={modGroup$.mods}
					item={({ item$ }) => (
						<ModItem item$={item$} modGroupsElement={modGroupsElement} />
					)}
					optimized
				/>
			</Collapsible.Content>
		</ReactiveCollapsible>
	);
}

type ModItemProps = {
	item$: Observable<Mod>;
	modGroupsElement: React.RefObject<HTMLDivElement | null>;
};

function ModItem({ item$, modGroupsElement }: ModItemProps) {
	const mod = useValue(item$);
	return (
		<RenderIfVisible
			className={"w-[21em]"}
			defaultHeight={243}
			key={`RIV-${mod.id}`}
			visibleOffset={486}
			root={modGroupsElement}
		>
			<ModDetail mod={mod} />
		</RenderIfVisible>
	);
}

interface GroupedModsProps {
	allModsCount: number;
	displayedModsCount: number;
	groupedMods: Mod[][];
}

const GroupedMods = ({
	groupedMods,
	allModsCount,
	displayedModsCount,
}: GroupedModsProps) => {
	const [t] = useTranslation("explore-ui");
	const [tDomain] = useTranslation("domain");

	const modGroupsElement = useRef<HTMLDivElement>(null);

	const modGroups: ModGroup[] = [];
	for (const modGroup of groupedMods) {
		modGroups.push({
			isOpen: true,
			id: `${modGroup[0].slot}-${modGroup[0].modset}-${modGroup[0].primaryStat.getDisplayType()}`,
			mods: modGroup,
		});
	}

	const modGroups$ = useObservable<ObservableModGroups>({
		modGroups: modGroups,
		closeAll: () => {
			beginBatch();
			modGroups$.modGroups.forEach((group) => {
				group.isOpen.set(false);
			});
			endBatch();
		},
		openAll: () => {
			beginBatch();
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
						onClick={() => {
							modGroups$.openAll();
						}}
					>
						<FontAwesomeIcon icon={faAnglesDown} title={t("Expand")} />
					</Button>
					<Button
						size={"sm"}
						onClick={() => {
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
				<For
					each={modGroups$.modGroups}
					item={({ item$: modGroup$ }) => (
						<ModGroupItem
							item$={modGroup$}
							modGroupsElement={modGroupsElement}
						/>
					)}
					optimized
				/>
			</div>
		</div>
	);
};

GroupedMods.displayName = "GroupedMods";

export default GroupedMods;
