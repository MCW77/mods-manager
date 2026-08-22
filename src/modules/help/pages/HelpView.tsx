// react
import React from "react";
import { useTranslation } from "react-i18next";
import { observer, Show, useValue } from "@legendapp/state/react";

// styles
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

// utils
import { match } from "ts-pattern";

// state
import { help$ } from "../state/help";
import { ui$ } from "#/modules/ui/state/ui";

// domain
import type { HelpSections } from "../domain/HelpSections";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, buttonVariants } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import { HelpLink } from "../components/HelpLink";

const topicsBySection: Record<HelpSections, number[]> = {
	general: [1, 2, 3, 4, 5],
	profiles: [1, 2, 3, 4, 5],
	explorer: [1, 2, 3],
	optimizer: [1, 2, 3, 4],
	editor: [1, 2, 3, 4, 5, 6],
};

const topicCSS =
	"prose dark:prose-invert m-x-auto max-w-[80ch] flex flex-col items-center text-balance";

type HelpSectionTabProps = {
	sectionName: HelpSections;
	currentSection: HelpSections;
	sectionRef: React.RefObject<HTMLButtonElement | null>;
	onSelect: (sectionName: HelpSections) => void;
	label: string;
};

const HelpSectionTab: React.FC<HelpSectionTabProps> = ({
	sectionName,
	currentSection,
	sectionRef,
	onSelect,
	label,
}) => {
	return (
		<Button
			variant={"ghost"}
			role={"tab"}
			aria-selected={sectionName === currentSection}
			className={
				"rounded-xl p-2 m-1 border border-solid border-white aria-selected:border-yellow-300"
			}
			ref={sectionRef}
			onClick={() => onSelect(sectionName)}
		>
			{label}
		</Button>
	);
};

function Topics() {
	const [t] = useTranslation("help-ui");
	const currentSection = useValue(help$.section);
	const currentTopic = useValue(help$.topic);
	if (currentTopic !== 0) return null;
	return topicsBySection[currentSection].map((topic: number) => {
		return (
			<h1
				key={`${currentSection}-${topic}`}
				onClick={() =>
					/*changeCurrentTopic(topic)*/ help$.setHelpPosition(
						currentSection,
						topic,
					)
				}
				onKeyUp={(event) => {
					if (event.code === "Enter") {
						//						changeCurrentTopic(topic);
						help$.setHelpPosition(currentSection, topic);
					}
				}}
			>
				{t(`${currentSection}.topics.${topic}`, "")}
			</h1>
		);
	});
}

function Topic() {
	const [t] = useTranslation("help-ui");
	const currentSection = useValue(help$.section);
	const currentTopic = useValue(help$.topic);

	return match([currentSection, currentTopic])
		.with(["explorer", 2], () => <ViewOptionsTopic />)
		.with(["optimizer", 1], () => <GlobalOptimizationSettingsTopic />)
		.with(["optimizer", 2], () => <CharacterTemplatesTopic />)
		.with(["optimizer", 3], () => <AutoGenerationTopic />)
		.with(["editor", 3], () => <OptimizationPlanEditorWeightsTopic />)
		.with(["profiles", 4], () => <FetchUnequippedModsWithHUTopic />)
		.otherwise(() => {
			const title = t(
				`${currentSection}.topicById.${currentTopic}.Headline`,
				"",
			) as string;
			let counter = 1;
			const paragraphs: string[] = [];
			let paragraph = t(
				`${currentSection}.topicById.${currentTopic}.${counter}`,
				"",
			) as string;
			while (paragraph !== "") {
				paragraphs.push(paragraph);
				counter++;
				paragraph = t(
					`${currentSection}.topicById.${currentTopic}.${counter}`,
					"",
				);
			}

			return (
				<div className={topicCSS}>
					{title !== "" && <h2>{title}</h2>}
					{paragraphs.map((p) => (
						<p key={p}>{p}</p>
					))}
				</div>
			);
		});
}

