import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ResetButton from './ResetButton';
import { useTranslation } from 'react-i18next';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

describe('ResetButton', () => {
  const mockResetFilters = vi.fn();
  const mockT = vi.fn((key) => key);

  beforeEach(() => {
    vi.clearAllMocks();
    useTranslation.mockReturnValue({ t: mockT });
  });

  it('renders nothing when isFiltered is false', () => {
    const { container } = render(
      <ResetButton isFiltered={false} resetFilters={mockResetFilters} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a button when isFiltered is true', () => {
    render(<ResetButton isFiltered={true} resetFilters={mockResetFilters} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDefined();
    expect(button.className).toBe('reset-button');
    expect(mockT).toHaveBeenCalledWith('filter.reset.label');
  });

  it('calls resetFilters when clicked', () => {
    render(<ResetButton isFiltered={true} resetFilters={mockResetFilters} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockResetFilters).toHaveBeenCalledTimes(1);
  });
});
