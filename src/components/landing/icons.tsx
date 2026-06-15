import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  GlobalOutlined,
  LinkOutlined,
  MessageOutlined,
  QrcodeOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { PRIM } from '@/src/constants/brand'

const s26 = { fontSize: 26, color: PRIM }
const s28 = { fontSize: 28, color: PRIM }

export const STEP_ICONS = [
  <MessageOutlined key="s1" style={s28} />,
  <ThunderboltOutlined key="s2" style={s28} />,
  <FileTextOutlined key="s3" style={s28} />,
]

export const FEAT_ICONS = [
  <MessageOutlined key="f1" style={s26} />,
  <LinkOutlined key="f2" style={s26} />,
  <QrcodeOutlined key="f3" style={s26} />,
]

export const WHY_ICONS = [
  <SafetyOutlined key="w1" style={s26} />,
  <ClockCircleOutlined key="w2" style={s26} />,
  <CheckCircleOutlined key="w3" style={s26} />,
  <GlobalOutlined key="w4" style={s26} />,
]