function ViewOptionsTopic() {
	const [t] = useTranslation("help-ui");

	return (
		<div className={topicCSS}>
			<h2>{t("explorer.topicById.2.Headline")}</h2>
			<div className="flex flex-col gap-2 w-full">
				<HelpLink
					title={t("explorer.topicById.3.Headline")}
					section="explorer"
					topic={3}
					showTitle={true}
				/>
				<HelpLink
					title={t("explorer.topicById.4.Headline")}
					section="explorer"
					topic={4}
					showTitle={true}
				/>
				<HelpLink
					title={t("explorer.topicById.5.Headline")}
					section="explorer"
					topic={5}
					showTitle={true}
				/>
			</div>
		</div>
	);
}

function OptimizationPlanEditorWeightsTopic() {
	const [t] = useTranslation("help-ui");
	const topicPath = "editor.topicById.3.";

	return (
		<div className={topicCSS}>
			<h2>{t(`${topicPath}Headline`)}</h2>
			<div>{t(`${topicPath}1`)}</div>
			<div>
				<p>{t(`${topicPath}2`)}</p>
				<p>{t(`${topicPath}3`)}</p>
			</div>
		</div>
	);
}

function CharacterTemplatesTopic() {
	const [t] = useTranslation("help-ui");

	return (
		<div className={topicCSS}>
			<h2>{t("optimizer.topicById.2.Headline")}</h2>
			<p>
				{t("optimizer.topicById.2.1")}
				<strong>{t("optimizer.topicById.2.2")}</strong>
				{t("optimizer.topicById.2.3")}
				<strong>{t("optimizer.topicById.2.4")}</strong>
				{t("optimizer.topicById.2.5")}
			</p>
			<h3>{t("optimizer.topicById.2.6")}</h3>
			<p>
				<strong>{t("optimizer.topicById.2.7")}</strong> -{" "}
				{t("optimizer.topicById.2.8")}
				<br />
				<strong>{t("optimizer.topicById.2.9")}</strong> -{" "}
				{t("optimizer.topicById.2.10")}
				<br />
				<strong>{t("optimizer.topicById.2.11")}</strong> -{" "}
				{t("optimizer.topicById.2.12")}
				<br />
				<strong>{t("optimizer.topicById.2.13")}</strong> -{" "}
				{t("optimizer.topicById.2.14")}
			</p>
			<h3>{t("optimizer.topicById.2.15")}</h3>
			<p>
				<strong>{t("optimizer.topicById.2.16")}</strong> -{" "}
				{t("optimizer.topicById.2.17")}
				<br />
				<strong>{t("optimizer.topicById.2.18")}</strong> -{" "}
				{t("optimizer.topicById.2.19")}
				<br />
				<strong>{t("optimizer.topicById.2.20")}</strong> -{" "}
				{t("optimizer.topicById.2.21")}
			</p>
		</div>
	);
}

function GlobalOptimizationSettingsTopic() {
	const [t] = useTranslation("help-ui");

	return (
		<div className={topicCSS}>
			<h2>{t("optimizer.topicById.1.Headline")}</h2>
			<div>{t("optimizer.topicById.1.1")}</div>
			<div>
				<p>
					<strong>{t("optimizer.topicById.1.2")}</strong> -{" "}
					{t("optimizer.topicById.1.3")}
				</p>
				<p>
					<strong>{t("optimizer.topicById.1.4")}</strong> -{" "}
					{t("optimizer.topicById.1.5")}
				</p>
				<p>
					<strong>{t("optimizer.topicById.1.6")}</strong> -{" "}
					{t("optimizer.topicById.1.7")}
				</p>
			</div>
		</div>
	);
}

function AutoGenerationTopic() {
	const [t] = useTranslation("help-ui");

	return (
		<div className={topicCSS}>
			<h1>{t("optimizer.topicById.3.Headline")}</h1>
			<p>{t("optimizer.topicById.3.1")}</p>
			<h2>{t("optimizer.topicById.3.2")}</h2>
			<section>
				<Label>{t("optimizer.topicById.3.3")}:</Label>
				<p>{t("optimizer.topicById.3.4")}</p>
				<Label>{t("optimizer.topicById.3.5")}:</Label>
				<p>{t("optimizer.topicById.3.6")}</p>
				<Label>{t("optimizer.topicById.3.7")}:</Label>
				<p>{t("optimizer.topicById.3.8")}</p>
				<Label>{t("optimizer.topicById.3.9")}:</Label>
				<p>{t("optimizer.topicById.3.10")}</p>
			</section>
		</div>
	);
}

