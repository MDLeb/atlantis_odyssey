import { _decorator, Component, Pool, Node, Prefab, Enum, instantiate, tween, v3, Vec3, animation, Tween, CCBoolean } from 'cc';
import { gameEventTarget } from './GameEventTarget';
import { GameEvent } from './enums/GameEvent';
import { CollectableItems } from './CollectableItems';
import { InteractiveArea } from './interactiveAreas/InteractiveArea';
import { CollectPoint } from './CollectPoint';
const { ccclass, property } = _decorator;


@ccclass('CollectableMap')
class CollectableMap {
	@property({ type: Enum(CollectableItems) })
	itemName: CollectableItems = CollectableItems.NONE

	@property(Prefab)
	prefab: Prefab

	@property(Node)
	collectPoint: Node

	currentCollection: Node[] = [];
}


@ccclass('CharacterCollector')
export class CharacterCollector extends Component {

	@property([CollectableMap])
	collectableMap: CollectableMap[] = []

	@property(Node)
	isAnimationControlPoint: Node = null;


	private _resource: CollectableItems = null;
	private _resourcePool: Map<CollectableItems, Pool<Node>> = new Map();
	private _animationController: animation.AnimationController = null;
	private _activeInteractionNode: Node = null;


	onEnable() {
		this._subscribeEvents(true);
		this._animationController = this.node.getComponentInChildren(animation.AnimationController);
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
			this.resourceCollecting(count);
		}
	}

	onInteractionEnd(item: CollectableItems) {
		this._resource = null;
		this._activeInteractionNode = null;
	}

	resourceExchanging(count: number, interactiveNode: Node) {
		if (count === 0) return;
		const source = this.collectableMap.find(i => i.itemName === this._resource);
		if (!source) return;
		const { collectPoint } = source;
		if (!collectPoint.children.length) return;

		const pool = this._resourcePool.get(this._resource);
		const lastFruit = collectPoint.children[collectPoint.children.length - 1];

		tween(lastFruit)
			.tag(2)
			.to(0.2, { scale: v3(1, 1, 1) }, {
				onComplete: () => {
					pool.free(lastFruit);
					Tween.stopAllByTarget(lastFruit);
					if (this._activeInteractionNode) {
						this._activeInteractionNode.getComponent(InteractiveArea).receive(1);
					}
					collectPoint.removeChild(lastFruit);
					if (this.isAnimationControlPoint === collectPoint && collectPoint.children.length === 0) {
						this._animationController.setValue('IsKeeping', false);
					}
					this.resourceExchanging(count - 1, interactiveNode);
				}
			})
			.to(0.1, { scale: v3(1, 1, 1) })
			.start();

	}

	resourceCollecting(count: number) {
		if (!this._resource || count <= 0) return;
		console.log(this._resource);


		const source = this.collectableMap.find(i => i.itemName === this._resource);
		const { collectPoint, prefab, itemName } = source;

		//если пул для текущего ресурса еще не создан в мапе
		if (!this._resourcePool.has(this._resource)) {
			this._resourcePool.set(this._resource, new Pool<Node>(() => {
				return instantiate(prefab);
			}, 5))
		}

		const pool = this._resourcePool.get(this._resource);
		const newFruit = pool.alloc();


		collectPoint.addChild(newFruit);
		newFruit.position = collectPoint.getComponent(CollectPoint).getNextPosition();

		tween(newFruit)
			.tag(1)
			.to(0.2, { scale: v3(2, 2, 2) }, {
				onComplete: () => {
					Tween.stopAllByTarget(newFruit);
					if (this.isAnimationControlPoint === collectPoint) {
						this._animationController.setValue('IsKeeping', true)
					}
					this.resourceCollecting(count - 1);
				}
			})
			.to(0.1, { scale: v3(1, 1, 1) })
			.start();
	}

}

