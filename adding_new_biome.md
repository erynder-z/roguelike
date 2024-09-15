## HowTo add a new biome

A new biome can be added by modifying the code as follows:

### Add environment data

```typescript
"./src/components/Environment/EnvironmentData/environment.json"

{
  "environment": [
    ...
    {
      "char": "⋒",
      "bgCol": "#4B5A52",
      "fgCol": "#5affd7",
      "hasSolidBg": false,
      "name": "Glowing_Mushroom",
      "description": "A mushroom that is emitting a glowing light.",
      "isOpaque": false,
      "isBlockingMovement": false,
      "isBlockingProjectiles": false,
      "isDiggable": true,
      "isCausingSlow": false,
      "isCausingBurn": false,
      "isMagnetic": false,
      "isCausingBleed": false,
      "isGlowing": true
    }
  ]
}
```

### Add glyph

```typescript
"./src/components/Glyphs/GlyphMap.ts"

export enum Glyph {
  ...
  Glowing_Mushroom,
}

```

### Add glyph to the list of map generation tiles for the desired level type

The glyph can be generated as a floor-tile, as a wall-tile or as both. The occurrencePercentage is the percentile chance that a generated rock will be of this type.

```typescript
'./src/components/MapGenerator/GenerationData/CaveLevelTiles.ts';

export const CAVE_LEVEL_TILES: Tile = {
  floor: [...{ glyph: Glyph.Glowing_Mushroom, occurrencePercentage: 1 }],

  wall: [...{ glyph: Glyph.Glowing_Mushroom, occurrencePercentage: 1 }],
};
```

### Optional: Add and implement new properties if needed

#### Update glyph-info class

```typescript
"./src/components/Glyphs/GlyphInfo.ts"

export class GlyphInfo {
  constructor(
    ...

    public someParameter: boolean = false

  ) {}
}
```

#### Add new parameter to glyph-map

```typescript
"./src/components/Glyphs/GlyphMap.ts"

export class GlyphMap {

...

  private static initializeGlyphs(): number {

    ...

      const glyphInfo = new GlyphInfo(
        ...
        info.someParameter

      );

      GlyphMap.glyphsRegistry[glyph] = glyphInfo;

    ...

    environmentData['environment'].forEach(env => addGlyph(<GlyphInfo>env));

    ...

    return GlyphMap.glyphsRegistry.length;
  }

  static addGlyph(
    ...
    someParameter: boolean;
  ) {
    const info: GlyphInfo = new GlyphInfo(
     ...
     someParameter
    );
    ...
    GlyphMap.glyphsRegistry[glyph] = info;
  }
    ...
}
```
