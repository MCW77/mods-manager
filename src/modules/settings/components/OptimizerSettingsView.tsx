// react
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const templates$ = stateLoader$.templates$;

// components
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { Label } from "#ui/label";
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { Select as ReactiveSelect } from "#/components/reactive/Select";

// containers
import TemplatesManager from "#/containers/TemplatesManager/TemplatesManager";
import { StackRankSettingsForm } from "#/modules/stackRank/components/StackRankSettingsForm/StackRankSettingsForm";
import OptimizationSettingsForm from "#/modules/optimizationSettings/components/OptimizationSettingsForm";

const OptimizerSettingsView: React.FC = observer(() => {
	const [t] = useTranslation("settings-ui");
	const addingModeItems = [
		{ label: t("optimizer.templates.Append"), value: "append" },
		{ label: t("optimizer.templates.Replace"), value: "replace" },
		{ label: t("optimizer.templates.Apply"), value: "apply targets only" },
	];

	const global =
		"grid gap-3 md:grid-cols-[[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
	const labelCSS = "grid-col-[labels] grid-row-auto" as const;

	return (
		<div className="grid grid-gap-2 justify-center grid-cols-[repeat(auto-fit,_minmax(min(500px,_100%),_1fr))]">
			<Card className="!bg-opacity-20 m-4">
				<CardHeader>
					<CardTitle>{t("optimizer.global.Title")}</CardTitle>
				</CardHeader>
				<CardContent>
					<OptimizationSettingsForm />
				</CardContent>
			</Card>
			<Card className="!bg-opacity-20 m-4">
				<CardHeader>
					<CardTitle>{t("optimizer.templates.Title")}</CardTitle>
				</CardHeader>
				<CardContent className={global}>
					<Label className={labelCSS}>
						{t("optimizer.templates.AddingMode")}:
					</Label>
					<FormInput>
						<ReactiveSelect
							items={addingModeItems}
							$value={templates$.templatesAddingMode}
						>
							<SelectTrigger className="w-[180px] accent-blue">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="accent-blue">
								<SelectGroup className="accent-blue">
									<SelectItem value="append">
										{t("optimizer.templates.Append")}
									</SelectItem>
									<SelectItem value="replace">
										{t("optimizer.templates.Replace")}
									</SelectItem>
									<SelectItem value="apply targets only">
										{t("optimizer.templates.Apply")}
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</ReactiveSelect>
					</FormInput>
					<Label className={`${labelCSS} self-start`}>
						{t("optimizer.templates.Own")}:
					</Label>
					<FormInput>
						<TemplatesManager />
					</FormInput>
				</CardContent>
			</Card>
			<Card className="!bg-opacity-20 m-4">
				<CardHeader>
					<CardTitle>{t("optimizer.stackrank.Title")}</CardTitle>
				</CardHeader>
				<CardContent className={global}>
					<StackRankSettingsForm />
				</CardContent>
			</Card>
		</div>
	);
});

const FormInput = (props: ComponentProps<"div">) => {
	return (
		<div className="grid-col-[controls] grid-row-auto">{props.children}</div>
	);
};

OptimizerSettingsView.displayName = "OptimizerSettingsView";

export { OptimizerSettingsView };
