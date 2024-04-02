// react
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Computed, For, Memo, Reactive, observer, reactive } from "@legendapp/state/react";

// state
import { ObservableOptimizationPlan } from "#/containers/CharacterEditForm/CharacterEditForm";

// modules
import { Data } from "#/state/modules/data";

import { BaseCharacter } from "#/domain/BaseCharacter";
import { createTargetStat } from "#/domain/TargetStat";

// components
import { TargetStatWidget } from "#/components/TargetStatWidget/TargetStatWidget";
import { Button } from "#ui/button";
import { Card } from "../ui/card";


type ComponentProps = {
  target$: ObservableOptimizationPlan;
}

const TargetStatsWidget = observer(({
  target$,
}: ComponentProps) => {
  const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);

  const baseCharacters2 = useMemo(
    () => (Object.values(baseCharacters).slice(0) as BaseCharacter[])
      .sort((a, b) => a.name.localeCompare(b.name))
    , [baseCharacters]
  )

  return <div>
    <Computed>
      {() =>
        <div className='flex flex-wrap gap-2'>
          <Card className={'flex items-center justify-center aspect-square'}>
            <Button
              type={'button'}
              size={'lg'}
              variant={'outline'}
              onClick={() => {
                target$.addTargetStat();
/*
                target$.target.targetStats.set(
                  [...target$.target.targetStats.peek(), createTargetStat('Speed')]
                )
*/
              }}
            >
              +
            </Button>
          </Card>
          {target$.target.targetStats.get() &&
            target$.target.targetStats.map(
            (targetStat$) => {
              return <TargetStatWidget target$={target$} id={targetStat$.peek().id} key={targetStat$.id.peek()} baseCharacters={baseCharacters2}></TargetStatWidget>

            },
          )}
        </div>
      }
    </Computed>
  </div>;
})

TargetStatsWidget.displayName = 'TargetStatsWidget';

export { TargetStatsWidget };


                /*<Memo key={id}>
                {() =>*/
                  //}
//                </Memo>
/*
    <For each={targetStats$}>
      {(item as Observable<TargetStat2>) => {
        const id = item.peek()!.id;
        return item.peek() !== undefined ? <TargetStatWidget targetStat$={item} targetStats={targetStats$} id={id} baseCharacters={baseCharacters2}></TargetStatWidget> : <></>
      }}
    </For>
*/