import {moveTowards, Vector} from "../math/vector";
import {areRectanglesOverlapping, normalizeRectangle, Rectangle, rectangle as createRectangle} from "../math/rectangle";
import {AsshatTicker} from "../asshatTicker";
import {PromiseFn, runInIguaZone} from "../../cutscene/runInIguaZone";
import {DisplayObject, Container, SCALE_MODES, Transform} from "pixi.js-legacy";
import {CancellationToken} from "../pissant/cancellationToken";

declare module "@pixi/display" {
    interface DisplayObject {
        moveUntilCollides(speed: Vector, displayObjects: DisplayObject | DisplayObject[]);

        moveTowards(dest: Vector, speed: number);

        collides(displayObjects: DisplayObject | DisplayObject[], offset?: Vector): boolean;

        useLinearFiltering();

        useNearestFiltering();

        rectangle: Rectangle;

        withStep(step: (self: this) => void): this;

        withAsync(async: PromiseFn): this;

        at(vector: Vector): this;

        at(x: number, y: number): this;

        ticker: AsshatTicker;
    }

    interface Container {
        removeAllChildren();

        withTicker(ticker: AsshatTicker): this;
    }
}

declare module "@pixi/math" {
    interface Transform {
        onPositionChanged(cb: () => void): this;

        onScaleChanged(cb: () => void): this;
    }
}

Object.defineProperty(DisplayObject.prototype, "rectangle", {
    get: function rectangle() {
        if (!this.anchor)
            return normalizeRectangle(createRectangle(this));
        return normalizeRectangle({
            x: this.x - this.width * this.anchor.x,
            y: this.y - this.height * this.anchor.y,
            width: this.width,
            height: this.height
        });
    }
});

Object.defineProperty(DisplayObject.prototype, "destroyed", {
    get: function destroyed() {
        return this._destroyed;
    }
});

type LazyTickerReceiver = (ticker: AsshatTicker) => void;

interface LazyTicker extends AsshatTicker {
    _resolve(ticker: AsshatTicker): void;

    _addReceiver(receiver: LazyTickerReceiver): void;

    _isLazy: true;
}

const isLazyTicker = (ticker: AsshatTicker): ticker is LazyTicker => (ticker as any)._isLazy;

const lazyTickerHandler = {
    get(target, propKey) {
        if (propKey === '_resolve') {
            return function (ticker: AsshatTicker) {
                if (target._resolved) {
                    console.error(`Attempt to resolve already resovled LazyTicker`, target);
                    return;
                }
                target._queuedCalls.forEach(({name, args}) => ticker[name](...args));
                target._receivers.forEach(fn => fn(ticker));
                target._resolved = true;
            }
        }
        if (propKey === '_addReceiver') {
            return function (receiver) {
                if (target._resolved) {
                    console.error(`Attempt to add receiver to already-resovled LazyTicker`, target, receiver);
                    return;
                }
                target._receivers.push(receiver);
            }
        }

        return function (...args) {
            if (target._resolved) {
                console.error(`Attempt to queue call to already-resovled LazyTicker`, target, propKey, args);
                return;
            }
            target._queuedCalls.push({name: propKey, args})
        };
    }
};

function createLazyTicker(): LazyTicker {
    return new Proxy({_resolved: false, _receivers: [], _queuedCalls: []}, lazyTickerHandler);
}

Object.defineProperty(DisplayObject.prototype, "ticker", {
    get: function ticker() {
        if (this._ticker)
            return this._ticker;

        if (this._lazyTicker)
            return this._lazyTicker;

        if (this.parent) {
            const maybeTicker = this.parent.ticker;
            if (!isLazyTicker(maybeTicker))
                return this._ticker = maybeTicker;

            maybeTicker._addReceiver(ticker => {
                this._ticker = ticker;
                delete this._lazyTicker;
            });
            return this._lazyTicker = maybeTicker;
        }

        const lazyTicker = createLazyTicker();
        lazyTicker._addReceiver(ticker => {
            this._ticker = ticker;
            delete this._lazyTicker;
        });
        this.on('added', () => {
            const parentTicker = this.parent.ticker;
            if (isLazyTicker(parentTicker))
                parentTicker._addReceiver(lazyTicker._resolve);
            else
                lazyTicker._resolve(parentTicker);
        });
        return this._lazyTicker = lazyTicker;
    }
});

export function doNowOrOnAdded<T extends DisplayObject>(displayObject: T, onAdded: () => void): T {
    if (displayObject.parent)
        onAdded();
    return displayObject.on("added", onAdded);
}

