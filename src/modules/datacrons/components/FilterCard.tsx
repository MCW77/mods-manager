// utils
import { booleanAsString } from "#/utils/legend-kit/as/booleanAsString";
import { numberAsString } from "#/utils/legend-kit/as/numberAsString";

import { findAffix } from "../utils/findAffix";

// state
import type { Observable } from "@legendapp/state";
import { For, useObservable, useValue } from "@legendapp/state/react";

import { characters$ } from "#/modules/characters/state/characters";
import { datacrons$ } from "../state/datacrons";

// domain
import type { DatacronSet } from "../domain/DatacronFilter";
import type { Affix } from "../domain/Datacrons";

// components
import { ClearableSelect } from "#/components/reactive/ClearableSelect";
import { Button } from "#ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { Label } from "#ui/label";
import { SelectItem } from "#ui/select";

type DatacronSetItemProps = {
	item$: Observable<DatacronSet>;
};
function DatacronSetItem({ item$ }: DatacronSetItemProps) {
	const item = useValue(item$);
	return (
		<SelectItem key={item.id} value={`${item.id}`}>
			{item.name}
		</SelectItem>
	);
}

interface FocusedStateItemProps {
	item$: Observable<{ id: string; value: boolean }>;
}

function FocusedStateItem({ item$ }: FocusedStateItemProps) {
	const item = useValue(item$);
	return (
		<SelectItem key={item.id} value={item.value ? "true" : "false"}>
			{item.value ? "Focused Datacron" : "Normal Datacron"}
		</SelectItem>
	);
}

interface AlignmentItemProps {
	item$: Observable<Affix>;
}
function AlignmentItem({ item$ }: AlignmentItemProps) {
	const targetRule = useValue(item$.targetRule);
	return (
		<SelectItem key={targetRule} value={targetRule}>
			{targetRule === "target_datacron_lightside" ? "Light Side" : "Dark Side"}
		</SelectItem>
	);
}

interface AlignmentAbilityItemProps {
	item$: Observable<Affix>;
}
function AlignmentAbilityItem({ item$ }: AlignmentAbilityItemProps) {
	const item = useValue(item$);
	const affixData = findAffix(item);
	const id = `${affixData?.targetRule}|${affixData?.abilityId}`;
	return (
		<SelectItem key={id} value={id}>
			{affixData?.shortText}
		</SelectItem>
	);
}

interface FactionItemProps {
	item$: Observable<Affix>;
}

function FactionItem({ item$ }: FactionItemProps) {
	const item = useValue(item$);
	const affixData = findAffix(item);
	return (
		<SelectItem
			key={affixData?.targetCategory}
			value={`${affixData?.targetCategory}`}
		>
			{affixData?.targetCategory}
		</SelectItem>
	);
}

function FactionAbilityItem({ item$ }: FactionItemProps) {
	const item = useValue(item$);
	const affixData = findAffix(item);
	return (
		<SelectItem key={item.abilityId} value={item.abilityId}>
			{affixData?.shortText}
		</SelectItem>
	);
}

function CharacterItem({ item$ }: FactionItemProps) {
	const item = useValue(item$);
	const baseCharacterById = useValue(characters$.baseCharacterById);
	const affixData = findAffix(item);
	const characterName =
		baseCharacterById[affixData?.targetCharacter || ""]?.name ||
		affixData?.targetCharacter;
	return (
		<SelectItem
			key={affixData?.targetCharacter}
			value={`${affixData?.targetCharacter}`}
		>
			{characterName}
		</SelectItem>
	);
}

function CharacterAbilityItem({ item$ }: FactionItemProps) {
	const item = useValue(item$);
	const affixData = findAffix(item);
	return (
		<SelectItem key={item.abilityId} value={item.abilityId}>
			{affixData?.shortText}
		</SelectItem>
	);
}

interface NameModesItemProps {
	item$: Observable<{ id: string; value: boolean }>;
}

function NameModesItem({ item$ }: NameModesItemProps) {
	const item = useValue(item$.value);
	return (
		<SelectItem
			key={item ? "named" : "unnamed"}
			value={item ? "true" : "false"}
		>
			{item ? "Named Datacron" : "Unnamed Datacron"}
		</SelectItem>
	);
}

