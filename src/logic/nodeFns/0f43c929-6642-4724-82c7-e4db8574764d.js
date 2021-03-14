// imove-branch: 是否有LBS接口

export default async function(ctx) {
  return checkHasLBS();
}

function checkHasLBS() {
  const t = Math.random();
  console.log(t);
  return t < 0.8;
}