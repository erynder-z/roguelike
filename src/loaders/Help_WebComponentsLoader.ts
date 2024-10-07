// Import all the individual help page modules
import { CloseButton } from '../helpPages/CloseButton';
import { HelpBuffs } from '../helpPages/HelpBuffs';
import { HelpOther } from '../helpPages/HelpOther';
import { HelpControls } from '../helpPages/HelpControls';
import { HelpEnvironment } from '../helpPages/HelpEnvironment';
import { HelpItems } from '../helpPages/HelpItems';
import { HelpMobs } from '../helpPages/HelpMobs';

// Define and register custom elements for each help page
customElements.define('help-buffs', HelpBuffs);
customElements.define('help-other', HelpOther);
customElements.define('help-controls', HelpControls);
customElements.define('help-environment', HelpEnvironment);
customElements.define('help-items', HelpItems);
customElements.define('help-mobs', HelpMobs);
customElements.define('close-button', CloseButton);
