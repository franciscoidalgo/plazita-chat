/* eslint-disable react/jsx-key */
import { Skeleton, Stack } from '@chakra-ui/react';
import React from 'react';

interface Props {
  h: string;
}

export const ChatLoading: React.FC<Props> = ({ h }) => {
  return (
    <Stack>
      <Skeleton h={h} />
      <Skeleton h={h} />
      <Skeleton h={h} />
      <Skeleton h={h} />
      <Skeleton h={h} />
      <Skeleton h={h} />
      <Skeleton h={h} />
      <Skeleton h={h} />
      <Skeleton h={h} />
      <Skeleton h={h} />
      <Skeleton h={h} />
      <Skeleton h={h} />
      <Skeleton h={h} />
    </Stack>
  );
};
