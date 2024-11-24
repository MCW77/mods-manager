// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const about$ = stateLoader$.about$;

// components
import { Github } from "lucide-react";
import { Button } from "#ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";

const AboutView = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");

		return (
			<div className={"p-y-4 flex flex-col gap-20 items-center grow-1"}>
				<div>
					<div className={"flex justify-center items-center gap-1"}>
						<img
							className={"h-[3.75em] p-2"}
							alt={"Logo"}
							src={"/img/gold-crit-dmg-arrow-mod-cropped.webp"}
						/>
						<h1 className={"leading-tight"}>
							Grandivory's Mods Optimizer
							<span className="block text-[0.5em]">
								{t("header.SubtitleFor")} Star Wars: Galaxy of Heroes™
							</span>
							<span className={"block text-[0.7em]"}>
								version {about$.version.get()}
							</span>
						</h1>
					</div>
					Star Wars: Galaxy of Heroes™ is owned by EA and Capital Games. This
					site is not affiliated with them.
				</div>
				<div className={"text-center"}>
					<a
						href={"https://github.com/grandivory/mods-optimizer"}
						target={"_blank"}
						rel={"noopener noreferrer"}
					>
						Contribute
					</a>
					&nbsp;|&nbsp; Ask for help or give feedback on{" "}
					<a
						href={"https://discord.gg/WFKycSm"}
						target={"_blank"}
						rel={"noopener noreferrer"}
					>
						Discord
					</a>
					&nbsp;| Like the tool? Consider donating to support the
					developer!&nbsp;
					<a
						href={"https://paypal.me/grandivory"}
						target={"_blank"}
						rel={"noopener noreferrer"}
						className={"text-yellow-300"}
					>
						Paypal
					</a>
					&nbsp;or&nbsp;
					<a
						href={"https://www.patreon.com/grandivory"}
						target={"_blank"}
						rel={"noopener noreferrer"}
						className={"text-yellow-300"}
					>
						Patreon
					</a>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col items-center">
						<h1>Blackfyre Edition (aka mods-manager)</h1>
						<h2>This is my fork of GIMO that i continue developing</h2>
					</div>
					<div className="flex gap-2">
						<Card className="size-fit">
							<CardHeader>
								<CardTitle>Contribute</CardTitle>
							</CardHeader>
							<CardContent className="flex justify-center items-center">
								<Button variant="link" asChild>
									<a
										href={"https://github.com/MCW77/mods-manager"}
										target="_blank"
										rel="noopener noreferrer"
									>
										<div className="flex gap-2 items-center">
											<span className="i-skill-icons:github-light dark:i-skill-icons:github-dark text-16" />
											<span>mods-manager on Github</span>
										</div>
									</a>
								</Button>
							</CardContent>
						</Card>
						<Card className="size-fit">
							<CardHeader>
								<CardTitle>Help & Feedback</CardTitle>
							</CardHeader>
							<CardContent className="flex justify-center items-center">
								<Button variant="link" asChild>
									<a
										href={"https://discord.gg/WFKycSm"}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span className="i-skill-icons:discord size-16" />
										<div className="flex flex-col gap-2 p-l-4">
											<div>Tag me on Grandivory's discord server.</div>
											<div>@Gylbert Blackfyre</div>
										</div>
									</a>
								</Button>
							</CardContent>
						</Card>
						<Card className="size-fit">
							<CardHeader>
								<CardTitle>Support</CardTitle>
							</CardHeader>
							<CardContent className="flex justify-center items-center">
								<Button variant="link" asChild>
									<a
										href={"https://paypal.me/mcw077"}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span className="i-logos:paypal text-16" />
										<span className="p-l-4">
											Thank you for helping me work on this
										</span>
									</a>
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}),
);

AboutView.displayName = "AboutView";

export { AboutView };
