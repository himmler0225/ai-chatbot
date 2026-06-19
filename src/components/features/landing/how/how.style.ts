'use client'

import styled from 'styled-components'
import { Stagger, StaggerItem } from '../shared/Motion'

export const HowStagger = styled(Stagger)`
  display: grid;
  gap: 1.25rem;
  align-items: stretch;

  & > [data-anime-stagger] {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* iPad / tablet: 1 cột, căn giữa */
  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: 1fr;
    max-width: 520px;
    margin-inline: auto;
    gap: 1rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
`

export const HowStepItem = styled(StaggerItem)`
  height: 100%;
`
