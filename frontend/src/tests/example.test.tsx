import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../pages/Home'

it('renders title', () => {
  render(<Home />)
  expect(screen.getByText(/Green Travel Tracker/i)).toBeInTheDocument()
})
