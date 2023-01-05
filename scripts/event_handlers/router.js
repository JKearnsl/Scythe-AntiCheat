//
// The EventRouter handles the game events described in "Minecraft.world.events".
//
// This router can dynamically register several custom handlers for one handler from "Minecraft.world.events",
// unsubscribe from "Minecraft.world.events" if there are no registered custom handlers,
// and vice versa subscribe if there are any.
//
// This class solves such tasks as: freeing the main.js file,
// distributing the task into subtasks, the ability to dynamically enable and disable handlers
//

import {world} from "@minecraft/server";

class TemplateEvent {
    _is_active = false;

    constructor(signature, is_debug = false) {
        this._signature = signature;
        this._is_debug = is_debug;
        this._dynamic_handlers = new Set();
        this._final_handlers = new Set();
    }
    subscribe(handler, is_final = false, filter = []) {
        if (is_final) {
            this._final_handlers.add({handler: handler, filter: filter});
        } else {
            this._dynamic_handlers.add({handler: handler, filter: filter});
        }
        if (!this._is_active){
            this._is_active = true;
            world.events[this._signature].subscribe(this.execute);
        }
    }
    unsubscribe(handler) {
        let is_found = false

        if (!is_found) {
            for (let obj of this._dynamic_handlers) {
                if (obj.handler === handler){
                    this._dynamic_handlers.delete(obj);
                    is_found = true;
                    break;
                }
            }
        }
        if (!is_found) {
            for (let obj of this._final_handlers) {
                if (obj.handler === handler){
                    this._final_handlers.delete(obj);
                    is_found = true;
                    break
                }
            }
        }
        if (!is_found)
            throw new Error(`Handler ${handler} not found in ${this._signature}`);

        if (this._dynamic_handlers.size + this._final_handlers.size === 0) {
            this._is_active = false;
            world.events[this._signature].unsubscribe(this.execute);
        }
    }

    execute(event_obj) {
        for (let obj of this._dynamic_handlers) {
            // todo: filter
            if (obj.handler(event_obj, this._is_debug)) return false;
        }
        for (let obj of this._final_handlers) {
            obj.handler(event_obj, this._is_debug);
        }
    }

    clear() {
        this._dynamic_handlers.clear();
        this._final_handlers.clear();
        if (this._is_active) {
            this._is_active = false;
            world.events[this._signature].unsubscribe(this.execute);
        }
    }

    get isActive() {
        return this._is_active;
    }

    get signature() {
        return this._signature;
    }
}

export default class EventRouter
{
    constructor(is_debug = false) {
        this._is_debug = is_debug;
        this._events = new Set();
    }

    registerHandler(event_signature, handler, is_final = false, filter = []) {
        //
        // If the handler is final, then its priority position is the last one.
        // Note that it is possible to overlay multiple final handlers, then :
        //
        // >>> let router = new EventRouter();
        //
        // >>> router.registerHandler("...", handler0);
        // >>> router.registerHandler("...", handler1, true); - will be executed before the last
        // >>> router.registerHandler("...", handler2, true); - will execute last
        //
        // Moreover, subsequent registered handlers with the flag is_final = false
        // will be executed before the final handlers:
        //
        // >>> router.registerHandler("...", handler0);
        // >>> router.registerHandler("...", handler1, true);
        // >>> router.registerHandler("...", handler2, true);
        //
        // Priority now: handler0 -> handler1 -> handler2
        //
        // >>> router.registerHandler("...", handler3);
        //
        // Priority now: handler0 -> handler3 -> handler1 -> handler2
        //
        let event = this._getEvent(event_signature);
        if (event === null) {
            event = new TemplateEvent(event_signature, this._is_debug);
            this._events.add(event);
        }
        event.subscribe(handler, is_final, filter);
    }

    unregisterHandler(event_signature, handler) {
        let event = this._getEvent(event_signature);
        if (event) event.unsubscribe(handler);
    }

    _getEvent(event_signature) {
        for (let event of this._events) {
            if (event.signature === event_signature) return event;
        }
        return null;
    }
}
