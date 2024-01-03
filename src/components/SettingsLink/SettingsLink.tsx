// react
import React from "react";
import { useDispatch } from "react-redux";

// styles
import {
  faGear,
} from "@fortawesome/free-solid-svg-icons";

// modules
import { Settings } from '#/state/modules/settings';

// domain
import { SettingsSections } from "#/domain/SettingsSections";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ComponentProps = {
  title: string;
  section: SettingsSections;
  topic: number;
}

const SettingsLink = React.memo(
  ({title, section, topic}: ComponentProps) => {
    const dispatch = useDispatch();

    return (
      <span
        className={'cursor-pointer'}
        title={title}
        onClick={() =>
          dispatch(Settings.actions.setSettingsPosition(section, topic))
        }
      >
        <FontAwesomeIcon icon={faGear} />
      </span>
    )
  }
)

SettingsLink.displayName = 'SettingsLink';

export { SettingsLink };
