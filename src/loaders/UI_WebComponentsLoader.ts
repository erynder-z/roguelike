import { BuffsDisplay } from '../components/UI/BuffsDisplay';
import { EquipmentDisplay } from '../components/UI/EquipmentDisplay';
import { FlashDisplay } from '../components/UI/FlashDisplay';
import { MessagesDisplay } from '../components/UI/MessagesDisplay';
import { OptionsMenu } from '../components/UI/OptionsMenu';
import { PlayerSetup } from '../components/UI/PlayerSetup';
import { StatsDisplay } from '../components/UI/StatsDisplay';
import { TitleMenu } from '../components/UI/TitleMenu';
import { TitleScreen } from '../components/UI/TitleScreen';

// Define and register custom elements for each UI element
customElements.define('title-screen', TitleScreen);
customElements.define('title-menu', TitleMenu);
customElements.define('player-setup', PlayerSetup);
customElements.define('stats-display', StatsDisplay);
customElements.define('messages-display', MessagesDisplay);
customElements.define('buffs-display', BuffsDisplay);
customElements.define('equipment-display', EquipmentDisplay);
customElements.define('flash-display', FlashDisplay);
customElements.define('options-menu', OptionsMenu);
