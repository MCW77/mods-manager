// react
import React from "react";

// state
import { help$ } from "#/modules/help/state/help";

//domain
import type { HelpSections } from "#/modules/help/domain/HelpSections";

// components
import { HelpCircle } from "lucide-react";

import { Button } from "#ui/button";

type ComponentProps = {
	title: string;
	section: HelpSections;
	topic: number;
};

const HelpLink = React.memo(({ title, section, topic }: ComponentProps) => {
	return (
		<Button
			className="inline-block h-6 w-6 m-x-1 m-y-0 align-middle cursor-pointer"
			size="icon"
			title={title}
			variant="ghost"
			onClick={() => help$.setHelpPosition(section, topic)}
		>
			<HelpCircle className="h-6 w-6 m-auto" />
		</Button>
	);
});

HelpLink.displayName = "HelpLink";

export { HelpLink };