Container.prototype.withTicker = function (ticker) {
    (this as any)._ticker = ticker;
    (this as any)._lazyTicker?._resolve(ticker);
    return this;
}

DisplayObject.prototype.moveTowards = function (other, speed) {
    moveTowards(this, other, speed);
}

DisplayObject.prototype.withStep = function (step) {
    if (step.length === 1) {
        const self = this;
        const oldStep = step;
        step = () => oldStep(self);
    }
    return doNowOrOnAdded(this, () => this.ticker.add(step))
        .on("removed", () => this.ticker.remove(step));
}

DisplayObject.prototype.withAsync = function (promiseFn) {
    const cancellationToken = new CancellationToken();
    const thisDisplayObject = this;

    return doNowOrOnAdded(this, async () => {
        try {
            // @ts-ignore
            if (thisDisplayObject._lazyTicker) {
                // @ts-ignore
                await new Promise(r => thisDisplayObject._lazyTicker._addReceiver(r));
            }
            await runInIguaZone(`${thisDisplayObject.constructor.name}.withAsync`, promiseFn, {
                ticker: this.ticker,
                cancellationToken
            });
        } catch (e) {
            throw e;
        } finally {
            cancellationToken.cancel();
        }
    })
        .on("removed", () => cancellationToken.cancel());
}

DisplayObject.prototype.at = function (x: Vector | number, y?: number) {
    if (typeof x === "number")
        this.position.set(x, y);
    else
        this.position.set(x.x, x.y);
    return this;
}

Container.prototype.removeAllChildren = function () {
    this.children.forEach(x => {
        if (x instanceof Container)
            x.removeAllChildren();
    });

    this.removeChildren();
}

// Move this Container by the given speed without touching any of the specified container(s). If a collision did not occur, the supplied speed will be modified with the remainder. Otherwise, the speed will have a length of 0.
DisplayObject.prototype.moveUntilCollides = function (speed, otherContainerOrContainers) {
    return moveUntilCollides(this, speed, otherContainerOrContainers);
}

// Test if this container collides with any of the specified containers taking into account the offset, if specified
DisplayObject.prototype.collides = function (otherContainerOrContainers, offset) {
    return collides(this, otherContainerOrContainers, offset);
}

// Use linear filtering for this
DisplayObject.prototype.useLinearFiltering = function () {
    useFiltering(this, SCALE_MODES.LINEAR);
}

// Use nearest filtering for this
DisplayObject.prototype.useNearestFiltering = function () {
    useFiltering(this, SCALE_MODES.NEAREST);
}

// Below are utilities, do not worry about them

function useFiltering(object, scaleModeValue) {
    if (object.scaleMode !== undefined) {
        object.scaleMode = scaleModeValue;
        return;
    }
    if (object.baseTexture)
        return useFiltering(object.baseTexture, scaleModeValue);
    if (object.texture)
        return useFiltering(object.texture, scaleModeValue);
}

function moveUntilCollides(container, speed, otherContainerOrContainers) {
    const signX = Math.sign(speed.x);
    const signY = Math.sign(speed.y);

    while (Math.abs(speed.x) >= 1 || Math.abs(speed.y) >= 1) {
        if (Math.abs(speed.x) >= 1) {
            if (container.collides(otherContainerOrContainers, {x: signX, y: 0})) {
                speed.x = 0;
            } else {
                container.x += signX;
                speed.x -= signX;
            }
        }
        if (Math.abs(speed.y) >= 1) {
            if (container.collides(otherContainerOrContainers, {x: 0, y: signY})) {
                speed.y = 0;
            } else {
                container.y += signY;
                speed.y -= signY;
            }
        }
    }
}

function collides(container, otherContainerOrContainers, offset) {
    if (container.destroyed)
        return false;

    if (Array.isArray(otherContainerOrContainers)) {
        for (let i = 0; i < otherContainerOrContainers.length; i++) {
            if (collides(container, otherContainerOrContainers[i], offset))
                return true;
        }

        return false;
    }

    if (otherContainerOrContainers.destroyed)
        return false;

    const containerBounds = container.getBounds();
    if (offset) {
        containerBounds.x += offset.x;
        containerBounds.y += offset.y;
    }
    const otherContainerBounds = otherContainerOrContainers.getBounds();
    return areRectanglesOverlapping(containerBounds, otherContainerBounds);
}

Transform.prototype.onPositionChanged = function (cb) {
    (this.position as any).cb = () => {
        cb();
        (this as any).onChange();
    };
    return this;
}

Transform.prototype.onScaleChanged = function (cb) {
    (this.scale as any).cb = () => {
        cb();
        (this as any).onChange();
    };
    return this;
}

export default 0;
