// imove-behavior: 处理：城市数据

export default async function(ctx) {
  console.log(ctx.getPipe());
  const {
    city
  } = ctx.getPipe();
  return {
    city
  }
}