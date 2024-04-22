// react
import React from "react";
import { withTranslation, type WithTranslation } from "react-i18next";
import { connect, type ConnectedProps } from "react-redux";
import type { ThunkDispatch } from "../../state/reducers/modsOptimizer";

// styles
import {
	faAnglesDown,
	faAnglesUp,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

// utils
import { forEach } from "lodash-es";

// state
import type { IAppState } from "../../state/storage";

import { dialog$ } from "#/modules/dialog/state/dialog";

// modules
import { Storage } from "../../state/modules/storage";

// domain
import type { CharacterNames } from "../../constants/characterSettings";
import { ModsFilter } from "../../modules/modExploration/domain/ModsFilter";

import type * as Character from "#/domain/Character";
import type { Mod } from "../../domain/Mod";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { FlexSidebar } from "../../components/FlexSidebar/FlexSidebar";
import { ModDetail } from "../../components/ModDetail/ModDetail";
import ModFilter from "../../components/ModFilter/ModFilter";
import { RenderIfVisible } from "../../components/RenderIfVisible/RenderIfVisible";
import { Button } from "#ui/button";

type AssignedMods = {
	[key: string]: CharacterNames;
};

class ExploreView extends React.PureComponent<Props> {
	modGroupToggle = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		const cl = (e.currentTarget as HTMLDivElement).nextElementSibling
			?.classList;
		if (cl) {
			cl.toggle("collapsed");
		}
	};

	render() {
		const modsElement = React.createRef<HTMLDivElement>();
		const modGroupsElement = React.createRef<HTMLDivElement>();

		const modElements = (mods: Mod[]) => {
			return mods.map((mod) => {
				const assignedCharacter = this.props.assignedMods[mod.id]
					? this.props.characters[this.props.assignedMods[mod.id]]
					: null;
				return (
					<RenderIfVisible
						className={"w-[21em]"}
						defaultHeight={278}
						key={`RIV-${mod.id}`}
						visibleOffset={4000}
						root={modGroupsElement}
					>
						<ModDetail
							mod={mod}
							assignedCharacter={assignedCharacter}
							showAssigned
						/>
					</RenderIfVisible>
				);
			});
		};

		let groupedMods = [];
		for (const key in this.props.displayedMods) {
			if (this.props.displayedMods[key].length > 0)
				groupedMods.push(this.props.displayedMods[key]);
		}
		groupedMods = groupedMods.sort(
			(mods1: Mod[], mods2: Mod[]) => mods1.length - mods2.length,
		);

		const modGroups = groupedMods.map((mods: Mod[]) => {
			return (
				<div
					className="modgroup"
					key={`modgroup-${mods[0].slot}-${mods[0].set}-${mods[0].primaryStat.getDisplayType()}`}
				>
					<div
						className="modgroupheader flex border-b-lightblue border-b-solid border-b-1 text-xs"
						onClick={this.modGroupToggle}
					>
						<span className="basis-20%">
							{this.props.t("domain:Slot")}:{" "}
							{this.props.t(`domain:slots.name.${mods[0].slot}`)}
						</span>
						<span className="basis-30%">
							{this.props.t("domain:Set")}:{" "}
							{this.props.t(`domain:stats.${mods[0].set}`)}
						</span>
						<span className="basis-30%">
							{this.props.t("domain:Primary")}:{" "}
							{this.props.t(
								`domain:stats.${mods[0].primaryStat.getDisplayType()}`,
							)}
						</span>
						<span className="basis-20%">
							{" "}
							({this.props.t("domain:ModWithCount", { count: mods.length })})
						</span>
					</div>
					<div className="modgroupmods flex flex-row flex-wrap justify-evenly gap-y-4 p-y-2 text-center [&.collapsed]:hidden">
						{modElements(mods)}
					</div>
				</div>
			);
		});

		return (
			<FlexSidebar
				sidebarContent={ExploreView.sidebar()}
				mainContent={
					<div className="flex flex-col h-full" ref={modsElement}>
						<div className="flex justify-between">
							<div className="flex gap-2 p-l-2 items-center text-sm align-middle">
								{this.props.t("explore-ui:ModsShown", {
									actual: this.props.displayedModsCount,
									max: this.props.modCount,
								})}
								&nbsp;
								<Button
									type={"button"}
									size={"sm"}
									variant={"destructive"}
									onClick={() => {
										dialog$.show(this.deleteModsModal());
									}}
								>
									<FontAwesomeIcon
										icon={faTrashCan}
										title={this.props.t("explore-ui:DeleteButton")}
									/>
								</Button>
							</div>
							<div className="flex gap-2 justify-center items-center p-t-2 p-r-6">
								<Button
									size={"sm"}
									onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
										forEach(
											modsElement.current?.getElementsByClassName(
												"modgroupmods",
											),
											(modgroup) => {
												modgroup.classList.remove("collapsed");
											},
										);
									}}
								>
									<FontAwesomeIcon
										icon={faAnglesDown}
										title={this.props.t("explore-ui:Expand")}
									/>
								</Button>
								<Button
									size={"sm"}
									onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
										forEach(
											modsElement.current?.getElementsByClassName(
												"modgroupmods",
											),
											(modgroup) => {
												modgroup.classList.add("collapsed");
											},
										);
									}}
								>
									<FontAwesomeIcon
										icon={faAnglesUp}
										title={this.props.t("explore-ui:Collapse")}
									/>
								</Button>
							</div>
						</div>
						<div
							className="flex flex-col overflow-y-auto overscroll-y-contain h-full"
							ref={modGroupsElement}
						>
							{modGroups}
						</div>
					</div>
				}
			/>
		);
	}

	/**
	 * Render the "Are you sure?" modal for deleting all displayed mods
	 * @returns {*}
	 */
	deleteModsModal() {
		return (
			<div>
				<h2>{this.props.t("explore-ui:DeleteButton")}</h2>
				<p>
					{this.props.t("explore-ui:DeleteAlt1")}
					<br />
					{this.props.t("explore-ui:DeleteAlt2")}
				</p>
				<div className={"actions flex gap-2 justify-center p-t-2"}>
					<Button
						type={"button"}
						onClick={() => {
							dialog$.hide();
						}}
					>
						No
					</Button>
					<Button
						type={"button"}
						variant={"destructive"}
						onClick={() => {
							for (const [key, mods] of Object.entries(
								this.props.displayedMods,
							)) {
								this.props.deleteMods(mods);
							}
						}}
					>
						Yes, Delete Mods
					</Button>
				</div>
			</div>
		);
	}

	/**
	 * Render the sidebar content
	 * @returns {*}
	 */
	static sidebar() {
		return (
			<div className={"filters"} key={"filters"}>
				<ModFilter />
			</div>
		);
	}
}

