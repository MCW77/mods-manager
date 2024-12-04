// react
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// utils
import formatAllycode from "#/utils/formatAllycode";

// state
const { refreshPlayerData } = await import(
	"#/modules/profileFetch/profileFetch"
);

// components
import { Input } from "#ui/input";

type ComponentProps = {
	setAddMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileAdder = React.memo(({ setAddMode }: ComponentProps) => {
	const [t] = useTranslation("global-ui");
	const inputRef = useRef<HTMLInputElement>(null);
	const [isFetchFinished, setIsFetchFinished] = useState(false);

	useEffect(() => {
		if (isFetchFinished === true) setAddMode(false);
	}, [isFetchFinished, setAddMode]);

	const fetch = async (allycode: string): Promise<void> => {
		const result = await refreshPlayerData(allycode, true, null);
		setIsFetchFinished(true);
		return result;
	};

	return (
		<Input
			className="w-60"
			type={"text"}
			inputMode={"numeric"}
			placeholder={t("header.ProfileSelectionPlaceholder")}
			size={26}
			ref={inputRef}
			onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
				if (e.key === "Escape") {
					setAddMode(false);
				}
				if (e.key === "Enter") {
					fetch((e.target as HTMLInputElement).value);
				}
				// Don't change the input if the user is trying to select something
				const windowSelection = window.getSelection();
				if (windowSelection?.toString() !== "") {
					return;
				}
				// Don't change the input if the user is hitting the arrow keys
				if (
					["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
				) {
					return;
				}

				// Format the input field
				(e.target as HTMLInputElement).value = formatAllycode(
					(e.target as HTMLInputElement).value,
				);
			}}
		/>
	);
});

ProfileAdder.displayName = "ProfileAdder";

export default ProfileAdder;
