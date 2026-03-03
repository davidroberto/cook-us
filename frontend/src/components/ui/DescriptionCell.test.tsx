import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DescriptionCell } from './DescriptionCell'

describe('DescriptionCell', () => {
    it('affiche "-" pour null', () => {
        render(<DescriptionCell text={null} />)
        expect(screen.getByText('-')).toBeInTheDocument()
    })

    it('affiche le texte fourni', () => {
        render(<DescriptionCell text="Chef spécialisé en cuisine italienne" />)
        const elements = screen.getAllByText('Chef spécialisé en cuisine italienne')
        expect(elements.length).toBeGreaterThanOrEqual(1)
    })

    it('affiche le texte en double (tronqué + tooltip)', () => {
        const text = 'Une très longue description de cuisinier'
        render(<DescriptionCell text={text} />)
        const elements = screen.getAllByText(text)
        expect(elements).toHaveLength(2)
    })
})
