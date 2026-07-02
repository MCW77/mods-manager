// state
import { ui$ } from "../state/ui";

// components
import { MonitorCog, Moon, Sun } from "lucide-react";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { Select } from "#/components/reactive/Select";
import { Switch } from "@legendapp/state/react";

const items = [
	{ label: "Light", value: "light" },
	{ label: "Dark", value: "dark" },
	{ label: "System", value: "system" },
];

function ThemeToggle() {
	return (
		<Select items={items} $value={ui$.theme}>
			<SelectTrigger>
				<SelectValue
					render={
						<Switch value={ui$.theme}>
							{{
								light: () => <Sun />,
								dark: () => <Moon />,
								system: () => <MonitorCog />,
							}}
						</Switch>
					}
				/>
			</SelectTrigger>
			<SelectContent>
				{items.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export { ThemeToggle };
