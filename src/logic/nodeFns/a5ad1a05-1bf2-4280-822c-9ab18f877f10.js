// imove-behavior: 触发：LBS数据

export default async function(ctx) {
  const {
    location
  } = ctx.getPipe();
  ctx.emit('action', { type: 'DATA_LOCATION', location });
}