const mapStateToProps = (state: IAppState) => {
	const profile = state.profile;
	if (profile) {
		const assignedMods: AssignedMods =
			profile.modAssignments
				?.filter((x) => null !== x)
				.reduce((acc, { id: characterID, assignedMods: modIds }) => {
					const updatedAssignments = { ...acc };
					modIds.forEach((id) => (updatedAssignments[id] = characterID));
					return updatedAssignments;
				}, {} as AssignedMods) ?? ({} as AssignedMods);

		const modsFilter = new ModsFilter(state.modsViewOptions);
		const [mods, shownMods] = modsFilter.applyModsViewOptions(profile.mods);

		return {
			characters: profile.characters,
			displayedMods: mods,
			assignedMods: assignedMods,
			modCount: profile.mods.length,
			displayedModsCount: shownMods,
		};
	}
	return {
		characters: {} as Character.Characters,
		displayedMods: {},
		assignedMods: {} as AssignedMods,
		modCount: 0,
		displayedModsCount: 0,
	};
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
	deleteMods: (mods: Mod[]) => {
		dispatch(Storage.thunks.deleteMods(mods));
		dialog$.hide();
	},
});

type Props = PropsFromRedux & WithTranslation<["domain", "explore-ui"]>;
type PropsFromRedux = ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(
	withTranslation(["domain", "explore-ui"])(ExploreView),
);
