import { screen }  from '@testing-library/dom';
import userEvent   from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import { join }         from 'node:path';

const fixtureHtml = readFileSync(
  join(__dirname, 'fixtures', 'page.html'),
  'utf8',
);


if (!('showModal' in HTMLDialogElement.prototype)) {
  Object.assign(HTMLDialogElement.prototype, {
    showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
    close(this: HTMLDialogElement) {
      this.removeAttribute('open');
    },
  });
}

const loadApp = () => {
  require('../src/main.ts');
};

beforeEach(() => {
  jest.resetModules();
  document.body.innerHTML = fixtureHtml;
  loadApp();
});

test('Should open a modal, set iframe src', async () => {
  await userEvent.click(
    screen.getByRole('button', { name: /play video/i }),
  );

  const dialog = document.getElementById('snippetModal');
  const iframe = document.getElementById('snippetIframe') as HTMLIFrameElement;

  expect(dialog).toHaveAttribute('open');
  expect(iframe.src).toMatch(/autoplay=1/);
});

test('should close the modal when close button is pressed, clear src and restores focus', async () => {
  const play  = screen.getByRole('button', { name: /play video/i });
  await userEvent.click(play);

  const close = screen.getByRole('button', { name: /close dialog/i });
  await userEvent.click(close);                     

  const dialog = document.getElementById('snippetModal');
  const iframe = document.getElementById('snippetIframe') as HTMLIFrameElement;

  expect(dialog).not.toHaveAttribute('open');
  expect(iframe).toHaveAttribute('src', '');
  expect(play).toHaveFocus();
});

test('missing DOM nodes → throws', () => {
  jest.resetModules();
  document.body.innerHTML = '<div></div>'; 
  expect(() => require('../src/main.ts')).toThrow(/Modal failed to init/);
});
