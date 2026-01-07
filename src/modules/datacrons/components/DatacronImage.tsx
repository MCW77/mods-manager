// state
import type { Observable } from "@legendapp/state";
import { Switch, useValue } from "@legendapp/state/react";

// domain
import type { Datacron } from "../domain/Datacrons";

import DatacronSets from "../DatacronSets.json";
import { findAffix } from "../utils/findAffix";

const overlayIconCSS = [
	"absolute top-0 left-0 size-[114px] opacity-0",
	"absolute top-0 left-0 size-[114px] opacity-30",
	"absolute top-0 left-0 size-[114px] opacity-35",
	"absolute top-0 left-0 size-[114px] opacity-60",
	"absolute top-0 left-0 size-[114px] opacity-65",
	"absolute top-0 left-0 size-[114px] opacity-70",
	"absolute top-0 left-0 size-[114px] opacity-80",
	"absolute top-0 left-0 size-[114px] opacity-85",
	"absolute top-0 left-0 size-[114px] opacity-90",
	"absolute top-0 left-0 size-[114px]",
	"absolute top-0 left-0 size-[114px]",
	"absolute top-0 left-0 size-[114px]",
	"absolute top-0 left-0 size-[114px]",
	"absolute top-0 left-0 size-[114px]",
	"absolute top-0 left-0 size-[114px]",
	"absolute top-0 left-0 size-[114px]",
] as const;

interface DatacronImageProps {
	datacron$: Observable<Datacron>;
}

function DatacronImage({ datacron$ }: DatacronImageProps) {
	const datacron = useValue(datacron$);
	const tier = datacron.affix.length;
	let displayedAffix = null;
	const displayedAffixIndex = Math.trunc(tier / 3) * 3 - 1;
	if (displayedAffixIndex >= 0)
		displayedAffix = datacron.affix[displayedAffixIndex];
	const matchingAffix = displayedAffix ? findAffix(displayedAffix) : null;
	const setData = (
		DatacronSets as Record<string, { displayName: string; icon: string }>
	)[`${datacron.setId}`];
	const iconName = `${setData.icon}${datacron.focused ? "_focused" : ""}`;
	let iconContainer =
		"relative size-[114px] bg-[url('/img/datacron-bg.webp')] bg-no-repeat bg-auto bg-origin-padding bg-clip-border bg-[position:0px_-342px]";
	if (tier < 9)
		iconContainer =
			"relative size-[114px] bg-[url('/img/datacron-bg.webp')] bg-no-repeat bg-auto bg-origin-padding bg-clip-border bg-[position:0px_-228px]";
	if (tier < 6)
		iconContainer =
			"relative size-[114px] bg-[url('/img/datacron-bg.webp')] bg-no-repeat bg-auto bg-origin-padding bg-clip-border bg-[position:0px_-114px]";
	if (tier < 3)
		iconContainer =
			"relative size-[114px] bg-[url('/img/datacron-bg.webp')] bg-no-repeat bg-auto bg-origin-padding bg-clip-border bg-[position:0px_0px]";
	const tier3 =
		tier >= 3
			? "absolute size-[18px] top-[84px] left-[25px] rounded-[50%] border-2 border-solid border-[lightblue] bg-[ivory]"
			: "absolute size-[18px] top-[84px] left-[25px] rounded-[50%] border-2 border-solid border-[lightblue] bg-black";
	const tier6 =
		tier >= 6
			? "absolute size-[18px] top-[96px] left-[47px] rounded-[50%] border-1 border-solid border-[lightblue] bg-[ivory]"
			: "absolute size-[18px] top-[96px] left-[47px] rounded-[50%] border-1 border-solid border-[lightblue] bg-black";
	const tier9 =
		tier >= 9
			? "absolute size-[18px] top-[84px] left-[69px] rounded-[50%] border-1 border-solid border-[lightblue] bg-[ivory]"
			: "absolute size-[18px] top-[84px] left-[69px] rounded-[50%] border-1 border-solid border-[lightblue] bg-black";

	const tier3focused =
		tier >= 3
			? "absolute size-[18px] top-[58px] left-[4px] rounded-[50%] border-2 border-solid border-[lightblue] bg-[ivory]"
			: "absolute size-[18px] top-[58px] left-[4px] rounded-[50%] border-2 border-solid border-[lightblue] bg-black";
	const tier6focused =
		tier >= 6
			? "absolute size-[18px] top-[73px] left-[23px] rounded-[50%] border-1 border-solid border-[lightblue] bg-[ivory]"
			: "absolute size-[18px] top-[73px] left-[23px] rounded-[50%] border-1 border-solid border-[lightblue] bg-black";
	const tier9focused =
		tier >= 9
			? "absolute size-[18px] top-[78px] left-[47px] rounded-[50%] border-1 border-solid border-[lightblue] bg-[ivory]"
			: "absolute size-[18px] top-[78px] left-[47px] rounded-[50%] border-1 border-solid border-[lightblue] bg-black";
	const tier12focused =
		tier >= 12
			? "absolute size-[18px] top-[73px] left-[71px] rounded-[50%] border-1 border-solid border-[lightblue] bg-[ivory]"
			: "absolute size-[18px] top-[73px] left-[71px] rounded-[50%] border-1 border-solid border-[lightblue] bg-black";
	const tier15focused =
		tier >= 15
			? "absolute size-[18px] top-[58px] left-[90px] rounded-[50%] border-1 border-solid border-[lightblue] bg-[ivory]"
			: "absolute size-[18px] top-[58px] left-[90px] rounded-[50%] border-1 border-solid border-[lightblue] bg-black";

	return (
		<div className={"flex flex-col items-center"}>
			<div className={iconContainer}>
				<img
					src={`/img/${iconName}_empty.webp`}
					alt={setData.displayName}
					className={"size-[114px]"}
				/>
				<img
					src={`/img/${iconName}_max.webp`}
					alt={setData.displayName}
					className={overlayIconCSS[tier]}
				/>
				<Switch value={datacron$.focused}>
					{{
						true: () => (
							<>
								<div className={tier3focused} />
								<div className={tier6focused} />
								<div className={tier9focused} />
								<div className={tier12focused} />
								<div className={tier15focused} />
							</>
						),
						false: () => (
							<>
								<div className={tier3} />
								<div className={tier6} />
								<div className={tier9} />
							</>
						),
					}}
				</Switch>
				{matchingAffix && (
					<div className={"absolute size-[42px] top-0 left-[35px]"}>
						<img
							src={
								matchingAffix.scopeIcon.startsWith("tex.datacronui")
									? `/img/${matchingAffix.scopeIcon}.webp`
									: "https://api.hotutils.com/images/units/" +
										matchingAffix.scopeIcon +
										".png"
							}
							alt={matchingAffix.shortText}
							className={"rounded-[50%] size-full"}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export { DatacronImage };
