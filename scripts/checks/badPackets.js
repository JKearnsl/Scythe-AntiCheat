import config from "../data/config";
import {flag} from "../util";

export function badPackets_2(msg) {
    let player = msg.sender;
    let message = msg.message.toLowerCase().trim();

    if(message.length > config.modules.badpackets2.maxlength || message.length < config.modules.badpackets2.minLength)
        flag(
            player,
            "BadPackets",
            "2",
            "Exploit",
            "messageLength",
            `${message.length}`,
            undefined,
            msg
        );

}