import './styles/cssReset.css';
import './styles/style-help.css';
import { WebviewWindow } from '@tauri-apps/api/window';

const activateCloseButton = () => {
  const helpWindow = WebviewWindow.getByLabel('help');
  const button = document.getElementById('close-button') as HTMLButtonElement;
  if (button && helpWindow) {
    button.addEventListener('click', () => {
      helpWindow.close();
    });
  }
};

const activateTabs = () => {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const targetContent = document.getElementById(
        tab.getAttribute('data-target') ?? '',
      );
      if (targetContent) targetContent.classList.add('active');
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  activateTabs();
  activateCloseButton();
});
