import { CanSee } from '../Utilities/CanSee';
import { Cost } from '../Commands/Types/Cost';
import { CommandBase } from '../Commands/CommandBase';
import { GameState } from '../Builder/Types/GameState';
import { GameMap } from '../MapModel/GameMap';
import { Mob } from './Mob';
import { MobAI } from './Types/MobAI';
import { MobAI2_Cat } from './MobAI2_Cat';
import { MobAI3_Ant } from './MobAI3_Ant';
import { Mood } from './MoodEnum';
import { NPCSpellFinder } from '../Spells/NPCSpellFinder';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { ScreenMaker } from '../Screens/Types/ScreenMaker';
import { SimpleSleepAI } from './SimpleSleepAI';
import { Spell } from '../Spells/Spell';
import { Stack } from '../Terminal/Types/Stack';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * An AI implementation for Mobs that shoot spells. Spells are being shot in diagonal or orthogonal lines.
 *
 */
export class ShootAI implements MobAI {
  constructor(
    public speed: number,
    public spellRate: number,
  ) {}

  private aiDir: MobAI = new MobAI2_Cat();
  private aiRnd: MobAI = new MobAI3_Ant();

  /**
   * Takes a turn for the Mob in a shootAI state.
   *
   * @param {Mob} me - The Mob making the turn.
   * @param {Mob} enemy - The enemy Mob.
   * @param {GameState} game - The game instance.
   * @param {Stack} stack - The screen stack.
   * @param {ScreenMaker} make - The screen maker.
   * @return {boolean} Always `true`.
   */
  public turn(
    me: Mob,
    enemy: Mob,
    game: GameState,
    stack: Stack,
    make: ScreenMaker,
  ): boolean {
    const { rand } = game;
    const far = !SimpleSleepAI.isNear(me, enemy);

    if (far) {
      me.mood = rand.isOneIn(3) ? Mood.Asleep : Mood.Awake;
      if (me.mood == Mood.Asleep) return true;
    }

    if (this.didShoot(me, rand, game, enemy, stack, make)) return true;

    if (this.maybeCastSpell(me, enemy, game, stack, make)) return true;

    for (let i = 0; i < this.speed; ++i) {
      const ai = rand.isOneIn(2) ? this.aiDir : this.aiRnd;
      ai.turn(me, enemy, game, stack, make);
    }

    return true;
  }

  /**
   * Tries to cast a spell between two mobs in the game.
   *
   * @param {Mob} me - the casting mob
   * @param {Mob} enemy - the target mob
   * @param {GameState} game - the game instance
   * @param {Stack} stack - the game stack
   * @param {ScreenMaker} make - the screen maker
   * @return {boolean} true if the spell was cast, false otherwise
   */
  private maybeCastSpell(
    me: Mob,
    enemy: Mob,
    game: GameState,
    stack: Stack,
    make: ScreenMaker,
  ): boolean {
    const map = <GameMap>game.currentMap();

    if (!CanSee.checkMobLOS_Bresenham(me, enemy, map, true)) return false;

    const { rand } = game;

    if (!rand.isOneIn(this.spellRate)) return false;

    const spell = this.pickSpell(me, rand);

    return this.castSpell(spell, me, enemy, game, stack, make);
  }

  /**
   * Picks a spell based on the mob's level.
   *
   * @param {Mob} me - The mob.
   * @param {RandomGenerator} rand - The random generator.
   * @return {Spell} The picked spell.
   */
  private pickSpell(me: Mob, rand: RandomGenerator): Spell {
    const range: number = Spell.None + 1;
    const spellIndex: number = me.level % range;
    const spell: Spell = <Spell>spellIndex;

    console.log(`${me.name}: spell ${Spell[spell]}`);
    return spell;
  }

  /**
   * Casts a spell using the NPCSpellFinder and executes the command if it is an instance of CommandBase.
   *
   * @param {Spell} spell - The spell to be cast.
   * @param {Mob} me - The mob casting the spell.
   * @param {Mob} enemy - The mob being targeted by the spell.
   * @param {GameState} game - The game object.
   * @param {Stack} stack - The game stack.
   * @param {ScreenMaker} make - The screen maker.
   * @return {boolean} Returns true if the spell was successfully cast and executed, otherwise false.
   */
  private castSpell(
    spell: Spell,
    me: Mob,
    enemy: Mob,
    game: GameState,
    stack: Stack,
    make: ScreenMaker,
  ): boolean {
    const finder = new NPCSpellFinder(game, stack, make);
    const noCost: Cost | undefined = undefined;
    const commandOrSpell = finder.find(me, spell, noCost);

    if (commandOrSpell instanceof CommandBase) return commandOrSpell.npcTurn();

    return true;
  }

  /**
   * Checks if the mob can shoot at another mob, picks a spell, checks if the spell is a bullet spell,
   * checks if the spell rate is met, checks if the mob is in line of sight of the target, and shoots.
   *
   * @param {Mob} me - The mob that is shooting.
   * @param {RandomGenerator} rand - The random generator used for picking a spell.
   * @param {GameState} game - The game object used for getting the current map and checking line of sight.
   * @param {Mob} him - The mob that is being shot at.
   * @param {Stack} stack - The game stack used for shooting.
   * @param {ScreenMaker} make - The screen maker used for shooting.
   * @return {boolean} Returns true if the mob successfully shoots, false otherwise.
   */
  private didShoot(
    me: Mob,
    rand: RandomGenerator,
    game: GameState,
    him: Mob,
    stack: Stack,
    make: ScreenMaker,
  ): boolean {
    if (!this.aim(me.pos, him.pos)) return false;

    const spell = this.pickSpell(me, rand);
    if (!this.isBulletSpell(spell)) return false;
    if (!rand.isOneIn(this.spellRate)) return false;

    const map = <GameMap>game.currentMap();
    if (!CanSee.checkMobLOS_Bresenham(me, him, map, true)) return false;

    return this.shoot(spell, me, him, game, stack, make);
  }

  /**
   * Checks if the given direction is a diagonal line between two points.
   *
   * @param {WorldPoint} from - The starting point.
   * @param {WorldPoint} to - The ending point.
   * @return {boolean} Returns true if the direction is diagonal, false otherwise.
   */
  private aim(from: WorldPoint, to: WorldPoint): boolean {
    const delta = from.minus(to);
    if (delta.x == 0 || delta.y == 0) return true;

    const xAxis = Math.abs(delta.x);
    const yAxis = Math.abs(delta.y);

    return xAxis == yAxis;
  }

  /**
   * Checks if the given spell is a bullet spell.
   *
   * @param {Spell} spell - The spell to check.
   * @return {boolean} True if the spell is a bullet spell, false otherwise.
   */
  private isBulletSpell(spell: Spell): boolean {
    return spell == Spell.Bullet;
  }

  /**
   * Shoots a spell from the given mob to another mob.
   *
   * @param {Spell} spell - The spell to be shot.
   * @param {Mob} me - The mob shooting the spell.
   * @param {Mob} him - The mob being shot.
   * @param {GameState} game - The game object.
   * @param {Stack} stack - The game stack.
   * @param {ScreenMaker} make - The screen maker.
   * @return {boolean} Returns true if the spell was successfully shot.
   */
  private shoot(
    spell: Spell,
    me: Mob,
    him: Mob,
    game: GameState,
    stack: Stack,
    make: ScreenMaker,
  ): boolean {
    this.castSpell(spell, me, him, game, stack, make);
    return true;
  }
}
