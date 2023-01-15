import config from "../data/config";
import data from "../data/data";

export function player_init(playerJoin, debug) {
    const player = playerJoin.player;

    // declare all needed variables in player
    if(config.modules.badpackets5.enabled) player.badpackets5Ticks = 0;
    if(config.modules.nukerA.enabled) player.blocksBroken = 0;
    if(config.modules.autoclickerA.enabled) player.firstAttack = Date.now();
    if(config.modules.fastuseA.enabled) player.lastThrow = Date.now();
    if(config.modules.autoclickerA.enabled) player.cps = 0;
    if(config.customcommands.report.enabled) player.reports = [];
    if(config.modules.killauraC.enabled) player.entitiesHit = [];

    // fix a disabler method
    player.nameTag = player.nameTag.replace(/[^A-Za-z0-9_\-() ]/gm, "").trim();

    if(data.loaded === false) {
        player.runCommandAsync("scoreboard players set scythe:config gametestapi 1");
        data.loaded = true;
    }

    // remove tags
    player.removeTag("attack");
    player.removeTag("hasGUIopen");
    player.removeTag("right");
    player.removeTag("left");
    player.removeTag("ground");
    player.removeTag("gliding");
    player.removeTag("sprinting");
    player.removeTag("moving");
    player.removeTag("sleeping");

}