interface NameItemProps {
	item$: Observable<{ id: string; name: string }>;
}

function NameItem({ item$ }: NameItemProps) {
	const item = useValue(item$);
	return (
		<SelectItem key={item.id} value={item.name}>
			{item.name}
		</SelectItem>
	);
}

function FilterCard({ showFilters }: { showFilters: boolean }) {
	const datacronSet$ = useObservable(
		numberAsString(datacrons$.filter.datacronSet),
	);
	const focused$ = useObservable(booleanAsString(datacrons$.filter.focused));
	const isNamed$ = useObservable(booleanAsString(datacrons$.filter.isNamed));

	if (!showFilters) return null;

	return (
		<Card className="max-w-[50%]">
			<CardHeader>
				<div className="flex justify-between items-center gap-4">
					<CardTitle>Filters</CardTitle>
					<div>
						<Button
							className="mt-2"
							onClick={() => {
								datacrons$.resetFilters();
							}}
						>
							Reset Filters
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="">
				<div className="flex flex-wrap gap-4">
					<div className="grid">
						<div>
							<Label>Datacron Set</Label>
							<ClearableSelect $value={datacronSet$} placeholder="Select Set">
								<For
									each={datacrons$.availableDatacronSets}
									item={DatacronSetItem}
								/>
							</ClearableSelect>
						</div>
						<div>
							<Label>Focused</Label>
							<ClearableSelect $value={focused$} placeholder="Select Focused">
								<For
									each={datacrons$.availableFocusedStates}
									item={FocusedStateItem}
								/>
							</ClearableSelect>
						</div>
					</div>
					<div className="grid">
						<div>
							<Label>Alignment</Label>
							<ClearableSelect
								$value={datacrons$.filter.alignment}
								placeholder="Select Alignment"
							>
								<For
									each={datacrons$.availableAlignments}
									item={AlignmentItem}
								/>
							</ClearableSelect>
						</div>
						<div>
							<Label>Alignment Ability</Label>
							<ClearableSelect
								$value={datacrons$.filter.alignmentAbility}
								placeholder="Select Alignment Ability"
							>
								<For
									each={datacrons$.availableAlignmentAbilities}
									item={AlignmentAbilityItem}
								/>
							</ClearableSelect>
						</div>
					</div>
					<div className="grid">
						<div>
							<Label>Faction/Role</Label>
							<ClearableSelect
								$value={datacrons$.filter.faction}
								placeholder="Select Faction/Role"
							>
								<For each={datacrons$.availableFactions} item={FactionItem} />
							</ClearableSelect>
						</div>
						<div>
							<Label>Faction/Role Ability</Label>
							<ClearableSelect
								$value={datacrons$.filter.factionAbility}
								placeholder="Select Faction/Role Ability"
							>
								<For
									each={datacrons$.availableFactionAbilities}
									item={FactionAbilityItem}
								/>
							</ClearableSelect>
						</div>
					</div>
					<div className="grid">
						<div>
							<Label>Character</Label>
							<ClearableSelect
								$value={datacrons$.filter.character}
								placeholder="Select Character"
							>
								<For
									each={datacrons$.availableCharacters}
									item={CharacterItem}
								/>
							</ClearableSelect>
						</div>
						<div>
							<Label>Character Ability</Label>
							<ClearableSelect
								$value={datacrons$.filter.characterAbility}
								placeholder="Select Character Ability"
							>
								<For
									each={datacrons$.availableCharacterAbilities}
									item={CharacterAbilityItem}
								/>
							</ClearableSelect>
						</div>
					</div>
					<div className="grid">
						<div>
							<Label>Named Status</Label>
							<ClearableSelect
								$value={isNamed$}
								placeholder="Select Named Status"
							>
								<For
									each={datacrons$.availableNameModes}
									item={NameModesItem}
								/>
							</ClearableSelect>
						</div>
						<div>
							<Label>Name</Label>
							<ClearableSelect
								$value={datacrons$.filter.name}
								placeholder="Select Name"
							>
								<For each={datacrons$.availableNames} item={NameItem} />
							</ClearableSelect>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default FilterCard;
