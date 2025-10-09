import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import Page from '@/app/page'

describe('Home Page', () => {
  it('renders heading and empty state', () => {
    render(<Page />)
    expect(screen.getByText(/Personal Notebook/i)).toBeInTheDocument()
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument()
  })

  it('adds a task via the form', async () => {
    render(<Page />)
    const input = screen.getByLabelText('Task Title') as HTMLInputElement
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Write tests' } })
      fireEvent.click(screen.getByRole('button', { name: /add/i }))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Write tests')).toBeInTheDocument()
    })
  })
})
