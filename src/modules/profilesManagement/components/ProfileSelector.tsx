// utils
import { objectEntries } from "#/utils/objectEntries";

// react
import type React from "react";
import { useTranslation } from "react-i18next";
import { For, observer, useValue, useObservable } from "@legendapp/state/react";

// state
import type { ObservableBoolean } from "@legendapp/state";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;

// components
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { Select as ReactiveSelect } from "#/components/reactive/Select";

type ComponentProps = {
	isAddingProfile$: ObservableBoolean;
};

const ProfileSelector: React.FC<ComponentProps> = observer(
	({ isAddingProfile$ }: ComponentProps) => {
		const [t] = useTranslation("global-ui");
		const selectedItem$ = useObservable(
			() =>
				profilesManagement$.profiles.playernameByAllycode.get()[
					profilesManagement$.profiles.activeAllycode.get() ?? ""
				],
		);

		const nameByAllycode$ = useObservable(() =>
			objectEntries(profilesManagement$.profiles.playernameByAllycode.get()),
		);
		const profileItems = useValue(() => {
			const items = nameByAllycode$.map(([allycode$, playerName$]) => ({
				value: allycode$.get(),
				label: playerName$.get(),
			}));
			items.push({ value: "new", label: t("header.ProfileAdderNewCode") });
			return items;
		});

		return (
			<ReactiveSelect
				items={profileItems}
				$value={selectedItem$}
				onValueChange={(value) => {
					if (value === undefined) return;
					if (value === "new") {
						isAddingProfile$.set(true);
						return;
					}
					profilesManagement$.profiles.activeAllycode.set(value);
				}}
			>
				<SelectTrigger className="w-60 accent-blue">
					<SelectValue />
				</SelectTrigger>
				<SelectContent className="accent-blue">
					<SelectGroup className="accent-blue">
						<For each={nameByAllycode$}>
							{([allycode$, playerName$]) => (
								<SelectItem key={allycode$.get()} value={allycode$.get()}>
									{playerName$.get()}
								</SelectItem>
							)}
						</For>
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup className="accent-blue">
						<SelectItem key="new" value="new">
							{t("header.ProfileAdderNewCode")}
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</ReactiveSelect>
		);
	},
);

ProfileSelector.displayName = "ProfileSelector";

export default ProfileSelector;
