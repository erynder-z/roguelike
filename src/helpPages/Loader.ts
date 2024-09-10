// Import all the individual help page modules
import { CloseButton } from './CloseButton';
import { HelpBuffs } from './HelpBuffs';
import { HelpOther } from './HelpOther';
import { HelpControls } from './HelpControls';
import { HelpEnvironment } from './HelpEnvironment';
import { HelpItems } from './HelpItems';
import { HelpMobs } from './HelpMobs';

// Define and register custom elements for each help page
customElements.define('help-buffs', HelpBuffs);
customElements.define('help-other', HelpOther);
customElements.define('help-controls', HelpControls);
customElements.define('help-environment', HelpEnvironment);
customElements.define('help-items', HelpItems);
customElements.define('help-mobs', HelpMobs);
customElements.define('close-button', CloseButton);
