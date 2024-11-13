import { _decorator, Component, Pool, Node, Prefab, Enum, instantiate, tween, v3, Vec3, animation, Tween, CCBoolean } from 'cc';
import { gameEventTarget } from './GameEventTarget';
import { GameEvent } from './enums/GameEvent';
import { CollectableItems } from './CollectableItems';
import { InteractiveArea } from './interactiveAreas/InteractiveArea';
import { CollectPoint } from './CollectPoint';
import { ExchangingArea } from './interactiveAreas/ExchangingArea';
const { ccclass, property } = _decorator;


@ccclass('CollectableMap')
class CollectableMap {
	@property({ type: Enum(CollectableItems) })
	itemName: CollectableItems = CollectableItems.NONE

	@property(Prefab)
	prefab: Prefab

	currentCollection: Node[] = [];
}


@ccclass('CharacterCollector')
export class CharacterCollector extends Component {

	@property([CollectableMap])
	collectableMap: CollectableMap[] = []

	@property(CCBoolean)
	isAnimationControlPoint: boolean = false;

	@property({
		visible: function () { return this.isAnimationControlPoint ?? false },
		type: animation.AnimationController
	})
	animationController: animation.AnimationController = null;


	private _resource: CollectableItems = null;
	private _resourcePool: Map<CollectableItems, Pool<Node>> = new Map();
	private _activeInteractionNode: Node = null;
	private _collectPoint: CollectPoint = null;


	onEnable() {
		this._subscribeEvents(true);
		this._collectPoint = this.node.getComponent(CollectPoint);
	}

	onDisable() {
		this._subscribeEvents(false);
	}


	private _subscribeEvents(isOn: boolean) {
		const func = isOn ? 'on' : 'off';

		gameEventTarget[func](GameEvent.INTERACTION_START, this.onInteractionStart, this);
		gameEventTarget[func](GameEvent.INTERACTION_END, this.onInteractionEnd, this);
	}


	onInteractionStart(item: CollectableItems, isExchanger: boolean, count: number, interactiveNode: Node) {
		this._resource = item;
		this._activeInteractionNode = interactiveNode;

		if (isExchanger) {
			this.resourceExchanging(count, interactiveNode);
		} else {
			this.resourceCollecting(count, interactiveNode);
		}
	}

	onInteractionEnd(item: CollectableItems, node: Node) {
		this._resource = null;
		if (this._activeInteractionNode === node) {
			this._activeInteractionNode = null;
		}
	}

	resourceExchanging(count: number, interactiveNode: Node) {
		if (count === 0) return;
		const source = this.collectableMap.find(i => i.itemName === this._resource);
		if (!source) return;
		if (!this.node.children.length) return;

		const pool = this._resourcePool.get(this._resource);
		const lastResource = this.node.children[this.node.children.length - 1];

		const prevPos = lastResource.worldPosition.clone();
		const nextPos = this._activeInteractionNode.getComponentInChildren(CollectPoint);;

		nextPos.node.addChild(lastResource);
		nextPos.setTempResource(lastResource, pool);
		lastResource.worldPosition = prevPos;
		const { x, y, z } = nextPos.getNextPosition();

		tween(lastResource.position)
			.to(0.3, { x, z }, {
				onUpdate: (target, ratio) => {
					const yOffset = Math.sin(ratio * Math.PI) * 1;
					// Обновляем позицию Y, добавляя смещение только вверх
					lastResource.position = v3(target.x, prevPos.y + yOffset + (y - prevPos.y) * ratio, target.z);
				},
				onStart: () => {
					// pool.free(lastResource);
					this.scheduleOnce(() => {
						if (this._activeInteractionNode) {
							const exchangingArea = this._activeInteractionNode.getComponent(ExchangingArea)
							exchangingArea.receive(1);
						}
						if (this._resource === CollectableItems.MONEY) {
							gameEventTarget.emit(GameEvent.MONEY_SPEND)
						}
						if (this.isAnimationControlPoint && this.node.children.length === 0) {
							this.animationController.setValue('IsKeeping', false);
						}
						this.resourceExchanging(count - 1, interactiveNode);
					}, 0.1)

				}
			})
			.start();
	}

	resourceCollecting(count: number, interactiveNode: Node, stopRecursive: boolean = false, delay: number = 0) {
		if (!this._resource || count <= 0) return;
		const source = this.collectableMap.find(i => i.itemName === this._resource);
		if (!source) return;
		const { prefab, itemName } = source;

		// if (interactiveNode !== this._activeInteractionNode && itemName !== CollectableItems.MONEY) return;
		//если собираем деньги, то разово при заходе в зону и все доступные
		if (this._resource === CollectableItems.MONEY && !stopRecursive) {
			for (let i = 0; i < count; i++) {
				this.scheduleOnce(() => {
					this.resourceCollecting(1, interactiveNode, true, i * 0.05);
				})
			}
			return;
		}

		//если пул для текущего ресурса еще не создан в мапе
		if (!this._resourcePool.has(this._resource)) {
			this._resourcePool.set(this._resource, new Pool<Node>(() => {
				return instantiate(prefab);
			}, 5))
		}

		const pool = this._resourcePool.get(this._resource);
		const newResource = pool.alloc();

		this.node.addChild(newResource);
		const prevCollectPoint = this._activeInteractionNode.getComponentInChildren(CollectPoint);
		const nextPos = this._collectPoint.getNextPosition();

		if (prevCollectPoint) {
			newResource.worldPosition = prevCollectPoint.node.worldPosition;
		} else {
			newResource.position = nextPos;
		}

		tween(newResource)
			.delay(delay)
			.to(0.2, { scale: v3(2, 2, 2), position: nextPos }, {
				onComplete: () => {
					// Tween.stopAllByTarget(newResource);
					if (this.isAnimationControlPoint) {
						this.animationController.setValue('IsKeeping', true)
					}
					if (itemName === CollectableItems.MONEY) {
						gameEventTarget.emit(GameEvent.MONEY_RECEIVE)
					}
					this.resourceCollecting(count - 1, interactiveNode);
				}
			})
			.to(0.1, { scale: v3(1, 1, 1) })
			.start();
	}

}

