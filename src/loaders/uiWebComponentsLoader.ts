import { BuffsDisplay } from '../ui/buffs/buffsDisplay';
import { EquipmentDisplay } from '../ui/equipment/equipmentDisplay';
import { FlashDisplay } from '../ui/flashDisplay/flashDisplay';
import { MessagesDisplay } from '../ui/messages/messagesDisplay';
import { IngameMenu } from '../ui/menu/ingameMenu';
import { LogScreenDisplay } from '../ui/logScreenDisplay/logScreenDisplay';
import { OptionsMenu } from '../ui/menu/optionsMenu';
import { PlayerSetup } from '../ui/menu/playerSetup';
import { StatsDisplay } from '../ui/stats/statsDisplay';
import { TitleMenu } from '../ui/menu/titleMenu';
import { TitleScreen } from '../ui/menu/titleScreen';

// Define and register custom elements for each UI element
customElements.define('title-screen', TitleScreen);
customElements.define('title-menu', TitleMenu);
customElements.define('player-setup', PlayerSetup);
customElements.define('stats-display', StatsDisplay);
customElements.define('messages-display', MessagesDisplay);
customElements.define('buffs-display', BuffsDisplay);
customElements.define('equipment-display', EquipmentDisplay);
customElements.define('flash-display', FlashDisplay);
customElements.define('ingame-menu', IngameMenu);
customElements.define('options-menu', OptionsMenu);
customElements.define('log-screen-display', LogScreenDisplay);
