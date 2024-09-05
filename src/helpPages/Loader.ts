// Import all the individual help page modules
import { HelpBuffs } from './HelpBuffs';
import { HelpConcepts } from './HelpConcepts';
import { HelpControls } from './HelpControls';
import { HelpEnvironment } from './HelpEnvironment';
import { HelpItems } from './HelpItems';
import { HelpMobs } from './HelpMobs';

// Define and register custom elements for each help page
customElements.define('help-buffs', HelpBuffs);
customElements.define('help-concepts', HelpConcepts);
customElements.define('help-controls', HelpControls);
customElements.define('help-environment', HelpEnvironment);
customElements.define('help-items', HelpItems);
customElements.define('help-mobs', HelpMobs);
