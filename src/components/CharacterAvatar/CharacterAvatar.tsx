// utils
import { cn } from "#/lib/utils";
import { match, P } from "ts-pattern";

// react
import * as React from "react";

// state
import { Show, Switch, useValue, useObservable } from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const characters$ = stateLoader$.characters$;

// domain
import {
	type BaseCharacter,
	defaultBaseCharacter,
} from "#/modules/characters/domain/BaseCharacter";
import type * as Character from "#/domain/Character";

// components
import {
	Stars0,
	Stars1,
	Stars2,
	Stars3,
	Stars4,
	Stars5,
	Stars6,
	Stars7,
} from "./Stars";

type ComponentProps = {
	character?: Character.Character;
	displayGear?: boolean;
	displayBadges?: boolean;
	displayStars?: boolean;
	id?: string;
	className?: string;
};

const CharacterAvatar = React.memo(
	({
		character,
		displayGear = true,
		displayBadges = true,
		displayStars = true,
		id,
		className = "",
	}: ComponentProps) => {
		const baseCharacterById = useValue(characters$.baseCharacterById);
		const displayStars$ = useObservable(displayStars);
		const displayBadges$ = useObservable(displayBadges);
		const stars$ = useObservable(() => {
			if (character === undefined || character === null) return 0;
			return character.playerValues.stars;
		});
		const isReliced$ = useObservable(() => {
			if (character === undefined || character === null) return false;
			return character.playerValues.gearLevel === 13;
		});

		if (character === undefined || character === null) return null;

		const baseCharacter: BaseCharacter = baseCharacterById[character.id] ?? {
			...defaultBaseCharacter,
			id: character.id,
			name: character.id,
		};
		const gearClass = match([
			character.playerValues.gearLevel,
			baseCharacter.alignment,
		])
			.with([0, P._], () => "border-1 border-inset border-cyan-200")
			.with(
				[1, P._],
				() =>
					"after:border-1 after:border-inset after:border-cyan-200 after:rounded-full",
			)
			.with([2, P._], () => "after:bg-[url(/img/g2-overlay.webp)]")
			.with([3, P._], () => "after:bg-[url(/img/g3-overlay.webp)]")
			.with([4, P._], () => "after:bg-[url(/img/g4-overlay.webp)]")
			.with([5, P._], () => "after:bg-[url(/img/g5-overlay.webp)]")
			.with([6, P._], () => "after:bg-[url(/img/g6-overlay.webp)]")
			.with([7, P._], () => "after:bg-[url(/img/g7-overlay.webp)]")
			.with([8, P._], () => "after:bg-[url(/img/g8-overlay.webp)]")
			.with([9, P._], () => "after:bg-[url(/img/g9-overlay.webp)]")
			.with([10, P._], () => "after:bg-[url(/img/g10-overlay.webp)]")
			.with([11, P._], () => "after:bg-[url(/img/g11-overlay.webp)]")
			.with([12, P._], () => "after:bg-[url(/img/g12-overlay.webp)]")
			.with(
				[13, "neutral"],
				[13, "noforce"],
				() =>
					"after:bg-[url(/img/g13-frame-atlas.webp)] after:size-[120%] after:top-0 after:left-[-10%] after:bg-[size:100%_300%] after:bg-[position:center_100%]",
			)
			.with(
				[13, "light"],
				() =>
					"after:bg-[url(/img/g13-frame-atlas.webp)] after:size-[120%] after:top-0 after:left-[-10%] after:bg-[size:100%_300%] after:bg-[position:center_0%]",
			)
			.with(
				[13, "dark"],
				() =>
					"after:bg-[url(/img/g13-frame-atlas.webp)] after:size-[120%] after:top-0 after:left-[-10%] after:bg-[size:100%_300%] after:bg-[position:center_50%]",
			)
			.run();

		const avatarClassName = cn(
			` relative inline-block size-16 m-x-2.4 m-t-3.6 m-b-1em rounded-full row-start-2 row-end-2 col-start-1 col-end-3 after:content-[''] after:block after:absolute after:w-full after:h-full after:box-border after:z-[29] after:left-0 after:top-[10px] after:bg-cover after:pointer-events-none ${displayGear ? gearClass : ""}`,
			className,
		);

		let badgePosition = "bg-[position:left_0px_top_0px]";
		if (baseCharacter.galacticLegend) {
			badgePosition = "bg-[position:left_0px_top_-120px]";
		} else {
			if (baseCharacter.alignment === "neutral") {
				badgePosition = "bg-[position:left_0px_top_-80px]";
			}
			if (baseCharacter.alignment === "dark") {
				badgePosition = "bg-[position:left_0px_top_-40px]";
			}
		}

		return (
			<div className="flex flex-col items-center justify-center">
				<div className={avatarClassName} id={id}>
					<Show if={displayStars$}>
						<Switch value={stars$}>
							{{
								0: () => <Stars0 />,
								1: () => <Stars1 />,
								2: () => <Stars2 />,
								3: () => <Stars3 />,
								4: () => <Stars4 />,
								5: () => <Stars5 />,
								6: () => <Stars6 />,
								7: () => <Stars7 />,
							}}
						</Switch>
					</Show>
					<div className={"grid h-21"}>
						<div
							className={
								"row-start-1 row-end-1 col-start-1 col-end-1 self-center"
							}
						>
							<img
								className={"rounded-full"}
								src={baseCharacter.avatarUrl}
								loading={"lazy"}
								alt={baseCharacter.name}
								title={baseCharacter.name}
								draggable={false}
							/>
						</div>
					</div>
				</div>
				<Show if={displayBadges$}>
					<div className="flex">
						<div className="h-10 w-4 row-1 col-1 grid">
							<div className="size-4 rounded-full justify-self-end self-center inline-flex items-center border border-transparent text-xs font-semibold bg-primary-foreground text-primary">
								{character.playerValues.level}
							</div>
						</div>
						<Show if={isReliced$}>
							<div
								className={`size-10 text-center vertical-middle text-3/10 bg-[url(/img/badge-atlas-ultimate.webp)] bg-size-[40px_160px] ${badgePosition}`}
							>
								{character.playerValues.relicTier - 2}
							</div>
						</Show>
						<div className="size-10 text-center vertical-middle text-3/10 bg-[url(/img/zeta.webp)] bg-size-[40px_40px]">
							{character.zetas.length}
						</div>
						<div className="size-10 grid place-content-center place-items-center grid-rows-1 grid-cols-1">
							<div className="size-10 row-1 col-1 bg-[url(/img/omicron.webp)] bg-size-[40px_40px]" />
							<div className="size-4 row-1 col-1 rounded-full inline-flex items-center justify-center border border-transparent text-xs bg-primary-foreground text-primary">
								{character.omis.length}
							</div>
						</div>
					</div>
				</Show>
			</div>
		);
	},
);

CharacterAvatar.displayName = "CharacterAvatar";

export default CharacterAvatar;
