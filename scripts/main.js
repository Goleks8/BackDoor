const defenseBlocks = ["turret"]; // Типы оборонительных сооружений
//TODO//////////////////////////////////////////////////////////////////////////////
const enableInvincibility = Core.settings.getBool("MyMod-enableInvincibility", true);
const invincibilityHealthThreshold = Core.settings.getFloat("MyMod-invincibilityHealthThreshold", 0.5);
print(enableInvincibility);
print(invincibilityHealthThreshold);


function isTeamVulnerable(team) {
    let hasDefense = false;
    Vars.world.tiles.eachTile(tile => {
        if (tile.build != null) {
            if(defenseBlocks.includes(tile.build.block.category.toString()) && tile.build.team === team){
                var str = "name: |" + tile.build.block.name +"| category: |" + tile.build.block.category + "| includes - " + defenseBlocks.includes(tile.build.block.category.toString())
                print(str);
                hasDefense = true;
            }
        }
    });
    showVulnerabilityEffect(team, !hasDefense);
    return !hasDefense
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


Events.on(EventType.BlockDestroyEvent, event => {
    isTeamVulnerable(event.team);
});

Events.on(EventType.BlockBuildEndEvent, event => {
    isTeamVulnerable(event.team);
});

Events.on(EventType.BuildDamageEvent, event => {
    const isVulnerable = isTeamVulnerable(event.build.team);
    if(!isVulnerable){
        event.build.heal(event.source.damage);
        Fx.healBlockFull.at(event.build.x, event.build.y, event.build.block.size, Color.white, event.build.block);
    }
});