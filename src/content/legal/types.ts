export type LegalSection = {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export type LegalDocument = {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

export type LegalDocKey = 'privacy' | 'terms'
