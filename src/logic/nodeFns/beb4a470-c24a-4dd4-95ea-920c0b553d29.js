// imove-behavior: 触发：城市数据

export default async function(ctx) {
  const {
    city
  } = ctx.getPipe();
  ctx.emit('action', { type: 'DATA_CITY', city });
}