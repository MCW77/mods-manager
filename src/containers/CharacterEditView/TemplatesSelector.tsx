// react
import type React from "react";
import { useSelector } from "react-redux";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";

// domain
import defaultTemplates from "#/constants/characterTemplates.json";

// components
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

const TemplatesSelector: React.FC<React.ComponentProps<typeof Select>> = ({
	children,
	...props
}) => {
	const userTemplatesNames = useSelector(
		CharacterEdit.selectors.selectUserTemplatesNames,
	).sort();
	const defaultTemplatesNames = defaultTemplates.map(({ name }) => name).sort();

	return (
		<Select {...props}>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent className={"max-h-[50%]"} position={"popper"}>
				<SelectGroup>
					<SelectLabel>User Generated Templates</SelectLabel>
					{userTemplatesNames.map((name) => (
						<SelectItem key={name} value={name}>
							{name}
						</SelectItem>
					))}
				</SelectGroup>
				<SelectSeparator />
				<SelectGroup>
					<SelectLabel>Builtin Templates</SelectLabel>
					{defaultTemplatesNames.map((name) => (
						<SelectItem key={name} value={name}>
							{name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

TemplatesSelector.displayName = "TemplatesSelector";

export { TemplatesSelector };