function FetchUnequippedModsWithHUTopic() {
	const [t] = useTranslation("help-ui");

	return (
		<div className={topicCSS}>
			<p>
				{t("profiles.topicById.4.1")} {t("profiles.topicById.4.2")}
			</p>
			<p>
				{t("profiles.topicById.4.7")}
				<a
					className={buttonVariants({ variant: "link" })}
					href={
						"https://discord.com/channels/451567765879259136/451569250650292244/1317618806230618174"
					}
					target="_blank"
					rel="noopener noreferrer"
				>
					Discord
				</a>
				{t("profiles.topicById.4.8")}
			</p>{" "}
			<p>
				<strong>{t("profiles.topicById.4.3")}</strong>
				<br />
				{t("profiles.topicById.4.4")} {t("profiles.topicById.4.5")}{" "}
				{t("profiles.topicById.4.6")}
			</p>
			<p>
				<a
					href={"https://www.hotutils.com/"}
					target={"_blank"}
					rel={"noopener noreferrer"}
				>
					https://www.hotutils.com/
				</a>
			</p>
			<p>
				<img
					className={"w-full"}
					src={"/img/hotsauce512.webp"}
					alt={"hotsauce"}
				/>
			</p>
		</div>
	);
}

const HelpView: React.FC = observer(() => {
	const [t] = useTranslation("help-ui");
	const helpSection = useValue(help$.section);
	const helpTopic = useValue(help$.topic);

	const sectionElements: Record<
		string,
		React.RefObject<HTMLButtonElement | null>
	> = {
		general: React.createRef<HTMLButtonElement>(),
		profiles: React.createRef<HTMLButtonElement>(),
		explorer: React.createRef<HTMLButtonElement>(),
		optimizer: React.createRef<HTMLButtonElement>(),
		editor: React.createRef<HTMLButtonElement>(),
	};

	const handleSectionSelect = (sectionName: HelpSections) => {
		help$.setHelpPosition(sectionName, 0);
	};

	return (
		<div className={"w-full flex flex-col"}>
			<nav className="flex flex-wrap justify-evenly p-4">
				<div className="m-1 p-2 rounded-xl">
					<FontAwesomeIcon
						icon={faCircleLeft}
						size="2xl"
						title={"Go back"}
						onClick={() => {
							if (help$.history.length === 0) {
								ui$.goToPreviousSection();
							} else {
								help$.goBack();
							}
						}}
					/>
				</div>
				<HelpSectionTab
					sectionName={"general"}
					currentSection={helpSection}
					sectionRef={sectionElements.general}
					onSelect={handleSectionSelect}
					label={t("general.Title")}
				/>
				<HelpSectionTab
					sectionName={"profiles"}
					currentSection={helpSection}
					sectionRef={sectionElements.profiles}
					onSelect={handleSectionSelect}
					label={t("profiles.Title")}
				/>
				<HelpSectionTab
					sectionName={"explorer"}
					currentSection={helpSection}
					sectionRef={sectionElements.explorer}
					onSelect={handleSectionSelect}
					label={t("explorer.Title")}
				/>
				<HelpSectionTab
					sectionName={"optimizer"}
					currentSection={helpSection}
					sectionRef={sectionElements.optimizer}
					onSelect={handleSectionSelect}
					label={t("optimizer.Title")}
				/>
				<HelpSectionTab
					sectionName={"editor"}
					currentSection={helpSection}
					sectionRef={sectionElements.editor}
					onSelect={handleSectionSelect}
					label={t("editor.Title")}
				/>
			</nav>
			<div className={`${topicCSS} text-center`}>
				<Show if={helpTopic === 0}>
					<Topics />
				</Show>
			</div>
			<div className={"overflow-y-auto"}>
				<Show if={helpTopic !== 0}>
					<Topic />
				</Show>
			</div>
		</div>
	);
});

HelpView.displayName = "HelpView";

export default HelpView;
