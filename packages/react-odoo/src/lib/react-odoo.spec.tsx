import { render } from '@testing-library/react';

import ReactOdoo from './react-odoo';

describe('ReactOdoo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactOdoo />);
    expect(baseElement).toBeTruthy();
  });
});
