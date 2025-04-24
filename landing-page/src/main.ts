

const dialog = document.getElementById('snippetModal') as HTMLDialogElement | null;
const iframe = document.getElementById('snippetIframe') as HTMLIFrameElement | null;
const playBtn = document.querySelector<HTMLButtonElement>('.snippet__play');
const closeBtn = document.querySelector<HTMLButtonElement>('.snippet-modal__close');

if (!dialog || !iframe || !playBtn || !closeBtn) {
    throw new Error('Modal failed to init');
}

let lastFocus: HTMLElement | null = null;
const supportsDialog = typeof dialog.showModal === 'function';

const YT_ID = 'x6iyz1AQhuU';
const openModal = (): void => {
    lastFocus = document.activeElement as HTMLElement | null;
    iframe.src = `https://www.youtube.com/embed/${YT_ID}?autoplay=1`;
    dialog.showModal();
}

const closeModal = (): void => {
    iframe.src = '';

    supportsDialog
        ? dialog.close()
        : dialog.removeAttribute('open');

    lastFocus?.focus();
};


playBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

dialog.addEventListener('close', () => {
    iframe.src = '';
    lastFocus?.focus();
});
