
export default class FixedArray<T = {}> {
    private _count: number;
    private _data: Array<T | undefined>;

    constructor (size: number) {
        this._count = 0;
        this._data = new Array(size);
    }

    get length () {
        return this._count;
    }

    get data () {
        return this._data;
    }

    public reset () {
        for (let i = 0; i < this._count; ++i) {
            this._data[i] = undefined;
        }

        this._count = 0;
    }

    public push (val) {
        this._data[this._count] = val;
        ++this._count;
    }

    public fastRemove (idx) {
        if (idx >= this._count || idx < 0) {
            return;
        }

        const last = this._count - 1;
        this._data[idx] = this._data[last];
        this._data[last] = undefined;
        this._count -= 1;
    }

    public indexOf (val) {
        return this._data.indexOf(val);
    }
}
