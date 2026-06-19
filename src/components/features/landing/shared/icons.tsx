import {
  FileTextOutlined,
  LinkOutlined,
  MessageOutlined,
  QrcodeOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { StyledGlyph } from './section.style'

export const STEP_ICONS = [
  <StyledGlyph key="s1" $size={28}><MessageOutlined /></StyledGlyph>,
  <StyledGlyph key="s2" $size={28}><ThunderboltOutlined /></StyledGlyph>,
  <StyledGlyph key="s3" $size={28}><FileTextOutlined /></StyledGlyph>,
]

export const FEAT_ICONS = [
  <StyledGlyph key="f1" $size={26}><MessageOutlined /></StyledGlyph>,
  <StyledGlyph key="f2" $size={26}><LinkOutlined /></StyledGlyph>,
  <StyledGlyph key="f3" $size={26}><QrcodeOutlined /></StyledGlyph>,
]
