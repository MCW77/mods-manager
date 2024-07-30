// react
import React from "react";

type ComponentProps = {
	pips: number;
};

const Pips = React.memo(({ pips }: ComponentProps) => {
	const pipElements = Array.from(Array(pips).keys()).map((_, index) => (
		// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
		<span key={index} className="inline-block size-[5px] m-x-[1.6px] m-y-[2px] bg-[#fae8da] rounded-[3px]" />
	));

	return (
		<div className={
			`p-[1px] m-y-[5px] text-left font-size-0
			 relative z-[-10]
			 before:absolute before:inset-[-2px] before:z-[-2] before:rounded-sm before:bg-[linear-gradient(30deg,_#afa992_10%,_black_70%)] before:content-[""]
			 after:absolute after:inset-0 after:z-[-1] after:rounded-sm after:bg-black after:content-[""]
			`}>
			{pipElements}
		</div>
	);
});

Pips.displayName = "Pips";

export { Pips };
