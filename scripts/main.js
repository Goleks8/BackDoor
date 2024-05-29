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
        }
    });

    showVulnerabilityEffect(team, isVulnerable);
}

function showVulnerabilityEffect(team, isVulnerable) {
    // Изменение цвета мини-карты для обозначения уязвимости базы
    const color = isVulnerable ? Color.red : Color.green;
    const players = Groups.player;

    players.each(player => {
        if (player.team() === team) {
            player.team().color.set(color);
        }
    });
}

Events.on(EventType.BlockBuildEndEvent, event => {
    updateTeamVulnerability(event.team);
});

Events.on(EventType.BlockDestroyEvent, event => {
    updateTeamVulnerability(event.team);
});

// Начальная проверка при загрузке мода для всех команд
Groups.player.each(player => {
    updateTeamVulnerability(player.team());
});
