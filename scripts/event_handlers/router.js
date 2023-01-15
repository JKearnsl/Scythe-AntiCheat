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
    _exec_link = null;

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
            console.warn(`[EventRouter] Subscribed to '${this.signature}'`);
            console.warn(`[EventRouter] ${typeof world.events[this.signature]} -> ${typeof TemplateEvent.execute}`);
            this._exec_link = (
                event_obj,
                data,
                options = {
                    signature: this.signature,
                    dynamic_handlers: this._dynamic_handlers,
                    final_handlers: this._final_handlers,
                    is_debug: this._is_debug
                }
            ) => TemplateEvent.execute(event_obj, options);
            world.events[this.signature].subscribe(this._exec_link);
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
            world.events[this._signature].unsubscribe(this._exec_link);
        }
    }

    static execute(event_obj, options) {
        try {
            for (let obj of options.dynamic_handlers) {
                // todo: filter
                try {
                    if (obj.handler(event_obj, options.is_debug)) return false;
                } catch (some_error) {
                    console.error(
                        `[EventRouter] Error in handler '${obj.handler.name}' of '${options.signature}': ${some_error}`
                    );
                }
            }
            for (let obj of options.final_handlers) {
                try {
                    obj.handler(event_obj, options.is_debug);
                } catch (some_error) {
                    console.error(
                        `[EventRouter] Error in handler '${obj.handler.name}' of '${options.signature}': ${some_error}`
                    );
                }
            }
        } catch (some_error) {
            console.error(`[EventRouter] '${options.signature}' executed with error: ${some_error}`);
        }
    }

    clear() {
        if (this._is_active) {
            this._is_active = false;
            world.events[this._signature].unsubscribe(this._exec_link);
        }
        this._dynamic_handlers.clear();
        this._final_handlers.clear();
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
