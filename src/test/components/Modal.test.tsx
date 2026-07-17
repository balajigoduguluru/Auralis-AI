import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../components/ui/Modal';

describe('Modal', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}} ariaLabel="Test Modal">
        <p>Content</p>
      </Modal>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders content when open', () => {
    render(
      <Modal open={true} onClose={() => {}} ariaLabel="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('sets correct aria-label', () => {
    render(
      <Modal open={true} onClose={() => {}} ariaLabel="Test Modal">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Test Modal');
  });

  it('calls onClose when pressing Escape', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} ariaLabel="Test Modal">
        <p>Content</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when clicking backdrop', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} ariaLabel="Test Modal">
        <p>Content</p>
      </Modal>
    );
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose when clicking inside content', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} ariaLabel="Test Modal">
        <button>Inside</button>
      </Modal>
    );
    const button = screen.getByText('Inside');
    fireEvent.click(button);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll when open', () => {
    const { rerender } = render(
      <Modal open={true} onClose={() => {}} ariaLabel="Test Modal">
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal open={false} onClose={() => {}} ariaLabel="Test Modal">
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('traps focus within modal', () => {
    render(
      <Modal open={true} onClose={() => {}} ariaLabel="Test Modal">
        <button>First</button>
        <button>Last</button>
      </Modal>
    );
    const first = screen.getByText('First');
    const last = screen.getByText('Last');

    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });
});
