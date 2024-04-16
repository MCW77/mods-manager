// react
import React from "react";
import { useDispatch } from "react-redux";

// state
import { ui$ } from "#/modules/ui/state/ui";

// modules
import { Settings } from '#/state/modules/settings';

// domain
import { SettingsSections } from "#/domain/SettingsSections";

// components
import { Settings as SettingsIcon } from "lucide-react";

import { Button } from "#ui/button";

type ComponentProps = {
  title: string;
  section: SettingsSections;
  topic: number;
}

const SettingsLink = React.memo(
  ({title, section, topic}: ComponentProps) => {
    const dispatch = useDispatch();

    return <Button
      className='inline-block h-6 w-6 m-x-1 m-y-0 align-middle cursor-pointer'
      size='icon'
      title={title}
      variant='ghost'
      onClick={() => {
        dispatch(Settings.actions.setSettingsPosition(section, topic));
        ui$.currentSection.set('settings');
      }}
    >
      <SettingsIcon className="h-6 w-6 m-auto"></SettingsIcon>
    </Button>
  }
)

SettingsLink.displayName = 'SettingsLink';

export { SettingsLink };
