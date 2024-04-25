// react
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// state
import { observer } from "@legendapp/state/react";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";

// domain
import type { TemplatesAddingMode } from "#/domain/TemplatesAddingMode";

// components
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { Label } from "#ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

// containers
import { TemplatesManager } from "#/containers/TemplatesManager/TemplatesManager";
import { StackRankSettingsForm } from "#/modules/stackRank/components/StackRankSettingsForm/StackRankSettingsForm";
import { OptimizationSettingsForm } from "#/modules/optimizationSettings/components/OptimizationSettingsForm";

const OptimizerSettingsView = observer(() => {
	const templatesAddingMode = useSelector(
		CharacterEdit.selectors.selectTemplatesAddingMode,
	);
	const dispatch: ThunkDispatch = useDispatch();
	const [t, i18n] = useTranslation("settings-ui");

	const global =
		"grid gap-3 md:grid-cols-[[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
	const labelCSS = "grid-col-[labels] grid-row-auto" as const;
	const inputCSS = "grid-col-[controls] grid-row-auto" as const;

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
						<Select
							value={templatesAddingMode}
							onValueChange={(value: TemplatesAddingMode) => {
								dispatch(CharacterEdit.actions.setTemplatesAddingMode(value));
							}}
						>
							<SelectTrigger className="w-[180px] accent-blue">
								<SelectValue placeholder={templatesAddingMode} />
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
						</Select>
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

export default OptimizerSettingsView;
