import { PopupBoxBad } from '../ui/popup/popupBoxBad';
import { PopupBoxGood } from '../ui/popup/popupBoxGood';

/**
 * Handles showing informational popups to the user.
 */
export class PopupHandler {
  /**
   * Displays a good popup message to the user.
   *
   * @param {string} msg - The message to display in the popup.
   * @returns {void}
   *
   * The popup is created as an instance of `PopupBoxGood` and appended
   * to the element with the ID 'body-main'. If the body element is not found,
   * an error is logged. The popup is ensured to be the first child of the body.
   */

  public static showGoodPopup(msg: string): void {
    const body = document.getElementById('body-main');
    if (!body) {
      console.error('Body element not found');
      return;
    }

    const popup = document.createElement('popup-box-good') as PopupBoxGood;

    body.appendChild(popup);
    popup.showMessage(msg);

    // Ensure the titleContainer is the first child of the body
    if (body.firstChild) {
      body.insertBefore(popup, body.firstChild);
    } else {
      body.appendChild(popup);
    }
  }

  /**
   * Displays a bad popup message to the user.
   *
   * @param {string} msg - The message to display in the popup.
   * @returns {void}
   *
   * The popup is created as an instance of `PopupBoxBad` and appended
   * to the element with the ID 'body-main'. If the body element is not found,
   * an error is logged. The popup is ensured to be the first child of the body.
   */
  public static showBadPopup(msg: string): void {
    const body = document.getElementById('body-main');
    if (!body) {
      console.error('Body element not found');
      return;
    }

    const popup = document.createElement('popup-box-bad') as PopupBoxBad;

    body.appendChild(popup);
    popup.showMessage(msg);

    // Ensure the titleContainer is the first child of the body
    if (body.firstChild) {
      body.insertBefore(popup, body.firstChild);
    } else {
      body.appendChild(popup);
    }
  }
}
