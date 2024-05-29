const defenseBlocks = ["turret", "wall", "mendProjector"]; // Типы оборонительных сооружений

function isTeamVulnerable(team) {
    let hasDefense = false;

    Vars.world.tiles.eachTile(tile => {
        if (tile.build != null && tile.build.team === team && defenseBlocks.includes(tile.build.block.name)) {
            hasDefense = true;
        }
    });

    return !hasDefense;
}

function updateTeamVulnerability(team) {
    const isVulnerable = isTeamVulnerable(team);

    Vars.world.tiles.eachTile(tile => {
        if (tile.build != null && tile.build.team === team && !defenseBlocks.includes(tile.build.block.name)) {
            tile.build.health = isVulnerable ? tile.build.maxHealth : Number.MAX_SAFE_INTEGER;
            tile.build.updateColor();
        }
    });

    showVulnerabilityEffect(team, isVulnerable);
}

function showVulnerabilityEffect(team, isVulnerable) {
    // Изменение цвета центрального ядра для обозначения уязвимости базы
    const core = team.core();
    if (core != null) {
        core.tint.set(isVulnerable ? Color.red : Color.green);
    }
}

Events.on(BlockBuildEndEvent, event => {
    print('BlockBuildEndEvent=============================================')
    updateTeamVulnerability(event.team);
});

Events.on(BlockDestroyEvent, event => {
    print('BlockDestroyEvent=============================================')
    updateTeamVulnerability(event.team);
});

// Начальная проверка при загрузке мода для всех команд
Groups.player.each(player => {
    print('LOAD MODE=============================================')
    updateTeamVulnerability(player.team());
});