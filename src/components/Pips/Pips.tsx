// react
import React from "react";

// styles
import "./Pips.css";

type ComponentProps = {
	pips: number;
};

const Pips = React.memo(({ pips }: ComponentProps) => {
	const pipElements = Array.from(Array(pips).keys()).map((_, index) => (
		// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
		<span key={index} className="pip" />
	));

	return <div className="pips inset">{pipElements}</div>;
});

Pips.displayName = "Pips";

export { Pips };
