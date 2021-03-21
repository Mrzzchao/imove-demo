// imove-behavior: 触发：无LBS

export default async function(ctx) {
  ctx.emit('action', { type: 'ERROR_NO_LBS_API'})
  console.log('est')
}