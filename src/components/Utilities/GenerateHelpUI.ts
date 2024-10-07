export class GenerateHelpUI {
  public static async generate() {
    const body = document.getElementById('body-help');

    if (!body) {
      console.error('Body element not found');
      return;
    }

    // Main help container
    const helpContainer = document.createElement('div');
    helpContainer.classList.add('help-container');

    // Tab container
    const tabContainer = document.createElement('div');
    tabContainer.classList.add('tab-container');

    // Tabs (controls, buffs, environment, items, mobs, concepts)
    const tabs = [
      { target: 'controls', text: 'C', underline: 'o', label: 'ntrols' },
      { target: 'buffs', text: 'B', underline: '', label: 'uffs' },
      { target: 'environment', text: 'E', underline: '', label: 'nvironment' },
      { target: 'items', text: 'I', underline: '', label: 'tems' },
      { target: 'mobs', text: 'M', underline: '', label: 'obs' },
      { target: 'concepts', text: 'O', underline: 't', label: 'her' },
    ];

    // Generate tabs dynamically
    for (let i = 0; i < tabs.length; i++) {
      const tab = document.createElement('div');
      tab.classList.add('tab');
      if (i === 0) tab.classList.add('active'); // Make the first tab active
      tab.dataset.target = tabs[i].target;

      // Underlined text handling
      const span = document.createElement('span');
      span.classList.add('underline');
      span.innerText = tabs[i].underline || tabs[i].text;

      // Append the tab contents
      tab.innerHTML = `${tabs[i].text}`;
      if (tabs[i].underline) tab.appendChild(span);
      tab.innerHTML += tabs[i].label;

      tabContainer.appendChild(tab);
    }

    // Append tab container to the main help container
    helpContainer.appendChild(tabContainer);

    // Tab contents (controls, buffs, environment, items, mobs, concepts)
    const contents = [
      { id: 'controls', component: 'help-controls', active: true },
      { id: 'buffs', component: 'help-buffs', active: false },
      { id: 'environment', component: 'help-environment', active: false },
      { id: 'items', component: 'help-items', active: false },
      { id: 'mobs', component: 'help-mobs', active: false },
      { id: 'concepts', component: 'help-other', active: false },
    ];

    // Generate content dynamically
    contents.forEach(content => {
      const contentDiv = document.createElement('div');
      contentDiv.id = content.id;
      contentDiv.classList.add('tab-content');
      if (content.active) contentDiv.classList.add('active');

      const component = document.createElement(content.component);
      contentDiv.appendChild(component);

      helpContainer.appendChild(contentDiv);
    });

    // Close button
    const closeButton = document.createElement('close-button');
    helpContainer.appendChild(closeButton);

    // Append the main help container to the body
    body.appendChild(helpContainer);

    this.initializeTabs();
  }

  private static initializeTabs() {
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
        case 'E':
          handleTabClick(
            document.querySelector(
              '[data-target="environment"]',
            ) as HTMLElement,
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
  }
}
