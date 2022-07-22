// react
import React, { useEffect, useRef } from 'react';

// styles
import './Spoiler.css';

type ComponentProps = {
  title: string;
  children: React.ReactNode;
};

const Spoiler = React.memo(({ title, children }: ComponentProps) => {
  const spoilerContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    spoilerContent.current?.style.setProperty(
      '--content-height',
      spoilerContent.current!.scrollHeight + 'px',
    );
  }, []);

  return (
    <div className={'spoiler'}>
      <div
        className={'title'}
        onClick={(e) =>
          (
            (e.target as HTMLDivElement)!.parentNode! as HTMLDivElement
          ).classList.toggle('open')
        }
      >
        {title}
      </div>
      <div className={'divider'} />
      <div className={'content'} ref={spoilerContent}>
        {children}
      </div>
    </div>
  );
});

Spoiler.displayName = 'Spoiler';

export default Spoiler;
