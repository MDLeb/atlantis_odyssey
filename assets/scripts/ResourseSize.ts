import { _decorator, Component, Node, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourseSize')
export class ResourseSize extends Component {
    @property(Vec3)
    size: Vec3 = v3(1, 1, 1);

    getSize() {
        return this.size
    }
}


