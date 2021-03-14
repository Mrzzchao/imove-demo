// imove-behavior: 触发：LBS 参数异常

export default async function(ctx) {
  ctx.emit('action', { type: 'ERROR_NO_LOCATION_PARAMS'})
}