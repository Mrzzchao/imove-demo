// imove-behavior: 触发：城市获取异常

export default async function(ctx) {
  ctx.emit('action', { type: 'ERROR_LOCATION_API'})
}