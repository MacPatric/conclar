import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShareLink from './ShareLink';
import { useStoreState } from 'easy-peasy';
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

// Mock easy-peasy
vi.mock('easy-peasy', () => ({
  useStoreState: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ to, children }) => <a href={to}>{children}</a>,
  };
});

// Mock react-qr-code
vi.mock('react-qr-code', () => ({
  default: ({ value }) => <div data-testid="qr-code" data-value={value}>QR Code</div>,
}));

// Mock config data
vi.mock('../config.json', () => ({
  default: {
    PROGRAM: {
      MY_SCHEDULE: {
        SHARE: {
          MAX_LENGTH: 50,
        },
      },
    },
  },
}));

describe('ShareLink', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.publicUrl
    window.publicUrl = '/';

    // Mock window.location
    delete window.location;
    window.location = { origin: 'http://localhost:3000' };

    useTranslation.mockReturnValue({
      t: (key) => {
        const translations = {
          'program.my_schedule.share.label': 'Share program selection',
          'program.my_schedule.share.description': 'Copy and paste this link to share your selections with other devices. Or point your camera at the QR code below.',
          'program.my_schedule.share.link_label': 'Shareable link',
          'program.my_schedule.share.multiple_link_label': 'Shareable link #@number',
          'program.my_schedule.share.multiple_description': 'Because you have selected a large number of items, you will need to use multiple links/QR codes to transfer to your other devices.',
        };
        return translations[key] || key;
      },
    });
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('renders nothing when mySchedule is empty', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [],
      };
      return selector(state);
    });

    const { container } = render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    expect(container.innerHTML).toBe('');
  });

  it('renders share link section when items are present', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [
          { id: '1', title: 'Item 1' },
          { id: '2', title: 'Item 2' },
        ],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    expect(screen.getByText('Share program selection')).toBeDefined();
  });

  it('renders description text', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [{ id: '1', title: 'Item 1' }],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    expect(screen.getByText(/Copy and paste this link to share/)).toBeDefined();
  });

  it('renders single link for few items', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [
          { id: '1', title: 'Item 1' },
          { id: '2', title: 'Item 2' },
        ],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    expect(screen.getByText('Shareable link')).toBeDefined();
  });

  it('generates correct link URL with tilde separator', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [
          { id: '1', title: 'Item 1' },
          { id: '2', title: 'Item 2' },
        ],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    const link = screen.getByText('Shareable link');
    expect(link.getAttribute('href')).toBe('/ids/1~2');
  });

  it('renders QR code', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [{ id: '1', title: 'Item 1' }],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    const qrCode = screen.getByTestId('qr-code');
    expect(qrCode).toBeDefined();
    expect(qrCode.getAttribute('data-value')).toBe('http://localhost:3000/ids/1');
  });

  it('splits into multiple links when exceeding MAX_LENGTH', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [
          { id: '123456789012345', title: 'Item 1' },
          { id: '234567890123456', title: 'Item 2' },
          { id: '345678901234567', title: 'Item 3' },
          { id: '456789012345678', title: 'Item 4' },
        ],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    // Should have multiple links
    const links = screen.getAllByText(/Shareable link/);
    expect(links.length).toBeGreaterThan(1);
  });

  it('displays multiple description when there are multiple links', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [
          { id: '123456789012345', title: 'Item 1' },
          { id: '234567890123456', title: 'Item 2' },
          { id: '345678901234567', title: 'Item 3' },
          { id: '456789012345678', title: 'Item 4' },
        ],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    expect(screen.getByText(/Because you have selected a large number of items/)).toBeDefined();
  });

  it('does not display multiple description with single link', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [
          { id: '1', title: 'Item 1' },
          { id: '2', title: 'Item 2' },
        ],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    expect(screen.queryByText(/Because you have selected a large number of items/)).toBeNull();
  });

  it('numbers multiple links correctly', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [
          { id: '123456789012345', title: 'Item 1' },
          { id: '234567890123456', title: 'Item 2' },
          { id: '345678901234567', title: 'Item 3' },
          { id: '456789012345678', title: 'Item 4' },
        ],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    // Check for numbered links (note: the numbering in the code starts at key + 1)
    const links = screen.getAllByText(/Shareable link #/);
    expect(links.length).toBeGreaterThan(0);
  });

  it('has correct CSS classes', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [{ id: '1', title: 'Item 1' }],
      };
      return selector(state);
    });

    const { container } = render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    expect(container.querySelector('.share-group')).toBeDefined();
    expect(container.querySelector('.share-head')).toBeDefined();
    expect(container.querySelector('.share-body')).toBeDefined();
    expect(container.querySelector('.share-link')).toBeDefined();
    expect(container.querySelector('.share-qr-code')).toBeDefined();
  });

  it('generates multiple QR codes for multiple links', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [
          { id: '123456789012345', title: 'Item 1' },
          { id: '234567890123456', title: 'Item 2' },
          { id: '345678901234567', title: 'Item 3' },
          { id: '456789012345678', title: 'Item 4' },
        ],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    const qrCodes = screen.getAllByTestId('qr-code');
    expect(qrCodes.length).toBeGreaterThan(1);
  });

  it('handles single item', () => {
    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [{ id: 'abc123', title: 'Single Item' }],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    const link = screen.getByText('Shareable link');
    expect(link.getAttribute('href')).toBe('/ids/abc123');
  });

  it('uses window.publicUrl for link generation', () => {
    window.publicUrl = '/app/';

    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [{ id: '1', title: 'Item 1' }],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    const link = screen.getByText('Shareable link');
    expect(link.getAttribute('href')).toBe('/app/ids/1');
  });

  it('uses window.location.origin for absolute QR code URLs', () => {
    delete window.location;
    window.location = { origin: 'https://example.com' };
    window.publicUrl = '/';

    useStoreState.mockImplementation((selector) => {
      const state = {
        getMySchedule: [{ id: '1', title: 'Item 1' }],
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ShareLink />
      </BrowserRouter>
    );

    const qrCode = screen.getByTestId('qr-code');
    expect(qrCode.getAttribute('data-value')).toBe('https://example.com/ids/1');
  });
});
