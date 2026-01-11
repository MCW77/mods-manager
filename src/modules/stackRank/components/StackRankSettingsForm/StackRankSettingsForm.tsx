// react
import { useTranslation } from "react-i18next";

// state
import { observer, reactive } from "@legendapp/state/react";

import { stackRank$ } from "../../state/stackRank";

// components
import { Input } from "#/components/reactive/Input";
import { Switch } from "#/components/reactive/Switch";
import { Label } from "#ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

const ReactiveSelect = reactive(Select);

const StackRankSettingsForm: React.FC = observer(() => {
	const [t] = useTranslation("settings-ui");

	const global =
		"grid gap-3 md:grid-cols-[[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
	const labelCSS = "grid-col-[labels] grid-row-auto" as const;
	const inputCSS = "grid-col-[controls] grid-row-auto" as const;

	return (
		<form className={global}>
			<Label className={labelCSS} htmlFor={"use-case"}>
				{t("optimizer.stackrank.UseCase")}:
			</Label>
			<ReactiveSelect
				name={"use-case"}
				$value={stackRank$.useCase}
				onValueChange={(value) => {
					stackRank$.useCase.set(value);
				}}
			>
				<SelectTrigger className={inputCSS} id={"use-case"}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent className={"max-h-[50%]"}>
					<SelectGroup>
						<SelectItem value={"0"}>GAC / TW / RotE</SelectItem>
						<SelectItem value={"1"}>LS-TB</SelectItem>
						<SelectItem value={"2"}>DS-TB</SelectItem>
						<SelectItem value={"3"}>Arena only</SelectItem>
					</SelectGroup>
				</SelectContent>
			</ReactiveSelect>
			<Label className={labelCSS} htmlFor={"ignore-arena"}>
				{t("optimizer.stackrank.IgnoreArena")}:
			</Label>
			<Switch
				className={inputCSS}
				id={"ignore-arena"}
				name={"ignore-arena"}
				$checked={stackRank$.parameters.ignoreArena}
			/>
			<Label className={labelCSS} htmlFor={"alignment-filter"}>
				{t("optimizer.stackrank.Alignment")}:
			</Label>
			<ReactiveSelect
				name={"alignment-filter"}
				$value={stackRank$.parameters.alignmentFilter}
				onValueChange={(value) => {
					stackRank$.parameters.alignmentFilter.set(
						value as "0" | "1" | "2" | "3",
					);
				}}
			>
				<SelectTrigger className={inputCSS} id={"alignment-filter"}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value={"0"}>
							{t("optimizer.stackrank.AlignmentAll")}
						</SelectItem>
						<SelectItem value={"1"}>
							{t("optimizer.stackrank.AlignmentLight")}
						</SelectItem>
						<SelectItem value={"2"}>
							{t("optimizer.stackrank.AlignmentDark")}
						</SelectItem>
						<SelectItem value={"3"}>
							{t("optimizer.stackrank.AlignmentNeutral")}
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</ReactiveSelect>
			<Label className={labelCSS} htmlFor={"minimum-gear-level"}>
				{t("optimizer.stackrank.MinimumGear")}:
			</Label>
			<Input
				className={inputCSS}
				id={"minimum-gear-level"}
				type={"number"}
				$value={stackRank$.parameters.minimumGearLevel}
			/>
			<Label className={labelCSS} htmlFor={"top"}>
				{t("optimizer.stackrank.Top")}:
			</Label>
			<Input
				className={inputCSS}
				id={"top"}
				type={"number"}
				$value={stackRank$.parameters.top}
			/>
			<Label className={labelCSS}>
				{t("optimizer.stackrank.OmicronBoosts")}:
			</Label>
			<Label className={labelCSS} htmlFor={"omicron-boost-gac"}>
				GAC:
			</Label>
			<Input
				className={inputCSS}
				id={"omicron-boost-gac"}
				type={"checkbox"}
				$value={stackRank$.parameters.omicronGac}
			/>
			<Label className={labelCSS} htmlFor={"omicron-boost-tw"}>
				TW:
			</Label>
			<Input
				className={inputCSS}
				id={"omicron-boost-tw"}
				type={"checkbox"}
				$value={stackRank$.parameters.omicronTw}
			/>
			<Label className={labelCSS} htmlFor={"omicron-boost-tb"}>
				TB:
			</Label>
			<Input
				className={inputCSS}
				id={"omicron-boost-tb"}
				type={"checkbox"}
				$value={stackRank$.parameters.omicronTb}
			/>
			<Label className={labelCSS} htmlFor={"omicron-boost-raids"}>
				Raids:
			</Label>
			<Input
				className={inputCSS}
				id={"omicron-boost-raids"}
				type={"checkbox"}
				$value={stackRank$.parameters.omicronRaids}
			/>
			<Label className={labelCSS} htmlFor={"omicron-boost-conquest"}>
				Conquest:
			</Label>
			<Input
				className={inputCSS}
				id={"omicron-boost-conquest"}
				type={"checkbox"}
				$value={stackRank$.parameters.omicronConquest}
			/>
		</form>
	);
});

StackRankSettingsForm.displayName = "StackRankSettingsForm";

export { StackRankSettingsForm };
