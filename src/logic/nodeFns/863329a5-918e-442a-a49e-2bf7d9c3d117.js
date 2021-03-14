// imove-behavior: 处理：LBS数据

export default async function(ctx) {
  const {
    location
  } = ctx.getPipe();
  
  return {
    location
  }
}