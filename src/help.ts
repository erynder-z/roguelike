import './styles/cssReset.css';
import './styles/style-help.css';
import { WebviewWindow } from '@tauri-apps/api/window';

const activateCloseButton = () => {
  const helpWindow = WebviewWindow.getByLabel('help');
  const button = document.getElementById('close-button') as HTMLButtonElement;

  const closeWindow = () => {
    if (helpWindow) {
      helpWindow.close();
    }
  };

  if (button) {
    button.addEventListener('click', closeWindow);
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'C') {
      closeWindow();
    }
  });
};

const initializeTabs = () => {
  const tabElements = document.querySelectorAll(
    '.tab',
  ) as NodeListOf<HTMLElement>;
  const contentElements = document.querySelectorAll('.tab-content');

  const handleTabClick = (tabElement: HTMLElement) => {
    tabElements.forEach(tab => tab.classList.remove('active'));
    contentElements.forEach(content => content.classList.remove('active'));
    tabElement.classList.add('active');

    const targetContentId = tabElement.getAttribute('data-target');
    const targetContent = targetContentId
      ? document.getElementById(targetContentId)
      : null;
    targetContent?.classList.add('active');
  };

  tabElements.forEach(tabElement =>
    tabElement.addEventListener('click', () => handleTabClick(tabElement)),
  );

  document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'o':
        handleTabClick(
          document.querySelector('[data-target="controls"]') as HTMLElement,
        );
        break;
      case 't':
        handleTabClick(
          document.querySelector('[data-target="concepts"]') as HTMLElement,
        );
        break;
      case 'B':
        handleTabClick(
          document.querySelector('[data-target="buffs"]') as HTMLElement,
        );
        break;
      case 'I':
        handleTabClick(
          document.querySelector('[data-target="items"]') as HTMLElement,
        );
        break;
      case 'M':
        handleTabClick(
          document.querySelector('[data-target="mobs"]') as HTMLElement,
        );
        break;
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initializeTabs();
  activateCloseButton();
});
