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
import { Badge } from "#ui/badge";

type ComponentProps = {
	character?: Character.Character;
	displayGear?: boolean;
	displayLevel?: boolean;
	displayStars?: boolean;
	id?: string;
	className?: string;
};

const CharacterAvatar = React.memo(
	({
		character,
		displayGear = true,
		displayLevel = true,
		displayStars = true,
		id,
		className = "",
	}: ComponentProps) => {
		const baseCharacterById = useValue(characters$.baseCharacterById);
		const displayStars$ = useObservable(displayStars);
		const displayLevel$ = useObservable(displayLevel);
		const stars$ = useObservable(() => {
			if (character === undefined || character === null) return 0;
			return character.playerValues.stars;
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
				<div className="grid p-0">
					<Show if={displayLevel$}>
						<Badge className="row-start-2 row-end-2 col-start-1 col-end-1 self-end justify-self-center p-0">
							{character.playerValues.level}
						</Badge>
					</Show>
				</div>
			</div>
		);
	},
);

CharacterAvatar.displayName = "CharacterAvatar";

export default CharacterAvatar;
