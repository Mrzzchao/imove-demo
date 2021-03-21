import nodeFns from './nodeFns';
import Context from './context';
import EventEmitter from 'eventemitter3';

// 事件类型
const LIFECYCLE = new Set(['ctxCreated', 'enterNode', 'leaveNode']);

// 节点类型
const SHAPES = {
  START: 'imove-start',
  BRANCH: 'imove-branch',
  BEHAVIOR: 'imove-behavior',
};

export default class Logic extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.dsl = opts.dsl;
    this.lifeCycleEvents = {};
  }

  // 逻辑单元组
  get cells() {
    return this.dsl.cells;
  }

  // 逻辑点
  get nodes() {
    return this.cells.filter((cell) => cell.shape !== 'edge');
  }

  // 起始节点
  get startNodes() {
    return this.cells.filter((cell) => cell.shape === SHAPES.START);
  }

  // 边
  get edges() {
    return this.cells.filter((cell) => cell.shape === 'edge');
  }

  _getUnsafeCtx() {
    // NOTE: don't use in prod
    return this._unsafeCtx;
  }

  // 顺序运行生命周期
  _runLifecycleEvent(eventName, ctx) {
    if (!LIFECYCLE.has(eventName)) {
      return console.warn(`Lifecycle ${eventName} is not supported!`);
    }
    if (this.lifeCycleEvents[eventName]) {
      this.lifeCycleEvents[eventName].forEach((fn) => fn(ctx));
    }
  }

  // 创建一个执行上下文，并运行ctxCreated生命周期
  _createCtx(opts) {
    const ctx = new Context(opts);
    ctx.emit = this.emit.bind(this);
    this._runLifecycleEvent('ctxCreated', ctx);
    return ctx;
  }

  // 获取起始节点
  _getStartNode(trigger) {
    for (const cell of this.startNodes) {
      if (cell.data.trigger === trigger) {
        return cell;
      }
    }
  }

  /**
   * 获取当前节点的右节点列表
   * @param {*} ctx 上下文
   * @param {*} curNode 当前节点
   * @param {*} curRet 当前输出
   */
  _getNextNodes(ctx, curNode, curRet) {
    const nodes = [];
    for (const edge of this.edges) {
      // 判断边的源节点是否匹配
      let isMatched = edge.source.cell === curNode.id;
      // NOTE: if it is a imove-branch node, each port's condition should be tested whether it is matched

      // 如果是条件节点，就需要判断轮询到的边跟哪一个端口匹配。
      if (curNode.shape === SHAPES.BRANCH) {
        let matchedPort = '';
        const { ports } = curNode.data;
        for (const key in ports) {
          const { condition } = ports[key];
          const ret = new Function('ctx', `return ${condition}`)(ctx);
          if (ret === Boolean(curRet)) {
            matchedPort = key;
            break;
          }
        }
        isMatched = isMatched && edge.source.port === matchedPort;
      }

      // 如果匹配，就拿到匹配边的目标节点
      if (isMatched) {
        // NOTE: not each edge both has source and target
        const nextNode = this.nodes.find((item) => item.id === edge.target.cell);
        nextNode && nodes.push(nextNode);
      }
    }
    return nodes;
  }

  use(pluginCreator) {
    if (typeof pluginCreator !== 'function') {
      console.error('imove plugin must be a function.');
      return;
    }
    const plugin = pluginCreator(this);
    if (typeof plugin !== 'object' || plugin === null) {
      console.error('imove plugin must return an object.');
      return;
    }
    for (const eventName in plugin) {
      if (!Object.prototype.hasOwnProperty.call(plugin, eventName)) {
        continue;
      }
      if (!LIFECYCLE.has(eventName)) {
        console.warn(`Lifecycle ${eventName} is not supported in imove.`);
        continue;
      }
      if (!this.lifeCycleEvents[eventName]) {
        this.lifeCycleEvents[eventName] = [];
      }
      this.lifeCycleEvents[eventName].push(plugin[eventName]);
    }
  }

  /**
   * 在线运行节点
   * @param {*} ctx 上下文
   * @param {*} curNode 当前执行节点
   * @param {*} lastRet 上一个的输出
   * @param {*} callback 回调
   */
  async _execNode(ctx, curNode, lastRet, callback) {
    // 保存节点信息
    ctx._transitTo(curNode, lastRet);
    // 获取节点代码
    const fn = nodeFns[curNode.id];

    // 执行进入节点生命周期函数
    this._runLifecycleEvent('enterNode', ctx);

    // 执行节点代码
    const curRet = await fn(ctx);

    // 执行离开节点生命周期函数
    this._runLifecycleEvent('leaveNode', ctx);

    // 如果不是条件节点，就记录上一个的输出
    if (curNode.shape !== SHAPES.BRANCH) {
      lastRet = curRet;
    }

    // 获取当前节点的右节点列表
    const nextNodes = this._getNextNodes(ctx, curNode, curRet);
    if (nextNodes.length > 0) {
      // 递归循环执行右节点
      nextNodes.forEach(async (node) => {
        await this._execNode(ctx, node, lastRet, callback);
      });
    } else {
      // 右节点全部执行完就执行回调函数
      callback && callback(lastRet);
    }
  }

  /**
   * 触发器
   * @param {*} trigger 触发器名称 例如start
   * @param {*} data 传递数据
   * @param {*} callback 回调
   */
  async invoke(trigger, data, callback) {
    // 获取起始节点
    const curNode = this._getStartNode(trigger);
    if (!curNode) {
      return Promise.reject(new Error(`Invoke failed! No logic-start named ${trigger} found!`));
    }
    this._unsafeCtx = this._createCtx({ payload: data });
    await this._execNode(this._unsafeCtx, curNode, undefined, callback);
  }
}
