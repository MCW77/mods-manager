// utils
import { objectEntries } from "#/utils/objectEntries";

// react
import type React from "react";
import { useTranslation } from "react-i18next";
import {
	For,
	observer,
	reactive,
	use$,
	useObservable,
} from "@legendapp/state/react";
import { useRenderCount } from "#/hooks/useRenderCount";

// state
import type { ObservableBoolean } from "@legendapp/state";
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;

// components
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

// Create ReactiveSelect outside component to prevent recreation on every render
const ReactiveSelect = reactive(Select);

type ComponentProps = {
	isAddingProfile$: ObservableBoolean;
};

const ProfileSelector: React.FC<ComponentProps> = observer(
	({ isAddingProfile$ }: ComponentProps) => {
		useRenderCount("ProfileSelector");
		const [t] = useTranslation("global-ui");
		const allycode = use$(profilesManagement$.profiles.activeAllycode);
		const nameByAllycode$ = useObservable(
			objectEntries(profilesManagement$.profiles.playernameByAllycode.get()),
		);

		return (
			<ReactiveSelect
				$value={profilesManagement$.profiles.activeAllycode}
				onValueChange={(value) => {
					if (value === "new") {
						isAddingProfile$.set(true);
					} else {
						if (value === "") return;
						profilesManagement$.profiles.activeAllycode.set(value);
					}
				}}
			>
				<SelectTrigger className="w-60 accent-blue">
					<SelectValue placeholder={allycode} />
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
