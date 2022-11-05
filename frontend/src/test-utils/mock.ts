
export const mockSearchResultData = ()=>{
  const result = []
  for(let i=1; i<=30; i++){
    result.push({
      id: i,
      place_name: `place${i}`,
      x: i,
      y: i,
    })
  }
  return result;
}