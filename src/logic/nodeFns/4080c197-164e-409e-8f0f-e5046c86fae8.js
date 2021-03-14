// imove-behavior: 触发：LBS 获取异常

export default async function(ctx) {
  ctx.emit('action', { type: 'ERROR_LBS_API'})
}