import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Thermometer } from 'lucide-react';
import MetricModule from '../../components/ui/MetricModule';

describe('MetricModule', () => {
  const defaultProps = {
    icon: <Thermometer className="w-6 h-6" data-testid="icon" />,
    label: 'Temperature',
    value: 24,
    unit: '°C',
    trend: '+2.1%',
    trendUp: true,
    color: 'text-accent',
  };

  it('renders label and value', () => {
    render(<MetricModule {...defaultProps} />);
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
  });

  it('renders unit', () => {
    render(<MetricModule {...defaultProps} />);
    expect(screen.getByText('°C')).toBeInTheDocument();
  });

  it('renders trend value', () => {
    render(<MetricModule {...defaultProps} />);
    expect(screen.getByText(/\+2\.1%/)).toBeInTheDocument();
  });

  it('applies correct color class', () => {
    const { container } = render(<MetricModule {...defaultProps} color="text-error" />);
    const trendEl = container.querySelector('.text-error');
    expect(trendEl).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<MetricModule {...defaultProps} />);
    const icon = document.querySelector('[data-testid="icon"]');
    expect(icon).toBeInTheDocument();
  });
});
