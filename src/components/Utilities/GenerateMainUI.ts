export class GenerateMainUI {
  public static async generate() {
    const body = document.getElementById('body-main');

    if (!body) {
      console.error('Body element not found');
      return;
    }

    // Main container
    const mainContainer = document.createElement('div');
    mainContainer.id = 'main-container';
    mainContainer.classList.add('main-container', 'scanlines');

    // Stats container
    const statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';
    statsContainer.classList.add('stats-container');
    const statsDisplay = document.createElement('stats-display');
    statsContainer.appendChild(statsDisplay);

    // Messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'messages-container';
    messagesContainer.classList.add('messages-container');
    const messagesDisplay = document.createElement('messages-display');
    messagesContainer.appendChild(messagesDisplay);

    // Canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvas-container';
    canvasContainer.classList.add('canvas-container');
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas1';
    canvas.classList.add('canvas1');
    canvasContainer.appendChild(canvas);

    const flashContainer = document.createElement('div');
    flashContainer.classList.add('flash-container');
    const flashDisplay = document.createElement('flash-display');
    flashContainer.appendChild(flashDisplay);
    canvasContainer.appendChild(flashContainer);

    // Bottom container
    const bottomContainer = document.createElement('div');
    bottomContainer.classList.add('bottom-container');

    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.id = 'image-container';
    imageContainer.classList.add('image-container');

    // Buffs container
    const buffsContainer = document.createElement('div');
    buffsContainer.classList.add('buffs-container');
    const buffsDisplay = document.createElement('buffs-display');
    buffsContainer.appendChild(buffsDisplay);

    // Equipment container
    const equipmentContainer = document.createElement('div');
    equipmentContainer.classList.add('equipment-container');
    const equipmentDisplay = document.createElement('equipment-display');
    equipmentContainer.appendChild(equipmentDisplay);

    // Append all containers
    bottomContainer.appendChild(imageContainer);
    bottomContainer.appendChild(buffsContainer);
    bottomContainer.appendChild(equipmentContainer);
    mainContainer.appendChild(statsContainer);
    mainContainer.appendChild(messagesContainer);
    mainContainer.appendChild(canvasContainer);
    mainContainer.appendChild(bottomContainer);

    // Append the main container to the body
    body.appendChild(mainContainer);
  }
}
