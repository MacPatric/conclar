import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';

// Mock react-markdown
vi.mock('react-markdown', () => ({
  default: ({ children }) => <div data-testid="markdown">{children}</div>,
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useTranslation.mockReturnValue({
      t: (key) => {
        const translations = {
          'footer.site_note_markdown': 'Test site note with **markdown**',
          'footer.copyright_markdown': '© 2026 Test Convention',
          'footer.conclar_note_markdown': 'Guide powered by [ConClár](https://github.com/lostcarpark/conclar)',
        };
        return translations[key] || key;
      },
    });
  });

  it('renders footer element', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer.footer');
    expect(footer).toBeDefined();
  });

  it('renders site note section', () => {
    const { container } = render(<Footer />);

    const siteNote = container.querySelector('.footer-site');
    expect(siteNote).toBeDefined();
  });

  it('renders site note markdown content', () => {
    render(<Footer />);

    expect(screen.getByText('Test site note with **markdown**')).toBeDefined();
  });

  it('renders footer bottom section', () => {
    const { container } = render(<Footer />);

    const footerBottom = container.querySelector('.footer-bottom');
    expect(footerBottom).toBeDefined();
  });

  it('renders copyright section', () => {
    const { container } = render(<Footer />);

    const copyright = container.querySelector('.footer-copyright');
    expect(copyright).toBeDefined();
  });

  it('renders copyright markdown content', () => {
    render(<Footer />);

    expect(screen.getByText('© 2026 Test Convention')).toBeDefined();
  });

  it('renders conclar note section', () => {
    const { container } = render(<Footer />);

    const conclarNote = container.querySelector('.footer-conclar');
    expect(conclarNote).toBeDefined();
  });

  it('renders conclar note markdown content', () => {
    render(<Footer />);

    expect(screen.getByText('Guide powered by [ConClár](https://github.com/lostcarpark/conclar)')).toBeDefined();
  });

  it('renders all three ReactMarkdown components', () => {
    render(<Footer />);

    const markdownComponents = screen.getAllByTestId('markdown');
    expect(markdownComponents).toHaveLength(3);
  });

  it('has correct structure hierarchy', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer.footer');
    const siteNote = footer.querySelector('.footer-site');
    const footerBottom = footer.querySelector('.footer-bottom');
    const copyright = footerBottom.querySelector('.footer-copyright');
    const conclarNote = footerBottom.querySelector('.footer-conclar');

    expect(footer).toBeDefined();
    expect(siteNote).toBeDefined();
    expect(footerBottom).toBeDefined();
    expect(copyright).toBeDefined();
    expect(conclarNote).toBeDefined();
  });
});
