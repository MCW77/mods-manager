// react
import React from "react";
import { useDispatch } from "react-redux";

// state
import { ui$ } from "#/modules/ui/state/ui";

// modules
import { Help } from '#/state/modules/help';

//domain
import { HelpSections } from "#/domain/HelpSections";

// components
import { HelpCircle } from "lucide-react";

import { Button } from "#ui/button";

type ComponentProps = {
  title: string;
  section: HelpSections;
  topic: number;
}

const HelpLink = React.memo(
  ({title, section, topic}: ComponentProps) => {
    const dispatch = useDispatch();

    return <Button
      className='inline-block h-6 w-6 m-x-1 m-y-0 align-middle cursor-pointer'
      size='icon'
      title={title}
      variant='ghost'
      onClick={() => {
        dispatch(Help.actions.setHelpPosition(section, topic));
        ui$.currentSection.set('help');
      }}
    >
      <HelpCircle className="h-6 w-6 m-auto"></HelpCircle>
    </Button>
  }
)

HelpLink.displayName = 'HelpLink';

export { HelpLink };
