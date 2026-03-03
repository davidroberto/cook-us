import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
    it('affiche "En attente" pour pending', () => {
        render(<StatusBadge status="pending" />)
        expect(screen.getByText('En attente')).toBeInTheDocument()
    })

    it('affiche "Acceptée" pour accepted', () => {
        render(<StatusBadge status="accepted" />)
        expect(screen.getByText('Acceptée')).toBeInTheDocument()
    })

    it('affiche "Refusée" pour declined', () => {
        render(<StatusBadge status="declined" />)
        expect(screen.getByText('Refusée')).toBeInTheDocument()
    })

    it('applique la classe verte pour accepted', () => {
        render(<StatusBadge status="accepted" />)
        expect(screen.getByText('Acceptée')).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('applique la classe rouge pour declined', () => {
        render(<StatusBadge status="declined" />)
        expect(screen.getByText('Refusée')).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('applique la classe jaune pour pending', () => {
        render(<StatusBadge status="pending" />)
        expect(screen.getByText('En attente')).toHaveClass('bg-yellow-100', 'text-yellow-800')
    })
})
