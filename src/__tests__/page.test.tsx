import { render, screen, fireEvent } from '@testing-library/react'
import Page from '@/app/page'

describe('Home Page', () => {
  it('renders heading and empty state', () => {
    render(<Page />)
    expect(screen.getByText(/Personal Notebook/i)).toBeInTheDocument()
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument()
  })

  it('adds a task via the form', () => {
    render(<Page />)
    const input = screen.getByLabelText('Task Title') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Write tests' } })
    fireEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })
})
