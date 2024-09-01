import './styles/cssReset.css';
import './styles/style-help.css';
import { WebviewWindow } from '@tauri-apps/api/window';

const activateButtons = () => {
  const helpWindow = WebviewWindow.getByLabel('help');
  const button = document.getElementById('close-button') as HTMLButtonElement;
  button.addEventListener('click', () => {
    helpWindow?.close();
  });
};

activateButtons();
