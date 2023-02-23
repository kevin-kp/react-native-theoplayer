import React, { useContext, useState } from 'react';
import type { Source } from '../../utils/source/Source';
import { Platform } from 'react-native';
import ALL_SOURCES from '../../res/sources.json';
import { PlayerContext } from '../util/PlayerContext';
import { ListSvg } from '../button/svg/ListSvg';
import { MenuButton } from './common/MenuButton';
import { MenuRadioButton } from './common/MenuRadioButton';
import { ScrollableMenu } from './common/ScrollableMenu';
import { MenuView } from './common/MenuView';

const SOURCES = ALL_SOURCES.filter((source) => source.os.indexOf(Platform.OS) >= 0) as Source[];

export const SourceMenuButton = () => {
  const context = useContext(PlayerContext);
  const [selectedSourceId, setSelectedSourceId] = useState<number | undefined>(undefined);

  const onSelectSource = (id: number) => {
    context.player.source = SOURCES[id].source;
    setSelectedSourceId(id);
  };
  if (!(SOURCES && SOURCES.length > 0)) {
    return <></>;
  }

  // Since this button in mostly for debugging purposes, set the first available source on the player.
  if (selectedSourceId === undefined) {
    onSelectSource(0);
  }

  return <MenuButton svg={<ListSvg />} menu={<SourceMenuView selectedSourceId={selectedSourceId} onSelectSource={onSelectSource} />} />;
};

interface SourceMenuViewProps {
  selectedSourceId: number | undefined;
  onSelectSource: (id: number) => void;
}

export const SourceMenuView = (props: SourceMenuViewProps) => {
  const { onSelectSource, selectedSourceId } = props;
  const [localSourceId, setLocalSourceId] = useState<number | undefined>(selectedSourceId);
  const selectSource = (id: number) => {
    setLocalSourceId(id);
    onSelectSource(id);
  };
  return (
    <MenuView
      menu={
        <ScrollableMenu
          title={'Source'}
          items={SOURCES.map((source, id) => (
            <MenuRadioButton key={id} label={source.name} id={id} onSelect={selectSource} selected={id === localSourceId}></MenuRadioButton>
          ))}
        />
      }
    />
  );
};
