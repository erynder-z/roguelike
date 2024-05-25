import { GameIF } from '../Builder/Interfaces/GameIF';
import { ScreenMaker } from './Interfaces/ScreenMaker';
import { Stack } from '../Terminal/Interfaces/Stack';
import { BaseScreen } from './BaseScreen';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { WorldPoint } from '../MapModel/WorldPoint';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { DrawMap } from '../MapModel/DrawMap';
import { Glyph } from '../Glyphs/Glyph';
import { Buff } from '../Buffs/BuffEnum';
import { CanSee } from '../Utilities/CanSee';
import { MapIF } from '../MapModel/Interfaces/MapIF';

export class LookScreen extends BaseScreen {
  name = 'look-screen';

  private readonly neutralPos = new WorldPoint(32, 16);
  private readonly playerPos = new WorldPoint(
    this.game.player.pos.x,
    this.game.player.pos.y,
  );
  private cursorPos: WorldPoint;
  private lookPos: WorldPoint;

  constructor(game: GameIF, make: ScreenMaker) {
    super(game, make);
    this.cursorPos = this.neutralPos;
    this.lookPos = this.playerPos;
  }

  drawScreen(term: DrawableTerminal): void {
    super.drawScreen(term);
    term.drawAt(
      this.cursorPos.x,
      this.cursorPos.y,
      '●',
      'fuchsia',
      '#00000000',
    );
    const s = this.getCellInfo(this.lookPos.x, this.lookPos.y);
    if (s) this.displayInfo(s, term);
  }

  checkVisibility(
    pos: WorldPoint,
    map: MapIF,
    playerPos: WorldPoint,
    g: GameIF,
  ): boolean {
    const buffs = g.player.buffs;
    const blind = buffs && buffs.is(Buff.Blind);
    const farDist = this.game.stats.visRange;
    const distance: number = pos.squaredDistanceTo(playerPos);
    const far: boolean = distance > farDist && !blind;

    const isEntityVisible: boolean =
      !far && !blind && CanSee.checkPointLOS(pos, playerPos, map, true);

    return isEntityVisible;
  }

  getCellInfo(x: number, y: number): string | null {
    const pos = new WorldPoint(x, y);
    const map = this.game.currentMap();

    const isVisible = this.checkVisibility(
      pos,
      map!,
      this.game.player.pos,
      this.game,
    );

    if (isVisible) {
      const cell = this.game?.currentMap()?.cell(new WorldPoint(x, y));
      const mobInfo = (): string | null =>
        cell?.mob ? `A lvl ${cell.mob?.level} ${cell.mob?.name}.` : null;

      const itemInfo = (): string | null =>
        cell?.hasObject() ? `A ${cell.obj?.description()}.` : null;

      const envInfo = (): string => {
        const env = cell?.env ? Glyph[cell.env] : '';
        return `${env}.`;
      };

      return cell?.mob ? mobInfo() : cell?.obj ? itemInfo() : envInfo();
    } else {
      return 'Not visible!';
    }
  }

  displayInfo(s: string, term: DrawableTerminal): void {
    this.game.log.clearQueue();
    const msg = new LogMessage(s, EventCategory.look);
    this.game.flash(msg);

    DrawMap.renderFlash(term, this.game);
  }

  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    const moveCursor = (dx: number, dy: number) => {
      this.cursorPos.x += dx;
      this.cursorPos.y += dy;
      this.lookPos.x += dx;
      this.lookPos.y += dy;
    };
    switch (event.code) {
      case 'ArrowLeft':
      case 'Numpad4':
        moveCursor(-1, 0);
        break;
      case 'ArrowRight':
      case 'Numpad6':
        moveCursor(1, 0);
        break;
      case 'ArrowUp':
      case 'Numpad8':
        moveCursor(0, -1);
        break;
      case 'ArrowDown':
      case 'Numpad2':
        moveCursor(0, 1);
        break;
      case 'Numpad7':
        moveCursor(-1, -1);
        break;
      case 'Numpad9':
        moveCursor(1, -1);
        break;
      case 'Numpad1':
        moveCursor(-1, 1);
        break;
      case 'Numpad3':
        moveCursor(1, 1);
        break;
      case 'KeyL':
        stack.pop();
        break;
    }
  }
}
